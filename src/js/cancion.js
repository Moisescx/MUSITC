// Script para cancion.html: carga posts y crea carrusel, botones de días y panel de detalle.
// Asume que existe `data/post.json` con un array de posts.

document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.getElementById('post-title');
  const metaEl = document.getElementById('post-meta');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const counterEl = document.getElementById('post-counter');

  const filterAuthor = document.getElementById('filter-author');
  const filterGenre = document.getElementById('filter-genre');
  const clearFilters = document.getElementById('clear-filters');

  let posts = [];
  let filteredPosts = [];
  let index = 0;

  function renderPost(i) {
    document.querySelectorAll('.tab-content').forEach(t => {
      t.classList.add('hidden'); 
      t.style.display = 'none'; 
    });

    if (!filteredPosts.length) {
      titleEl.textContent = 'No hay canciones';
      metaEl.textContent = '';
      counterEl.textContent = '';
      return;
    }

    const p = filteredPosts[i];
    titleEl.textContent = p.title || 'Sin título';
    metaEl.textContent = p.excerpt || '';

    document.getElementById('tab-author').textContent = p.authorFilter || 'Información del autor no disponible.';
    document.getElementById('tab-reflection').textContent = p.reflection || p.excerpt || 'Reflexión no disponible.';

    const actions = document.getElementById('post-actions');
    actions.innerHTML = '';
    if (p.listenUrl) {
      const a = document.createElement('a');
      a.href = p.listenUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'inline-flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded shadow hover:bg-green-700';
      a.innerHTML = `🎵 ${p.listenText || 'Escuchar'}`;
      actions.appendChild(a);
    } else {
      const span = document.createElement('div');
      span.className = 'text-sm text-gray-600';
      span.textContent = p.listenText || 'No disponible para escuchar.';
      actions.appendChild(span);
    }

    counterEl.textContent = `${i + 1} / ${filteredPosts.length}`;

    const currentHash = location.hash.replace('#', '');
    if (['author', 'reflection', 'listen'].includes(currentHash)) showTab(currentHash);
    else showTab('author');
  }

  function prev() { index = (index - 1 + filteredPosts.length) % filteredPosts.length; renderPost(index); }
  function next() { index = (index + 1) % filteredPosts.length; renderPost(index); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  function showTab(name) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(t => { t.style.display = 'none'; t.classList.add('hidden'); });
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => { b.classList.remove('bg-blue-600','text-white'); b.style.backgroundColor=''; b.style.color=''; });
    const active = document.getElementById('tab-' + name);
    if (active) { active.classList.remove('hidden'); active.style.display = 'block'; }
    const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (btn) { btn.classList.add('bg-blue-600','text-white'); btn.style.backgroundColor='#2563eb'; btn.style.color='#fff'; }
    if (history.replaceState) history.replaceState(null, '', '#' + name);
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.tab-btn');
    if (!b) return;
    showTab(b.dataset.tab);
  });

  function applyFilters() {
    const authorValue = filterAuthor.value;
    const genreValue = filterGenre.value;
    filteredPosts = posts.filter(p => {
      return (!authorValue || p.author === authorValue) &&
             (!genreValue || p.genre === genreValue);
    });
    index = 0;
    renderPost(index);
  }

  filterAuthor.addEventListener('change', applyFilters);
  filterGenre.addEventListener('change', applyFilters);
  clearFilters.addEventListener('click', () => {
    filterAuthor.value = '';
    filterGenre.value = '';
    applyFilters();
  });

  fetch('./data/post.json')
    .then(r => { if (!r.ok) throw new Error('Network response not ok'); return r.json(); })
    .then(data => {
      posts = (data || []).filter(Boolean);

      // Llenar selects de filtro
      const authors = [...new Set(posts.map(p => p.author).filter(Boolean))];
      const genres = [...new Set(posts.map(p => p.genre).filter(Boolean))];

      authors.forEach(a => { const o = document.createElement('option'); o.value = a; o.textContent = a; filterAuthor.appendChild(o); });
      genres.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; filterGenre.appendChild(o); });

      filteredPosts = [...posts];
      filteredPosts.sort((a,b)=> (Number(a.id)||0) - (Number(b.id)||0));
      index = 0;
      renderPost(index);
      const h = location.hash.replace('#','');
      if (['author','reflection','listen'].includes(h)) showTab(h);
      else showTab('author');
    })
    .catch(err => {
      console.error('Error cargando posts:', err);
      titleEl.textContent = 'Error cargando canciones';
      metaEl.textContent = '';
    });
});
