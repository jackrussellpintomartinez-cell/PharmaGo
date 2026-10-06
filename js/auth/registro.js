const vistaLogin = document.getElementById("vistaLogin");
const vistaRegistro = document.getElementById("vistaRegistro");
const formularioRegistro = document.getElementById("registroForm");
const regNombres = document.getElementById("regNombres");
const regApellidos = document.getElementById("regApellidos");
const regCorreo = document.getElementById("regCorreo");
const regPassword = document.getElementById("regPassword");
const regConfirmar = document.getElementById("regConfirmar");
const errorRegNombres = document.getElementById("errorRegNombres");
const errorRegApellidos = document.getElementById("errorRegApellidos");
const errorRegCorreo = document.getElementById("errorRegCorreo");
const errorRegPassword = document.getElementById("errorRegPassword");
const errorRegConfirmar = document.getElementById("errorRegConfirmar");
const mensajeRegistro = document.getElementById("mensajeRegistro");

const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,50}$/;

const modeloUsuarios = new Modelo("pharmago_usuarios", "idUsuario");
const modeloRoles = new Modelo("pharmago_roles", "idRol");

function cambiarVista(mostrarRegistro) {
  vistaLogin.hidden = mostrarRegistro;
  vistaRegistro.hidden = !mostrarRegistro;
}

document.getElementById("irRegistro").addEventListener("click", () => cambiarVista(true));
document.getElementById("irLogin").addEventListener("click", e => {
  e.preventDefault();
  cambiarVista(false);
});

function mostrarMensajeRegistro(texto, tipo) {
  mensajeRegistro.textContent = texto;
  mensajeRegistro.className = texto ? "mensaje " + tipo : "mensaje";
}

function validarTexto(campo, caja, textoVacio) {
  const valor = campo.value.trim();
  let error = "";

  if (valor === "") {
    error = textoVacio;
  } else if (!soloLetras.test(valor)) {
    error = "Solo letras, mínimo 2 caracteres.";
  }

  marcarCampo(campo, caja, error);
  return error === "";
}

function validarNombres() {
  return validarTexto(regNombres, errorRegNombres, "Escribe tus nombres.");
}

function validarApellidos() {
  return validarTexto(regApellidos, errorRegApellidos, "Escribe tus apellidos.");
}

function correoRegistrado(correo) {
  const enUsuarios = StorageService.leer("pharmago_usuarios")
    .some(u => String(u.correo).toLowerCase() === correo);
  const enPrueba = cuentasDePrueba.some(c => c.correo === correo);
  return enUsuarios || enPrueba;
}

function validarCorreoRegistro() {
  const valor = regCorreo.value.trim().toLowerCase();
  let error = "";

  if (valor === "") {
    error = "El correo es obligatorio.";
  } else if (/^\d+$/.test(valor)) {
    error = "El correo no puede ser solo números.";
  } else if (!formatoCorreo.test(valor)) {
    error = "Escribe un correo válido, por ejemplo nombre@correo.com.";
  } else if (correoRegistrado(valor)) {
    error = "Este correo ya está registrado.";
  }

  marcarCampo(regCorreo, errorRegCorreo, error);
  return error === "";
}

function validarClaveRegistro() {
  const valor = regPassword.value;
  let error = "";

  if (valor.trim() === "") {
    error = "La contraseña es obligatoria.";
  } else if (valor.length < 6) {
    error = "La contraseña debe tener al menos 6 caracteres.";
  }

  marcarCampo(regPassword, errorRegPassword, error);
  return error === "";
}

function validarConfirmacion() {
  let error = "";

  if (regConfirmar.value === "") {
    error = "Confirma tu contraseña.";
  } else if (regConfirmar.value !== regPassword.value) {
    error = "Las contraseñas no coinciden.";
  }

  marcarCampo(regConfirmar, errorRegConfirmar, error);
  return error === "";
}

regNombres.addEventListener("input", validarNombres);
regApellidos.addEventListener("input", validarApellidos);
regCorreo.addEventListener("input", validarCorreoRegistro);
regPassword.addEventListener("input", () => {
  validarClaveRegistro();
  if (regConfirmar.value !== "") validarConfirmacion();
});
regConfirmar.addEventListener("input", validarConfirmacion);

function buscarRolPaciente() {
  return modeloRoles.listar().find(r => quitarTildes(r.nombre_rol) === "paciente");
}

function obtenerIdRolPaciente() {
  let rol = buscarRolPaciente();
  if (!rol) {
    modeloRoles.guardar({ nombre_rol: "Paciente" });
    rol = buscarRolPaciente();
  }
  return rol.idRol;
}

function limpiarRegistro() {
  formularioRegistro.reset();
  marcarCampo(regNombres, errorRegNombres, "");
  marcarCampo(regApellidos, errorRegApellidos, "");
  marcarCampo(regCorreo, errorRegCorreo, "");
  marcarCampo(regPassword, errorRegPassword, "");
  marcarCampo(regConfirmar, errorRegConfirmar, "");
}

formularioRegistro.addEventListener("submit", e => {
  e.preventDefault();

  const validos = [
    validarNombres(),
    validarApellidos(),
    validarCorreoRegistro(),
    validarClaveRegistro(),
    validarConfirmacion()
  ];

  if (validos.includes(false)) {
    mostrarMensajeRegistro("Corrige los campos marcados en rojo.", "error");
    return;
  }

  const correo = regCorreo.value.trim().toLowerCase();

  modeloUsuarios.guardar({
    tipo_documento: "",
    numero_documento: "",
    nombres: regNombres.value.trim(),
    apellidos: regApellidos.value.trim(),
    correo: correo,
    password: regPassword.value,
    telefono: "",
    idRol: obtenerIdRolPaciente(),
    idEPS: null
  });

  limpiarRegistro();
  mostrarMensajeRegistro("", "");
  cambiarVista(false);

  document.querySelector('.rol[data-rol="Paciente"]').click();
  usuario.value = correo;
  password.value = "";
  validarCorreo();
  mostrarMensaje("Cuenta creada con éxito. Ya puedes iniciar sesión.", "exito");
});
