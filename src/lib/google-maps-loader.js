let mapsReady = null;

export function loadGoogleMaps(apiKey) {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
  if (typeof window.google?.maps?.importLibrary === 'function') return Promise.resolve();
  if (mapsReady) return mapsReady;
  mapsReady = new Promise((resolve, reject) => {
    const cb = '__gmapsReady';
    window[cb] = () => resolve();
    window.gm_authFailure = () => {
      window.dispatchEvent(new Event('gmaps:auth-failure'));
      reject(new Error('gm_authFailure'));
    };
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&callback=${cb}`;
    s.async = true;
    s.onerror = () => {
      mapsReady = null;
      reject(new Error('maps script failed'));
    };
    document.head.appendChild(s);
  });
  return mapsReady;
}

export let mapsAuthFailed = false;
if (typeof window !== 'undefined') {
  window.addEventListener('gmaps:auth-failure', () => {
    mapsAuthFailed = true;
  });
}
