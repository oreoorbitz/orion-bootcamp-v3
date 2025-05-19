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
      const exerciseIds = context.environments.exercise_ids || []
      const targetId = exerciseIds[exerciseIds.length - 1] || 'html-output-missing'

      emitter.write(`
        <section class="flex flex-col items-center max-w-[1000px] mx-auto mt-6 space-y-4">
          <textarea data-html-for="${targetId}" data-type="js" class="input-block w-full bg-black">${scriptContent}</textarea>
          <button data-html-submit="${targetId}" class="bg-brand-teal text-white px-4 py-2 rounded hover:bg-accent transition">Run</button>
        </section>
      `)
    }
  });
}
