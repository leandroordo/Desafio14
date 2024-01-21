// Obtener todos los forms de la página
const forms = document.querySelectorAll("form[data-form]");

if (forms.length > 0) {
  for (let form of forms) {
    // Obtener todos los campos que tienen el atributo data-validate
    const inputs = form.querySelectorAll("[data-validate]");

    // Evento Submit
    form.addEventListener("submit", (e) => submitForm(inputs, e));

    inputs.forEach((input) => {
      // Evento input
      input.addEventListener("input", inputChange);
    });
  }
}

function inputChange() {
  const input = this;
  validateInput(input);
}

function validateInput(input) {
  const value = input.value;
  const errorEl = input
    .closest("[data-formgroup]")
    .querySelector("[data-formerror]");

  let error = null;

  // Ver si el campo tiene el atributo data-required y si está vacío (solo si no es radio o checkbox)
  if (
    (input.type !== "radio" || input.type !== "checkbox") &&
    input.dataset.required !== undefined &&
    value === ""
  ) {
    error = input.dataset.requiredmessage
      ? input.dataset.requiredmessage
      : "Complete este campo por favor";
    input.classList.add("error");
  }

  // Ver la longitud mínima
  if (
    !error &&
    input.dataset.minlength !== undefined &&
    value.length < +input.dataset.minlength
  ) {
    error = input.dataset.minlengthmessage
      ? input.dataset.minlengthmessage
      : `Por favor, escriba ${input.dataset.minlength} caracteres como mínimo`;
    input.classList.add("error");
  }

  // Ver la longitud máxima
  if (
    !error &&
    input.dataset.maxlength !== undefined &&
    value.length > +input.dataset.maxlength
  ) {
    error = input.dataset.maxlengthmessage
      ? input.dataset.maxlengthmessage
      : `Por favor, escriba ${input.dataset.maxlength} caracteres como máximo`;
    input.classList.add("error");
  }

  // Validar mail
  if (!error && input.dataset.email !== undefined && !validateEmail(value)) {
    error = input.dataset.emailerrormessage
      ? input.dataset.emailerrormessage
      : "Dirección de email incorrecta";
    input.classList.add("error");
  }

  //Validar por expresión regular
  if (
    !error &&
    input.dataset.regularexpression !== undefined &&
    value &&
    !validateRegularExpression(input.dataset.regularexpression, value)
  ) {
    error = input.dataset.errormessage
      ? input.dataset.errormessage
      : "Este valor es incorrecto";
    input.classList.add("error");
  }

  //Validar el caso especial del documento
  if (
    !error &&
    input.dataset.validatedocumento !== undefined &&
    input.dataset.documentobasedon !== undefined
  ) {
    // Obtener el option indicado por el atributo data-documentobasedon
    const inputDni = input
      .closest("[data-form]")
      .querySelector(`[id="${input.dataset.documentobasedon}"]`);

    if (inputDni.checked) {
      if (
        !validateRegularExpression(
          input.dataset.documentoregularexpression,
          value
        )
      ) {
        error = input.dataset.errormessagedocumento
          ? input.dataset.errormessagedocumento
          : "Este valor es incorrecto";
        input.classList.add("error");
      }
    }
  }

  //Validar el caso especial del CUIL
  if (
    !error &&
    input.dataset.validatecuil !== undefined &&
    input.dataset.cuilbasedon !== undefined
  ) {
    // Obtener el option indicado por el atributo data-cuilbasedon
    const inputCuil = input
      .closest("[data-form]")
      .querySelector(`[id="${input.dataset.cuilbasedon}"]`);

    if (inputCuil.checked) {
      if (
        !validateRegularExpression("(\\d{11}|\\d{2}-\\d{8}-\\d{1})$", value)
      ) {
        error = input.dataset.errormessagecuil
          ? input.dataset.errormessagecuil
          : "Este valor es incorrecto";
        input.classList.add("error");
      }
    }
  }

  //Formatear nombre
  //Por cada nombre, poner primera letra en mayúscula y el resto en minúsculas
  if (input.dataset.formatname !== undefined) {
    input.value = value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Si no hubo error, eliminar clase y mensaje
  if (!error) {
    input.classList.remove("error");
    errorEl.innerText = "";
    errorEl.style.display = "none";
  } else {
    // Mostrar el error
    errorEl.innerText = error;
    errorEl.style.display = "block";
  }
  return error;
}

function submitForm(inputs, e) {
  e.preventDefault();
  const errors = [];

  inputs.forEach((input) => {
    const error = validateInput(input);
    if (error) {
      errors.push(error);
    }
  });

  if (errors.length == 0) {
    if (e.target.dataset.submitmessage !== undefined) {
      window.alert(e.target.dataset.submitmessage);
    }
    return true;
  } else {
    mostrarToast(errors);
  }

  return false;
}

// Validar email
function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//Validar por expresión regular
function validateRegularExpression(regularExpression, value) {
  const re = new RegExp(regularExpression);
  return re.test(String(value));
}

function clearErrors() {
  const errores = document.querySelectorAll("small[data-formerror]");
  for (let errorEl of errores) {
    errorEl.innerText = "";
    errorEl.style.display = "none";
  }

  const inputs = document.querySelectorAll("[data-validate]");
  for (let inputEl of inputs) {
    inputEl.classList.remove("error");
  }
}

//Mostar toast con errores
function mostrarToast(errores) {
  var mensaje =
    "<ul>" + errores.map((error) => "<li>" + error + "</li>").join("");
  +"</ul>";

  leandrosToast.toast({
    titulo: "Por favor corrija los siguientes problemas:",
    mensaje,
  });
}
