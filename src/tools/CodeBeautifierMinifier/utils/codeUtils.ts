type Language = 'html' | 'css' | 'javascript' | 'typescript' | 'php';

interface CodeStats {
  lines: number;
  characters: number;
  charactersNoSpaces: number;
  words: number;
}

// Import js-beautify functions
import { js as jsBeautify, html as htmlBeautify, css as cssBeautify } from 'js-beautify';

export function beautifyCode(code: string, language: Language): string {
  switch (language) {
    case 'html':
      return htmlBeautify(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal',
        brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 0,
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false
      });
    case 'css':
      return cssBeautify(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        newline_between_rules: true,
        end_with_newline: true,
        indent_empty_lines: false,
        space_around_combinator: true
      });
    case 'javascript':
    case 'typescript':
      return jsBeautify(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal',
        brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 0,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false,
        space_in_paren: false,
        space_in_empty_paren: false,
        operator_position: 'before-newline'
      });
    default:
      throw new Error(`Beautification für ${language} wird nicht unterstützt`);
  }
}

export async function minifyCode(code: string, language: Language): Promise<string> {
  switch (language) {
    case 'html':
      return minifyHtml(code);
    case 'css':
      return minifyCss(code);
    case 'javascript':
    case 'typescript':
      return minifyJs(code);
    default:
      throw new Error(`Minification für ${language} wird nicht unterstützt`);
  }
}

function minifyHtml(html: string): string {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/\s*=\s*/g, '=')
    .replace(/;\s*}/g, '}')
    .trim();
}

function minifyCss(css: string): string {
  return css
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/\s*{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .replace(/,\s*/g, ',')
    .replace(/:\s*/g, ':')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*~\s*/g, '~')
    .trim();
}

function minifyJs(js: string): string {
  return js
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/\s*{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .replace(/,\s*/g, ',')
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*&&\s*/g, '&&')
    .replace(/\s*\|\|\s*/g, '||')
    .replace(/\s*===\s*/g, '===')
    .replace(/\s*!==\s*/g, '!==')
    .replace(/\s*==\s*/g, '==')
    .replace(/\s*!=\s*/g, '!=')
    .replace(/\s*<=\s*/g, '<=')
    .replace(/\s*>=\s*/g, '>=')
    .replace(/\s*<\s*/g, '<')
    .replace(/\s*>\s*/g, '>')
    .trim();
}

export function calculateCodeStats(code: string, language: Language): CodeStats {
  const lines = code.split('\n').length;
  const characters = code.length;
  const charactersNoSpaces = code.replace(/\s/g, '').length;
  const words = code.split(/\s+/).filter(word => word.length > 0).length;

  return {
    lines,
    characters,
    charactersNoSpaces,
    words
  };
}