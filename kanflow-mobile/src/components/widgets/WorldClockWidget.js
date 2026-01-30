import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Globe } from "lucide-react-native";

export const WorldClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [clocks] = useState([
    { city: "New York", zone: "America/New_York" },
    { city: "London", zone: "Europe/London" },
    { city: "Tokyo", zone: "Asia/Tokyo" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date, zone) => {
    try {
      return date.toLocaleTimeString("en-US", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "--:--";
    }
  };

  const getDayOffset = (date, zone) => {
    try {
      const localDay = date.getDay();
      const targetDate = new Date(
        date.toLocaleString("en-US", { timeZone: zone }),
      );
      const targetDay = targetDate.getDay();

      if (localDay === targetDay) return "Today";
      if ((localDay + 1) % 7 === targetDay) return "Tomorrow";
      if ((localDay - 1 + 7) % 7 === targetDay) return "Yesterday";
      return "";
    } catch (e) {
      return "";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Globe size={18} color="#32ADE6" />
          </View>
          <Text style={styles.title}>World Clock</Text>
        </View>
      </View>

      <View style={styles.list}>
        {clocks.map((clock, index) => (
          <View
            key={index}
            style={[
              styles.clockItem,
              index === clocks.length - 1 && styles.lastItem,
            ]}
          >
            <View>
              <View style={styles.cityRow}>
                <Text style={styles.cityText}>{clock.city}</Text>
                <Text style={styles.offsetText}>
                  {getDayOffset(time, clock.zone)}
                </Text>
              </View>
              <Text style={styles.zoneText}>{clock.zone}</Text>
            </View>
            <Text style={styles.timeText}>{formatTime(time, clock.zone)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1E", // iOS System Gray 6
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2C2C2E", // iOS System Gray 5
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  list: {
    backgroundColor: "#2C2C2E", // iOS System Gray 5
    borderRadius: 16,
    overflow: "hidden",
  },
  clockItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#3A3A3C", // Separator color
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cityText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 16,
  },
  offsetText: {
    fontSize: 13,
    color: "#8E8E93", // iOS System Gray
  },
  zoneText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "400",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"], // Monospaced numbers
  },
});
