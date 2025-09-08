// Script para cancion.html: carga posts y crea carrusel, botones de días y panel de detalle.
// Asume que existe `data/post.json` con un array de posts.

document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.getElementById('post-title');
  const metaEl = document.getElementById('post-meta');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const counterEl = document.getElementById('post-counter');

  let posts = [];
  let index = 0; // index of current post in posts array

  function renderPost(i) {
  // hide all tab content while updating (use style display to guarantee hiding)
  document.querySelectorAll('.tab-content').forEach(t => { t.classList.add('hidden'); t.style.display = 'none'; });
    if (!posts.length) {
      titleEl.textContent = 'No hay canciones';
      metaEl.textContent = '';
      counterEl.textContent = '';
      return;
    }
    const p = posts[i];
    titleEl.textContent = p.title || 'Sin título';
    metaEl.textContent = p.excerpt || '';

    // Fill tabbed sections
    const lyricsEl = document.getElementById('tab-lyrics');
    const reflectionEl = document.getElementById('tab-reflection');
    const listenEl = document.getElementById('tab-listen');

  // put plain text into the panels; use textContent to avoid injecting HTML
  lyricsEl.textContent = p.content || 'Letra no disponible.';
  reflectionEl.textContent = p.reflection || p.excerpt || 'Reflexión no disponible.';

    // Render actions (listen button) inside tab-listen
  // ensure actions live only within the listen tab
  const actions = document.getElementById('post-actions');
  actions.innerHTML = '';
    const linkText = p.listenText || 'Escuchar';
    if (p.listenUrl) {
      const a = document.createElement('a');
      a.href = p.listenUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
  // Use inline styles as fallback to ensure visibility even if Tailwind classes miscompile
  a.className = 'inline-flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded shadow hover:bg-green-700';
  a.style.backgroundColor = '#16a34a'; // green-600
  a.style.color = '#ffffff';
  a.style.padding = '8px 16px';
  a.style.display = 'inline-flex';
  a.style.alignItems = 'center';
  a.style.gap = '8px';
      a.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22v-20l18 10-18 10z"/></svg>
        ${linkText}
      `;
      actions.appendChild(a);
    } else {
      // show fallback text
      const span = document.createElement('div');
      span.className = 'text-sm text-gray-600';
      span.textContent = p.listenText || 'No disponible para escuchar.';
      actions.appendChild(span);
    }

  counterEl.textContent = `${i + 1} / ${posts.length}`;

  // Preserve current tab selection on post change, or show lyrics by default
  const currentHash = location.hash.replace('#', '');
  if (['lyrics', 'reflection', 'listen'].includes(currentHash)) showTab(currentHash);
  else showTab('lyrics');
  }

  function prev() {
    index = (index - 1 + posts.length) % posts.length;
    renderPost(index);
  }

  function next() {
    index = (index + 1) % posts.length;
    renderPost(index);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Tab switching logic
  function showTab(name) {
    // hide with style.display as a reliable fallback
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(t => {
      t.style.display = 'none';
      // keep existing hidden class if present
      t.classList.add('hidden');
    });
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => {
      b.classList.remove('bg-blue-600', 'text-white');
      // inline style fallback
      b.style.backgroundColor = '';
      b.style.color = '';
    });
    const active = document.getElementById('tab-' + name);
    if (active) {
      active.classList.remove('hidden');
      active.style.display = 'block';
    }
    const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (btn) {
      btn.classList.add('bg-blue-600', 'text-white');
      // fallback inline styles in case Tailwind classes missing
      btn.style.backgroundColor = '#2563eb'; // blue-600
      btn.style.color = '#ffffff';
    }
    // Update hash without scrolling
    if (history.replaceState) history.replaceState(null, '', '#' + name);
  }

  // Attach tab button handlers
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.tab-btn');
    if (!b) return;
    const tab = b.dataset.tab;
    showTab(tab);
  });

  // On load, check hash to select tab
  function selectInitialTab() {
    const h = location.hash.replace('#', '');
    if (['lyrics', 'reflection', 'listen'].includes(h)) showTab(h);
    else showTab('lyrics');
  }

  // Load posts
  fetch('./data/post.json')
    .then(r => {
      if (!r.ok) throw new Error('Network response not ok');
      return r.json();
    })
    .then(data => {
      posts = (data || []).filter(Boolean);
      if (!posts.length) {
        renderPost(0);
        return;
      }
      // Optional: sort by id if ids are numeric
      posts.sort((a, b) => {
        const ai = Number(a.id) || 0;
        const bi = Number(b.id) || 0;
        return ai - bi;
      });
      index = 0;
      renderPost(index);
  selectInitialTab();
    })
    .catch(err => {
    console.error('Error loading posts:', err);
    titleEl.textContent = 'Error cargando canciones';
    metaEl.textContent = '';
    });

});
