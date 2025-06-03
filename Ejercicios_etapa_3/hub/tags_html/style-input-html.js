import { primarySemiRoundedButton } from "../elements/buttons/primary-semi-rounded-button"

const buttonAttributes = id => {
  return `data-html-submit="${id}" class="bg-brand-teal text-white px-4 py-2 rounded hover:bg-accent transition"`
}

export const styleInputHtml = (targetId, styleContent) => {
 retturn `
     <section class="flex flex-col items-center max-w-[1000px] mx-auto mt-6 space-y-4 language-css">
       <pre  contenteditable="true"
            data-html-for="${targetId}"
            data-type="css"
            class="language-css input-block font-mono border-muted text-sm bg-code-block text-brand-light rounded p-4 w-full min-h-[8rem]"
            spellcheck="false">${styleContent}</pre>
      ${primarySemiRoundedButton('Run', buttonAttributes(targetId))}
     </section>
   `
}