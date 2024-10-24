// Obtener elementos del DOM
const modal = document.getElementById("subredditModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementsByClassName("close")[0];
const subredditRails = document.getElementById("subreddit-rails");

// Ocultar el modal cuando se cargue el documento
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded: Ocultando modal");
  modal.style.display = "none"; // Asegúrate de que el modal esté oculto
});

// Abrir el modal cuando se hace clic en el botón
openModalBtn.onclick = function (event) {
  event.stopPropagation(); // Evita que el clic se propague
  console.log("Abrir modal");
  modal.style.display = "block"; // Mostrar el modal
};

// Cerrar el modal cuando se hace clic en el botón de cerrar
closeModalBtn.onclick = function () {
  console.log("Cerrar modal");
  modal.style.display = "none"; // Ocultar el modal
};

// Agregar un evento para verificar si se hace clic fuera del modal
window.onclick = function (event) {
  if (event.target === modal) {
    console.log("Clic fuera del modal");
    modal.style.display = "none"; // Ocultar el modal
  }
};

// Evitar que el clic en el contenido del modal cierre el modal
const modalContent = document.querySelector(".modal-content");
modalContent.onclick = function (event) {
  event.stopPropagation(); // Evita que el clic en el contenido del modal cierre el modal
};

// Agregar subreddit
document.getElementById("add-subreddit").addEventListener("click", () => {
  const subredditName = document.getElementById("subreddit-name").value.trim();
  if (validateSubredditName(subredditName)) {
    fetchSubreddit(subredditName);
    modal.style.display = "none"; // Ocultar el modal después de agregar el subreddit
  }
});

// Validar nombre del subreddit
function validateSubredditName(name) {
  const regex = /^[a-zA-Z0-9_]+$/; // Solo permite letras, números y guiones bajos
  if (!name) {
    alert("El nombre del subreddit no puede estar vacío.");
    return false;
  }
  if (!regex.test(name)) {
    alert(
      "El nombre del subreddit solo puede contener letras, números y guiones bajos."
    );
    return false;
  }
  return true;
}

// Obtener datos del subreddit
function fetchSubreddit(subreddit) {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading";
  loadingIndicator.innerText = "Cargando...";
  subredditRails.appendChild(loadingIndicator);
  loadingIndicator.style.display = "block"; // Mostrar el indicador de carga

  fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Subreddit no encontrado o error de red.");
      }
      return response.json();
    })
    .then((data) => {
      loadingIndicator.style.display = "none"; // Ocultar el indicador de carga
      displaySubreddit(data.data.children, subreddit);
    })
    .catch((error) => {
      loadingIndicator.style.display = "none"; // Ocultar el indicador de carga
      alert(`Error: ${error.message}`);
    });
}

// Mostrar subreddit
function displaySubreddit(posts, subreddit) {
  const rail = document.createElement("div");
  rail.className = "rail";

  // Crear el título del carril como un h2
  const title = document.createElement("h2");
  title.innerText = `r/${subreddit}`;
  title.style.cursor = "pointer"; // Cambiar el cursor para indicar que es clickeable
  title.onclick = () => {
    console.log(`Redirigiendo a r/${subreddit}`);
    window.open(`https://www.reddit.com/r/${subreddit}`, "_blank"); // Abrir en nueva pestaña
  };

  // Crear el botón de eliminar
  const removeBtn = document.createElement("button");
  removeBtn.innerText = "Eliminar";
  removeBtn.className = "remove-btn";
  removeBtn.onclick = () => {
    subredditRails.removeChild(rail);
  };

  // Crear el botón de refrescar
  const refreshBtn = document.createElement("button");
  refreshBtn.innerText = "Refrescar";
  refreshBtn.className = "refresh-btn";
  refreshBtn.onclick = () => {
    rail.removeChild(rail.lastChild); // Eliminar publicaciones anteriores
    fetchSubreddit(subreddit); // Volver a obtener las publicaciones
  };

  // Agregar el título y los botones al carril
  rail.appendChild(title);
  rail.appendChild(removeBtn);
  rail.appendChild(refreshBtn);

  // Agregar las publicaciones al carril
  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    // Crear el título de la publicación como un enlace
    const postTitle = document.createElement("a");
    postTitle.innerText = post.data.title;
    postTitle.href = `https://www.reddit.com${post.data.permalink}`; // Enlace a la publicación
    postTitle.target = "_blank"; // Abrir en nueva pestaña
    postTitle.style.cursor = "pointer"; // Cambiar el cursor para indicar que es clickeable

    // Agregar el autor y los votos
    const postInfo = document.createElement("div");
    postInfo.innerHTML = `Autor: ${post.data.author} | Votos: ${post.data.ups}`;

    // Agregar el título y la información al div de la publicación
    postDiv.appendChild(postTitle);
    postDiv.appendChild(postInfo);
    rail.appendChild(postDiv);
  });

  // Agregar el carril al contenedor principal
  document.getElementById("subreddit-rails").appendChild(rail);
}
