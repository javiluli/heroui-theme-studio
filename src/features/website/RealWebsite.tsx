import { useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Chip,
  Label,
  ListBox,
  ProgressBar,
  SearchField,
  Select,
  Separator,
  Tabs,
} from "@heroui/react";
import { ChevronDown, FileCode, GitBranch, Package, Star } from "lucide-react";

const readme = {
  path: "README.md",
  description: "Project overview",
  content: "",
};

const files = [
  readme,
  {
    path: "src/index.ts",
    description: "Public exports",
    content: 'export { ThemeCard } from "./theme-card";\nexport { StatusLabel } from "./status-label";',
  },
  {
    path: "styles/theme.css",
    description: "Semantic styles",
    content: "@import \"tailwindcss\";\n@import \"@heroui/styles\";\n\n:root {\n  --panel-background: var(--surface);\n  --panel-text: var(--surface-foreground);\n}",
  },
  {
    path: "package.json",
    description: "Project configuration",
    content: '{\n  "name": "fieldnotes",\n  "version": "1.4.0",\n  "type": "module"\n}',
  },
];

const previewFile = {
  path: "PREVIEW.md",
  description: "Notes for the next release",
  content: "# 1.5 preview\n\n- Add compact navigation.\n- Share keyboard shortcuts across panels.",
};

const issues = [
  { id: 24, title: "Document keyboard shortcuts", area: "Documentation", status: "Open", color: "success" },
  { id: 21, title: "Review compact navigation", area: "Design", status: "In review", color: "warning" },
  { id: 18, title: "Long filenames overflow on mobile", area: "Bug", status: "Blocked", color: "danger" },
] as const;

const releaseTasks = ["Review components", "Check mobile layouts", "Publish release notes"];

export default function RealWebsite() {
  const [branch, setBranch] = useState("main");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(readme);
  const [starred, setStarred] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([releaseTasks[0]]);

  const branchFiles = branch === "preview" ? [...files, previewFile] : files;
  const visibleFiles = branchFiles.filter(({ path }) => path.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section
      aria-labelledby="repository-title"
      className="@container w-full min-w-0 overflow-hidden rounded-[calc(var(--radius)+var(--spacing)*2)] border border-separator bg-background"
      id="real-website-preview"
    >
      <header className="grid gap-5 bg-surface p-5 text-surface-foreground @lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-(--radius) bg-accent-soft text-accent-soft-foreground">
              <Package size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 id="repository-title" className="text-2xl font-semibold tracking-tight">Fieldnotes</h1>
              <p className="text-xs text-muted">North Workshop</p>
            </div>
          </div>
          <Button size="sm" variant={starred ? "primary" : "secondary"} aria-pressed={starred} onPress={() => setStarred(!starred)}>
            <Star size={16} aria-hidden="true" />
            {starred ? "Starred" : "Star"}
          </Button>
        </div>
        <p className="max-w-prose text-sm text-muted">A component library for documenting design decisions.</p>
      </header>

      <Separator />

      <Tabs defaultSelectedKey="files">
        <div className="flex min-w-0 px-4 pt-4 @lg:px-6">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Repository views">
              <Tabs.Tab id="files">Files<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="issues">Issues<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="releases">Releases<Tabs.Indicator /></Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </div>

        <Tabs.Panel id="files">
          <div className="grid min-w-0 items-start gap-4 p-4 @lg:p-6 @min-[44rem]:grid-cols-[minmax(14rem,2fr)_minmax(0,3fr)]">
            <div className="grid min-w-0 gap-3">
              <div className="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,4fr)] gap-2">
                <Select
                  fullWidth
                  variant="secondary"
                  value={branch}
                  onChange={(value) => {
                    if (value !== "main" && value !== "preview") return;
                    setBranch(value);
                    setFile(readme);
                  }}
                >
                  <Label className="sr-only">Branch</Label>
                  <Select.Trigger>
                    <GitBranch size={15} aria-hidden="true" />
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="main">main<ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="preview">preview<ListBox.ItemIndicator /></ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                <SearchField aria-label="Find a file" value={query} onChange={setQuery}>
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Find a file" />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
              </div>

              <div className="rounded-(--radius) border border-separator bg-surface p-1 text-surface-foreground">
                <ListBox
                  aria-label="Repository files"
                  items={visibleFiles}
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={visibleFiles.includes(file) ? [file.path] : []}
                  onSelectionChange={(keys) => {
                    if (keys === "all") return;
                    const next = visibleFiles.find(({ path }) => keys.has(path));
                    if (next) setFile(next);
                  }}
                  renderEmptyState={() => <p className="px-3 py-2 text-sm text-muted">No files match this search.</p>}
                >
                  {(entry) => (
                    <ListBox.Item id={entry.path} textValue={entry.path}>
                      <FileCode size={16} className="shrink-0 text-muted" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-mono text-xs">{entry.path}</span>
                        <span className="block truncate text-xs text-muted">{entry.description}</span>
                      </span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )}
                </ListBox>
              </div>

              <Card>
                <Card.Header>
                  <Card.Title>Release checklist</Card.Title>
                  <Card.Description>v1.5 preview</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="grid gap-3">
                    <ProgressBar aria-label="Release readiness" value={completedTasks.length} maxValue={releaseTasks.length}>
                      <ProgressBar.Output>{`${completedTasks.length} of ${releaseTasks.length} complete`}</ProgressBar.Output>
                      <ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track>
                    </ProgressBar>
                    <CheckboxGroup aria-label="Release tasks" value={completedTasks} onChange={setCompletedTasks}>
                      {releaseTasks.map((task) => (
                        <Checkbox key={task} value={task}>
                          <Checkbox.Content>
                            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                            {task}
                          </Checkbox.Content>
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                </Card.Content>
              </Card>
            </div>

            <Card>
              <Card.Header>
                <Card.Title>{file.path}</Card.Title>
                <Card.Description>{file.description}</Card.Description>
              </Card.Header>
              <Separator />
              <Card.Content>
                {file === readme ? (
                  <div className="grid gap-3">
                    <h2 className="text-xl font-semibold">Fieldnotes</h2>
                    <p className="max-w-prose text-sm text-muted">
                      Keep component examples and usage notes together. Open a file to inspect the styles, or switch to the preview branch to read what is coming in the next release.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Chip variant="soft" color="accent" size="sm">React</Chip>
                      <Chip variant="soft" size="sm">CSS variables</Chip>
                    </div>
                    <Accordion>
                      <Accordion.Item id="setup">
                        <Accordion.Heading>
                          <Accordion.Trigger>
                            Run locally
                            <Accordion.Indicator><ChevronDown /></Accordion.Indicator>
                          </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                          <Accordion.Body>
                            Install the dependencies with <code>npm install</code> and start the preview with <code>npm run dev</code>.
                          </Accordion.Body>
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item id="theme">
                        <Accordion.Heading>
                          <Accordion.Trigger>
                            Customize the theme
                            <Accordion.Indicator><ChevronDown /></Accordion.Indicator>
                          </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                          <Accordion.Body>
                            Open <code>styles/theme.css</code> to see the global styles used by the project.
                          </Accordion.Body>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                ) : (
                  <pre tabIndex={0} aria-label={file.path} className="overflow-x-auto rounded-(--radius) bg-surface-secondary p-3 text-xs leading-6 text-surface-secondary-foreground focus-visible:outline-2 focus-visible:outline-focus">
                    <code>{file.content}</code>
                  </pre>
                )}
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="issues">
          <div className="p-4 @lg:p-6">
            <ul className="divide-y divide-separator rounded-(--radius) border border-separator bg-surface text-surface-foreground">
              {issues.map(({ id, title, area, status, color }) => (
                <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted">#{id} · {area}</p>
                  </div>
                  <Chip size="sm" variant="soft" color={color}>{status}</Chip>
                </li>
              ))}
            </ul>
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="releases">
          <div className="grid gap-3 p-4 @lg:p-6">
            <Card>
              <Card.Header>
                <Card.Title>v1.4.0</Card.Title>
                <Card.Description>Semantic styles for surfaces, statuses and form fields.</Card.Description>
              </Card.Header>
              <Card.Footer><Chip size="sm" variant="soft" color="success">Latest</Chip></Card.Footer>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>v1.3.0</Card.Title>
                <Card.Description>Keyboard access and responsive previews.</Card.Description>
              </Card.Header>
            </Card>
          </div>
        </Tabs.Panel>
      </Tabs>
    </section>
  );
}
