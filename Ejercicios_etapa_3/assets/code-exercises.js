document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-html-output]').forEach(output => {
      const container = output;
      const exerciseId = container.id;
  
      const htmlInput = document.querySelector(`[data-html-for="${exerciseId}"][data-type="html"]`);
      const jsInput = document.querySelector(`[data-html-for="${exerciseId}"][data-type="js"]`);
      const button = document.querySelector(`[data-html-submit="${exerciseId}"]`);
  
      if (button && htmlInput) {
        button.addEventListener('click', () => {
          container.innerHTML = htmlInput.value;
  
          try {
            if (jsInput) {
              const script = document.createElement('script');
              script.textContent = jsInput.value;
              container.appendChild(script);
            }
          } catch (e) {
            container.innerHTML += `<div class="text-red-600 text-sm mt-2">⚠️ ${e.message}</div>`;
          }
        });
      }
    });
  });
  