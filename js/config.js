// App-wide configurable settings for external API calls and features
// You can override these via localStorage keys: 'apiBaseUrl', 'llmProviderOrder'

(function initAppConfig() {
  const DEFAULTS = {
    // For AIT bundle, set to your deployed API origin, e.g. 'https://your-api.vercel.app'
    apiBaseUrl: 'https://dream-workshop-api.vercel.app/', // empty = same origin
    // Provider preference order; can be changed without code by overriding localStorage
    llmProviderOrder: ['gemini', 'openai'],
  };

  try {
    const storedBase = localStorage.getItem('apiBaseUrl');
    const storedOrder = localStorage.getItem('llmProviderOrder');
    if (storedBase) DEFAULTS.apiBaseUrl = storedBase;
    if (storedOrder) DEFAULTS.llmProviderOrder = JSON.parse(storedOrder);
  } catch {}

  window.APP_CONFIG = DEFAULTS;
})();


