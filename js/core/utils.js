function escapar(texto) {
  const reemplazos = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(texto == null ? "" : texto).replace(/[&<>"']/g, c => reemplazos[c]);
}

function quitarTildes(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
