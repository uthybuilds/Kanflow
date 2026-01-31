import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Stack, router } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { StatusBar } from "expo-status-bar";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { Svg, Rect, Path, Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

// Web-aligned Logo Component
const AuthLogo = () => (
  <View style={styles.logoContainer}>
    <LinearGradient
      colors={["#27272a", "#18181b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.logoBox}
    >
      <Svg width={24} height={24} viewBox="0 0 40 40" fill="none">
        <Rect width="40" height="40" rx="8" fill="transparent" />
        <Path
          d="M12 28V12"
          stroke="#e4e4e7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M20 28V16"
          stroke="#e4e4e7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M28 28V20"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Circle cx="28" cy="14" r="2" fill="#3b82f6" />
      </Svg>
    </LinearGradient>
  </View>
);

export default function AuthScreen() {
  const [view, setView] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    setErrorMsg("");
    if (!email || !password || (view === "signup" && !fullName)) {
      const msg = "Please fill in all fields";
      setErrorMsg(msg);
      if (Platform.OS !== "web") Alert.alert("Error", msg);
      return;
    }

    setLoading(true);
    try {
      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          router.replace("/");
        } else {
          // Explicitly construct the URL for web compatibility
          router.push({ pathname: "/auth/verify", params: { email } });
        }
      }
    } catch (error) {
      let msg = error.message;
      // If rate limited, it usually means the previous "silent" attempts worked and sent emails.
      // We should treat this as a "soft success" and guide the user to verify.
      if (msg.includes("rate limit") || msg.includes("Too many")) {
        if (Platform.OS !== "web") {
          Alert.alert(
            "Code Already Sent",
            "It looks like you've already requested a verification code recently. Please check your email.",
            [
              {
                text: "Enter Code",
                onPress: () =>
                  router.push({ pathname: "/auth/verify", params: { email } }),
              },
            ],
          );
        } else {
          // On web, we can just show a more helpful message or auto-redirect
          msg =
            "We've already sent a verification code to this email. Please check your inbox.";
          // Optional: Auto-redirect after a delay?
          // For now, let's show the manual link prominently by setting the specific error message
          setErrorMsg(msg);
          return;
        }
      }
      setErrorMsg(msg);
      if (Platform.OS !== "web") Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await AsyncStorage.setItem("guest_mode", "true");
      router.replace("/");
    } catch (e) {
      console.error("Failed to set guest mode:", e);
      Alert.alert("Error", "Failed to enter guest mode");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Ambient Background (Simulating Web Design) */}
      <View style={styles.ambientContainer} pointerEvents="none">
        <View style={styles.ambientBlue} />
        <View style={styles.ambientPurple} />
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/landing")
        }
      >
        <ArrowLeft size={24} color="#a1a1aa" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={{ alignItems: "center" }}>
              <AuthLogo />
              <Text style={styles.title}>
                {view === "login" ? "Welcome back" : "Create your account"}
              </Text>
              <Text style={styles.subtitle}>
                {view === "login"
                  ? "Enter your credentials to access your workspace"
                  : "Start managing your projects with KanFlow"}
              </Text>
            </View>

            <View style={styles.form}>
              {view === "signup" && (
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#52525b"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#52525b"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="#52525b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#71717a" />
                    ) : (
                      <Eye size={20} color="#71717a" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {errorMsg ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                  {(errorMsg.includes("Too many attempts") ||
                    errorMsg.includes("already sent")) &&
                    view === "signup" && (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/auth/verify",
                            params: { email },
                          })
                        }
                        style={{ marginTop: 8 }}
                      >
                        <Text
                          style={[
                            styles.link,
                            { textAlign: "center", fontSize: 13 },
                          ]}
                        >
                          Go to Verification Page
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              ) : null}

              {view === "login" && (
                <TouchableOpacity
                  onPress={() => router.push("/auth/forgot-password")}
                  style={{
                    alignSelf: "flex-end",
                    marginBottom: 24,
                    marginTop: -16,
                  }}
                >
                  <Text style={{ color: "#a1a1aa", fontSize: 14 }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={handleAuth}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {view === "login" ? "Sign in" : "Create account"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#27272a", marginTop: 12 },
                ]}
                onPress={handleGuestLogin}
                activeOpacity={0.9}
              >
                <Text style={styles.buttonText}>Continue as Guest</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {view === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </Text>
                <TouchableOpacity
                  onPress={() => setView(view === "login" ? "signup" : "login")}
                >
                  <Text style={styles.link}>
                    {view === "login" ? "Sign up" : "Sign in"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Blue-500/10
    borderRadius: 200,
    opacity: 0.5,
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
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#a1a1aa", // zinc-400
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    backgroundColor: "rgba(24, 24, 27, 0.5)", // zinc-900/50
    borderWidth: 1,
    borderColor: "#27272a", // zinc-800
    borderRadius: 8, // rounded-lg
    padding: 14, // px-4 py-3 approx
    fontSize: 14, // text-sm
    color: "#fff",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  button: {
    backgroundColor: "#2563eb", // blue-600
    height: 44, // py-2 approx
    borderRadius: 8, // rounded-lg
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500", // font-medium
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  footerText: {
    color: "#71717a", // zinc-500 (web might be zinc-400/500)
    fontSize: 14,
  },
  link: {
    color: "#60a5fa", // blue-400
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500/10
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    marginBottom: 8,
  },
  errorText: {
    color: "#ef4444", // red-500
    fontSize: 14,
    textAlign: "center",
  },
});
