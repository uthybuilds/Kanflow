import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Droplets, Plus, Minus } from "lucide-react-native";

export const WaterWidget = () => {
  const [glasses, setGlasses] = useState(0);
  const target = 8;

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const savedGlasses = await AsyncStorage.getItem("daily_water_glasses");
      const savedDate = await AsyncStorage.getItem("daily_water_date");
      const today = new Date().toDateString();

      if (savedDate === today && savedGlasses) {
        setGlasses(parseInt(savedGlasses));
      } else {
        setGlasses(0);
        await AsyncStorage.setItem("daily_water_date", today);
      }
    } catch (error) {
      console.error("Failed to load water data", error);
    }
  };

  const updateGlasses = async (newValue) => {
    if (newValue < 0) return;
    setGlasses(newValue);
    try {
      await AsyncStorage.setItem("daily_water_glasses", newValue.toString());
      await AsyncStorage.setItem("daily_water_date", new Date().toDateString());
    } catch (error) {
      console.error("Failed to save water data", error);
    }
  };

  const percentage = Math.min((glasses / target) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Droplets size={18} color="#0A84FF" />
          </View>
          <Text style={styles.title}>Water</Text>
        </View>
        <Text style={styles.targetLabel}>Target: {target}</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.textContainer}>
          <Text style={styles.currentValue}>{glasses}</Text>
          <Text style={styles.unit}>glasses</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => updateGlasses(glasses - 1)}
          disabled={glasses === 0}
          style={styles.controlButton}
        >
          <Minus size={20} color="#0A84FF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => updateGlasses(glasses + 1)}
          style={[styles.controlButton, styles.addButton]}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
    gap: 8,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A84FF", // Apple Blue
  },
  targetLabel: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  mainContent: {
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 12,
  },
  currentValue: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },
  unit: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#2C2C2E", // iOS System Gray 5
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0A84FF",
    borderRadius: 4,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  controlButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#0A84FF",
  },
});
