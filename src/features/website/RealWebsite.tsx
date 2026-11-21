import { memo, useState } from 'react';
import {
  Accordion, Alert, Avatar, Button, Calendar, Card, Checkbox, Chip, DateField, DatePicker, Input,
  Label, ListBox, ProgressBar, Select, Separator, Switch, TextField, Tooltip,
} from '@heroui/react';
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronRight,
  CircleHelp, Layers3, Menu, ShieldCheck, Sparkles, WandSparkles, X,
} from 'lucide-react';

const steps = [
  { number: '01', title: 'Organize your work', description: 'Keep projects, notes, and tasks together in shared spaces.', icon: Layers3 },
  { number: '02', title: 'Collaborate easily', description: 'Share context, review progress, and keep everyone informed.', icon: Sparkles },
  { number: '03', title: 'Stay focused', description: 'Keep the important work in view with a simple interface.', icon: ShieldCheck },
];

const faq = [
  ['Can I try the product?', 'Yes. This interactive demo lets you try your theme. It does not create accounts.'],
  ['What changes when I edit the theme?', 'Every component uses the global HeroUI v3 tokens for colors, surfaces, typography, and corner radii.'],
  ['Are these Pro components?', 'This demo uses free components from @heroui/react.'],
];

export default memo(function RealWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('teams');
  const [sent, setSent] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [query, setQuery] = useState('');
  const [favorite, setFavorite] = useState(false);

  const navigate = () => setMenuOpen(false);

  return (
    <div className="@container w-full min-w-0 overflow-hidden border-y border-border bg-background text-foreground" id="real-website-preview">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-separator px-5 py-2 text-xs">
        <span className="font-semibold">Theme Studio · Sample website</span>
        <span className="text-muted">Local preview with HeroUI v3 components</span>
      </div>
      <header className="relative flex min-h-18 items-center justify-between gap-3 border-b border-separator bg-surface px-4 py-3 @3xl:px-8">
        <a href="#site-home" className="inline-flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-foreground no-underline" onClick={navigate}>
          <span className="grid size-9 place-items-center rounded-[var(--radius)] bg-accent text-accent-foreground"><Layers3 size={20}/></span>
          <strong>Forma</strong><span className="-ml-2 text-accent">.</span>
        </a>
        <nav className={'absolute top-full right-0 left-0 z-10 flex-col gap-4 border-b border-separator bg-surface p-5 text-xs font-semibold @3xl:static @3xl:flex @3xl:flex-row @3xl:items-center @3xl:gap-6 @3xl:border-0 @3xl:p-0 ' +
          (menuOpen ? 'flex' : 'hidden @3xl:flex')} aria-label="Demo site navigation">
          <a href="#site-features" onClick={navigate}>Features</a>
          <a href="#site-work" onClick={navigate}>Product</a>
          <a href="#site-pricing" onClick={navigate}>Pricing</a>
          <a href="#site-faq" onClick={navigate}>FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden @3xl:inline-flex"><Button size="sm" variant="ghost" onPress={() => document.getElementById('site-contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</Button></span>
          <Button size="sm" variant="primary" onPress={() => document.getElementById('site-contact')?.scrollIntoView({ behavior: 'smooth' })}>Get started <ArrowRight size={15}/></Button>
          <span className="@3xl:hidden"><Button isIconOnly size="sm" variant="secondary"
            onPress={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}>
            {menuOpen ? <X size={18}/> : <Menu size={18}/>}
          </Button></span>
        </div>
      </header>

      <section id="site-home" className="grid scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] min-w-0 items-center gap-8 px-5 py-12 @3xl:grid-cols-2 @3xl:px-10 @3xl:py-20">
        <div className="min-w-0">
          <Chip size="sm" color="accent" variant="soft"><Chip.Label><Sparkles size={13}/> PALETTE · LIGHT AND DARK</Chip.Label></Chip>
          <h1 className="my-6 max-w-[12ch] text-4xl font-semibold leading-tight tracking-tight @4xl:text-6xl">A theme in every detail</h1>
          <p className="max-w-[62ch] text-sm leading-relaxed text-muted">See how surfaces, fields, and actions work together with the current palette.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" variant="primary" onPress={() => document.getElementById('site-contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the demo <ArrowRight size={17}/>
            </Button>
            <Button size="lg" variant="outline" onPress={() => document.getElementById('site-work')?.scrollIntoView({ behavior: 'smooth' })}>
              View components
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex shrink-0 items-center gap-1">
              {['LM','CR','AP'].map((name) => (
                <Avatar key={name} size="sm" color="accent" ><Avatar.Fallback>{name}</Avatar.Fallback></Avatar>
              ))}
            </div>
            <span>For teams that care about the details.</span>
          </div>
        </div>
        <div className="relative min-w-0 py-6" aria-label="App preview using free Card, Chip, and ProgressBar components">
          <div className="pointer-events-none absolute inset-0 -z-0 rounded-full bg-accent/5 blur-3xl" />
          <Card >
            <Card.Header>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius)] bg-accent text-accent-foreground"><WandSparkles size={17}/></span>
                <div><Card.Title>Creative Studio</Card.Title><Card.Description>Team workspace · Demo</Card.Description></div>
              </div>
              <Chip size="sm" variant="soft" color="success">In progress</Chip>
            </Card.Header>
            <Card.Content>
              <div className="mb-5 flex gap-5 border-b border-separator pb-3 text-xs text-muted"><span className="border-b-2 border-accent pb-2 font-semibold text-accent">Overview</span><span>Tasks</span><span>Files</span></div>
              <div className="mb-3 flex justify-between gap-2 text-sm"><strong>Website redesign</strong><span className="text-xs text-muted">3 / 4</span></div>
              <ProgressBar aria-label="Design progress" value={75} color="accent" size="md">
                <ProgressBar.Track><ProgressBar.Fill/></ProgressBar.Track>
              </ProgressBar>
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-separator py-2 text-xs"><CheckCircle2 size={17}/><span>Define the visual identity</span><Chip size="sm" color="success" variant="soft">Done</Chip></div>
                <div className="flex items-center gap-2 border-b border-separator py-2 text-xs"><CheckCircle2 size={17}/><span>Design components</span><Chip size="sm" color="success" variant="soft">Done</Chip></div>
                <div className="flex items-center gap-2 border-b border-separator py-2 text-xs"><CheckCircle2 size={17}/><span>Build the homepage</span><Chip size="sm" color="success" variant="soft">Done</Chip></div>
                <div className="flex items-center gap-2 py-2 text-xs"><span className="inline-block size-4 shrink-0 rounded-full border-2 border-border" /><span>Team review</span><Chip size="sm" color="warning" variant="soft">In progress</Chip></div>
              </div>
            </Card.Content>
          </Card>
          <div className="absolute right-0 bottom-0 flex items-center gap-2 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-sm"><Check size={16}/><span>Real-time collaboration</span></div>
        </div>
      </section>

      <section id="site-features" className="scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] px-5 py-12 @3xl:px-10 @3xl:py-16">
        <div className="mx-auto mb-9 max-w-2xl space-y-3 text-center">
          <span className="text-xs font-bold tracking-wider text-accent">BUILT FOR EVERYDAY WORK</span>
          <h2 className="text-2xl font-bold tracking-tight @3xl:text-3xl">More room to create</h2>
          <p className="text-sm leading-relaxed text-muted">Change the global theme to see how these components respond together.</p>
        </div>
        <div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <Card key={number} >
              <Card.Content>
                <div className="flex flex-col items-start gap-3"><span className="mb-3 grid size-12 place-items-center rounded-[var(--radius)] bg-surface-secondary text-accent"><Icon size={23}/></span>
                <small className="text-xs text-muted">{number} / 03</small>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{description}</p>
                <a className="inline-flex items-center gap-1 text-xs font-semibold text-accent" href="#site-work">Learn more <ArrowUpRight size={15}/></a>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section id="site-work" className="grid scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] items-center gap-10 bg-surface-secondary px-5 py-12 @3xl:grid-cols-2 @3xl:px-10 @3xl:py-16">
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-wider text-accent">BUILT TO ADAPT</span>
          <h2 className="text-2xl font-bold tracking-tight @3xl:text-3xl">Everything in one workspace</h2>
          <p className="text-sm leading-relaxed text-muted">Try interactive forms, lists, actions, and states built with HeroUI.</p>
          <ul className="my-5 flex flex-col gap-3">
            <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={17}/> Clear, accessible forms</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={17}/> Consistent states and actions</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle2 size={17}/> Light and dark modes</li>
          </ul>
          <Button variant="secondary" onPress={() => setFavorite((current) => !current)}>
            {favorite ? <Check size={16}/> : <ArrowRight size={16}/>} {favorite ? 'Saved for later' : 'Save for later'}
          </Button>
        </div>
        <Card >
          <Card.Header>
            <Card.Title>Find a project</Card.Title>
            <Card.Description>Search and filter the project list.</Card.Description>
          </Card.Header>
          <Card.Content>
            <TextField>
              <Label>Search</Label>
              <Input variant="secondary" placeholder="Project name" value={query}
                onChange={(event) => setQuery(event.target.value)}/>
            </TextField>
            <div className="mt-5 flex flex-col gap-3">
              {[
                { name: 'Visual identity', status: 'In progress' },
                { name: 'Company website', status: 'Pending' },
                { name: 'Component kit', status: 'In progress' },
              ].filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).map((item) => (
                <div key={item.name} className="flex items-center gap-3 border-b border-separator py-2">
                  <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius)] bg-surface-secondary text-accent"><Layers3 size={17}/></span>
                  <strong className="min-w-0 flex-1 text-xs font-semibold">{item.name}</strong>
                  <Chip color={item.status === 'Pending' ? 'warning' : 'success'} variant="soft" size="sm">{item.status}</Chip>
                  <ChevronRight size={15}/>
                </div>
              ))}
              {!['Visual identity', 'Company website', 'Component kit'].some((name) => name.toLowerCase().includes(query.toLowerCase())) &&
                <p className="text-xs text-muted">No matching projects.</p>}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section id="site-pricing" className="scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] px-5 py-12 @3xl:px-10 @3xl:py-16">
        <div className="mx-auto mb-9 max-w-2xl space-y-3 text-center">
          <span className="text-xs font-bold tracking-wider text-accent">SIMPLE PRICING</span>
          <h2 className="text-2xl font-bold tracking-tight @3xl:text-3xl">Plans to start and grow</h2>
          <p className="text-sm leading-relaxed text-muted">A pricing section built with HeroUI cards and status indicators.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 @xl:grid-cols-2">
          {[
            { title: 'Personal', cost: 'Free', desc: 'Explore ideas and projects.', features: ['3 projects', 'Personal workspace', 'Essential components'], recommended: false },
            { title: 'Team', cost: '12 €', desc: 'Collaborate on shared projects.', features: ['Unlimited projects', 'Team collaboration', 'Shared history'], recommended: true },
          ].map((plan) => (
            <Card key={plan.title} >
              <Card.Header>
                <div className="flex items-center justify-between gap-2"><Card.Title>{plan.title}</Card.Title>{plan.recommended && <Chip color="accent" variant="soft" size="sm">Popular</Chip>}</div>
                <Card.Description>{plan.desc}</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="my-5 text-3xl font-bold">{plan.cost}{plan.recommended && <small className="text-xs text-muted"> / month</small>}</div>
                <Separator/>
                <div className="mt-4 flex flex-col gap-3">
                  {plan.features.map((f) => <span key={f} className="flex items-center gap-2 text-xs"><Check size={16}/>{f}</span>)}
                </div>
              </Card.Content>
              <Card.Footer>
                <Button variant={plan.recommended ? 'primary' : 'secondary'} onPress={() => document.getElementById('site-contact')?.scrollIntoView({ behavior: 'smooth' })}>Choose {plan.title} <ArrowRight size={15}/></Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">* Sample prices and data for this demo.</p>
      </section>

      <section id="site-faq" className="grid scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] gap-8 px-5 py-12 @3xl:grid-cols-2 @3xl:px-10 @3xl:py-16">
        <div>
          <span className="text-xs font-bold tracking-wider text-accent">HELP CENTER</span>
          <h2 className="text-2xl font-bold tracking-tight @3xl:text-3xl">Frequently asked questions</h2>
          <p className="text-sm leading-relaxed text-muted">This section uses the HeroUI v3 Accordion component.</p>
          <Tooltip delay={200}>
            <Tooltip.Trigger><Button variant="secondary" size="sm"><CircleHelp size={15}/> About this demo</Button></Tooltip.Trigger>
            <Tooltip.Content showArrow><Tooltip.Arrow/>This is a local preview.</Tooltip.Content>
          </Tooltip>
        </div>
        <Accordion variant="surface" defaultExpandedKeys={['faq-0']}>
          {faq.map(([question, answer], index) => (
            <Accordion.Item id={'faq-' + index} key={question}>
              <Accordion.Heading><Accordion.Trigger>{question}<Accordion.Indicator/></Accordion.Trigger></Accordion.Heading>
              <Accordion.Panel><Accordion.Body>{answer}</Accordion.Body></Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </section>

      <section id="site-contact" className="grid scroll-mt-[calc(var(--studio-header-height,3.5625rem)+4.5rem)] gap-8 bg-surface-secondary px-5 py-12 @3xl:grid-cols-2 @3xl:px-10 @3xl:py-16">
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-wider text-accent">GET STARTED</span>
          <h2 className="text-2xl font-bold tracking-tight @3xl:text-3xl">Bring your idea to life</h2>
          <p className="text-sm leading-relaxed text-muted">Try fields, buttons, validation, and states with the theme you are designing.</p>
        </div>
        <Card >
          <Card.Header><Card.Title>Request information</Card.Title><Card.Description>This sample form does not send data.</Card.Description></Card.Header>
          <Card.Content>
            <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); if (email.includes('@') && agreed) setSent(true); }}>
              <TextField isRequired>
                <Label>Email</Label>
                <Input variant="secondary" type="email" value={email} placeholder="you@example.com"
                  onChange={(event) => { setEmail(event.target.value); setSent(false); }}/>
              </TextField>
              <Select selectedKey={interest} onSelectionChange={(key) => { if (key) setInterest(String(key)); }}>
                <Label>What are you interested in?</Label>
                <Select.Trigger><Select.Value/><Select.Indicator/></Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="teams" textValue="Team collaboration">Team collaboration<ListBox.ItemIndicator/></ListBox.Item>
                    <ListBox.Item id="design" textValue="Product design">Product design<ListBox.ItemIndicator/></ListBox.Item>
                    <ListBox.Item id="personal" textValue="Personal use">Personal use<ListBox.ItemIndicator/></ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              <DatePicker>
                <Label>Preferred demo date</Label>
                <DateField.Group variant="secondary">
                  <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                  <DateField.Suffix><DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger></DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                  <Calendar>
                    <Calendar.Header><Calendar.NavButton slot="previous" /><Calendar.Heading /><Calendar.NavButton slot="next" /></Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                      <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                    </Calendar.Grid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>
              <Switch>
                <Switch.Content><Switch.Control><Switch.Thumb /></Switch.Control><Label>Send me a demo reminder</Label></Switch.Content>
              </Switch>
              <Checkbox isSelected={agreed} onChange={setAgreed}>
                <Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control>I understand this is a demo</Checkbox.Content>
              </Checkbox>
              <Button type="submit" variant="primary" isDisabled={!agreed || !email.includes('@')}>
                Submit demo form <ArrowRight size={16}/>
              </Button>
            </form>
            {sent && <Alert status="success"><Alert.Indicator/><Alert.Content><Alert.Title>Demo submitted</Alert.Title><Alert.Description>No data was sent.</Alert.Description></Alert.Content></Alert>}
          </Card.Content>
        </Card>
      </section>

      <footer className="flex flex-wrap items-start justify-between gap-6 border-t border-separator bg-surface px-5 py-8 @3xl:px-10">
        <div><span className="inline-flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-foreground no-underline"><span className="grid size-9 place-items-center rounded-[var(--radius)] bg-accent text-accent-foreground"><Layers3 size={18}/></span><strong>Forma.</strong></span><p className="text-sm leading-relaxed text-muted">Built with free HeroUI React v3 components.</p></div>
        <nav className="flex flex-wrap gap-4 text-xs text-muted" aria-label="Footer navigation"><a href="#site-home">Home</a><a href="#site-features">Features</a><a href="#site-faq">FAQ</a></nav>
        <span>Theme Studio · Website preview</span>
      </footer>
    </div>
  );
});
