import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Timer } from "lucide-react-native";

const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const pausedTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 30);
    } else {
      clearInterval(intervalRef.current);
      pausedTimeRef.current = time;
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    pausedTimeRef.current = 0;
  };

  return { time, isRunning, start, stop, reset };
};

export const StopwatchWidget = () => {
  const { time, isRunning, start, stop, reset } = useStopwatch();

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return (
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {minutes.toString().padStart(2, "0")}
        </Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.timeText}>
          {seconds.toString().padStart(2, "0")}
        </Text>
        <Text style={styles.msText}>
          .{milliseconds.toString().padStart(2, "0")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Timer size={18} color="#FF9F0A" />
          </View>
          <Text style={styles.title}>Stopwatch</Text>
        </View>
      </View>

      <View style={styles.content}>{formatTime(time)}</View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={reset}
          disabled={time === 0}
        >
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            isRunning ? styles.stopButton : styles.startButton,
          ]}
          onPress={isRunning ? stop : start}
        >
          <Text
            style={[
              styles.buttonText,
              isRunning ? styles.stopText : styles.startText,
            ]}
          >
            {isRunning ? "Stop" : "Start"}
          </Text>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
    backgroundColor: "rgba(255, 159, 10, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9F0A",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "300",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  separator: {
    fontSize: 48,
    fontWeight: "300",
    color: "#FFFFFF",
    marginHorizontal: 4,
    marginBottom: 4,
  },
  msText: {
    fontSize: 48,
    fontWeight: "300",
    color: "#8E8E93",
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  resetButton: {
    backgroundColor: "#3A3A3C", // Dark Gray Button
    borderColor: "#3A3A3C",
  },
  startButton: {
    backgroundColor: "rgba(48, 209, 88, 0.2)", // Green Tint
    borderColor: "#30D158",
  },
  stopButton: {
    backgroundColor: "rgba(255, 69, 58, 0.2)", // Red Tint
    borderColor: "#FF453A",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  startText: {
    color: "#30D158",
  },
  stopText: {
    color: "#FF453A",
  },
});
