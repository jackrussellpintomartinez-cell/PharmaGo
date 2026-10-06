const medicamentoVista = new Vista({
  titulo: "Gestión de Medicamentos",
  campos: [
    { nombre: "nombre_comercial", etiqueta: "Nombre comercial", tipo: "text", requerido: true, max: 100, ejemplo: "Ej. Dolex" },
    { nombre: "principio_activo", etiqueta: "Principio activo", tipo: "text", requerido: true, max: 100, ejemplo: "Ej. Acetaminofén" },
    { nombre: "presentacion", etiqueta: "Presentación", tipo: "text", requerido: true, max: 50, ejemplo: "Ej. Tabletas x 10" },
    { nombre: "concentracion", etiqueta: "Concentración", tipo: "text", requerido: true, max: 50, ejemplo: "Ej. 500 mg" },
    { nombre: "laboratorio", etiqueta: "Laboratorio", tipo: "text", max: 50, ejemplo: "Ej. GSK" }
  ]
});
