const epsVista = new Vista({
  titulo: "Gestión de EPS",
  campos: [
    { nombre: "nombre_eps", etiqueta: "Nombre de la EPS", tipo: "text", requerido: true, max: 100, ejemplo: "Ej. Sanitas" },
    { nombre: "estado", etiqueta: "Estado", tipo: "select", requerido: true, numero: true, opciones: [[1, "Activo"], [0, "Inactivo"]] }
  ]
});
