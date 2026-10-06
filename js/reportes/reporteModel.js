const reporteModel = {
  resumen() {
    const inventario = inventarioModel.listar();
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 30);

    return {
      medicamentos: medicamentoModel.listar().length,
      farmacias: farmaciaModel.listar().length,
      unidades: inventario.reduce((total, item) => total + item.cantidad, 0),
      vencidos: inventario.filter(item => new Date(item.fecha_vencimiento) < hoy),
      porVencer: inventario.filter(item => {
        const fecha = new Date(item.fecha_vencimiento);
        return fecha >= hoy && fecha <= limite;
      }),
      stockBajo: inventario.filter(item => item.cantidad < 10)
    };
  }
};
