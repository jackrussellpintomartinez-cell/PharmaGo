const usuarioVista = new Vista({
  titulo: "Gestión de Usuarios",
  campos: [
    { nombre: "tipo_documento", etiqueta: "Tipo de documento", tipo: "select", requerido: true,
      opciones: [["CC", "CC"], ["TI", "TI"], ["CE", "CE"]] },
    { nombre: "numero_documento", etiqueta: "N° de documento", tipo: "text", requerido: true, max: 20 },
    { nombre: "nombres", etiqueta: "Nombres", tipo: "text", requerido: true, max: 50 },
    { nombre: "apellidos", etiqueta: "Apellidos", tipo: "text", requerido: true, max: 50 },
    { nombre: "correo", etiqueta: "Correo electrónico", tipo: "email", requerido: true, max: 100 },
    { nombre: "password", etiqueta: "Contraseña", tipo: "password", requerido: true, max: 255 },
    { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", max: 15 },
    { nombre: "idRol", etiqueta: "Rol", tipo: "select", requerido: true, numero: true,
      origen: { modelo: rolModel, valor: "idRol", texto: "nombre_rol" } },
    { nombre: "idEPS", etiqueta: "EPS", tipo: "select", numero: true,
      origen: { modelo: epsModel, valor: "idEPS", texto: "nombre_eps" } }
  ]
});
