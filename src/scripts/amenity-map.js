/**
 * Lazy-loaded Google Maps amenity explorer for Consenza Estates.
 * Falls back gracefully when PUBLIC_GOOGLE_MAPS_API_KEY is missing or the API errors.
 */

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

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }
    const existing = document.querySelector('script[data-amenity-maps-loader]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.amenityMapsLoader = 'true';
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Maps script failed to load'));
    document.head.appendChild(script);
  });
}

function showFallback(root) {
  const fallback = root.querySelector('[data-amenity-fallback]');
  const interactive = root.querySelector('[data-amenity-interactive]');
  if (interactive) interactive.hidden = true;
  if (fallback) fallback.hidden = false;
}

async function searchNearbyNew(Place, center, types, radiusMeters) {
  const request = {
    fields: ['displayName', 'location', 'formattedAddress', 'rating', 'googleMapsURI'],
    locationRestriction: {
      center,
      radius: radiusMeters,
    },
    includedPrimaryTypes: types.slice(0, 5),
    maxResultCount: 20,
  };
  const { places } = await Place.searchNearby(request);
  return places ?? [];
}

function searchNearbyLegacy(service, center, types, radiusMeters) {
  return new Promise((resolve) => {
    const type = types[0] || 'point_of_interest';
    service.nearbySearch(
      {
        location: center,
        radius: radiusMeters,
        type,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          resolve([]);
        }
      }
    );
  });
}

function placeToMarkerData(place, isLegacy) {
  if (isLegacy) {
    const loc = place.geometry?.location;
    return {
      name: place.name,
      lat: loc?.lat(),
      lng: loc?.lng(),
      address: place.vicinity || '',
      rating: place.rating,
      mapsUrl: place.url || directionsUrl(loc?.lat(), loc?.lng(), place.name),
    };
  }
  const loc = place.location;
  const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.latitude;
  const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.longitude;
  const displayName =
    typeof place.displayName === 'string'
      ? place.displayName
      : place.displayName?.text ?? place.displayName?.toString?.() ?? 'Place';
  return {
    name: displayName,
    lat,
    lng,
    address: place.formattedAddress || '',
    rating: place.rating,
    mapsUrl: place.googleMapsURI || directionsUrl(lat, lng, displayName),
  };
}

function initAmenityMap(root) {
  const apiKey = root.dataset.apiKey?.trim();
  const mapId = root.dataset.mapId?.trim();
  const lat = parseFloat(root.dataset.lat, 10);
  const lng = parseFloat(root.dataset.lng, 10);
  const communityName = root.dataset.communityName || 'Community';
  const radius = parseInt(root.dataset.radius || '8000', 10);
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

  if (!apiKey) {
    showFallback(root);
    return;
  }

  const center = { lat, lng };
  let map;
  let markers = [];
  let infoWindow;
  let activeCategory = categories[0]?.id;
  let useLegacy = false;
  let PlaceClass;
  let legacyService;

  function clearMarkers() {
    markers.forEach((m) => m.setMap(null));
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
        ${p.rating ? `<span aria-label="Rating"> · ${p.rating}★</span>` : ''}
        <br /><span>${escapeHtml(p.address)}</span>
        <br /><a href="${escapeHtml(p.mapsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>
      </li>`
      )
      .join('');
  }

  function addMarker(data, options = {}) {
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lng)) return;
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

    const content = `
      <div class="amenity-map__info">
        <strong>${escapeHtml(data.name)}</strong>
        ${data.rating ? `<div>${data.rating}★</div>` : ''}
        <div>${escapeHtml(data.address)}</div>
        <a href="${escapeHtml(data.mapsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>
      </div>`;
    marker.addListener('click', () => {
      infoWindow.setContent(content);
      infoWindow.open({ anchor: marker, map });
    });
    markers.push(marker);
  }

  async function loadCategory(categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    if (!category || !map) return;
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

    let places = [];
    try {
      if (!useLegacy && PlaceClass?.searchNearby) {
        places = await searchNearbyNew(PlaceClass, center, category.placeTypes, radius);
      } else if (legacyService) {
        const legacyResults = await searchNearbyLegacy(legacyService, center, category.placeTypes, radius);
        places = legacyResults;
        useLegacy = true;
      }
    } catch (err) {
      console.warn('Amenity search failed', err);
      places = [];
    }

    const normalized = places
      .map((p) => placeToMarkerData(p, useLegacy))
      .filter((p) => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng));

    normalized.forEach((p) => addMarker(p));
    renderResultList(normalized);
    setStatus(
      normalized.length
        ? `${normalized.length} ${category.label.toLowerCase()} near ${communityName}`
        : `No ${category.label.toLowerCase()} found in this search radius.`
    );
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
    .then(async (maps) => {
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
      map = new maps.Map(mapEl, mapOptions);
      infoWindow = new maps.InfoWindow();

      try {
        await maps.importLibrary('marker');
      } catch {
        /* Advanced markers optional */
      }

      try {
        const placesLib = await maps.importLibrary('places');
        PlaceClass = placesLib.Place;
      } catch {
        useLegacy = true;
        legacyService = new maps.places.PlacesService(map);
      }

      if (!PlaceClass?.searchNearby) {
        useLegacy = true;
        legacyService = new maps.places.PlacesService(map);
      }

      bindFilters();
      await loadCategory(activeCategory);
    })
    .catch(() => {
      showFallback(root);
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
