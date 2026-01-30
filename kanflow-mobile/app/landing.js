import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Logo } from "../src/components/Logo";

const { width, height } = Dimensions.get("window");

// Large Logo Component for Welcome Screen
const LargeLogo = () => (
  <View style={styles.logoContainer}>
    <Logo size={120} />
  </View>
);

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Ambient Background (Web Design Consistency) */}
      <View style={styles.ambientContainer} pointerEvents="none">
        <View style={styles.ambientBlue} />
        <View style={styles.ambientPurple} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.centerContent}>
          <LargeLogo />
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandText}>KanFlow</Text>
          <Text style={styles.taglineText}>
            Streamline your workflow with precision.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/auth/login")}
            activeOpacity={0.9}
          >
            <Text style={styles.getStartedText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  ambientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  ambientBlue: {
    position: "absolute",
    top: -100,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    backgroundColor: "rgba(59, 130, 246, 0.08)", // Blue-500/8
    borderRadius: 200,
    opacity: 0.6,
    transform: [{ scale: 1.5 }],
  },
  ambientPurple: {
    position: "absolute",
    bottom: -100,
    right: -100,
    width: 400,
    height: 400,
    backgroundColor: "rgba(168, 85, 247, 0.05)", // Purple-500/5
    borderRadius: 200,
    opacity: 0.4,
    transform: [{ scale: 1.5 }],
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: height * 0.15,
    paddingBottom: 60,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  welcomeText: {
    fontSize: 24,
    color: "#a1a1aa", // zinc-400
    marginBottom: 8,
    fontWeight: "400",
  },
  brandText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    letterSpacing: -1,
  },
  taglineText: {
    fontSize: 16,
    color: "#71717a", // zinc-500
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  getStartedButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#fff", // White button for high contrast on welcome
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  getStartedText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});
