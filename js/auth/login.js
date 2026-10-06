if (Sesion.activa()) window.location.replace("dashboard.html");

const botonesRol = document.querySelectorAll(".rol");
const textoRol = document.getElementById("textoRol");
const iconoRol = document.getElementById("iconoRol");
const formulario = document.getElementById("loginForm");
const usuario = document.getElementById("usuario");
const password = document.getElementById("password");
const errorUsuario = document.getElementById("errorUsuario");
const errorPassword = document.getElementById("errorPassword");
const verPassword = document.getElementById("mostrarPassword");
const recordar = document.getElementById("recordar");
const mensaje = document.getElementById("mensaje");

const datosRol = {
  "Paciente": "👤",
  "Farmacéutico": "💊",
  "Administrador": "⚙️"
};

const cuentasDePrueba = [
  { correo: "paciente@pharmago.com", rol: "Paciente", nombre: "Paciente" },
  { correo: "farmaceutico@pharmago.com", rol: "Farmacéutico", nombre: "Farmacéutico" },
  { correo: "admin@pharmago.com", rol: "Administrador", nombre: "Administrador" }
];

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let rolActual = "Paciente";

const guardado = localStorage.getItem("pharmago_recordar");
if (guardado) {
  usuario.value = guardado;
  recordar.checked = true;
}

function marcarCampo(campo, caja, error) {
  caja.textContent = error;
  campo.classList.toggle("invalido", error !== "");
  campo.classList.toggle("valido", error === "" && campo.value !== "");
}

function validarCorreo() {
  const valor = usuario.value.trim();
  let error = "";

  if (valor === "") {
    error = "El correo es obligatorio.";
  } else if (/^\d+$/.test(valor)) {
    error = "El correo no puede ser solo números.";
  } else if (!formatoCorreo.test(valor)) {
    error = "Escribe un correo válido, por ejemplo nombre@correo.com.";
  }

  marcarCampo(usuario, errorUsuario, error);
  return error === "";
}

function validarPassword() {
  const valor = password.value;
  let error = "";

  if (valor.trim() === "") {
    error = "La contraseña es obligatoria.";
  } else if (valor.length < 4) {
    error = "La contraseña debe tener al menos 4 caracteres.";
  }

  marcarCampo(password, errorPassword, error);
  return error === "";
}

usuario.addEventListener("input", validarCorreo);
password.addEventListener("input", validarPassword);

botonesRol.forEach(boton => {
  boton.addEventListener("click", () => {
    botonesRol.forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");
    rolActual = boton.dataset.rol;
    iconoRol.textContent = datosRol[rolActual];
    textoRol.textContent = "Ingresando como " + rolActual;
    mostrarMensaje("", "");
  });
});

verPassword.addEventListener("click", () => {
  const oculta = password.type === "password";
  password.type = oculta ? "text" : "password";
  verPassword.textContent = oculta ? "🙈" : "👁";
});

function validar(correo, clave) {
  const usuarios = StorageService.leer("pharmago_usuarios");
  const roles = StorageService.leer("pharmago_roles");

  const encontrado = usuarios.find(u =>
    String(u.correo).toLowerCase() === correo.toLowerCase() && u.password === clave
  );

  if (encontrado) {
    const rol = roles.find(r => r.idRol == encontrado.idRol);
    if (rol && quitarTildes(rol.nombre_rol) === quitarTildes(rolActual)) {
      return { rol: rolActual, nombre: encontrado.nombres };
    }
    return { error: "Esta cuenta no tiene el rol " + rolActual + "." };
  }

  const prueba = cuentasDePrueba.find(c => c.correo === correo.toLowerCase() && c.rol === rolActual);
  if (prueba && clave === "1234") {
    return { rol: prueba.rol, nombre: prueba.nombre };
  }

  return { error: "Correo, contraseña o rol incorrecto." };
}

formulario.addEventListener("submit", e => {
  e.preventDefault();

  const correoValido = validarCorreo();
  const claveValida = validarPassword();

  if (!correoValido || !claveValida) {
    mostrarMensaje("Corrige los campos marcados en rojo.", "error");
    return;
  }

  const correo = usuario.value.trim();
  const resultado = validar(correo, password.value);

  if (resultado.error) {
    mostrarMensaje(resultado.error, "error");
    return;
  }

  if (recordar.checked) {
    localStorage.setItem("pharmago_recordar", correo);
  } else {
    localStorage.removeItem("pharmago_recordar");
  }

  Sesion.iniciar(resultado.rol, resultado.nombre, correo.toLowerCase());
  mostrarMensaje("¡Bienvenido, " + resultado.nombre + "!", "exito");
  setTimeout(() => { window.location.href = "dashboard.html"; }, 700);
});

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = texto ? "mensaje " + tipo : "mensaje";
}
