const reporteVista = {
  tarjeta(titulo, valor) {
    return `<div class="tarjeta"><span>${titulo}</span><strong>${valor}</strong></div>`;
  },

  tabla(titulo, filas) {
    const cuerpo = filas.map(item => {
      const sede = farmaciaModel.buscar(item.idFarmacia);
      const medicamento = medicamentoModel.buscar(item.idMedicamento);
      return `<tr>
        <td>${escapar(sede ? sede.nombre_sede : "-")}</td>
        <td>${escapar(medicamento ? medicamento.nombre_comercial : "-")}</td>
        <td>${escapar(item.lote)}</td>
        <td>${escapar(item.fecha_vencimiento)}</td>
        <td>${item.cantidad}</td>
      </tr>`;
    }).join("");

    const vacio = filas.length === 0 ? `<p class="vacio">Sin registros.</p>` : "";

    return `
      <h3>${titulo}</h3>
      <table>
        <thead><tr><th>Sede</th><th>Medicamento</th><th>Lote</th><th>Vencimiento</th><th>Stock</th></tr></thead>
        <tbody>${cuerpo}</tbody>
      </table>
      ${vacio}`;
  },

  dibujar(contenedor, datos) {
    contenedor.innerHTML = `
      <h2>Reportes</h2>
      <div class="tarjetas">
        ${this.tarjeta("Medicamentos", datos.medicamentos)}
        ${this.tarjeta("Farmacias", datos.farmacias)}
        ${this.tarjeta("Unidades en stock", datos.unidades)}
        ${this.tarjeta("Lotes vencidos", datos.vencidos.length)}
      </div>
      ${this.tabla("Lotes que vencen en 30 días", datos.porVencer)}
      ${this.tabla("Lotes vencidos", datos.vencidos)}
      ${this.tabla("Stock bajo (menos de 10 unidades)", datos.stockBajo)}`;
  }
};
