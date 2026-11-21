import { describe, expect, it, vi } from 'vitest';
import { generateThemeWithRecovery } from './generate-theme';

const validSeed = JSON.stringify({
  name: 'Bosque', description: 'Verde y suave',
  accent: '#008833', neutral: '#CCCCCC', contrast: 'balanced',
  darkStyle: 'charcoal', radius: 12,
});

describe('recovery from malformed WebLLM output', () => {
  it('accepts Qwen3.5 thinking prefix in the first response', async () => {
    const respond = vi.fn().mockResolvedValue({
      content: '<think>\n\n</think>\n' + validSeed,
      finishReason: 'stop',
    });
    const result = await generateThemeWithRecovery(respond, 'Tema verde bosque');
    expect(result.name).toBe('Bosque');
    expect(respond).toHaveBeenCalledTimes(1);
  });

  it('retries the same model before considering a fallback', async () => {
    const respond = vi.fn()
      .mockResolvedValueOnce({ content: '<think></think>\nNot valid JSON', finishReason: 'stop' })
      .mockResolvedValueOnce({ content: validSeed, finishReason: 'stop' });
    const reporter = vi.fn();
    const result = await generateThemeWithRecovery(respond, 'Tema verde', undefined, reporter);
    expect(result.radius).toBe(12);
    expect(respond).toHaveBeenCalledTimes(2);
    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter.mock.calls[0][2]).toMatchObject({ finishReason: 'stop' });
  });

  it('retries truncated JSON without pretending it was complete', async () => {
    const respond = vi.fn()
      .mockResolvedValueOnce({ content: '<think></think>{"name":"unfinished"', finishReason: 'length' })
      .mockResolvedValueOnce({ content: validSeed });
    await expect(generateThemeWithRecovery(respond, 'Tema verde')).resolves.toMatchObject({
      radius: 12,
    });
    expect(respond).toHaveBeenCalledTimes(2);
  });

  it('fails with a clear message after exhausting recovery attempts', async () => {
    const respond = vi.fn().mockResolvedValue({ content: '<think>incomplete' });
    await expect(generateThemeWithRecovery(respond, 'Tema verde')).rejects.toThrow('2 attempts');
    expect(respond).toHaveBeenCalledTimes(2);
  });

  it('does not retry GPU exceptions or other inference failures', async () => {
    const respond = vi.fn().mockRejectedValue(new Error('GPU device lost'));
    await expect(generateThemeWithRecovery(respond, 'Tema verde')).rejects.toThrow('GPU device lost');
    expect(respond).toHaveBeenCalledTimes(1);
  });
});
