// Archivo JS principal para futuras interacciones.
document.addEventListener("DOMContentLoaded", function () {
  console.log("main.js cargado");

  // Función para cargar estadísticas
  /*async function loadStats() {
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
*/
  function createCardHTML(post) {
    return `
    <article class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 w-full max-w-sm">
      <h3 class="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">${post.title}</h3>
      <p class="text-gray-600 mb-4 line-clamp-3">${post.excerpt}</p>
      <div class="mt-auto">
        <a href="./cancion.html#${post.slug}"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
           Ver reflexión
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
           </svg>
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
