/**
 * Lazy-loaded Google Maps amenity explorer for Consenza Estates.
 */
import { loadGoogleMaps, mapsAuthFailed } from '../lib/google-maps-loader.js';

function directionsUrl(lat, lng, name) {
  const q = encodeURIComponent(name || `${lat},${lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** One Places request per category per page session */
const categorySearchCache = new Map();

function searchCategory(center, categoryId, types, radiusMeters) {
  let p = categorySearchCache.get(categoryId);
  if (!p) {
    p = (async () => {
      const { Place } = await google.maps.importLibrary('places');
      const { places } = await Place.searchNearby({
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
        locationRestriction: { center, radius: radiusMeters },
        includedPrimaryTypes: types,
        maxResultCount: 10,
        rankPreference: 'POPULARITY',
      });
      return places ?? [];
    })();
    p.catch(() => categorySearchCache.delete(categoryId));
    categorySearchCache.set(categoryId, p);
  }
  return p;
}

function placeToMarkerData(place) {
  const loc = place.location;
  const json = loc?.toJSON?.() ?? loc;
  const lat = typeof loc?.lat === 'function' ? loc.lat() : json?.lat;
  const lng = typeof loc?.lng === 'function' ? loc.lng() : json?.lng;
  const displayName =
    typeof place.displayName === 'string'
      ? place.displayName
      : place.displayName?.text ?? place.displayName?.toString?.() ?? 'Place';
  return {
    name: displayName,
    lat,
    lng,
    address: place.formattedAddress || '',
    mapsUrl: place.googleMapsURI || directionsUrl(lat, lng, displayName),
  };
}

function buildInfoWindowContent(data) {
  const wrap = document.createElement('div');
  wrap.className = 'amenity-map__info';
  const title = document.createElement('strong');
  title.textContent = data.name;
  wrap.appendChild(title);
  if (data.address) {
    const addr = document.createElement('div');
    addr.textContent = data.address;
    wrap.appendChild(addr);
  }
  const link = document.createElement('a');
  link.href = data.mapsUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Directions';
  wrap.appendChild(link);
  return wrap;
}

function showFallback(root) {
  const fallback = root.querySelector('[data-amenity-fallback]');
  const interactive = root.querySelector('[data-amenity-interactive]');
  if (interactive) interactive.hidden = true;
  if (fallback) fallback.hidden = false;
}

function parseCurated(root) {
  try {
    return JSON.parse(root.dataset.curated || '[]');
  } catch {
    return [];
  }
}

function renderCuratedForCategory(listEl, curated, categoryId, communityName) {
  if (!listEl) return;
  const items = curated.filter((p) => p.category === categoryId);
  if (!items.length) {
    listEl.innerHTML =
      '<p class="amenity-map__empty">Featured places for this category are listed below the map.</p>';
    return;
  }
  listEl.innerHTML = items
    .map(
      (p) => `
      <li>
        <strong>${escapeHtml(p.name)}</strong>
        <br /><span>${escapeHtml(p.address || '')}</span>
        <br /><a href="${escapeHtml(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.address || ''}`)}`
        )}" target="_blank" rel="noopener noreferrer">Directions</a>
      </li>`
    )
    .join('');
}

function initAmenityMap(root) {
  const apiKey = root.dataset.apiKey?.trim();
  const mapId = root.dataset.mapId?.trim();
  const lat = parseFloat(root.dataset.lat, 10);
  const lng = parseFloat(root.dataset.lng, 10);
  const communityName = root.dataset.communityName || 'Community';
  const radius = parseInt(root.dataset.radius || '8000', 10);
  const curated = parseCurated(root);
  let categories = [];
  try {
    categories = JSON.parse(root.dataset.categories || '[]');
  } catch {
    categories = [];
  }

  const mapEl = root.querySelector('[data-amenity-map-canvas]');
  const statusEl = root.querySelector('[data-amenity-status]');
  const listEl = root.querySelector('[data-amenity-results-list]');
  const filterContainer = root.querySelector('[data-amenity-filters]');

  if (!mapEl || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    showFallback(root);
    return;
  }

  if (!apiKey || mapsAuthFailed) {
    showFallback(root);
    return;
  }

  const center = { lat, lng };
  let map;
  let markers = [];
  let infoWindow;
  let activeCategory = categories[0]?.id;
  let authListener;
  let tornDown = false;

  function teardownToFallback() {
    if (tornDown) return;
    tornDown = true;
    clearMarkers();
    if (mapEl) mapEl.replaceChildren();
    if (authListener) {
      window.removeEventListener('gmaps:auth-failure', authListener);
      authListener = null;
    }
    showFallback(root);
    setStatus(`Map preview — featured places near ${communityName}`);
  }

  authListener = () => teardownToFallback();
  window.addEventListener('gmaps:auth-failure', authListener);

  function clearMarkers() {
    markers.forEach((m) => {
      if (m.map !== undefined) m.map = null;
      else if (m.setMap) m.setMap(null);
    });
    markers = [];
  }

  function setStatus(message) {
    if (statusEl) statusEl.textContent = message;
  }

  function renderResultList(items) {
    if (!listEl) return;
    if (!items.length) {
      listEl.innerHTML = '<p class="amenity-map__empty">No places found for this category in the search area.</p>';
      return;
    }
    listEl.innerHTML = items
      .map(
        (p) => `
      <li>
        <strong>${escapeHtml(p.name)}</strong>
        <br /><span>${escapeHtml(p.address)}</span>
        <br /><a href="${escapeHtml(p.mapsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>
      </li>`
      )
      .join('');
  }

  function addMarker(data, options = {}) {
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lng) || !map) return;
    const position = { lat: data.lat, lng: data.lng };
    let marker;
    if (mapId && google.maps.marker?.AdvancedMarkerElement) {
      const pin = document.createElement('div');
      pin.className = options.isCommunity ? 'amenity-map__community-pin' : 'amenity-map__place-pin';
      pin.textContent = options.isCommunity ? '★' : '•';
      pin.setAttribute('aria-hidden', 'true');
      marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title: data.name,
        content: pin,
      });
    } else {
      marker = new google.maps.Marker({
        map,
        position,
        title: data.name,
        icon: options.isCommunity
          ? undefined
          : {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#7d3f98',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#fff',
            },
      });
    }

    const openInfo = () => {
      infoWindow.setContent(buildInfoWindowContent(data));
      infoWindow.open({ anchor: marker, map });
    };
    marker.addListener('click', openInfo);
    markers.push(marker);
  }

  async function loadCategory(categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    if (!category || !map || tornDown) return;
    activeCategory = categoryId;
    clearMarkers();
    setStatus(`Loading ${category.label}…`);

    addMarker(
      {
        name: communityName,
        lat,
        lng,
        address: root.dataset.communityAddress || '',
        mapsUrl: directionsUrl(lat, lng, communityName),
      },
      { isCommunity: true }
    );

    let normalized = [];
    try {
      const places = await searchCategory(center, categoryId, category.placeTypes, radius);
      normalized = places
        .map((p) => placeToMarkerData(p))
        .filter((p) => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng));
    } catch {
      renderCuratedForCategory(listEl, curated, categoryId, communityName);
      setStatus(`Showing featured ${category.label.toLowerCase()} near ${communityName}`);
      return;
    }

    normalized.forEach((p) => addMarker(p));
    if (!normalized.length) {
      renderCuratedForCategory(listEl, curated, categoryId, communityName);
      setStatus(`Showing featured ${category.label.toLowerCase()} near ${communityName}`);
      return;
    }
    renderResultList(normalized);
    setStatus(`${normalized.length} ${category.label.toLowerCase()} near ${communityName}`);
  }

  function bindFilters() {
    if (!filterContainer) return;
    filterContainer.querySelectorAll('[data-amenity-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-amenity-filter');
        filterContainer.querySelectorAll('[data-amenity-filter]').forEach((b) => {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        loadCategory(id);
      });
    });
  }

  loadGoogleMaps(apiKey)
    .then(async () => {
      if (mapsAuthFailed || tornDown) {
        teardownToFallback();
        return;
      }
      const interactive = root.querySelector('[data-amenity-interactive]');
      const fallback = root.querySelector('[data-amenity-fallback]');
      if (interactive) interactive.hidden = false;
      if (fallback) fallback.hidden = true;

      const mapOptions = {
        center,
        zoom: parseInt(root.dataset.zoom || '14', 10),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      };
      if (mapId) mapOptions.mapId = mapId;
      map = new google.maps.Map(mapEl, mapOptions);
      infoWindow = new google.maps.InfoWindow();

      try {
        await google.maps.importLibrary('marker');
      } catch {
        /* Advanced markers optional */
      }

      bindFilters();
      await loadCategory(activeCategory);
    })
    .catch(() => {
      teardownToFallback();
    });
}

function observeAmenityMaps() {
  const roots = document.querySelectorAll('[data-amenity-map-root]');
  if (!roots.length) return;

  const start = (root) => {
    if (root.dataset.amenityMapStarted) return;
    root.dataset.amenityMapStarted = 'true';
    initAmenityMap(root);
  };

  if (!('IntersectionObserver' in window)) {
    roots.forEach(start);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '120px' }
  );

  roots.forEach((root) => observer.observe(root));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeAmenityMaps);
} else {
  observeAmenityMaps();
}
