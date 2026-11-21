import { HeroUILogo } from "../../components/HeroUILogo";
import { Code2, Github, Moon, Sparkles, Sun } from "lucide-react";
import { Button, Link, Tooltip, Typography } from "@heroui/react";
import type { Ref } from "react";
import type { ThemeMode } from "../../features/theme/model";
import type { ThemePlatform } from "../../features/theme/export-css";
import { Flex } from "../../components/layout";

interface StudioHeaderProps {
  platform: ThemePlatform;
  mode: ThemeMode;
  aiOpen: boolean;
  aiTrigger: Ref<HTMLButtonElement>;
  onModeChange: (mode: ThemeMode) => void;
  onToggleAI: () => void;
  onExport: () => void;
}

/** Persistent actions for the active preview. */
export function StudioHeader({
  platform,
  mode,
  aiOpen,
  aiTrigger,
  onModeChange,
  onToggleAI,
  onExport,
}: StudioHeaderProps) {
  const docsPlatform = platform === "native" ? "native" : "react";
  const docsLabel = `HeroUI ${platform === "native" ? "Native" : "React"} documentation`;
  return (
    <Flex className="min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <Typography.Paragraph size="sm" weight="semibold">
          HeroUI Theme Studio
        </Typography.Paragraph>
        <span className="text-xs text-muted">
          Unofficial theme generator for HeroUI v3
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <Link
            href="https://github.com/javiluli/heroui-theme-studio"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <span className="grid size-9 place-items-center">
              <Github size={20} aria-hidden="true" />
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
            <span className="grid size-9 place-items-center">
              <HeroUILogo />
            </span>
          </Link>
          <Tooltip.Content>{docsLabel}</Tooltip.Content>
        </Tooltip>
        <Button
          variant="ghost"
          isIconOnly
          onPress={() => onModeChange(mode === "light" ? "dark" : "light")}
          aria-label={
            mode === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {mode === "light" ? <Moon /> : <Sun />}
        </Button>
        <Button
          variant={aiOpen ? "secondary" : "outline"}
          ref={aiTrigger}
          isIconOnly
          onPress={onToggleAI}
          aria-expanded={aiOpen}
          aria-controls={aiOpen ? "theme-ai-chat" : undefined}
          aria-label={aiOpen ? "Close AI assistant" : "Open AI assistant"}
        >
          <Sparkles />
        </Button>
        <Button
          variant="secondary"
          onPress={onExport}
          aria-label="Export theme CSS"
        >
          <Code2 />
          <span className="hidden sm:inline">Export CSS</span>
        </Button>
      </div>
    </Flex>
  );
}
