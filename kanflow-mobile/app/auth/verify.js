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
import { Stack, router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: "signup",
      });
      if (error) throw error;

      Alert.alert("Success", "Email verified successfully!", [
        { text: "Continue", onPress: () => router.replace("/") },
      ]);
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
        <Text style={styles.title}>Verify Email</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Enter the code sent to {email}</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor="#52525b"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={10}
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={async () => {
            const { error } = await supabase.auth.resend({
              type: "signup",
              email: email,
            });
            if (error) {
              if (error.message.includes("rate limit")) {
                Alert.alert(
                  "Please Wait",
                  "We recently sent a code. Please check your spam folder or wait a moment before retrying.",
                );
              } else {
                Alert.alert("Error", error.message);
              }
            } else {
              Alert.alert(
                "Sent",
                "New code sent! Please check your inbox and spam folder.",
              );
            }
          }}
        >
          <Text style={styles.resendText}>Resend Code</Text>
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
    borderRadius: 20,
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
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 4,
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
    marginBottom: 24,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
});
