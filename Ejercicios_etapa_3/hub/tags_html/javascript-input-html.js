import { primarySemiRoundedButton } from '../elements/buttons/primary-semi-rounded-button.js';

const BUTTON_ATTRIBUTES = `
  data-html-submit
  class="bg-brand-teal text-white px-4 py-2 rounded hover:bg-accent transition"
`;

export const javascriptInputHtml = (targetId, scriptContent) => {
    return `
        <section class="flex flex-col items-center max-w-[1000px] mx-auto mt-6 space-y-4">
          <pre contenteditable="true"
               data-html-for="${targetId}"
               data-type="js"
               class="language-js input-block font-mono text-sm bg-code-block text-brand-light rounded p-4 w-full min-h-[8rem]"
               spellcheck="false">${scriptContent}</pre>
         ${primarySemiRoundedButton('Run', BUTTON_ATTRIBUTES)}
        </section>
      `
}