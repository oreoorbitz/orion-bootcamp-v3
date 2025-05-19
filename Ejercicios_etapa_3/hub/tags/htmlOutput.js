export default function register(engine) {
    engine.registerTag('htmlOutput', {
      parse(tagToken, remainTokens) {
        this.tpls = []
        this.liquid.parser.parseStream(remainTokens)
          .on('template', tpl => this.tpls.push(tpl))
          .on('tag:endhtmlOutput', function () { this.stop() })
          .on('end', () => { throw new Error(`tag ${tagToken.getText()} not closed`) })
          .start()
      },
      * render(context, emitter) {
        const id = `html-output-${Math.random().toString(36).slice(2, 9)}`
  
        if (!context.environments.exercise_ids) {
          context.environments.exercise_ids = []
        }
        context.environments.exercise_ids.push(id)
  
        emitter.write(`<div data-html-output id="${id}">`)
        yield this.liquid.renderer.renderTemplates(this.tpls, context, emitter)
        emitter.write(`<script data-injected></script>`)
        emitter.write(`</div>`)
      }
    });
  }
  