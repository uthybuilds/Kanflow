import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Trophy, Flame, Plus, Check, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HabitTrackerWidget = () => {
  const [habits, setHabits] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const saved = await AsyncStorage.getItem("kanflow_habits");
      if (saved) {
        setHabits(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load habits", error);
    }
  };

  const saveHabits = async (newHabits) => {
    setHabits(newHabits);
    try {
      await AsyncStorage.setItem("kanflow_habits", JSON.stringify(newHabits));
    } catch (error) {
      console.error("Failed to save habits", error);
    }
  };

  const toggleHabit = (id) => {
    const updated = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            completed: !h.completed,
            streak: !h.completed ? h.streak + 1 : h.streak - 1,
          }
        : h,
    );
    saveHabits(updated);
  };

  const addNewHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: newHabitName.trim(),
      completed: false,
      streak: 0,
    };

    saveHabits([...habits, newHabit]);
    setNewHabitName("");
    setIsAdding(false);
  };

  const deleteHabit = (id) => {
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Flame size={18} color="#FF9F0A" />
          </View>
          <Text style={styles.title}>Habits</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsAdding(!isAdding)}
          style={styles.addButton}
        >
          {isAdding ? (
            <X size={20} color="#FF9F0A" />
          ) : (
            <Plus size={20} color="#FF9F0A" />
          )}
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New habit..."
            placeholderTextColor="#8E8E93"
            value={newHabitName}
            onChangeText={setNewHabitName}
            autoFocus
            onSubmitEditing={addNewHabit}
          />
          <TouchableOpacity
            onPress={addNewHabit}
            disabled={!newHabitName.trim()}
            style={[
              styles.addConfirmButton,
              !newHabitName.trim() && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.addConfirmText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listContainer}>
        {habits.length === 0 && !isAdding ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits yet</Text>
          </View>
        ) : (
          habits.map((habit, index) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitRow,
                index === habits.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => toggleHabit(habit.id)}
              onLongPress={() => deleteHabit(habit.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  habit.completed && styles.checkboxChecked,
                ]}
              >
                {habit.completed && <Check size={14} color="#000" />}
              </View>
              <View style={styles.habitContent}>
                <Text
                  style={[
                    styles.habitName,
                    habit.completed && styles.habitNameCompleted,
                  ]}
                >
                  {habit.name}
                </Text>
                {habit.streak > 0 && (
                  <Text style={styles.streakText}>
                    {habit.streak} day streak
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1E",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 159, 10, 0.1)", // Orange tint
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9F0A", // Apple Orange
  },
  addButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 15,
  },
  addConfirmButton: {
    backgroundColor: "#FF9F0A",
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addConfirmText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: "#2C2C2E", // Slightly lighter for the list group
    borderRadius: 16,
    overflow: "hidden",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#38383A", // Separator color
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#8E8E93",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF9F0A",
    borderColor: "#FF9F0A",
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  habitNameCompleted: {
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  streakText: {
    fontSize: 12,
    color: "#FF9F0A",
    marginTop: 2,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
  },
});
