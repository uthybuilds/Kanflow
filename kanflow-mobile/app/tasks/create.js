import { useState, useLayoutEffect } from "react";
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
import { Stack, router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { taskService } from "../../src/services/taskService";
import { supabase } from "../../src/lib/supabase";
import { X, Calendar } from "lucide-react-native";

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
    <X size={24} color="#fff" />
  </TouchableOpacity>
);

export default function CreateTaskScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "New Task",
      headerStyle: { backgroundColor: "#09090b" },
      headerTintColor: "#fff",
      presentation: "modal",
      headerLeft: () => <HeaderLeft />,
    });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title is required");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await taskService.createTask({
        title,
        description,
        priority,
        status,
        due_date: dueDate || null,
        user_id: user.id,
      });

      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const setDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    setDueDate(date.toISOString().split("T")[0]);
  };

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
              placeholder="What needs to be done?"
              placeholderTextColor="#71717a"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details..."
              placeholderTextColor="#71717a"
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
            <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
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
              style={styles.createButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Create Task</Text>
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
  content: {
    padding: 20,
    paddingTop: 40, // Extra padding for header clearance
    gap: 24,
    paddingBottom: 40,
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
  buttonContainer: {
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
