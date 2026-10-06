class Controlador {
  constructor(modelo, vista, opciones) {
    this.modelo = modelo;
    this.vista = vista;
    this.opciones = opciones || {};
    this.editando = null;
    this.puedeEditar = false;
  }

  permitido() {
    return this.opciones.soloAdmin ? Sesion.esAdmin() : Sesion.puedeEditar();
  }

  mostrar(contenedor) {
    this.puedeEditar = this.permitido();
    this.editando = null;
    this.vista.dibujar(contenedor, this.puedeEditar);
    this.actualizarTabla();

    contenedor.querySelector("#buscador").addEventListener("input", e => {
      this.vista.filtrar(e.target.value);
    });

    if (!this.puedeEditar) return;

    contenedor.querySelector("#formulario").addEventListener("submit", e => this.guardar(e));
    contenedor.querySelector("#btnCancelar").addEventListener("click", () => this.cancelar());
    contenedor.querySelector("tbody").addEventListener("click", e => {
      const boton = e.target.closest("button");
      if (!boton) return;
      if (boton.dataset.accion === "editar") this.editar(boton.dataset.id);
      if (boton.dataset.accion === "eliminar") this.eliminar(boton.dataset.id);
    });
  }

  actualizarTabla() {
    this.vista.dibujarTabla(this.modelo.listar(), this.modelo.campoId, this.puedeEditar, this.opciones.sinEditar);
  }

  guardar(evento) {
    evento.preventDefault();
    if (!this.permitido()) return;

    const datos = this.vista.leerFormulario();
    if (this.opciones.antesDeGuardar) this.opciones.antesDeGuardar(datos);

    if (this.modelo.duplicado(datos, this.editando)) {
      alert("Ya existe un registro con esos mismos datos.");
      return;
    }

    this.modelo.guardar(datos, this.editando);
    this.cancelar();
    this.actualizarTabla();
  }

  editar(id) {
    const item = this.modelo.buscar(id);
    if (!item) return;
    this.editando = id;
    this.vista.llenarFormulario(item);
  }

  eliminar(id) {
    if (!this.permitido()) return;

    const item = this.modelo.buscar(id);
    if (!item) return;

    if (this.opciones.motivoNoEliminar) {
      const motivo = this.opciones.motivoNoEliminar(item);
      if (motivo) {
        alert(motivo);
        return;
      }
    }

    const pregunta = this.opciones.mensajeEliminar
      ? this.opciones.mensajeEliminar(item)
      : "¿Desea eliminar este registro?";
    if (!confirm(pregunta)) return;

    this.modelo.eliminar(id);
    this.actualizarTabla();
  }

  cancelar() {
    this.editando = null;
    this.vista.limpiarFormulario();
  }
}
