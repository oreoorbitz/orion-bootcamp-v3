export default function register(engine) {
    engine.registerFilter('link_to_module', (modulePath) => {
      if (!modulePath || typeof modulePath !== 'string') return '';
      
      // Extract root folder name (e.g., general, shopify, dawn-theme)
      const parts = modulePath.split('/');
      const root = parts[0].toLowerCase();
  
      // Map to correct output folder prefix
      const prefixMap = {
        general: '1_general',
        shopify: '2_Shopify',
        'dawn-theme': '3_Dawn-theme'
      };
  
      const folder = prefixMap[root];
      if (!folder) return '';
  
      const rest = parts.slice(1).join('/');
      return `/${folder}/${rest}/index.html`;
    });
  }
  