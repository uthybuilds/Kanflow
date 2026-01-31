import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Stack,
  router,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { taskService } from "../../src/services/taskService";
import { supabase } from "../../src/lib/supabase";
import { ArrowLeft, Trash2, Calendar } from "lucide-react-native";

const PriorityChip = ({ value, label, color, selectedValue, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      selectedValue === value && { backgroundColor: color, borderColor: color },
    ]}
    onPress={() => onSelect(value)}
  >
    <Text
      style={[styles.chipText, selectedValue === value && { color: "#fff" }]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const StatusChip = ({ value, label, color, selectedValue, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      selectedValue === value && { backgroundColor: color, borderColor: color },
    ]}
    onPress={() => onSelect(value)}
  >
    <Text
      style={[styles.chipText, selectedValue === value && { color: "#fff" }]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const HeaderLeft = () => (
  <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
    <ArrowLeft size={24} color="#fff" />
  </TouchableOpacity>
);

export default function EditTaskScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleDelete = useCallback(async () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await taskService.deleteTask(id);
            router.back();
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Edit Task",
      headerStyle: { backgroundColor: "#09090b" },
      headerTintColor: "#fff",
      headerLeft: () => <HeaderLeft />,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            marginRight: -8, // Adjust for padding to align visually
          }}
        >
          <Trash2 size={24} color="#ef4444" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleDelete]);

  const fetchTask = async () => {
    try {
      const tasks = await taskService.getTasks();
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
      } else {
        Alert.alert("Error", "Task not found");
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title is required");
      return;
    }

    setSaving(true);
    try {
      await taskService.updateTask(id, {
        title,
        description,
        priority,
        status,
        due_date: dueDate || null,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const setDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    setDueDate(date.toISOString().split("T")[0]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.chipContainer}>
              <PriorityChip
                value="low"
                label="Low"
                color="#3b82f6"
                selectedValue={priority}
                onSelect={setPriority}
              />
              <PriorityChip
                value="medium"
                label="Medium"
                color="#eab308"
                selectedValue={priority}
                onSelect={setPriority}
              />
              <PriorityChip
                value="high"
                label="High"
                color="#ef4444"
                selectedValue={priority}
                onSelect={setPriority}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.chipContainer}>
              <StatusChip
                value="todo"
                label="To Do"
                color="#3b82f6"
                selectedValue={status}
                onSelect={setStatus}
              />
              <StatusChip
                value="in-progress"
                label="Doing"
                color="#eab308"
                selectedValue={status}
                onSelect={setStatus}
              />
              <StatusChip
                value="done"
                label="Done"
                color="#22c55e"
                selectedValue={status}
                onSelect={setStatus}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#71717a"
                value={dueDate}
                onChangeText={setDueDate}
              />
              <Calendar size={20} color="#71717a" style={{ marginLeft: 10 }} />
            </View>
            <View style={styles.dateHelpers}>
              <TouchableOpacity
                style={styles.dateHelperChip}
                onPress={() => setDate(0)}
              >
                <Text style={styles.dateHelperText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateHelperChip}
                onPress={() => setDate(1)}
              >
                <Text style={styles.dateHelperText}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateHelperChip}
                onPress={() => setDate(7)}
              >
                <Text style={styles.dateHelperText}>Next Week</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    paddingTop: 40,
    gap: 24,
    paddingBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    color: "#a1a1aa",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
  },
  chipText: {
    color: "#a1a1aa",
    fontSize: 14,
    fontWeight: "500",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateHelpers: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  dateHelperChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#27272a",
  },
  dateHelperText: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
