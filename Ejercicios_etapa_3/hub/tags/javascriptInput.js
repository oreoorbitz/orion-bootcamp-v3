import Prism from 'prismjs';
import { javascriptInputHtml } from '../tags_html/javascript-input-html.js';


export default function register(engine) {
  engine.registerTag('javascriptInput', {
    parse(tagToken, remainTokens) {
      this.tpls = []
      this.liquid.parser.parseStream(remainTokens)
        .on('template', tpl => this.tpls.push(tpl))
        .on('tag:endjavascriptInput', function () { this.stop() })
        .on('end', () => { throw new Error(`${tagToken.getText()} not closed`) })
        .start()
    }, 
    * render(context, emitter) {
      const rendered = yield this.liquid.renderer.renderTemplates(this.tpls, context)
      const match = rendered.match(/<script[^>]*>([\s\S]*?)<\/script>/)

      if (!match) {
        emitter.write(`<div class="text-red-600">❌ No &lt;script&gt; found in javascriptInput</div>`)
        return 
      }

      const scriptContent = match[1].trim()
      const formatedScriptContent = Prism.highlight(scriptContent, Prism.languages.javascript, 'javascript')
      const exerciseIds = context.environments.exercise_ids || []
      const targetId = exerciseIds[exerciseIds.length - 1] || 'html-output-missing'

      emitter.write(javascriptInputHtml(targetId, formatedScriptContent))
    }
  });
}
 