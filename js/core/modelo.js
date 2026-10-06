class Modelo {
  constructor(clave, campoId, unicos) {
    this.clave = clave;
    this.campoId = campoId;
    this.unicos = unicos || [];
  }

  listar() {
    let lista = StorageService.leer(this.clave);
    const faltan = lista.some(item => item[this.campoId] == null);
    if (faltan) {
      let ultimo = Math.max(0, ...lista.map(item => item[this.campoId] || 0));
      lista = lista.map(item => item[this.campoId] == null ? { ...item, [this.campoId]: ++ultimo } : item);
      StorageService.guardar(this.clave, lista);
    }
    return lista;
  }

  buscar(id) {
    return this.listar().find(item => item[this.campoId] == id);
  }

  duplicado(datos, id) {
    if (this.unicos.length === 0) return false;
    return this.listar().some(item =>
      item[this.campoId] != id && this.unicos.every(campo => item[campo] === datos[campo])
    );
  }

  guardar(datos, id) {
    let lista = this.listar();
    if (id) {
      lista = lista.map(item => item[this.campoId] == id ? { ...datos, [this.campoId]: Number(id) } : item);
    } else {
      const ultimo = Math.max(0, ...lista.map(item => item[this.campoId]));
      lista.push({ ...datos, [this.campoId]: ultimo + 1 });
    }
    StorageService.guardar(this.clave, lista);
  }

  eliminar(id) {
    const lista = this.listar().filter(item => item[this.campoId] != id);
    StorageService.guardar(this.clave, lista);
  }
}
