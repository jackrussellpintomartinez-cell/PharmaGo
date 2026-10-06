const rolController = new Controlador(rolModel, rolVista, {
  soloAdmin: true,

  motivoNoEliminar(rol) {
    const enUso = usuarioModel.listar().some(u => u.idRol == rol.idRol);
    return enUso ? "No se puede eliminar: hay usuarios con este rol." : "";
  }
});
