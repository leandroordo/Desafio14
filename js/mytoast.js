var leandrosToast = {
  options: {
    duracion: 6000,
    cantidadDeToasts: 0,
  },

  toast: function ({ titulo, mensaje }) {
    /* Si el toast no existe, crearlo */
    if (document.getElementById("toastwrapper") == null) {
      const toastwrapper = document.createElement("div");
      toastwrapper.id = "toastwrapper";
      toastwrapper.className = "toastwrapper top-right";
      document.body.appendChild(toastwrapper);

      // Crear la lista de toasts
      if (document.getElementById("toastlist") == null) {
        const toastlist = document.createElement("ol");
        toastlist.id = "toastlist";
        toastlist.className = "toastlist";
        toastwrapper.appendChild(toastlist);
      }
    }

    // Crear el toast
    const toast = document.createElement("li");
    leandrosToast.options.cantidadDeToasts++;
    toast.className = "leandrosToast toastDown error";
    toast.id = "leandrosToast-" + leandrosToast.options.cantidadDeToasts;

    //Agregar el nuevo toast a la lista de toasts
    document.getElementById("toastlist").appendChild(toast);

    // Agregar la estructura interna del toast
    const toastNotif = document.createElement("div");
    toastNotif.className = "notif";
    toast.appendChild(toastNotif);

    const toastDesc = document.createElement("div");
    toastDesc.className = "desc";
    toastNotif.appendChild(toastDesc);

    if (titulo != null) {
      const toasttitulo = document.createElement("div");
      toasttitulo.className = "titulo";
      toasttitulo.innerHTML = titulo;
      toastDesc.appendChild(toasttitulo);
    }

    if (mensaje != null) {
      const toastmensaje = document.createElement("div");
      toastmensaje.className = "mensaje";
      toastmensaje.innerHTML = mensaje;
      toastDesc.appendChild(toastmensaje);
    }

    // Quitar las animaciones
    setTimeout(function () {
      toast.className = toast.className.replace(" toastDown", "");
    }, 500);

    // Eliminar el toast después del tiempo especificado
    setTimeout(function () {
      leandrosToast.quitarToast(toast.id);
    }, leandrosToast.options.duracion);
  },

  quitarToast(toastId) {
    var toast = document.getElementById(toastId);

    if (toast != null) {
      toast.className += " fadeOutToast";

      setTimeout(function () {
        try {
          //Hacer que sea transparente para animar la salida
          toast.style.opacity = "0";
          //Quitar el toast
          toast.parentNode.removeChild(toast);
          leandrosToast.options.cantidadDeToasts--;
        } catch (e) {}

        // Quitar el wrapper si no hay más toasts
        if (leandrosToast.options.cantidadDeToasts == 0) {
          var toaster = document.getElementById("toastwrapper");
          toaster.parentNode.removeChild(toaster);
        }
      }, 500);
    }
  },
};
