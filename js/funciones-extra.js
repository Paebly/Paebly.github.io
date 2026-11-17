/* Funciones adicionales de Cercanías. Los datos editados y las opiniones
   se guardan en este navegador: para uso público hace falta un servidor. */
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const keyReviews = 'cercanias_opiniones_v1';
  const keyEdits = 'cercanias_comercios_ediciones_v1';
  const get = key => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const mapUrl = name => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name + ', Buenos Aires, Argentina')}`;
  const socialUrl = (network, name) => network === 'Instagram'
    ? `https://www.instagram.com/${encodeURIComponent(name.replace(/\s+/g, '').toLowerCase())}/`
    : `https://www.facebook.com/search/top?q=${encodeURIComponent(name)}`;

  const businessExtra = [
    {name:'Bodegón 606',city:'Merlo',address:'Libertad 606, Merlo',category:'gastronomia',description:'Bodegón de cocina argentina y platos tradicionales. Consultá la carta y los horarios antes de visitar.'},
    {name:'Kentucky',city:'Merlo',address:'Juncal 898-850, Merlo',category:'gastronomia',description:'Pizzería y restaurante céntrico, con propuesta de pizza y comidas para distintos momentos del día.'},
    {name:'Salamanca',city:'Merlo',address:'Av. del Libertador 467, Merlo',category:'gastronomia',description:'Cafetería y restaurante sobre una de las avenidas principales de Merlo.'},
    {name:'Virtuoso Coffee',city:'Merlo',address:'Juncal 465, Merlo',category:'gastronomia',description:'Cafetería y espresso bar para disfrutar café en la zona céntrica.'},
    {name:'Café La Logia',city:'Merlo',address:'Suipacha 780, Merlo',category:'gastronomia',description:'Cafetería y pastelería, una opción para desayunos y meriendas.'},
    {name:'Bonafide Merlo',city:'Merlo',address:'Chacabuco 678, Merlo',category:'gastronomia',description:'Cafetería con desayunos, meriendas y productos de chocolate.'},
    {name:'Pepper Resto y Coffee',city:'Merlo',address:'Av. del Libertador 701, Merlo',category:'gastronomia',description:'Restaurante y cafetería en el centro de Merlo.'},
    {name:'Que Chimba! Café y Pastelería',city:'Merlo',address:'Juncal 557, Merlo',category:'gastronomia',description:'Cafetería y pastelería con variedad de productos dulces.'}
  ];
  const touristExtra = [
    {name:'Casa de la Cultura de Merlo',address:'Av. Calle Real y Padre Espinal, Merlo',description:'Espacio cultural municipal donde se realizan talleres, cursos y espectáculos.'},
    {name:'Espacio Multiarte',address:'Riobamba entre Colón y Pasteur, Merlo',description:'Espacio dedicado a actividades artísticas y culturales.'},
    {name:'Parque Cultural de Padua',address:'Av. Pte. Perón 23850, San Antonio de Padua, Merlo',description:'Parque cultural con propuestas recreativas y actividades para la comunidad.'},
    {name:'Parque Cultural de Libertad',address:'Av. Eva Perón y Colombia, Libertad, Merlo',description:'Espacio municipal para actividades culturales y recreativas.'},
    {name:'Museo Casa Correa',address:'Padre Espinal 874, Merlo',description:'Museo local para conocer parte de la historia y el patrimonio de la zona.'},
    {name:'Museo Malvinas, Memoria del Pueblo de Merlo',address:'Av. Argentina 1086, Merlo',description:'Espacio de memoria dedicado a la historia de Malvinas y su vínculo con la comunidad.'},
    {name:'Museo Interactivo de Ciencias Naturales',address:'Av. Pte. Perón 23850, San Antonio de Padua, Merlo',description:'Propuesta educativa e interactiva vinculada a las ciencias naturales.'}
  ];

  function makeCard(item, isShop) {
    const article = document.createElement('article');
    article.className = `place-card ${isShop ? 'shop-card' : ''} extra-card`;
    article.dataset.category = isShop ? item.category : 'cultura';
    article.dataset.name = item.name.toLowerCase();
    article.dataset.city = 'Merlo';
    article.innerHTML = `<div class="shop-visual"><span>${isShop ? '⌂' : '✦'}</span><small>${isShop ? 'COMERCIO DE MERLO' : 'LUGAR DE INTERÉS · MERLO'}</small></div><div class="card-body"><span class="pill ${isShop ? 'red-pill' : 'green-pill'}">${isShop ? 'Gastronomía' : 'Cultura'}</span><h3>${safe(item.name)}</h3><p><strong>Dirección:</strong> ${safe(item.address)}, Buenos Aires.<br>${safe(item.description)}</p><div class="extra-actions"><a class="text-link" href="${mapUrl(item.name + ', ' + item.address)}" target="_blank" rel="noopener">Cómo llegar ↗</a><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}" target="_blank" rel="noopener">Ver ubicación ↗</a></div></div>`;
    return article;
  }

  const shopGrid = $('#shops-grid');
  if (shopGrid) businessExtra.forEach(item => shopGrid.appendChild(makeCard(item, true)));
  const placeGrid = $('#places-grid');
  if (placeGrid) touristExtra.forEach(item => placeGrid.appendChild(makeCard(item, false)));

  // Herramientas por ficha: indicaciones, redes sociales y opiniones.
  document.querySelectorAll('.place-card').forEach((card, index) => {
    const title = $('h3', card)?.textContent?.trim();
    if (!title || card.dataset.extraEnhanced) return;
    card.dataset.extraEnhanced = '1';
    const city = card.dataset.city || (card.textContent.includes('Merlo') ? 'Merlo' : 'Marcos Paz');
    const query = `${title}, ${city}, Buenos Aires, Argentina`;
    const body = $('.card-body', card) || card;
    const links = document.createElement('div');
    links.className = 'extra-actions';
    links.innerHTML = `<a class="text-link" href="${mapUrl(query)}" target="_blank" rel="noopener">Indicaciones para llegar ↗</a><a class="text-link" href="https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(title)}" target="_blank" rel="noopener">Instagram ↗</a><a class="text-link" href="https://www.facebook.com/search/top?q=${encodeURIComponent(title)}" target="_blank" rel="noopener">Facebook ↗</a>`;
    body.appendChild(links);
    const reviews = get(keyReviews);
    const id = `${city}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const panel = document.createElement('div');
    panel.className = 'review-panel';
    panel.innerHTML = `<details><summary>Opiniones y calificaciones <span class="review-count">(${(reviews[id] || []).length})</span></summary><div class="review-list"></div><form class="review-form"><label>Tu calificación <select name="rating" required><option value="">Elegir</option><option value="5">★★★★★ · Excelente</option><option value="4">★★★★ · Muy bueno</option><option value="3">★★★ · Bueno</option><option value="2">★★ · Regular</option><option value="1">★ · Malo</option></select></label><label>Tu opinión <textarea name="comment" rows="2" maxlength="400" required placeholder="Contá brevemente tu experiencia"></textarea></label><button class="btn-primary" type="submit">Publicar opinión</button><p class="muted">Ingresá con una cuenta de usuario para publicar. Opiniones guardadas en este dispositivo.</p></form></details>`;
    body.appendChild(panel);
    const list = $('.review-list', panel);
    const render = () => {
      const entries = get(keyReviews)[id] || [];
      list.innerHTML = entries.length ? entries.map(r => `<p class="review-entry"><strong>${'★'.repeat(Number(r.rating))}${'☆'.repeat(5-Number(r.rating))}</strong><br><b>${safe(r.author || 'Visitante')}</b><br>${safe(r.comment)}</p>`).join('') : '<p class="muted">Todavía no hay opiniones. ¡Sé el primero en compartir tu experiencia!</p>';
      $('.review-count', panel).textContent = `(${entries.length})`;
    };
    render();
    $('.review-form', panel).addEventListener('submit', e => {
      e.preventDefault(); const form = e.currentTarget;
      let account = null; try { account = JSON.parse(sessionStorage.getItem('cercanias_demo_session_v1') || 'null'); } catch {}
      if (!account || account.role !== 'usuario') { alert('Para publicar una opinión, ingresá o creá una cuenta de usuario.'); location.href = 'acceso.html'; return; }
      const data = new FormData(form); const all = get(keyReviews);
      all[id] ||= []; all[id].unshift({author:account.name,rating:data.get('rating'),comment:data.get('comment').trim()});
      save(keyReviews, all); form.reset(); render();
    });
  });

  // Distancia desde el dispositivo: requiere permiso de ubicación y muestra la ruta en Maps.
  const locationButton = $('#nearby-location');
  if (locationButton) locationButton.addEventListener('click', () => {
    const status = $('#nearby-status');
    if (!navigator.geolocation) { status.textContent = 'Tu navegador no permite obtener la ubicación.'; return; }
    status.textContent = 'Solicitando permiso de ubicación…';
    navigator.geolocation.getCurrentPosition(pos => {
      const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
      status.textContent = 'Ubicación obtenida. Abrí las indicaciones para consultar distancia y tiempo estimado.';
      document.querySelectorAll('.extra-actions a:first-child').forEach(a => {
        const u = new URL(a.href); u.searchParams.set('origin', origin); a.href = u.toString();
      });
    }, () => { status.textContent = 'No se pudo acceder a tu ubicación. Podés habilitar el permiso del navegador o usar el mapa manualmente.'; }, {enableHighAccuracy:true,timeout:10000});
  });

  // Acceso al panel con cuenta de comerciante (prototipo de autenticación local).
  if (shopGrid) {
    const section = document.createElement('section'); section.className = 'section merchant-area';
    section.innerHTML = `<div class="merchant-box"><span class="eyebrow">IMPULSO LOCAL</span><h2>¿Tenés un comercio?</h2><p>Creá una cuenta de comerciante para administrar tu ficha, actualizar redes y solicitar aparecer entre los comercios destacados.</p><a class="btn btn-primary" href="acceso.html">Ingresar como comerciante / Crear cuenta</a><p class="muted">Las cuentas de esta versión son demostrativas y se guardan solo en el navegador. Para publicar cambios para todos los visitantes se necesita conectar una base de datos y un servidor.</p></div>`;
    shopGrid.closest('.section').insertAdjacentElement('afterend', section);
  }

  // Botón para pedir geolocalización: se agrega sin obligar al visitante.
  const hero = $('.page-hero');
  if (hero && !$('#nearby-location')) {
    const wrap = document.createElement('div'); wrap.className = 'nearby-tools';
    wrap.innerHTML = '<button type="button" class="btn-primary" id="nearby-location">Usar mi ubicación</button><span id="nearby-status" class="muted">La ubicación solo se usa si das permiso. Google Maps calculará la ruta y la distancia.</span>';
    hero.appendChild(wrap);
  }
})();
