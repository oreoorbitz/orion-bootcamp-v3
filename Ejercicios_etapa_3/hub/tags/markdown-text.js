import showdown from 'showdown';
import markdownTextHtml from '../tags_html/markdown-text-html.js';
import getMarkdownContent from '../markdownText/get-markdown-content.js';

export default function register(engine) {
    console.log('test0r', engine)
  showdown.setFlavor('github');
  const converter = new showdown.Converter();

  engine.registerTag('markdownText', {
    parse(tagToken, remainTokens) {
      this.tpls = []
      this.liquid.parser.parseStream(remainTokens)
        .on('template', tpl => this.tpls.push(tpl))
        .on('tag:endmarkdownText', function () { this.stop() })
        .on('end', () => { throw new Error(`${tagToken.getText()} not closed`) })
        .start()
    },
    *render(context, emitter) {
      const rendered = yield this.liquid.renderer.renderTemplates(this.tpls, context)
      const markdownName = rendered.trim()
      const markdownContent = getMarkdownContent(markdownName)
      const html = converter.makeHtml(markdownContent)
      emitter.write(markdownTextHtml(html))
    }
  });
}