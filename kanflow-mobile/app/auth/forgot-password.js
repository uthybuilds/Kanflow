import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { ArrowLeft, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "kanflow://auth/reset-password",
      });
      if (error) throw error;

      Alert.alert(
        "Email Sent",
        "Check your email for the password reset link.",
        [{ text: "Back to Login", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#e4e4e7" />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>

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

        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18181b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
