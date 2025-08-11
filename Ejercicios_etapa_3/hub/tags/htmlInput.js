export default function register(engine) {
    engine.registerTag('htmlInput', {
      parse(tagToken, remainTokens) {
        this.tpls = []
        this.liquid.parser.parseStream(remainTokens)
          .on('template', tpl => this.tpls.push(tpl))
          .on('tag:endhtmlInput', function () { this.stop() })
          .on('end', () => { throw new Error(`${tagToken.getText()} not closed`) })
          .start()
      },
      * render(context, emitter) {
        const rendered = yield this.liquid.renderer.renderTemplates(this.tpls, context)
        const match = rendered.match(/<template[^>]*>([\s\S]*?)<\/template>/)
  
        if (!match) {
          emitter.write(`<div class="text-red-600">❌ No &lt;template&gt; found in htmlInput</div>`)
          return
        }
  
        const htmlContent = match[1].trim()
        const exerciseIds = context.environments.exercise_ids || []
        const targetId = exerciseIds[exerciseIds.length - 1] || 'html-output-missing'
  
        emitter.write(`
          <section class="flex flex-col items-center max-w-[1000px] mx-auto mt-6 space-y-4">
            <textarea data-html-for="${targetId}" data-type="html" class="input-block">${htmlContent}</textarea>
          </section>
        `)
      }
    });
  }
  