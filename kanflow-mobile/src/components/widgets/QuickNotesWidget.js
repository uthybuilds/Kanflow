import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StickyNote } from "lucide-react-native";
import { supabase } from "../../lib/supabase";

export const QuickNotesWidget = () => {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) loadNote(user.id);
    });
  }, []);

  const loadNote = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("integrations")
        .select("data")
        .eq("user_id", userId)
        .eq("provider", "quick_notes")
        .single();

      if (data?.data?.content) {
        setNote(data.data.content);
      }
    } catch (error) {
      console.log("Error loading note:", error);
    }
  };

  const saveNote = async (text) => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("integrations").upsert(
        {
          user_id: user.id,
          provider: "quick_notes",
          data: { content: text },
        },
        { onConflict: "user_id,provider" },
      );
    } catch (error) {
      console.log("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) saveNote(note);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [note, user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <StickyNote size={18} color="#FFD60A" />
          </View>
          <Text style={styles.title}>Quick Notes</Text>
        </View>
        <View style={styles.statusIndicator}>
          {saving ? (
            <Text style={styles.statusText}>Saving...</Text>
          ) : (
            <Text style={styles.statusText}>Saved</Text>
          )}
        </View>
      </View>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Type something..."
        placeholderTextColor="#8E8E93"
        value={note}
        onChangeText={setNote}
      />
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
    minHeight: 180,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "rgba(255, 214, 10, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD60A", // Apple Yellow
  },
  statusText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    textAlignVertical: "top",
    lineHeight: 22,
  },
});
