export default function register(engine) {
    engine.registerFilter('link_to_module', (modulePath, linkText = null) => {
      if (!modulePath || typeof modulePath !== 'string') return '';
  
      const parts = modulePath.split('/');
      const root = parts[0].toLowerCase();
  
      const prefixMap = {
        general: '1_general',
        shopify: '2_Shopify',
        'dawn-theme': '3_Dawn-theme'
      };
  
      const folder = prefixMap[root];
      if (!folder) return '';
  
      const rest = parts.slice(1).join('/');
      const href = `/${folder}/${rest}/index.html`;
      const text = linkText || modulePath;
  
      return `<a href="${href}" hx-get="${href}" hx-target="main" hx-push-url="true" class="text-brand-teal underline">${text}</a>`;
    });
  }
  