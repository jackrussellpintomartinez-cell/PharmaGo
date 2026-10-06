const inventarioVista = new Vista({
  titulo: "Control de Inventario",
  campos: [
    { nombre: "idFarmacia", etiqueta: "Farmacia sede", tipo: "select", requerido: true, numero: true,
      origen: { modelo: farmaciaModel, valor: "idFarmacia", texto: "nombre_sede" } },
    { nombre: "idMedicamento", etiqueta: "Medicamento", tipo: "select", requerido: true, numero: true,
      origen: { modelo: medicamentoModel, valor: "idMedicamento", texto: "nombre_comercial", extra: "concentracion" } },
    { nombre: "lote", etiqueta: "Lote", tipo: "text", requerido: true, max: 30, ejemplo: "Ej. LOT-2026-A" },
    { nombre: "fecha_vencimiento", etiqueta: "Fecha de vencimiento", tipo: "date", requerido: true },
    { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number", requerido: true, numero: true, min: 0, valor: 0 },
    { nombre: "fecha_actualizacion", etiqueta: "Última actualización", tipo: "text", soloTabla: true }
  ]
});
