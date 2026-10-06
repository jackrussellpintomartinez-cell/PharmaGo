const Sesion = {
  iniciar(rol, nombre, correo) {
    sessionStorage.setItem("pharmago_rol", rol);
    sessionStorage.setItem("pharmago_nombre", nombre);
    sessionStorage.setItem("pharmago_correo", correo || "");
  },

  rol() {
    return sessionStorage.getItem("pharmago_rol");
  },

  nombre() {
    return sessionStorage.getItem("pharmago_nombre") || "";
  },

  correo() {
    return sessionStorage.getItem("pharmago_correo") || "";
  },

  activa() {
    return !!this.rol();
  },

  puedeEditar() {
    return this.activa() && this.rol() !== "Paciente";
  },

  esAdmin() {
    return this.rol() === "Administrador";
  },

  proteger() {
    if (!this.activa()) window.location.replace("login.html");
  },

  cerrar() {
    sessionStorage.clear();
    window.location.href = "login.html";
  }
};
