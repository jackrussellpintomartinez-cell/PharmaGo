const inventarioController = new Controlador(inventarioModel, inventarioVista, {
  antesDeGuardar(datos) {
    datos.fecha_actualizacion = new Date().toLocaleString();
  }
});
