const formularioDom = document.getElementById("formulario");
const tituloDom = document.getElementById("inputTitulo");
const notaDom = document.getElementById("inputNota");
const tablaDom = document.getElementById("tabla");
const editarForm = document.getElementById("formularioEditar");
const editarTituloInput = document.getElementById("editarTitulo");
const editarNotaInput = document.getElementById("editarNota");
const busquedaForm = document.getElementById("formBusqueda");
const json = localStorage.getItem("notas");
let notas = JSON.parse(json) || [];

function generarID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

formularioDom.onsubmit = function (e) {
  e.preventDefault();
  const nota = {
    id: generarID(),
    titulo: tituloDom.value,
    nota: notaDom.value,
  };
  notas.push(nota);
  const json = JSON.stringify(notas);
  localStorage.setItem("notas", json);
  mostrarNotas();
  formularioDom.reset();
};

function mostrarNotas() {
  let filas = [];
  for (let i = 0; i < notas.length; i++) {
    const nota = notas[i];
    const tr = `
          <tr>
              <td>${nota.titulo}</td>
              <td>${nota.nota}</td>
              <td>
              <button onclick="mostrarDetalle('${nota.id}')" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalDetalle">Ver nota</button>
              <button onclick="cargarModalEditar('${nota.id}')" type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
              data-bs-target="#modalEditar">Editar</button>
              <button onclick="eliminarNota('${nota.id}')" class="btn btn-danger btn-sm">Eliminar</button>
              </td>
          </tr>
      `;
    filas.push(tr);
  }
  tablaDom.innerHTML = filas.join("");
}

mostrarNotas();

function eliminarNota(id) {
  let notasFiltradas = [];
  for (let i = 0; i < notas.length; i++) {
    const nota = notas[i];
    const coincideId = nota.id === id;
    if (!coincideId) {
      notasFiltradas.push(nota);
    }
  }
  const json = JSON.stringify(notasFiltradas);
  localStorage.setItem("notas", json);
  notas = notasFiltradas;
  console.log("Se eliminó exitosamente la nota. 👨‍💻");
  mostrarNotas();
}

function mostrarDetalle(id) {
  const notaEncontrada = notas.find((nota) => nota.id === id);
  const detalleDiv = document.getElementById("detalleNota");
  const detallesNota = `
      <p>Titulo: ${notaEncontrada.titulo}</p>
      <p>Nota: ${notaEncontrada.nota}</p>

  `;
  detalleDiv.innerHTML = detallesNota;
}

function cargarModalEditar(id) {
  const notaEncontrada = notas.find((nota) => nota.id === id);
  editarTituloInput.value = notaEncontrada.titulo;
  editarNotaInput.value = notaEncontrada.nota;
  notaId = notaEncontrada.id;
}

editarForm.onsubmit = function editarNota(e) {
  e.preventDefault();
  const notasModificado = notas.map((nota) => {
    if (nota.id === notaId) {
      const notaModificada = {
        ...nota,
        titulo: editarTituloInput.value,
        nota: editarNotaInput.value,
      };
      return notaModificada;
    } else {
      return nota;
    }
  });

  const json = JSON.stringify(notasModificado);
  localStorage.setItem("notas", json);
  notas = notasModificado;
  mostrarNotas();
  const modalDiv = document.getElementById("modalEditar");
  const modalBootstrap = bootstrap.Modal.getInstance(modalDiv);
  modalBootstrap.hide();
};

busquedaForm.onsubmit = function busquedaNota(e) {
  e.preventDefault();
  const notasLocal = JSON.parse(localStorage.getItem("notas")) || [];
  const busquedaInput = document.getElementById("busqueda");
  const termino = busquedaInput.value.toLowerCase();
  const notasFiltradas = notasLocal.filter((nota) => {
    const tituloEnMinuscula = nota.titulo.toLowerCase();
    const notaEnMinuscula = nota.nota.toLowerCase();
    return (
      tituloEnMinuscula.includes(termino) || notaEnMinuscula.includes(termino)
    );
  });
  notas = notasFiltradas;
  mostrarNotas();
  const alerta = document.getElementById("alertaBusqueda");
  if (notasFiltradas.length === 0) {
    alerta.classList.remove("d-none");
  } else {
    alerta.classList.add("d-none");
  }
};

const limpiarFiltro = () => {
  notas = JSON.parse(localStorage.getItem("notas")) || [];
  busquedaForm.reset();
  mostrarNotas();
  const alerta = document.getElementById("alertaBusqueda");
  alerta.classList.add("d-none");
};
