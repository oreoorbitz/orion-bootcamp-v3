export default function registerMarkdownText(engine) {
  engine.registerTag('markdownText', {
    parse: function (tagToken) {
      const markup = tagToken.markup;
      return {
        markup
      };
    },
    render: function (context, emitter) {
      const { markup } = this.parseData;
      const html = marked(markup);
      emitter.write(html);
    }
  });
}