const StorageService = {
  datos: {},
  servidor: false,

  iniciar() {
    try {
      const peticion = new XMLHttpRequest();
      peticion.open("GET", "/api/datos", false);
      peticion.send();
      if (peticion.status === 200) {
        this.datos = JSON.parse(peticion.responseText);
        this.servidor = true;
      }
    } catch (error) {
      this.servidor = false;
    }
  },

  leer(clave) {
    if (this.servidor) {
      return JSON.parse(JSON.stringify(this.datos[clave] || []));
    }
    try {
      return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
      return [];
    }
  },

  guardar(clave, datos) {
    if (!this.servidor) {
      localStorage.setItem(clave, JSON.stringify(datos));
      return;
    }

    this.datos[clave] = datos;
    fetch("/api/datos/" + clave, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(respuesta => {
        if (!respuesta.ok) throw new Error("error");
      })
      .catch(() => {
        alert("No se pudo guardar en el servidor. Verifica que esté encendido.");
      });
  }
};

StorageService.iniciar();
