import { useState } from "react";
import { Calendar, DateField, DatePicker, DateRangePicker, FieldError, Label, RangeCalendar, TimeField } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { PlaygroundControls, PlaygroundPreview } from "../components/ComponentPlayground";
import { configuredExample, fieldStateProps, FIELD_STATES, FIELD_VARIANTS } from "../components/configured-example";
import { ControlSwitch } from "../components/ControlSwitch";

function DateCalendar({ label = "Select a date", disabled }: { label?: string; disabled?: boolean }) {
  return (
    <Calendar aria-label={label} isDisabled={disabled}>
      <Calendar.Header>
        <Calendar.Heading />
        <Calendar.NavButton slot="previous" />
        <Calendar.NavButton slot="next" />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {(date) => <Calendar.Cell date={date} />}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
}

function CalendarPlayground() {
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <DateCalendar disabled={disabled} />
      </PlaygroundPreview>
    </>
  );
}

function DateRangePlayground() {
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <DateRangePicker isDisabled={disabled}>
          <Label>Range</Label>
          <DateField.Group>
            <DateField.InputContainer>
              <DateField.Input slot="start">
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateRangePicker.RangeSeparator />
              <DateField.Input slot="end">
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
            </DateField.InputContainer>
            <DateField.Suffix>
              <DateRangePicker.Trigger>
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DateRangePicker.Popover>
            <RangeCalendar aria-label="Select a range">
              <RangeCalendar.Header>
                <RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.YearPickerTriggerHeading />
                  <RangeCalendar.YearPickerTriggerIndicator />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => (
                    <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                  )}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      </PlaygroundPreview>
    </>
  );
}

function TimePlayground() {
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <PlaygroundControls>
        <ControlSwitch
          label="Disabled"
          value={disabled}
          onChange={setDisabled}
        />
      </PlaygroundControls>
      <PlaygroundPreview>
        <TimeField isDisabled={disabled}>
          <Label>Delivery time</Label>
          <TimeField.Group>
            <TimeField.Input>
              {(segment) => <TimeField.Segment segment={segment} />}
            </TimeField.Input>
          </TimeField.Group>
        </TimeField>
        <CalendarDays size={20} />
      </PlaygroundPreview>
    </>
  );
}

const DateFieldExample = configuredExample({ Variant: FIELD_VARIANTS, State: FIELD_STATES },
  ({ Variant, State }) => (
    <DateField {...fieldStateProps(State)}>
      <Label>Delivery date</Label>
      <DateField.Group variant={Variant}>
        <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
      </DateField.Group>
      <FieldError>Check the date.</FieldError>
    </DateField>
  ));

const DatePickerExample = configuredExample({ Variant: FIELD_VARIANTS, State: FIELD_STATES },
  ({ Variant, State }) => (
    <DatePicker {...fieldStateProps(State)}>
      <Label>Meeting date</Label>
      <DateField.Group variant={Variant}>
        <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
        <DateField.Suffix><DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger></DateField.Suffix>
      </DateField.Group>
      <FieldError>Check the date.</FieldError>
      <DatePicker.Popover>
        <DateCalendar label="Meeting date" />
      </DatePicker.Popover>
    </DatePicker>
  ));

const RangeCalendarExample = configuredExample({ State: FIELD_STATES },
  ({ State }) => (
    <RangeCalendar aria-label="Trip dates" {...fieldStateProps(State)}>
      <RangeCalendar.Header>
        <RangeCalendar.Heading /><RangeCalendar.NavButton slot="previous" /><RangeCalendar.NavButton slot="next" />
      </RangeCalendar.Header>
      <RangeCalendar.Grid>
        <RangeCalendar.GridHeader>{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}</RangeCalendar.GridHeader>
        <RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    </RangeCalendar>
  ));

const examples = {
  calendar: CalendarPlayground,
  "date-field": DateFieldExample,
  "date-picker": DatePickerExample,
  "date-range-picker": DateRangePlayground,
  "range-calendar": RangeCalendarExample,
  "time-field": TimePlayground,
};

export type DateExampleSlug = keyof typeof examples;

export default function DatePlaygrounds({ slug }: { slug: DateExampleSlug }) {
  const Example = examples[slug];
  return <Example />;
}
