const farmaciaVista = new Vista({
  titulo: "Gestión de Farmacias",
  campos: [
    { nombre: "nombre_sede", etiqueta: "Nombre de la sede", tipo: "text", requerido: true, max: 100, ejemplo: "Ej. Sede Chapinero" },
    { nombre: "direccion", etiqueta: "Dirección", tipo: "text", requerido: true, max: 120 },
    { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", max: 15 },
    { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text", requerido: true, max: 50, valor: "Bogotá D.C." },
    { nombre: "localidad", etiqueta: "Localidad", tipo: "text", requerido: true, max: 50, ejemplo: "Ej. Suba" }
  ]
});
