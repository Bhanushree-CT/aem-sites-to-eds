import { readBlockConfig, loadScript } from '../../scripts/aem.js';

async function fetchPlaceholders() {
  const resp = await fetch('/placeholders.json');
  if (!resp.ok) return {};
  const json = await resp.json();
  const placeholders = {};
  json.data.forEach((row) => {
    placeholders[row.Key] = row.Value;
  });
  return placeholders;
}

function initMap(container, config) {
  const zoom = parseInt(config.zoom, 10) || 14;

  if (config.latitude && config.longitude) {
    const center = {
      lat: parseFloat(config.latitude),
      lng: parseFloat(config.longitude),
    };
    // eslint-disable-next-line no-undef
    const map = new google.maps.Map(container, { center, zoom });
    // eslint-disable-next-line no-undef, no-new
    new google.maps.Marker({ position: center, map });
  } else if (config.address) {
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: config.address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const center = results[0].geometry.location;
        // eslint-disable-next-line no-undef
        const map = new google.maps.Map(container, { center, zoom });
        // eslint-disable-next-line no-undef, no-new
        new google.maps.Marker({ position: center, map });
      } else {
        container.textContent = config.address;
        container.classList.add('google-map-error');
      }
    });
  } else {
    container.textContent = 'No location specified.';
    container.classList.add('google-map-error');
  }
}

export default function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  const mapContainer = document.createElement('div');
  mapContainer.className = 'google-map-canvas';
  block.append(mapContainer);

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      try {
        const placeholders = await fetchPlaceholders();
        const apiKey = placeholders.googlemapsapikey;
        if (!apiKey) {
          mapContainer.textContent = 'Map unavailable — API key not configured.';
          mapContainer.classList.add('google-map-error');
          return;
        }
        await loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`);
        initMap(mapContainer, config);
      } catch (e) {
        mapContainer.textContent = 'Map could not be loaded.';
        mapContainer.classList.add('google-map-error');
      }
    }
  }, { rootMargin: '200px' });

  observer.observe(mapContainer);
}
