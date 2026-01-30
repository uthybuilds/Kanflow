import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Slack, Disc, MessageSquare } from "lucide-react-native";
import { supabase } from "../../lib/supabase";

export const TeamCommsWidget = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [slackConfig, setSlackConfig] = useState(null);
  const [discordConfig, setDiscordConfig] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("integrations")
        .select("provider, data")
        .eq("user_id", user.id)
        .in("provider", ["slack", "discord"]);

      if (data) {
        const slack = data.find((d) => d.provider === "slack")?.data;
        const discord = data.find((d) => d.provider === "discord")?.data;
        if (slack?.webhookUrl) setSlackConfig(slack);
        if (discord?.webhookUrl) setDiscordConfig(discord);
      }
    } catch (err) {
      console.error("Failed to load comms config", err);
    }
  };

  const sendUpdate = async (provider) => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    const config = provider === "slack" ? slackConfig : discordConfig;

    if (!config?.webhookUrl) {
      Alert.alert(
        "Not Connected",
        `Please configure ${provider === "slack" ? "Slack" : "Discord"} integration on the web platform first.`,
      );
      return;
    }

    setIsSending(true);
    Keyboard.dismiss();

    try {
      const url = config.webhookUrl;
      const body =
        provider === "slack" ? { text: message } : { content: message };

      const res = await fetch(url, {
        method: "POST",
        headers:
          provider === "discord" ? { "Content-Type": "application/json" } : {},
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to send");

      Alert.alert(
        "Success",
        `Update sent to ${provider === "slack" ? "Slack" : "Discord"}`,
      );
      setMessage("");
    } catch (err) {
      Alert.alert(
        "Error",
        `Failed to send to ${provider === "slack" ? "Slack" : "Discord"}`,
      );
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <MessageSquare size={18} color="#AF52DE" />
          </View>
          <Text style={styles.title}>Team Comms</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What are you working on?"
        placeholderTextColor="#8E8E93"
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={140}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, !slackConfig && styles.disabledButton]}
          onPress={() => sendUpdate("slack")}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <Slack size={16} color={slackConfig ? "#FFFFFF" : "#8E8E93"} />
              <Text
                style={[styles.actionText, !slackConfig && styles.disabledText]}
              >
                Slack
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, !discordConfig && styles.disabledButton]}
          onPress={() => sendUpdate("discord")}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <Disc size={16} color={discordConfig ? "#FFFFFF" : "#8E8E93"} />
              <Text
                style={[
                  styles.actionText,
                  !discordConfig && styles.disabledText,
                ]}
              >
                Discord
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
    backgroundColor: "rgba(175, 82, 222, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#AF52DE", // Apple Purple
  },
  input: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 15,
    textAlignVertical: "top",
    marginBottom: 16,
    minHeight: 80,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#AF52DE", // Apple Purple
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#2C2C2E",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledText: {
    color: "#8E8E93",
  },
});
