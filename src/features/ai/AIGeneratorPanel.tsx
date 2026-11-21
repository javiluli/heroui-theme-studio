import { memo, useEffect, useRef, useState } from 'react';
import { Button, Label, Spinner, TextArea, TextField } from '@heroui/react';
import { ArrowRight, ArrowUp, Check, Copy, Info, Sparkles, X } from 'lucide-react';
import type { ThemeConfig } from '../theme/model';
import { applyThemeProposal, type ThemeProposal } from './model';
import { routeThemeRequest } from './intent';
import { previousThemeForRequest } from './direction';
import { AI_MAX_PROMPT_LENGTH, AI_MIN_PROMPT_LENGTH } from './config';
import { getWebGPUWarning, useThemeAI } from './useThemeAI';

interface Props {
  open: boolean;
  theme: ThemeConfig;
  onApply: (theme: ThemeConfig) => void;
  onClose: () => void;
}

type ChatEntry =
  | {id: number; kind: 'user'; text: string}
  | {id: number; kind: 'info'; text: string}
  | {id: number; kind: 'proposal'; proposal: ThemeProposal}
  | {id: number; kind: 'error'; prompt: string; stage: string; detail: string; advice: string; diagnostic: string};

const EXAMPLES = [
  {label: 'Warm editorial', prompt: 'An editorial theme with a terracotta accent, warm backgrounds, and square corners.'},
  {label: 'High-contrast technical', prompt: 'A technical theme with a turquoise accent, graphite backgrounds, and high contrast.'},
  {label: 'Soft lavender', prompt: 'A soft theme with a lavender accent, light surfaces, and rounded corners.'},
];
const SHOWCASE_COLORS = ['background', 'surface', 'accent', 'success', 'warning', 'danger'] as const;

function ProposalMessage({proposal, applied, onApply}: {
  proposal: ThemeProposal; applied: boolean; onApply: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <strong className="text-sm">{proposal.name}</strong>
        <span className="text-xs text-muted">Radio {proposal.radius}px</span>
      </div>
      {proposal.description && <p className="text-xs leading-relaxed text-muted">{proposal.description}</p>}
      <div className="flex flex-col gap-3">
        {(['light', 'dark'] as const).map((mode) => (
          <div className="flex flex-col gap-1.5" key={mode}>
            <span className="text-xs font-semibold">{mode === 'light' ? 'Light' : 'Dark'}</span>
            <div className="flex gap-1">
              {SHOWCASE_COLORS.map((token) => (
                <span className="h-7 min-w-0 flex-1 rounded-[var(--radius)] border border-border"
                  key={token} title={'--' + token + ': ' + proposal[mode][token]}
                  style={{backgroundColor: proposal[mode][token]}}/>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={applied ? 'secondary' : 'primary'} onPress={onApply}>
          <ArrowRight size={15} aria-hidden="true"/> {applied ? 'Apply again' : 'Apply theme'}
        </Button>
        {applied && <span className="flex items-center gap-1 text-xs" role="status"><Check size={14} aria-hidden="true"/> Theme applied</span>}
      </div>
    </div>
  );
}

/** WebLLM worker remains mounted with the chat, even when the panel is hidden. */
export default memo(function AIGeneratorPanel({open, theme, onApply, onClose}: Props) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [copyResult, setCopyResult] = useState<{id: number; message: string} | null>(null);
  const counterRef = useRef(0);
  const pendingPromptRef = useRef<string | null>(null);
  const previousRef = useRef<ThemeProposal | undefined>(undefined);
  const feedRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const followFeed = useRef(true);
  const ai = useThemeAI();
  const unavailable = getWebGPUWarning();
  const busy = ai.status === 'loading' || ai.status === 'generating';
  const promptLength = draft.trim().length;
  const canSend = !busy && promptLength >= AI_MIN_PROMPT_LENGTH && promptLength <= AI_MAX_PROMPT_LENGTH;

  const editDraft = (prompt: string) => {
    setDraft(prompt);
    draftRef.current?.focus();
  };

  const submit = () => {
    const prompt = draft.trim();
    if (!canSend || pendingPromptRef.current) return;
    followFeed.current = true;
    const userMessage: ChatEntry = {id: ++counterRef.current, kind: 'user', text: prompt};
    setMessages((list) => [...list, userMessage]);
    setDraft('');
    const route = routeThemeRequest(prompt, !!previousRef.current);
    const reply = route.kind === 'theme' ? unavailable : route.reply;
    if (reply) {
      const info: ChatEntry = {id: ++counterRef.current, kind: 'info', text: reply};
      setMessages((list) => [...list, info]);
      return;
    }
    pendingPromptRef.current = prompt;
    void ai.generate(prompt, previousThemeForRequest(prompt, previousRef.current));
  };

  useEffect(() => {
    const prompt = pendingPromptRef.current;
    const proposal = ai.proposal;
    if (!prompt) return;
    if (ai.status === 'ready' && proposal) {
      pendingPromptRef.current = null;
      previousRef.current = proposal;
      const message: ChatEntry = {id: ++counterRef.current, kind: 'proposal', proposal};
      setMessages((list) => [...list, message]);
    } else if (ai.status === 'error' && ai.error) {
      pendingPromptRef.current = null;
      const message: ChatEntry = {
        id: ++counterRef.current, kind: 'error', prompt, stage: ai.stage,
        detail: ai.error, advice: ai.advice,
        diagnostic: [
          'Stage: ' + ai.stage, 'Model: ' + (ai.activeModel || 'Automatic'),
          'Error: ' + ai.error, 'Sugerencia: ' + ai.advice,
        ].join('\n'),
      };
      setMessages((list) => [...list, message]);
    }
  }, [ai.status, ai.proposal, ai.error, ai.stage, ai.advice, ai.activeModel]);

  useEffect(() => {
    if (!open || !followFeed.current) return;
    const feed = feedRef.current;
    if (feed) feed.scrollTop = feed.scrollHeight;
  }, [messages, ai.status, ai.progress, open]);

  useEffect(() => {
    if (open) draftRef.current?.focus({preventScroll: true});
  }, [open]);

  return (
    <aside id="theme-ai-chat" aria-label="AI theme chat"
      aria-hidden={!open} inert={!open}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing) onClose();
      }}
      className={'sticky top-0 flex h-dvh min-h-0 shrink-0 flex-col overflow-hidden bg-surface text-surface-foreground motion-safe:transition-[width] motion-safe:duration-200 ' +
        (open ? 'w-full border-l border-separator lg:w-[398px]' : 'pointer-events-none w-0 border-0')}>
        <div className="flex items-center justify-between gap-3 border-b border-separator px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-(--radius) bg-surface-secondary text-surface-secondary-foreground"><Sparkles size={18} aria-hidden="true"/></span>
            <div className="flex flex-col">
              <strong className="text-sm">Theme assistant</strong>
              <small className="text-xs text-muted">Local AI</small>
            </div>
          </div>
          <Button size="sm" isIconOnly variant="ghost" aria-label="Close chat" onPress={onClose}><X size={18}/></Button>
        </div>

        <div className="scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4" data-scrollbar="thin"
          role="log" aria-label="Chat messages" ref={feedRef}
          onScroll={(event) => {
            const {scrollHeight, clientHeight, scrollTop} = event.currentTarget;
            followFeed.current = scrollHeight - clientHeight - scrollTop < 48;
          }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-start gap-3 py-5">
              <h2 className="text-lg font-semibold">What theme would you like to create?</h2>
              <p className="text-sm leading-relaxed text-muted">
                Describe the style and colors you want. You can review the proposal in light and dark modes.
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(({label, prompt}) => (
                  <Button key={label} variant="secondary" size="sm" onPress={() => editDraft(prompt)}>{label}</Button>
                ))}
              </div>
              {!unavailable && <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <Info size={14} className="shrink-0" aria-hidden="true"/> The browser downloads the model when you generate your first theme.
              </p>}
            </div>
          )}
          {messages.map((message) => (
            <div className={'flex min-w-0 gap-2 ' + (message.kind === 'user' ? 'justify-end' : 'justify-start')} key={message.id}>
              {message.kind !== 'user' && (
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-secondary text-surface-secondary-foreground">
                  <Sparkles size={15} aria-hidden="true"/>
                </span>
              )}
              <div className={'min-w-0 max-w-[92%] rounded-(--radius) p-3 text-sm ' +
                (message.kind === 'user' ? 'bg-surface-secondary text-surface-secondary-foreground' : 'border border-separator')}>
                {(message.kind === 'user' || message.kind === 'info') && (
                  <p className="wrap-anywhere whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                )}
                {message.kind === 'proposal' && (
                  <ProposalMessage proposal={message.proposal} applied={appliedId === message.id}
                    onApply={() => {
                      onApply(applyThemeProposal(theme, message.proposal));
                      previousRef.current = message.proposal;
                      setAppliedId(message.id);
                    }}/>
                )}
                {message.kind === 'error' && (
                  <div className="flex flex-col gap-2">
                    <strong className="text-xs text-danger">Error during {message.stage || 'WebLLM'}</strong>
                    <p className="text-sm leading-relaxed">{message.advice || message.detail}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="secondary" isDisabled={!!draft.trim()}
                        onPress={() => editDraft(message.prompt)}>
                        Restore prompt
                      </Button>
                    </div>
                    <details>
                      <summary className="cursor-pointer text-xs text-muted">Show diagnostics</summary>
                      <pre className="mt-2 max-h-32 overflow-auto wrap-anywhere whitespace-pre-wrap text-xs">{message.diagnostic}</pre>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="ghost" onPress={async () => {
                          try {
                            await navigator.clipboard.writeText(message.diagnostic);
                            setCopyResult({id: message.id, message: 'Diagnostics copied.'});
                          } catch {
                            setCopyResult({id: message.id, message: 'Could not copy. You can select the text manually.'});
                          }
                        }}><Copy size={14} aria-hidden="true"/> Copy diagnostics</Button>
                        {copyResult?.id === message.id && <span role="status" className="text-xs">{copyResult.message}</span>}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
          {ai.notice && <div className="flex items-start gap-2 text-xs leading-relaxed text-muted"><Info size={14} className="shrink-0"/>{ai.notice}</div>}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-muted" role="status" aria-live="polite">
              <Spinner size="sm" color="accent" aria-hidden="true"/>
              <span>{ai.progress || 'Generating theme…'}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-separator p-4">
          {unavailable && <p className="text-xs leading-relaxed text-danger" role="status">{unavailable}</p>}
          <div className="flex flex-col gap-2">
            <TextField value={draft} onChange={setDraft}>
              <Label className="sr-only">Describe or refine a theme</Label>
              <TextArea ref={draftRef} variant="secondary" rows={3} maxLength={AI_MAX_PROMPT_LENGTH}
                placeholder={previousRef.current ? 'Ask for a change, such as more contrast…' : 'Describe your theme…'}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault(); submit();
                  }
                }}/>
            </TextField>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-muted">Enter to send · Shift+Enter for a new line</span>
              <Button isIconOnly size="sm" variant="primary" aria-label="Send and generate theme"
                isDisabled={!canSend}
                onPress={submit}><ArrowUp size={18}/></Button>
            </div>
          </div>
        </div>
    </aside>
  );
}, (previous, next) => {
  if (previous.open !== next.open) return false;
  if (!next.open) return previous.onApply === next.onApply && previous.onClose === next.onClose;
  return previous.theme === next.theme && previous.onApply === next.onApply && previous.onClose === next.onClose;
});
