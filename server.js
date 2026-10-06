const http = require("http");
const fs = require("fs");
const path = require("path");

const PUERTO = process.env.PORT || 3000;
const RAIZ = __dirname;
const CARPETA_DATOS = path.join(RAIZ, "data");
const ARCHIVO = path.join(CARPETA_DATOS, "db.json");
const LIMITE = 5 * 1024 * 1024;

const tipos = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function leerBase() {
  try {
    return JSON.parse(fs.readFileSync(ARCHIVO, "utf8"));
  } catch (error) {
    return {};
  }
}

function guardarBase(base) {
  fs.mkdirSync(CARPETA_DATOS, { recursive: true });
  const temporal = ARCHIVO + ".tmp";
  fs.writeFileSync(temporal, JSON.stringify(base, null, 2));
  fs.renameSync(temporal, ARCHIVO);
}

function responder(res, codigo, cuerpo, tipo) {
  res.writeHead(codigo, {
    "Content-Type": tipo || "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(cuerpo);
}

function leerCuerpo(req, alTerminar) {
  let texto = "";
  let excedido = false;
  req.on("data", trozo => {
    texto += trozo;
    if (texto.length > LIMITE) {
      excedido = true;
      req.destroy();
    }
  });
  req.on("end", () => { if (!excedido) alTerminar(texto); });
}

function atenderApi(req, res, ruta) {
  if (req.method === "GET" && ruta === "/api/datos") {
    responder(res, 200, JSON.stringify(leerBase()));
    return;
  }

  const coincide = ruta.match(/^\/api\/datos\/(pharmago_[a-z_]+)$/);
  if (req.method === "PUT" && coincide) {
    leerCuerpo(req, texto => {
      try {
        const datos = JSON.parse(texto);
        if (!Array.isArray(datos)) throw new Error("formato");
        const base = leerBase();
        base[coincide[1]] = datos;
        guardarBase(base);
        responder(res, 200, JSON.stringify({ ok: true }));
      } catch (error) {
        responder(res, 400, JSON.stringify({ error: "Datos inválidos" }));
      }
    });
    return;
  }

  responder(res, 404, JSON.stringify({ error: "No encontrado" }));
}

function atenderArchivo(req, res, ruta) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    responder(res, 405, "Método no permitido", "text/plain; charset=utf-8");
    return;
  }

  let relativa;
  try {
    relativa = decodeURIComponent(ruta);
  } catch (error) {
    responder(res, 400, "Solicitud inválida", "text/plain; charset=utf-8");
    return;
  }

  if (relativa === "/") relativa = "/index.html";

  const archivo = path.normalize(path.join(RAIZ, relativa));
  const dentro = archivo.startsWith(RAIZ + path.sep);
  const privado = archivo.startsWith(CARPETA_DATOS + path.sep) || archivo === path.join(RAIZ, "server.js");

  if (!dentro || privado) {
    responder(res, 404, "No encontrado", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(archivo, (error, contenido) => {
    if (error) {
      responder(res, 404, "No encontrado", "text/plain; charset=utf-8");
      return;
    }
    const tipo = tipos[path.extname(archivo).toLowerCase()] || "application/octet-stream";
    responder(res, 200, req.method === "HEAD" ? "" : contenido, tipo);
  });
}

const servidor = http.createServer((req, res) => {
  const ruta = new URL(req.url, "http://localhost").pathname;
  if (ruta.startsWith("/api/")) {
    atenderApi(req, res, ruta);
  } else {
    atenderArchivo(req, res, ruta);
  }
});

servidor.listen(PUERTO, "127.0.0.1", () => {
  console.log("PharmaGo funcionando en http://localhost:" + PUERTO);
  console.log("Los datos se guardan en " + ARCHIVO);
});
