const convenioVista = new Vista({
  titulo: "Convenios EPS - Farmacia",
  campos: [
    { nombre: "idEPS", etiqueta: "EPS", tipo: "select", requerido: true, numero: true,
      origen: { modelo: epsModel, valor: "idEPS", texto: "nombre_eps" } },
    { nombre: "idFarmacia", etiqueta: "Farmacia sede", tipo: "select", requerido: true, numero: true,
      origen: { modelo: farmaciaModel, valor: "idFarmacia", texto: "nombre_sede" } }
  ]
});
