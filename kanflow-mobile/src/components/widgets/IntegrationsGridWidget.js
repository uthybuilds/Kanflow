import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gitlab, Figma, Activity, CheckCircle2 } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { integrationService } from "../../services/integrationService";

const IntegrationCard = ({
  icon: Icon,
  title,
  desc,
  color,
  connected = false,
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => router.push("/settings")}
  >
    <View style={styles.cardHeader}>
      {connected ? (
        <View style={styles.statusDot} />
      ) : (
        <View style={styles.iconWrapper}>
          <Icon size={24} color={color} />
        </View>
      )}
    </View>
    <View style={styles.cardContent}>
      {connected ? (
        <CheckCircle2 size={32} color="#34C759" />
      ) : (
        <>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{desc}</Text>
        </>
      )}
    </View>
    <View style={styles.cardFooter}>
      <View style={[styles.connectButton, connected && styles.connectedButton]}>
        <Text style={[styles.connectText, connected && styles.connectedText]}>
          {connected ? "No Issues" : "Connect"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export const IntegrationsGridWidget = () => {
  const [integrations, setIntegrations] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadIntegrations();
    }, []),
  );

  const loadIntegrations = async () => {
    const data = await integrationService.getIntegrations();
    setIntegrations(data);
  };

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <IntegrationCard
          icon={Gitlab}
          title="GitLab"
          desc="Sync issues"
          color="#FC6D26"
          connected={integrations.gitlab}
        />
        <IntegrationCard
          icon={Figma}
          title="Figma"
          desc="View files"
          color="#A259FF"
          connected={integrations.figma}
        />
      </View>
      <View style={styles.row}>
        <IntegrationCard
          icon={Activity}
          title="Sentry"
          desc="Monitor errors"
          color="#6C5FC7"
          connected={integrations.sentry}
        />
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/settings")}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: "#2C2C2E", borderWidth: 0 },
              ]}
            >
              <Text style={{ fontSize: 10, color: "#8E8E93" }}>Issues</Text>
            </View>
          </View>
          <View style={[styles.cardContent, { justifyContent: "center" }]}>
            <CheckCircle2 size={32} color="#34C759" />
            <Text style={[styles.cardDesc, { marginTop: 8 }]}>All Clear</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 16,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  card: {
    flex: 1,
    backgroundColor: "#1C1C1E", // iOS System Gray 6
    borderRadius: 22,
    padding: 16,
    height: 180,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    height: 40,
    alignItems: "center",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2C2C2E", // iOS System Gray 5
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 4,
  },
  cardDesc: {
    color: "#8E8E93", // iOS System Gray
    fontSize: 12,
    textAlign: "center",
    maxWidth: 100,
  },
  cardFooter: {
    alignItems: "center",
    height: 30,
    justifyContent: "flex-end",
  },
  connectButton: {
    backgroundColor: "#0A84FF", // iOS Blue
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
    minWidth: 80,
    alignItems: "center",
  },
  connectedButton: {
    backgroundColor: "rgba(52, 199, 89, 0.1)", // Green with opacity
  },
  connectText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  connectedText: {
    color: "#34C759", // iOS Green
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759", // iOS Green
    alignSelf: "flex-end",
  },
});
