import { describe, expect, it } from 'vitest';
import { THEME_RESPONSE_SCHEMA, THEME_RESPONSE_FORMAT } from './schema';

describe('WebLLM compact theme response format', () => {
  it('provides a serialized JSON Schema instead of undefined', () => {
    expect(THEME_RESPONSE_FORMAT.type).toBe('json_object');
    expect(typeof THEME_RESPONSE_FORMAT.schema).toBe('string');
  });
  it('restricts output to a small, semantic design seed, not 18 random colors', () => {
    const schema = JSON.parse(THEME_RESPONSE_SCHEMA) as {
      required: string[];
      properties: Record<string, { type: string; enum?: string[] }>;
    };
    expect(schema.required).toEqual(['name', 'description', 'accent', 'neutral', 'contrast', 'darkStyle', 'radius']);
    expect(schema.properties.contrast.enum).toContain('high');
    expect(schema.properties.darkStyle.enum).toContain('black');
    expect(Object.keys(schema.properties)).toHaveLength(7);
  });
});
