// Centralized API Base URL & Fetch Client configured with permanent 24/7 Render Cloud Server
export const DEFAULT_CLOUD_BACKEND = 'https://kiranastore-imwk.onrender.com';

export const getApiBaseUrl = () => {
  try {
    const saved = localStorage.getItem('kirana_api_base_url');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  } catch {}
  return DEFAULT_CLOUD_BACKEND;
};

export const setApiBaseUrl = (url) => {
  try {
    if (url && url.trim()) {
      localStorage.setItem('kirana_api_base_url', url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('kirana_api_base_url');
    }
    // Notify all components of base URL change
    window.dispatchEvent(new Event('api_base_url_changed'));
  } catch {}
};

export const getFullApiUrl = (endpoint) => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
};

export const fetchApi = async (endpoint, options = {}) => {
  const fullUrl = getFullApiUrl(endpoint);
  return fetch(fullUrl, options);
};

export const testBackendConnection = async (customUrl = null) => {
  const base = (customUrl !== null ? customUrl : getApiBaseUrl()).trim().replace(/\/+$/, '');
  const targetUrl = base ? `${base}/api/categories` : '/api/categories';
  
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    if (res.ok) {
      return { success: true, latency, message: `Connected successfully (${latency}ms)!` };
    } else {
      return { success: false, latency, message: `Server responded with HTTP ${res.status}` };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { success: false, message: 'Connection timed out (6s). Check if backend is running or URL is correct.' };
    }
    return { success: false, message: `Connection failed: ${err.message}` };
  }
};
