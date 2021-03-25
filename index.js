const formularioDom = document.getElementById("formulario");
const tituloDom = document.getElementById("inputTitulo");
const notaDom = document.getElementById("inputNota");
const tablaDom = document.getElementById("tabla");
const json = localStorage.getItem("notas"); // Traer de localStorage el dato asociado a la key "notas".
let notas = JSON.parse(json) || []; // Convertir datos de un string JSON a código JavaScript.

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
  const json = JSON.stringify(notas); // Convertir datos a un string JSON.
  localStorage.setItem("notas", json); // Guardar en localStorage un dato asociado a la key "notas".
  mostrarNotas();
  formularioDom.reset(); // reset limpia los campos del formulario.
};

function mostrarNotas() {
  let filas = [];
  for (let i = 0; i < notas.length; i++) {
    const nota = notas[i];
    const tr = `
          <tr>
              <td>${nota.titulo}</td>
              <td>${nota.nota}</td>
              <td> <button onclick="eliminarNota('${nota.id}')" class="btn btn-danger btn-sm">Eliminar</button>
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
