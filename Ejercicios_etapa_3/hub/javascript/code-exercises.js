document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-html-output]').forEach(output => {
    const container = output;
    const renderTarget = container.querySelector('[data-html-render]');
    const exerciseId = container.id;

    const htmlInput = document.querySelector(`[data-html-for="${exerciseId}"][data-type="html"]`);
    const jsInput = document.querySelector(`[data-html-for="${exerciseId}"][data-type="js"]`);
    const button = document.querySelector(`[data-html-submit="${exerciseId}"]`);

    const initialHTML = renderTarget?.innerHTML || '';

    console.log(htmlInput, button);

    if (button) {
      button.addEventListener('click', () => {
        console.log(`🔁 Running exercise for #${exerciseId}`);

        try {
          // Always reset the render area first
          const temp = document.createElement('div');

          if (htmlInput && htmlInput.value.trim()) {
            temp.innerHTML = htmlInput.value;
          } else {
            temp.innerHTML = initialHTML; // restore original
          }

          if (renderTarget) {
            console.log(`🔁 Replacing content for #${exerciseId}`);
            renderTarget.replaceChildren(...temp.childNodes);
          }

          // Inject JS if present
          if (jsInput) {
            const jsCode = jsInput.textContent || jsInput.value || '';
            const placeholder = container.querySelector('script[data-injected]');
            if (placeholder) placeholder.textContent = jsCode;

            const runtimeScript = document.createElement('script');
            runtimeScript.textContent = jsCode;
            document.body.appendChild(runtimeScript);
            document.body.removeChild(runtimeScript);
          }

        } catch (e) {
          const message = `<div class="text-red-600 text-sm mt-2">⚠️ ${e.message}</div>`;
          if (renderTarget) {
            renderTarget.insertAdjacentHTML('beforeend', message);
          } else {
            container.insertAdjacentHTML('beforeend', message);
          }
        }
      });
    }
  });
});
