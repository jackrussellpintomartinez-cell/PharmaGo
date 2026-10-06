class Vista {
  constructor(config) {
    this.titulo = config.titulo;
    this.campos = config.campos;
    this.contenedor = null;
  }

  opciones(campo) {
    if (campo.opciones) return campo.opciones;
    const origen = campo.origen;
    return origen.modelo.listar().map(item => {
      let texto = item[origen.texto];
      if (origen.extra) texto += " (" + item[origen.extra] + ")";
      return [item[origen.valor], texto];
    });
  }

  campoHtml(campo) {
    const requerido = campo.requerido ? "required" : "";
    let control = "";

    if (campo.tipo === "select") {
      const opciones = this.opciones(campo)
        .map(op => `<option value="${escapar(op[0])}">${escapar(op[1])}</option>`)
        .join("");
      control = `<select id="${campo.nombre}" ${requerido}><option value="">-- Seleccionar --</option>${opciones}</select>`;
    } else {
      const max = campo.max ? `maxlength="${campo.max}"` : "";
      const min = campo.min !== undefined ? `min="${campo.min}"` : "";
      const valor = campo.valor !== undefined ? `value="${escapar(campo.valor)}"` : "";
      const ejemplo = campo.ejemplo ? `placeholder="${escapar(campo.ejemplo)}"` : "";
      control = `<input type="${campo.tipo}" id="${campo.nombre}" ${requerido} ${max} ${min} ${valor} ${ejemplo}>`;
    }

    const asterisco = campo.requerido ? " *" : "";
    return `<div class="form-group"><label for="${campo.nombre}">${campo.etiqueta}${asterisco}</label>${control}</div>`;
  }

  dibujar(contenedor, puedeEditar) {
    this.contenedor = contenedor;
    let html = `<h2>${this.titulo}</h2>`;

    if (!puedeEditar) {
      html += `<p class="aviso">Tu rol es de solo consulta. Puedes buscar y ver registros, pero no crear, editar ni eliminar.</p>`;
    } else {
      const campos = this.campos.filter(c => !c.soloTabla).map(c => this.campoHtml(c)).join("");
      html += `
        <form id="formulario">
          <div class="form-grid">${campos}</div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="btnGuardar">Guardar</button>
            <button type="button" class="btn btn-secondary" id="btnCancelar">Cancelar</button>
          </div>
        </form>
        <hr>`;
    }

    html += `
      <div class="barra">
        <h3>Registros</h3>
        <input type="search" id="buscador" placeholder="Buscar en la tabla">
      </div>
      <table><thead></thead><tbody></tbody></table>
      <p class="vacio" id="vacio" hidden>No hay registros todavía.</p>`;

    contenedor.innerHTML = html;
  }

  celda(campo, valor) {
    if (campo.nombre === "estado") {
      const activo = valor == 1;
      return `<span class="badge ${activo ? "active" : "inactive"}">${activo ? "Activo" : "Inactivo"}</span>`;
    }
    if (campo.tipo === "select") {
      const op = this.opciones(campo).find(o => o[0] == valor);
      return escapar(op ? op[1] : "-");
    }
    return escapar(valor === "" || valor == null ? "-" : valor);
  }

  dibujarTabla(filas, campoId, puedeEditar, sinEditar) {
    const columnas = this.campos.filter(c => c.tipo !== "password");
    const encabezados = columnas.map(c => `<th>${c.etiqueta}</th>`).join("");
    const acciones = puedeEditar ? "<th>Acciones</th>" : "";
    this.contenedor.querySelector("thead").innerHTML = `<tr><th>ID</th>${encabezados}${acciones}</tr>`;

    this.contenedor.querySelector("tbody").innerHTML = filas.map(fila => {
      const celdas = columnas.map(c => `<td>${this.celda(c, fila[c.nombre])}</td>`).join("");
      const id = fila[campoId];
      let botones = "";
      if (puedeEditar) {
        const editar = sinEditar ? "" : `<button class="btn btn-warning btn-sm" data-accion="editar" data-id="${id}">Editar</button>`;
        botones = `<td class="acciones">${editar}<button class="btn btn-danger btn-sm" data-accion="eliminar" data-id="${id}">Eliminar</button></td>`;
      }
      return `<tr><td>${id}</td>${celdas}${botones}</tr>`;
    }).join("");

    this.contenedor.querySelector("#vacio").hidden = filas.length > 0;
    this.filtrar("");
  }

  filtrar(texto) {
    const buscado = quitarTildes(texto);
    this.contenedor.querySelectorAll("tbody tr").forEach(tr => {
      tr.hidden = !quitarTildes(tr.textContent).includes(buscado);
    });
  }

  leerFormulario() {
    const datos = {};
    this.campos.filter(c => !c.soloTabla).forEach(c => {
      const valor = document.getElementById(c.nombre).value.trim();
      if (c.numero) {
        datos[c.nombre] = valor === "" ? null : Number(valor);
      } else {
        datos[c.nombre] = valor;
      }
    });
    return datos;
  }

  llenarFormulario(item) {
    this.campos.filter(c => !c.soloTabla).forEach(c => {
      const valor = item[c.nombre];
      document.getElementById(c.nombre).value = valor == null ? "" : valor;
    });
    this.textoBoton("Guardar cambios");
    document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });
  }

  limpiarFormulario() {
    document.getElementById("formulario").reset();
    this.textoBoton("Guardar");
  }

  textoBoton(texto) {
    document.getElementById("btnGuardar").textContent = texto;
  }
}
