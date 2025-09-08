// Archivo JS principal para futuras interacciones.
// Por ahora está vacío, pero aquí puedes añadir listeners o pequeñas funciones.
document.addEventListener('DOMContentLoaded', function () {
  // Ejemplo: log para verificar que el script se carga
  console.log('main.js cargado');

  // Función para crear el HTML de una card a partir de un post
  function createCardHTML(post) {
    // Usamos template literals para construir la estructura de la card
    return `
      <article class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold">${post.title}</h3>
        <p class="text-sm text-gray-600 mt-2">${post.excerpt}</p>
        <div class="mt-4">
          <a href="./cancion.html" class="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Ver más</a>
        </div>
      </article>
    `;
  }

  // Renderizar posts desde data/post.json
  async function loadAndRenderPosts() {
    const container = document.getElementById('posts');
    const fallback = document.getElementById('posts-fallback');
    if (!container) return;

    try {
      const res = await fetch('./data/post.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const posts = await res.json();

      // Limpiar fallback
      if (fallback) fallback.remove();

      // Insertar cada card en el contenedor
      posts.forEach(post => {
        const wrapper = document.createElement('div');
        // Mantener la misma estructura de grid: cada card queda en un div
        wrapper.innerHTML = createCardHTML(post);
        container.appendChild(wrapper);
      });

    } catch (err) {
      console.error('Error cargando posts:', err);
      if (fallback) fallback.textContent = 'No se pudieron cargar las entradas. Revisa la consola.';
    }
  }

  // Ejecutar la carga
  loadAndRenderPosts();
});
