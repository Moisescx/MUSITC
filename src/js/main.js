// Archivo JS principal para futuras interacciones.
document.addEventListener("DOMContentLoaded", function () {
  console.log("main.js cargado");

  // Función para cargar estadísticas
  async function loadStats() {
    try {
      const response = await fetch("./data/stats.json");
      if (!response.ok)
        throw new Error("No se pudieron cargar las estadísticas");

      const stats = await response.json();

      // Actualizar elementos que tengan data-stat
      const reflexionesEl = document.querySelector('[data-stat="reflexiones"]');
      const sugerenciasEl = document.querySelector('[data-stat="sugerencias"]');

      if (reflexionesEl) reflexionesEl.textContent = stats.reflexiones;
      if (sugerenciasEl) sugerenciasEl.textContent = stats.sugerencias;

      // Opcional: mostrar fecha de última actualización
      const lastUpdated = document.querySelector('[data-stat="lastUpdated"]');
      if (lastUpdated) {
        const date = new Date(stats.lastUpdated).toLocaleDateString("es-ES");
        lastUpdated.textContent = `Actualizado el ${date}`;
      }
    } catch (error) {
      console.log("Manteniendo estadísticas por defecto");
      // Las estadísticas quedan como están en el HTML
    }
  }

  // Función para crear el HTML de una card a partir de un post
  function createCardHTML(post) {
    return `
      <article class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold">${post.title}</h3>
        <p class="text-sm text-gray-600 mt-2">${post.excerpt}</p>
        <div class="mt-4">
          <a href="./cancion.html#${post.slug}"
              class="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
             Ver más
          </a>
        </div>
      </article>
    `;
  }

  // Renderizar posts desde data/post.json
  async function loadAndRenderPosts() {
    const container = document.getElementById("posts");
    const fallback = document.getElementById("posts-fallback");
    if (!container) return;

    try {
      const res = await fetch("./data/post.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not ok");
      const posts = await res.json();

      // Limpiar fallback
      if (fallback) fallback.remove();

      // Limitar a los primeros 4 posts
      const previewPosts = posts.slice(0, 4);

      // Insertar cada card en el contenedor
      previewPosts.forEach((post) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = createCardHTML(post);
        container.appendChild(wrapper);
      });
    } catch (err) {
      console.error("Error cargando posts:", err);
      if (fallback)
        fallback.textContent =
          "No se pudieron cargar las entradas. Revisa la consola.";
    }
  }

  // Cargar estadísticas si existe el elemento
  if (document.querySelector("[data-stat]")) {
    loadStats();
  }

  // Ejecutar la carga de posts
  loadAndRenderPosts();
});
