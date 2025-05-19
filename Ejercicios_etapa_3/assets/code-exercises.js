document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-html-output]').forEach(output => {
      const container = output;
      const exerciseId = container.id;
  
      const htmlInput = document.querySelector(`[data-html-for="${exerciseId}"][data-type="html"]`);
      const jsInput = document.querySelector(`[data-html-for="${exerciseId}"][data-type="js"]`);
      const button = document.querySelector(`[data-html-submit="${exerciseId}"]`);
  
      if (button && htmlInput) {
        button.addEventListener('click', () => {
          console.log('test0r')
          // Inject HTML
          container.innerHTML = htmlInput.value;
  
          try {
            if (jsInput) {
              // Find the injected <script> placeholder
              const placeholder = container.querySelector('script[data-injected]');
              if (placeholder) {
                placeholder.textContent = jsInput.value;
  
                // Execute the JS via a new script tag (runtime evaluation)
                const runtimeScript = document.createElement('script');
                runtimeScript.textContent = jsInput.value;
                document.body.appendChild(runtimeScript);
                document.body.removeChild(runtimeScript);
              }
            }
          } catch (e) {
            container.innerHTML += `<div class="text-red-600 text-sm mt-2">⚠️ ${e.message}</div>`;
          }
        });
      }
    });
  });
  