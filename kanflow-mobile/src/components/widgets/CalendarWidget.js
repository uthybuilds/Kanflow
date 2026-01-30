import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar as CalendarIcon, Plus } from "lucide-react-native";

export const CalendarWidget = () => {
  const [date] = useState(new Date());

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <CalendarIcon size={18} color="#FF3B30" />
          </View>
          <View>
            <Text style={styles.dayText}>{days[date.getDay()]}</Text>
            <Text style={styles.dateText}>
              {months[date.getMonth()]} {date.getDate()}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <CalendarIcon size={24} color="#3A3A3C" />
          </View>
          <Text style={styles.emptyText}>No events today</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Add Event</Text>
          </TouchableOpacity>
        </View>
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
    minHeight: 180,
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
  dayText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  dateText: {
    fontSize: 13,
    color: "#8E8E93", // iOS System Gray
    marginTop: 2,
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)", // Red with opacity
    borderRadius: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  emptyState: {
    alignItems: "center",
    gap: 12,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 15,
    fontWeight: "500",
  },
  linkText: {
    color: "#FF3B30", // Apple Red
    fontSize: 15,
    fontWeight: "600",
  },
});
