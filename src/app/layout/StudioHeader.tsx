import { HeroUILogo } from "../../components/HeroUILogo";
import { Code2, Github, Sparkles } from "lucide-react";
import { Button, Link, Tooltip, Typography } from "@heroui/react";
import type { ReactNode, Ref } from "react";
import type { ThemePlatform } from "../../features/theme/export-css";
import { Grid } from "../../components/layout";

interface StudioHeaderProps {
  platform: ThemePlatform;
  navigation?: ReactNode;
  aiOpen: boolean;
  aiTrigger: Ref<HTMLButtonElement>;
  onToggleAI: () => void;
  onExport: () => void;
}

/** Persistent actions for the active preview. */
export function StudioHeader({
  platform,
  navigation,
  aiOpen,
  aiTrigger,
  onToggleAI,
  onExport,
}: StudioHeaderProps) {
  const docsPlatform = platform === "native" ? "native" : "react";
  const docsLabel = `HeroUI ${platform === "native" ? "Native" : "React"} documentation`;
  return (
    <Grid className="min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-(--studio-column-gap) gap-y-2 py-2 @[52rem]/studio:grid-cols-(--studio-split-columns) @[72rem]/studio:grid-cols-(--studio-header-columns) @[84rem]/studio:grid-cols-(--studio-web-columns)">
      <div className="flex min-w-0 flex-col px-2">
        <Typography.Paragraph size="base" weight="semibold">
          HeroUI Theme Studio
        </Typography.Paragraph>
        <span className="sr-only text-xs text-muted @[36rem]/studio:not-sr-only">
          Unofficial theme generator for HeroUI v3
        </span>
      </div>
      {navigation && (
        <div className="col-span-2 row-start-2 w-fit max-w-full justify-self-center @[52rem]/studio:col-span-1 @[52rem]/studio:col-start-2 @[72rem]/studio:row-start-1">
          {navigation}
        </div>
      )}
      <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-1 @[72rem]/studio:col-start-3">
        <Tooltip>
          <Link
            href="https://github.com/javiluli/heroui-theme-studio"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <span className="grid size-11 place-items-center md:size-10">
              <Github size={18} aria-hidden="true" />
            </span>
          </Link>
          <Tooltip.Content>GitHub repository</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Link
            href={`https://heroui.com/en/docs/${docsPlatform}/components`}
            target="_blank"
            rel="noreferrer"
            aria-label={docsLabel}
          >
            <span className="grid size-11 place-items-center md:size-10">
              <HeroUILogo />
            </span>
          </Link>
          <Tooltip.Content>{docsLabel}</Tooltip.Content>
        </Tooltip>
        <Button
          size="lg"
          variant={aiOpen ? "tertiary" : "ghost"}
          ref={aiTrigger}
          isIconOnly
          onPress={onToggleAI}
          aria-expanded={aiOpen}
          aria-controls={aiOpen ? "theme-ai-chat" : undefined}
          aria-label={aiOpen ? "Close AI assistant" : "Open AI assistant"}
        >
          <Sparkles aria-hidden="true" />
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onPress={onExport}
          aria-label="Export theme CSS"
          aria-haspopup="dialog"
        >
          <Code2 aria-hidden="true" />
          <span className="hidden @[36rem]/studio:inline">Export CSS</span>
        </Button>
      </div>
    </Grid>
  );
}
