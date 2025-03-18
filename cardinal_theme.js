  import colors from 'ansicolors';

  // Change the below definitions in order to tweak the color theme.
  export default {

      'Boolean': {
        'true'   :  colors.white
      , 'false'  :  colors.white
      , _default :  colors.brightRed
      }

    , 'Identifier': {
        'colors.white' :  colors.white
      , 'self'      :  colors.brightRed
      , 'console'   :  colors.blue
      , 'log'       :  colors.blue
      , 'warn'      :  colors.red
      , 'error'     :  colors.brightRed
      , _default    :  function(s, info) {
        // if the strings are after the word 'function' and before a parenthesis, make them blue
        if (info.tokens[info.tokenIndex - 1] && info.tokens[info.tokenIndex - 1].value === 'function' &&
            info.tokens[info.tokenIndex + 1] && info.tokens[info.tokenIndex + 1].value === '(') {
          return colors.blue(s);
        }
        
        return colors.brightBlue(s);
      }
      }

    , 'Null': {
        _default: colors.white
      }

    , 'Numeric': {
        _default: colors.blue
      }

    , 'String': {
        _default: function(s, info) {
          var nextToken = info.tokens[info.tokenIndex + 1]

          // show keys of object literals and json in different color
          return (nextToken && nextToken.type === 'Punctuator' && nextToken.value === ':')
            ? colors.green(s)
            : colors.brightGreen(s)
        }
      }

    , 'Keyword': {
        'break'       :  colors.white

      , 'case'        :  colors.white
      , 'catch'       :  colors.cyan
      , 'class'       :  colors.white
      , 'const'       :  colors.blue
      , 'continue'    :  colors.white

      , 'debugger'    :  colors.white
      , 'default'     :  colors.white
      , 'delete'      :  colors.red
      , 'do'          :  colors.white

      , 'else'        :  colors.white
      , 'enum'        :  colors.white
      , 'export'      :  colors.white
      , 'extends'     :  colors.white

      , 'finally'     :  colors.cyan
      , 'for'         :  colors.white
      , 'function'    :  colors.brightYellow

      , 'if'          :  colors.white
      , 'implements'  :  colors.white
      , 'import'      :  colors.white
      , 'in'          :  colors.white
      , 'instanceof'  :  colors.white
      , 'let'         :  colors.white
      , 'new'         :  colors.red
      , 'package'     :  colors.white
      , 'private'     :  colors.white
      , 'protected'   :  colors.white
      , 'public'      :  colors.white
      , 'return'      :  colors.magenta
      , 'static'      :  colors.white
      , 'super'       :  colors.white
      , 'switch'      :  colors.white

      , 'this'        :  colors.brightRed
      , 'throw'       :  colors.white
      , 'try'         :  colors.cyan
      , 'typeof'      :  colors.white

      , 'var'         :  colors.green
      , 'void'        :  colors.white

      , 'while'       :  colors.white
      , 'with'        :  colors.white
      , 'yield'       :  colors.white
      , _default      :  colors.brightBlue
    }
    , 'Punctuator': {
        ';': colors.white
      , '.': colors.green
      , ',': colors.green

      , '{': colors.yellow
      , '}': colors.yellow
      , '(': colors.yellow
      , ')': colors.yellow
      , '[': colors.yellow
      , ']': colors.yellow

      , '<': colors.white
      , '>': colors.white
      , '+': colors.white
      , '-': colors.white
      , '*': colors.white
      , '%': colors.white
      , '&': colors.white
      , '|': colors.white
      , '^': colors.white
      , '!': colors.white
      , '~': colors.white
      , '?': colors.white
      , ':': colors.white
      , '=': colors.white

      , '<=': colors.white
      , '>=': colors.white
      , '==': colors.white
      , '!=': colors.white
      , '++': colors.white
      , '--': colors.white
      , '<<': colors.white
      , '>>': colors.white
      , '&&': colors.white
      , '||': colors.white
      , '+=': colors.white
      , '-=': colors.white
      , '*=': colors.white
      , '%=': colors.white
      , '&=': colors.white
      , '|=': colors.white
      , '^=': colors.white
      , '/=': colors.white
      , '=>': colors.white
      , '**': colors.white

      , '===': colors.white
      , '!==': colors.white
      , '>>>': colors.white
      , '<<=': colors.white
      , '>>=': colors.white
      , '...': colors.white
      , '**=': colors.white

      , '>>>=': colors.white

      , _default: colors.brightYellow
    }

      // line comment
    , Line: {
        _default: colors.white
      }

      /* block comment */
    , Block: {
        _default: colors.white
      }

    // JSX
    , JSXAttribute: {
        _default: colors.magenta
      }
    , JSXClosingElement: {
        _default: colors.magenta
      }
    , JSXElement: {
        _default: colors.magenta
      }
    , JSXEmptyExpression: {
        _default: colors.magenta
      }
    , JSXExpressionContainer: {
        _default: colors.magenta
      }
    , JSXIdentifier: {
          className: colors.blue
        , _default: colors.magenta
      }
    , JSXMemberExpression: {
        _default: colors.magenta
      }
    , JSXNamespacedName: {
        _default: colors.magenta
      }
    , JSXOpeningElement: {
        _default: colors.magenta
      }
    , JSXSpreadAttribute: {
        _default: colors.magenta
      }
    , JSXText: {
        _default: colors.brightGreen
      }

    , _default: colors.white
  }