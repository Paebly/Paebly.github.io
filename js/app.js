/* CERCANÍAS · funcionalidades generales */
document.addEventListener("DOMContentLoaded", () => {
  // Menú adaptable
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // Buscador de la página principal
  const globalSearch = document.querySelector("#global-search");
  if (globalSearch) {
    globalSearch.addEventListener("submit", event => {
      event.preventDefault();
      const query = document.querySelector("#search-input").value.trim();
      const category = document.querySelector("#search-category").value;
      const destination = category === "comercio" ? "comercios.html" : "lugares.html";
      const url = new URL(destination, window.location.href);
      if (query) url.searchParams.set("q", query);
      window.location.href = url.href;
    });
  }

  // Filtros reutilizables para tarjetas
  function setupFilters(buttonContainer, gridSelector, searchSelector, emptySelector) {
    const container = document.querySelector(buttonContainer);
    const grid = document.querySelector(gridSelector);
    if (!container || !grid) return;
    const cards = [...grid.querySelectorAll(".place-card")];
    const search = document.querySelector(searchSelector);
    const empty = document.querySelector(emptySelector);
    let activeFilter = "todos";

    function update() {
      const query = (search?.value || "").toLocaleLowerCase("es").trim();
      let visible = 0;
      cards.forEach(card => {
        const matchesCategory = activeFilter === "todos" || card.dataset.category === activeFilter;
        const text = `${card.dataset.name || ""} ${card.textContent}`.toLocaleLowerCase("es");
        const matchesText = text.includes(query);
        const show = matchesCategory && matchesText;
        card.hidden = !show;
        if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }
    container.addEventListener("click", event => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeFilter = button.dataset.filter;
      container.querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === button));
      update();
    });
    search?.addEventListener("input", update);
    update();
  }
  setupFilters("#place-filters", "#places-grid", "#place-search", "#places-empty");
  setupFilters("#shop-filters", "#shops-grid", "#shop-search", "#shops-empty");

  // Permite recibir búsquedas desde el inicio
  const params = new URLSearchParams(window.location.search);
  const incomingQuery = params.get("q");
  if (incomingQuery) {
    const search = document.querySelector("#place-search, #shop-search");
    if (search) {
      search.value = incomingQuery;
      search.dispatchEvent(new Event("input"));
    }
  }

  // Reservas de demostración: se guardan solamente en el navegador actual
  const bookingForm = document.querySelector("#booking-form");
  const bookingList = document.querySelector("#booking-list");
  const bookingMessage = document.querySelector("#booking-message");
  const dateInput = document.querySelector("#booking-date");
  const storageKey = "cercanias_reservas";
  if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

  function getBookings() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); }
    catch { return []; }
  }
  function renderBookings() {
    if (!bookingList) return;
    const bookings = getBookings();
    if (!bookings.length) {
      bookingList.innerHTML = '<p class="muted">Todavía no tenés solicitudes guardadas.</p>';
      return;
    }
    bookingList.innerHTML = bookings.map(item =>
      `<article class="booking-item"><div><strong>${escapeHTML(item.place)}</strong><br><span class="muted">${escapeHTML(item.name)} · ${escapeHTML(item.date)} · ${item.people} persona(s)</span></div><strong>${escapeHTML(item.code)}</strong></article>`
    ).join("");
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  }
  if (bookingForm) {
    renderBookings();
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;
      const data = new FormData(bookingForm);
      const booking = {
        code: "CER-" + Math.floor(100000 + Math.random() * 900000),
        name: data.get("name").trim(),
        email: data.get("email").trim(),
        place: data.get("place"),
        date: data.get("date"),
        people: Number(data.get("people")),
        notes: data.get("notes").trim(),
        status: "Pendiente de confirmación"
      };
      const bookings = getBookings();
      bookings.unshift(booking);
      localStorage.setItem(storageKey, JSON.stringify(bookings));
      bookingMessage.textContent = `Solicitud guardada. Tu código es ${booking.code}. Recordá que todavía debe confirmarse con el establecimiento.`;
      bookingForm.reset();
      if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
      renderBookings();
    });
  }

  // Consulta del estado local de una reserva (no procesa pagos)
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", event => {
      event.preventDefault();
      const code = new FormData(paymentForm).get("code").trim().toUpperCase();
      const bookings = getBookings();
      const booking = bookings.find(item => item.code.toUpperCase() === code);
      const message = document.querySelector("#payment-message");
      message.textContent = booking
        ? `Solicitud encontrada: ${booking.place}, fecha ${booking.date}. Estado: ${booking.status}. Esta demostración no cobra ni procesa pagos.`
        : "No encontramos ese código en este navegador. Verificá el código o el dispositivo donde realizaste la solicitud.";
    });
  }

  // Mapa Leaflet + OpenStreetMap. Coordenadas orientativas para el prototipo.
  const mapElement = document.querySelector("#map");
  if (mapElement && window.L) {
    const map = L.map("map").setView([-34.7805, -58.8375], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const points = [
      {name:"Plaza General San Martín",type:"lugar",lat:-34.7802,lng:-58.8375,detail:"Plaza principal de Marcos Paz."},
      {name:"Templo San Marcos Evangelista",type:"lugar",lat:-34.7801,lng:-58.8367,detail:"Templo histórico frente al área de la plaza."},
      {name:"Casa de la Cultura",type:"lugar",lat:-34.7800,lng:-58.8359,detail:"Belgrano y 25 de Mayo. Consultá actividades y horarios."},
      {name:"Museo Islas Malvinas",type:"lugar",lat:-34.7788,lng:-58.8361,detail:"Ferrari 15. Confirmá horarios antes de visitar."},
      {name:"Museo de Ciencias Naturales Lucas Kraglievich",type:"lugar",lat:-34.7820,lng:-58.8330,detail:"José C. Paz 146. Consultá horarios actualizados."},
      {name:"Jardín Botánico Florencio Malatesta",type:"lugar",lat:-34.7905,lng:-58.8465,detail:"Predio de la Quinta de Devoto, Ruta Provincial 200. Ubicación orientativa."},
      {name:"Paseo del Bicentenario y La Poderosa",type:"lugar",lat:-34.7812,lng:-58.8383,detail:"Punto de interés de la historia ferroviaria local."},
      {name:"Reserva Natural El Durazno",type:"lugar",lat:-34.8170,lng:-58.8740,detail:"Ubicación orientativa. Verificá si está habilitada para visitas."},
      {name:"Centro Recreativo Inchausti",type:"lugar",lat:-34.7845,lng:-58.8420,detail:"Espacio verde recreativo. Confirmá el acceso."},
      {name:"Seiki Sushi",type:"comercio",lat:-34.7798,lng:-58.8357,detail:"Pellegrini 48. Dirección del directorio municipal; verificá actividad."},
      {name:"La Notable",type:"comercio",lat:-34.7808,lng:-58.8365,detail:"Avellaneda e Independencia. Dirección del directorio municipal."},
      {name:"Nuestra Casa",type:"comercio",lat:-34.7820,lng:-58.8362,detail:"Leandro N. Alem 139. Dirección del directorio municipal."},
      {name:"Hansel y Gretel",type:"comercio",lat:-34.7805,lng:-58.8348,detail:"Pellegrini 160. Dirección del directorio municipal."},
      {name:"Gato Negro",type:"comercio",lat:-34.7809,lng:-58.8371,detail:"San Martín 829. Dirección del directorio municipal."},
      {name:"El Despacho Cervecería",type:"comercio",lat:-34.7825,lng:-58.8327,detail:"Belgrano 2131. Dirección del directorio municipal."},
      {name:"Bonafide",type:"comercio",lat:-34.7812,lng:-58.8362,detail:"Independencia 184. Dirección del directorio municipal."},
      {name:"Aibar",type:"comercio",lat:-34.7815,lng:-58.8365,detail:"Sarmiento 1975. Dirección del directorio municipal."},
      {name:"Rocket Cervecería",type:"comercio",lat:-34.7818,lng:-58.8352,detail:"Sarmiento 1786. Dirección del directorio municipal."}
    ];
    const markers = [];
    points.forEach(point => {
      const marker = L.marker([point.lat, point.lng]).bindPopup(`<strong>${escapeHTML(point.name)}</strong><br>${escapeHTML(point.detail)}<br><small>${point.type === "lugar" ? "Lugar turístico" : "Comercio"}</small>`);
      marker.addTo(map);
      markers.push({marker, type:point.type});
    });
    const mapFilter = document.querySelector("#map-filter");
    mapFilter?.addEventListener("change", () => {
      markers.forEach(item => {
        const visible = mapFilter.value === "todos" || mapFilter.value === item.type;
        if (visible && !map.hasLayer(item.marker)) item.marker.addTo(map);
        if (!visible && map.hasLayer(item.marker)) map.removeLayer(item.marker);
      });
    });
  } else if (mapElement) {
    mapElement.innerHTML = "<p style='padding:24px'>No se pudo cargar el mapa. Revisá tu conexión a internet.</p>";
  }

  // Planificador inicial de recorridos (reglas locales; no es todavía IA).
  const tripForm = document.querySelector("#trip-form");
  if (tripForm) {
    tripForm.addEventListener("submit", event => {
      event.preventDefault();
      const hours = Number(document.querySelector("#trip-time").value);
      const interest = document.querySelector("#trip-interest").value;
      const options = [
        {name:"Plaza General San Martín",category:"historia",duration:30,link:"lugares.html"},
        {name:"Templo San Marcos Evangelista",category:"historia",duration:25,link:"lugares.html"},
        {name:"Casa de la Cultura",category:"cultura",duration:45,link:"lugares.html"},
        {name:"Museo de Ciencias Naturales Lucas Kraglievich",category:"cultura",duration:60,link:"lugares.html"},
        {name:"Jardín Botánico Florencio Malatesta",category:"naturaleza",duration:60,link:"lugares.html"},
        {name:"Centro Recreativo Inchausti",category:"naturaleza",duration:60,link:"lugares.html"},
        {name:"Paseo del Bicentenario y La Poderosa",category:"historia",duration:35,link:"lugares.html"}
      ];
      let selected = interest === "todos" ? options : options.filter(item => item.category === interest);
      if (!selected.length) selected = options;
      const limit = Math.max(1, Math.floor(hours * 60 / 45));
      const chosen = selected.slice(0, limit);
      const result = document.querySelector("#trip-result");
      result.innerHTML = `<strong>Tu idea de recorrido (${hours} horas)</strong><ol>${chosen.map(item => `<li>${escapeHTML(item.name)} <span class="muted">· ${item.duration} min aprox.</span></li>`).join("")}</ol><p>Esta es una sugerencia orientativa, no calcula distancias ni disponibilidad. Revisá horarios, accesos y traslados antes de salir.</p><a class="text-link" href="mapa.html">Abrir el mapa interactivo →</a>`;
    });
  }
});