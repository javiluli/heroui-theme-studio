import {
  Alert, Button, Card, Checkbox, Chip, Description, FieldError, Input, Label, Menu,
  Separator, TextArea, TextField, Typography, useThemeColor, useToast,
} from "heroui-native";
import { useRef, useState, type ComponentRef } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { NativeCatalogScreen } from "./NativeCatalogScreen";
import { PreviewIcon } from "./PreviewIcon";
import { PreviewSelect, type PreviewOption } from "./PreviewSelect";
import { PreviewSwitch } from "./PreviewSwitch";

const priorities = ["Normal", "High", "Low"].map((label) => ({ label, value: label }));
const initialTasks = [
  { id: 1, name: "Review the onboarding flow", details: "Check the welcome screen and the sign-in states.", priority: "High", done: false },
  { id: 2, name: "Share the first layout", details: "", priority: "Normal", done: false },
  { id: 3, name: "Collect reference screens", details: "", priority: "Normal", done: true },
];

export function NativeAppScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCompleted, setShowCompleted] = useState(true);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState<PreviewOption | undefined>(priorities[0]);
  const [invalid, setInvalid] = useState(false);
  const [library, setLibrary] = useState(false);
  const nextId = useRef(initialTasks.length + 1);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const positions = useRef({ tasks: 0, form: 0 });
  const { width } = useWindowDimensions();
  const [foreground, accent] = useThemeColor(["foreground", "accent"]);
  const { toast } = useToast();
  const complete = tasks.filter((task) => task.done).length;
  const percent = Math.round(complete / tasks.length * 100);
  const visibleTasks = showCompleted ? tasks : tasks.filter((task) => !task.done);

  const addTask = () => {
    if (!name.trim()) {
      setInvalid(true);
      return;
    }
    const task = { id: nextId.current++, name: name.trim(), details: details.trim(), priority: priority?.label ?? "Normal", done: false };
    setTasks((current) => [...current, task]);
    setName("");
    setDetails("");
    setPriority(priorities[0]);
    setInvalid(false);
    toast.show({ variant: "success", label: "Task added" });
  };

  return (
    <View className="min-h-0 flex-1" testID="native-app">
      <View className="flex-row items-center gap-2 border-b border-separator bg-surface px-3 pb-2 pt-8">
        <View className="size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
          {library ? (
            <Button size="sm" variant="ghost" isIconOnly accessibilityLabel="Back to Dayplan" onPress={() => setLibrary(false)}>
              <PreviewIcon name="back" color={foreground} />
            </Button>
          ) : <PreviewIcon name="app" color={accent} />}
        </View>
        <View className="min-w-0 flex-1"><Typography className="text-lg font-semibold" numberOfLines={1}>{library ? "Library" : "Dayplan"}</Typography></View>
        {!library && (
          <Menu>
            <Menu.Trigger asChild>
              <Button size="sm" variant="ghost" isIconOnly accessibilityLabel="Open app menu"><PreviewIcon name="menu" color={foreground} /></Button>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Overlay />
              <Menu.Content presentation="popover" placement="bottom" align="end" width={Math.min(220, width - 24)}>
                <Menu.Item id="today" onPress={() => scroll.current?.scrollTo({ y: 0 })}><Menu.ItemTitle>Today</Menu.ItemTitle></Menu.Item>
                <Menu.Item id="tasks" onPress={() => scroll.current?.scrollTo({ y: positions.current.tasks })}><Menu.ItemTitle>Tasks</Menu.ItemTitle></Menu.Item>
                <Menu.Item id="form" onPress={() => scroll.current?.scrollTo({ y: positions.current.form })}><Menu.ItemTitle>New task</Menu.ItemTitle></Menu.Item>
                <Menu.Item id="library" onPress={() => setLibrary(true)}><Menu.ItemTitle>Component library</Menu.ItemTitle></Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        )}
      </View>
      {library ? <NativeCatalogScreen /> : (
        <ScrollView ref={scroll} className="min-h-0 flex-1" contentContainerClassName="gap-5 px-4 pb-6 pt-4"
          keyboardShouldPersistTaps="handled" testID="dayplan-scroll">
          <View className="gap-3">
            <View className="gap-1">
              <Typography.Heading type="h1" className="text-2xl">Today</Typography.Heading>
              <Description>Plan your day and keep track of what’s done.</Description>
            </View>
            <Card variant="secondary">
              <View className="gap-3">
                <View className="flex-row flex-wrap items-center justify-between gap-2">
                  <Card.Title>Daily progress</Card.Title>
                  <Chip size="sm" variant="soft" color={percent === 100 ? "success" : "accent"}>{percent}%</Chip>
                </View>
                <View accessibilityRole="progressbar" accessibilityLabel="Daily progress"
                  aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
                  className="h-2 overflow-hidden rounded-full bg-default">
                  <View className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
                </View>
                <Card.Description>{complete} of {tasks.length} tasks completed</Card.Description>
              </View>
            </Card>
          </View>

          <View className="gap-3" onLayout={(event) => { positions.current.tasks = event.nativeEvent.layout.y; }}>
            <View className="flex-row flex-wrap items-center justify-between gap-2">
              <Typography.Heading type="h2" className="text-lg">Tasks</Typography.Heading>
              <View className="flex-row flex-wrap items-center gap-2">
                <Description>Show completed</Description>
                <PreviewSwitch accessibilityLabel="Show completed tasks" isSelected={showCompleted} onSelectedChange={setShowCompleted} />
              </View>
            </View>
            {visibleTasks.length ? (
              <Card>
                <View className="gap-3">
                  {visibleTasks.map((task, index) => (
                    <View key={task.id} className="gap-3">
                      {index > 0 && <Separator />}
                      <View className="flex-row items-start gap-3">
                        <View className="shrink-0 pt-0.5">
                          <Checkbox accessibilityLabel={task.name} isSelected={task.done} onSelectedChange={(done) =>
                            setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done } : item))} />
                        </View>
                        <View className="min-w-0 flex-1 items-start gap-1">
                          <Typography>{task.name}</Typography>
                          {!!task.details && <Description>{task.details}</Description>}
                          {(task.done || task.priority !== "Normal") && (
                            <Chip size="sm" variant="soft" color={task.done ? "success" : task.priority === "High" ? "warning" : "default"}>
                              {task.done ? "Done" : `${task.priority} priority`}
                            </Chip>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            ) : (
              <Alert status="success"><Alert.Indicator /><Alert.Content><Alert.Title>All caught up</Alert.Title></Alert.Content></Alert>
            )}
          </View>

          <View className="gap-3" onLayout={(event) => { positions.current.form = event.nativeEvent.layout.y; }}>
            <Typography.Heading type="h2" className="text-lg">New task</Typography.Heading>
            <Card>
              <View className="gap-4">
                <TextField isRequired isInvalid={invalid}>
                  <Label>Task name</Label>
                  <Input accessibilityLabel="Task name" value={name} maxLength={80} placeholder="e.g. Review the color palette"
                    onChangeText={(value) => { setName(value); setInvalid(false); }} onSubmitEditing={addTask} />
                  <FieldError>Enter a task name.</FieldError>
                </TextField>
                <PreviewSelect label="Priority" options={priorities} value={priority} onChange={setPriority} />
                <TextField>
                  <Label>Notes</Label>
                  <TextArea accessibilityLabel="Notes" value={details} onChangeText={setDetails} maxLength={240}
                    placeholder="Add context for later" />
                </TextField>
                <Button onPress={addTask}>Add task</Button>
              </View>
            </Card>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
