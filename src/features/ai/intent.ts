/**
 * Local routing, independent of the language model. The assistant is not
 * fine-tuned; requests are limited at the application layer to the theme tool.
 * This is intentionally conservative, not a general-purpose classifier.
 */
import { findStyleReference } from './style-references';

export type ThemeRequestRoute =
  | { kind: 'theme' }
  | { kind: 'help'; reply: string }
  | { kind: 'reject'; reply: string };

const APP_HELP = [
  {
    match: /(?:export(?:ar)?|download|copy|descargar|copiar).{0,35}(?:css|tema)|(?:css).{0,35}(?:export(?:ar)?|download|copy|descargar|copiar)/i,
    reply: 'Select Export CSS in the header to export both light and dark tokens.',
  },
  {
    match: /(?:where|how|d[oó]nde|c[oó]mo|como).{0,55}(?:change|edit|modify|cambiar|editar|modificar).{0,40}(?:color|token|variable)/i,
    reply: 'Edit tokens such as --accent and --background in the left sidebar. Changes appear in the preview as you make them.',
  },
  {
    match: /(?:c[oó]mo|como).{0,35}(?:work|use|funciona|utilizo|uso).{0,40}(?:ai|artificial intelligence|model|ia|inteligencia artificial|modelo|webllm)/i,
    reply: 'The theme assistant runs locally with WebLLM and WebGPU. It downloads a model on demand and updates your theme when you select Apply theme.',
  },
  {
    match: /(?:where|how|d[oó]nde|c[oó]mo|como).{0,45}(?:light|dark|modo claro|modo oscuro)/i,
    reply: 'Use the mode toggle in the header to switch between light and dark tokens.',
  },
];

const unrelated = /(?:\b(?:chiste|receta|cocina|f[uú]tbol|resultado deportivo|predicci[oó]n del tiempo|clima hoy|noticias|elecciones|pol[ií]tica|presidente|historia universal|matem[aá]ticas|cu[aá]nto es|traduce|traducir|poema|hazme un email|programa en python|script en python)\b|ignora (?:todas? )?las instrucciones|olvida (?:las )?instrucciones|act[uú]a como|ignore (?:all |the )?instructions|jailbreak)/i;
const design = /\b(?:tema|themes?|theming|palette|colors?|contrast|saturation|surfaces?|typography|fonts?|gradient|paleta|colores?|tonos?|tinte|saturaci[oó]n|contraste|accent|acento|superficie|background|foreground|fondo|bordes?|radios?|radius|redondead[oa]s?|tipograf[ií]a|fuentes?|estilo|est[eé]tica|minimalista|elegante|vibrante|pastel|ne[oó]n|monocrom[aá]tico|look|dark|light|oscuro|oscura|claro|clara|sombras?|gradientes?)\b/i;
const colors = /\b(?:morado|morado?s?|violeta|p[uú]rpura|lila|azul|verde|rojo|rosa|rosado|fucsia|magenta|amarillo|naranja|turquesa|cian|cyan|negro|negra|blanco|blanca|gris|dorado|beige|marr[oó]n|oliva|esmeralda|lavanda|petr[oó]leo|oc[eé]ano|bosque|carb[oó]n|charcoal|turquoise|lavender|terracotta|emerald|purple|violet|black|white|blue|green|red|pink|yellow|orange|gray|grey)\b/i;
const editTerms = /\b(?:hazlo|c[aá]mbialo|cambia|modifica|ajusta|m[aá]s|menos|mant[eé]n|conserva|suaviza|intensifica|aumenta|reduce|parecido|similar|brillante|apagado|profundo|oscurece|aclara|more|less|keep|adjust|increase|decrease|lighter|darker|c[aá]lido|fr[ií]o)\b/i;

export function routeThemeRequest(input: string, hasThemeHistory: boolean): ThemeRequestRoute {
  const text = input.trim();
  if (!text) return { kind: 'reject', reply: 'Describe the theme you want to create or refine.' };
  if (unrelated.test(text)) {
    return { kind: 'reject', reply: 'This assistant handles HeroUI themes and questions about Theme Studio.' };
  }
  for (const help of APP_HELP) {
    if (help.match.test(text)) return { kind: 'help', reply: help.reply };
  }
  if (design.test(text) || colors.test(text) || findStyleReference(text) || (hasThemeHistory && editTerms.test(text)) || /#[0-9a-f]{6}\b/i.test(text)) {
    return { kind: 'theme' };
  }
  return {
    kind: 'reject',
    reply: 'Ask about Theme Studio or try a HeroUI theme request such as “dark purple theme” or “more contrast.”',
  };
}
