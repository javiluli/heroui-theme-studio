import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ComponentGallery, { COMPONENT_EXAMPLES } from './ComponentGallery';
import { categoryId, COMPONENT_CATEGORIES, COMPONENT_ORDER } from './component-categories';
import { ComponentIndex } from './components/ComponentIndex';
import { REACT_COMPONENT_SOURCES } from './inspection/react-component-sources';

/** The exact OSS list from the HeroUI v3 React component catalog, excluding Pro. */
const officialOss = [
  'Accordion', 'Alert', 'AlertDialog', 'Autocomplete', 'Avatar', 'AvatarGroup', 'Badge',
  'Breadcrumbs', 'Button', 'ButtonGroup', 'Calendar', 'Card', 'Checkbox',
  'CheckboxGroup', 'Chip', 'CloseButton', 'ColorArea', 'ColorField', 'ColorPicker',
  'ColorSlider', 'ColorSwatch', 'ColorSwatchPicker', 'ComboBox', 'DateField',
  'DatePicker', 'DateRangePicker', 'Description', 'Disclosure', 'DisclosureGroup',
  'Drawer', 'Dropdown', 'ErrorMessage', 'FieldError', 'Fieldset', 'Form',
  'Input', 'InputGroup', 'InputOTP', 'Kbd', 'Label', 'Link', 'ListBox', 'Meter',
  'Modal', 'NumberField', 'Pagination', 'Popover', 'ProgressBar', 'ProgressCircle',
  'RadioGroup', 'RangeCalendar', 'ScrollShadow', 'SearchField', 'Select',
  'Separator', 'Sheet', 'Skeleton', 'Slider', 'Spinner', 'Surface', 'Switch',
  'Table', 'Tabs', 'TagGroup', 'TextArea', 'TextField', 'TimeField', 'Toast',
  'ToggleButton', 'ToggleButtonGroup', 'Toolbar', 'Tooltip', 'Typography',
];

const galleryProps = { onGalleryReady: () => {}, anchorTarget: createRef<HTMLElement>() };

describe('free HeroUI React v3 gallery coverage', () => {
  it('declares real examples for every documented OSS component', () => {
    expect(Object.keys(COMPONENT_EXAMPLES).sort()).toEqual(Object.keys(REACT_COMPONENT_SOURCES).sort());
    expect(Object.values(REACT_COMPONENT_SOURCES).map(({ name }) => name).sort()).toEqual([...officialOss].sort());
    expect(Object.values(COMPONENT_EXAMPLES).every((example) => typeof example === 'function')).toBe(true);
  });

  it('renders each category heading and example in the same order as their index links', () => {
    const index = renderToStaticMarkup(createElement(ComponentIndex, { gallery: null, anchorTarget: galleryProps.anchorTarget }));
    const gallery = renderToStaticMarkup(createElement(ComponentGallery, galleryProps));
    const categoryTitles = COMPONENT_CATEGORIES.map(({ title }) => title);
    const categoryIds = categoryTitles.map(categoryId);

    expect([...COMPONENT_ORDER].sort()).toEqual(Object.keys(COMPONENT_EXAMPLES).sort());
    expect([...gallery.matchAll(/<h2\b[^>]*>([^<]+)<\/h2>/g)].map((match) => match[1])).toEqual(categoryTitles);
    expect([...index.matchAll(/<ul aria-label="([^"]+)"/g)].map((match) => match[1])).toEqual(categoryTitles);
    expect([...gallery.matchAll(/<h2 id="(category-[^"]+)"/g)].map((match) => match[1])).toEqual(categoryIds);
    expect([...index.matchAll(/href="#(category-[^"]+)"/g)].map((match) => match[1])).toEqual(categoryIds);
    expect([...gallery.matchAll(/data-example="([^"]+)"/g)].map((match) => match[1])).toEqual(COMPONENT_ORDER);
    expect([...index.matchAll(/href="#example-([^"]+)"/g)].map((match) => match[1])).toEqual(COMPONENT_ORDER);
  });

  it('reuses the React catalog for collage and serves the isolated Native viewer without premium dependencies', () => {
    const app = readFileSync(new URL('../../app/App.tsx', import.meta.url), 'utf8');
    const packageFile = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')) as {
      dependencies: Record<string, string>;
    };
    const navigation = readFileSync(new URL('../../app/layout/StudioViews.tsx', import.meta.url), 'utf8');
    expect(navigation).toContain('{ id: "collage", label: "Collage" }');
    expect(app).toMatch(/<ComponentGallery\s+layout=\{page === "collage" \? "collage" : "list"\}/);
    expect(app).toContain('<RealWebsite />');
    expect(app).toMatch(/<NativePreviewPage\s+theme=\{editor.theme\}\s+mode=\{editor.mode\}\s*\/>/);
    expect(Object.keys(packageFile.dependencies).some((key) => key.includes('heroui-pro'))).toBe(false);
  });

  it('renders the collage composition with interactive HeroUI samples', () => {
    const html = renderToStaticMarkup(createElement(ComponentGallery, { ...galleryProps, layout: 'collage' }));
    expect(html).toContain('data-gallery-layout="collage"');
    for (const label of ['Your email', 'Verification code', 'Time range', 'File actions', 'Create an account', 'Indie Hackers', 'AI Builders', 'Unsaved changes']) {
      expect(html).toContain(label);
    }
    expect(html).not.toContain('data-playground-settings');
  });
});
