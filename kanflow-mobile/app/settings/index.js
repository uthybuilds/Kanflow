import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Github,
  Gitlab,
  Figma,
  Slack,
  LogOut,
  ChevronRight,
  Globe,
  Activity,
  Zap,
  Video,
  MessageCircle,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../src/lib/supabase";
import { integrationService } from "../../src/services/integrationService";
import { taskService } from "../../src/services/taskService";
import { SafeAreaView } from "react-native-safe-area-context";

// Custom Confirmation Modal Component
const ConfirmationModal = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  isDestructive = false,
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonCancel]}
            onPress={onCancel}
          >
            <Text style={styles.modalButtonTextCancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              isDestructive
                ? styles.modalButtonDestructive
                : styles.modalButtonPrimary,
            ]}
            onPress={onConfirm}
          >
            <Text
              style={[
                styles.modalButtonText,
                isDestructive && styles.modalButtonTextDestructive,
              ]}
            >
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const InputModal = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Save",
  loading = false,
  children,
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onCancel}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalOverlay}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        {message && <Text style={styles.modalMessage}>{message}</Text>}

        <View style={{ width: "100%", marginBottom: 20 }}>{children}</View>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonCancel]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.modalButtonTextCancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.modalButtonText}>{confirmText}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const IntegrationSetupModal = ({
  visible,
  onClose,
  onSave,
  integrationTitle,
  fields = [],
}) => {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setFormValues({});
  }, [visible]);

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    const missing = fields.find((f) => f.required && !formValues[f.key]);
    if (missing) {
      Alert.alert("Error", `Please enter your ${missing.label}`);
      return;
    }
    onSave(formValues);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.setupModalContent}>
          <View style={styles.setupModalHeader}>
            <Text style={styles.setupModalTitle}>
              Connect {integrationTitle}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.setupModalBody}>
            <Text style={styles.setupModalDesc}>
              Enter your credentials to enable this integration.
            </Text>

            {fields.map((field) => (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label.toUpperCase()}</Text>
                <TextInput
                  style={styles.input}
                  value={formValues[field.key] || ""}
                  onChangeText={(text) => handleChange(field.key, text)}
                  placeholder={field.placeholder}
                  placeholderTextColor="#52525b"
                  secureTextEntry={field.secure}
                  autoCapitalize="none"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.setupModalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isGuest, setIsGuest] = useState(false);
  const [integrations, setIntegrations] = useState({
    github: false,
    gitlab: false,
    figma: false,
    sentry: false,
    slack: false,
    discord: false,
    zoom: false,
  });

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Account Form States
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
    isDestructive: false,
    confirmText: "Confirm",
  });

  const [setupModalConfig, setSetupModalConfig] = useState({
    visible: false,
    key: null,
    title: "",
    fields: [],
  });

  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [verifyEmailVisible, setVerifyEmailVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const INTEGRATION_FIELDS = {
    github: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "ghp_...",
        secure: true,
        required: true,
      },
    ],
    gitlab: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "glpat-...",
        secure: true,
        required: true,
      },
    ],
    slack: [
      {
        key: "webhookUrl",
        label: "Webhook URL",
        placeholder: "https://hooks.slack.com/...",
        secure: false,
        required: true,
      },
    ],
    discord: [
      {
        key: "webhookUrl",
        label: "Webhook URL",
        placeholder: "https://discord.com/api/webhooks/...",
        secure: false,
        required: true,
      },
    ],
    figma: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "figd_...",
        secure: true,
        required: true,
      },
    ],
    sentry: [
      {
        key: "authToken",
        label: "Auth Token",
        placeholder: "Enter your auth token",
        secure: true,
        required: true,
      },
    ],
    zoom: [
      {
        key: "personalLink",
        label: "Personal Link",
        placeholder: "https://zoom.us/my/...",
        secure: false,
        required: true,
      },
    ],
  };

  useEffect(() => {
    fetchUser();
    fetchIntegrations();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadAvatar(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Error picking image: " + error.message);
    }
  };

  const uploadAvatar = async (imageAsset) => {
    try {
      setUploadingAvatar(true);
      if (!user?.id) throw new Error("No user logged in");

      const arrayBuffer = await fetch(imageAsset.uri).then((res) =>
        res.arrayBuffer(),
      );

      const fileExt = imageAsset.uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: imageAsset.mimeType ?? "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      await fetchUser();
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      if (error.message && error.message.includes("Bucket not found")) {
        Alert.alert(
          "Configuration Error",
          "The 'avatars' storage bucket does not exist in your Supabase project. Please create a public bucket named 'avatars'.",
        );
      } else {
        Alert.alert("Error", "Error uploading avatar: " + error.message);
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fetchUser = async () => {
    try {
      const guestMode = await AsyncStorage.getItem("guest_mode");
      if (guestMode === "true") {
        setIsGuest(true);
        setUser({
          id: "guest",
          email: "guest@example.com",
          user_metadata: { full_name: "Guest User" },
        });
        setFullName("Guest User");
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrations = async () => {
    const data = await integrationService.getIntegrations();
    setIntegrations(data);
  };

  const handleUpdateProfile = async () => {
    if (isGuest) {
      Alert.alert("Guest Mode", "You cannot update profile in guest mode.");
      return;
    }
    if (!fullName.trim()) {
      Alert.alert("Error", "Full Name cannot be empty.");
      return;
    }
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    setSavingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      Alert.alert(
        "Check your email",
        `Confirmation links have been sent to both ${user.email} and ${newEmail}. Please click both to verify the change.`,
        [{ text: "OK", onPress: () => setIsEditingEmail(false) }],
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSignOut = async () => {
    if (isGuest) {
      await AsyncStorage.removeItem("guest_mode");
      router.replace("/landing");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
    else router.replace("/landing");
  };

  const handlePasswordReset = () => {
    setChangePasswordVisible(true);
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setChangePasswordVisible(false);
      setNewPassword("");
      Alert.alert("Success", "Password updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!verificationCode) return;
    setVerifyingEmail(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: newEmail,
        token: verificationCode,
        type: "email_change",
      });
      if (error) throw error;
      setVerifyEmailVisible(false);
      setVerificationCode("");
      Alert.alert("Success", "Email updated successfully!");

      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      setIsEditingEmail(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const isIntegrationActive = (key) => {
    const integration = integrations[key];
    if (!integration) return false;
    if (typeof integration === "boolean") return integration;
    return integration.connected;
  };

  const handleIntegrationAction = (key, title) => {
    const active = isIntegrationActive(key);

    if (active) {
      // Disconnect flow
      setModalConfig({
        visible: true,
        title: `Disconnect ${title}`,
        message: `Are you sure you want to disconnect ${title}? This will stop all sync features.`,
        confirmText: "Disconnect",
        isDestructive: true,
        onConfirm: async () => {
          setModalConfig((prev) => ({ ...prev, visible: false }));
          const updated = await integrationService.disconnectIntegration(key);
          setIntegrations(updated);
        },
      });
    } else {
      // Connect flow
      setSetupModalConfig({
        visible: true,
        key,
        title,
        fields: INTEGRATION_FIELDS[key] || [],
      });
    }
  };

  const handleSetupSave = async (config) => {
    const { key } = setupModalConfig;
    const updated = await integrationService.connectIntegration(key, config);
    setIntegrations(updated);
    setSetupModalConfig((prev) => ({ ...prev, visible: false }));
    Alert.alert("Success", `${setupModalConfig.title} connected successfully!`);
  };

  const handleDeleteAllTasks = () => {
    if (isDeleting) return;

    setModalConfig({
      visible: true,
      title: "Delete All Tasks",
      message:
        "Are you sure you want to delete all tasks? This action cannot be undone.",
      confirmText: "Delete",
      isDestructive: true,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, visible: false }));
        setIsDeleting(true);
        try {
          await taskService.deleteAllTasks();
          Alert.alert("Success", "All tasks have been deleted.", [
            {
              text: "OK",
              onPress: () => {
                router.dismissAll();
                router.replace("/");
              },
            },
          ]);
        } catch (error) {
          Alert.alert("Error", error.message);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    setModalConfig({
      visible: true,
      title: "Delete Account",
      message:
        "Are you sure you want to delete your account? This will permanently remove all your data.",
      confirmText: "Delete Account",
      isDestructive: true,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, visible: false }));
        try {
          await taskService.deleteAllTasks();
          await supabase.auth.signOut();
          router.replace("/landing");
        } catch (error) {
          Alert.alert("Error", error.message);
        }
      },
    });
  };

  const tabs = ["Profile", "Integrations", "Account"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Public Profile</Text>
              <Text style={styles.sectionSubtitle}>
                Manage how you appear to other users across the workspace.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.avatarSection}>
                <TouchableOpacity
                  style={styles.avatarLarge}
                  onPress={pickImage}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <ActivityIndicator color="#fff" />
                  ) : user?.user_metadata?.avatar_url ? (
                    <Image
                      source={{ uri: user.user_metadata.avatar_url }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarTextLarge}>
                      {user?.user_metadata?.full_name
                        ? Array.from(
                            user.user_metadata.full_name,
                          )[0].toUpperCase()
                        : user?.email?.charAt(0).toUpperCase() || "U"}
                    </Text>
                  )}
                  <View style={styles.editAvatarBadge}>
                    <User size={12} color="#fff" />
                  </View>
                </TouchableOpacity>
                <View style={styles.avatarInfo}>
                  <Text style={styles.label}>Profile Photo</Text>
                  <Text style={styles.helperText}>
                    Click the icon to upload a new photo. Recommended size:
                    400x400px.
                  </Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#52525b"
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case "Integrations":
        return (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Integrations</Text>
              <Text style={styles.sectionSubtitle}>
                Connect your favorite tools to automate your workflow. Settings
                are automatically saved and synced across your devices.
              </Text>
            </View>

            <View style={styles.integrationsGrid}>
              {renderIntegrationCard(
                Github,
                "GitHub",
                "Import issues as tasks and sync status changes.",
                "github",
              )}
              {renderIntegrationCard(
                Gitlab,
                "GitLab",
                "Sync issues from GitLab projects to your board.",
                "gitlab",
                "#fc6d26",
              )}
              {renderIntegrationCard(
                Slack,
                "Slack",
                "Send notifications to a channel when tasks are updated.",
                "slack",
                "#E01E5A",
              )}
              {renderIntegrationCard(
                MessageCircle,
                "Discord",
                "Post task updates to a Discord server channel.",
                "discord",
                "#5865F2",
              )}
              {renderIntegrationCard(
                Figma,
                "Figma",
                "Link Figma files to tasks and view previews.",
                "figma",
                "#a259ff",
              )}
              {renderIntegrationCard(
                Activity,
                "Sentry",
                "Create tasks from Sentry issues automatically.",
                "sentry",
                "#362d59",
              )}
              {renderIntegrationCard(
                Video,
                "Zoom",
                "Attach Zoom meeting links to your tasks.",
                "zoom",
                "#2D8CFF",
              )}
            </View>
          </View>
        );

      case "Account":
        if (isGuest) {
          return (
            <View style={styles.tabContent}>
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionTitle}>Guest Account</Text>
                <Text style={styles.sectionSubtitle}>
                  You are currently using a guest account. Sign up to save your
                  data permanently.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.button, { marginTop: 24 }]}
                onPress={handleSignOut}
              >
                <Text style={styles.buttonText}>Sign Up / Login</Text>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <Text style={styles.sectionSubtitle}>
                Manage your account credentials and security preferences.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>EMAIL ADDRESS</Text>
                  <TouchableOpacity
                    onPress={() => setIsEditingEmail(!isEditingEmail)}
                  >
                    <Text style={styles.linkText}>
                      {isEditingEmail ? "Cancel" : "Change Email"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isEditingEmail ? (
                  <View>
                    <TextInput
                      style={styles.input}
                      value={newEmail}
                      onChangeText={setNewEmail}
                      placeholder="Enter new email address"
                      placeholderTextColor="#52525b"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity
                        style={[styles.saveButton, { marginTop: 12, flex: 1 }]}
                        onPress={handleChangeEmail}
                        disabled={savingEmail}
                      >
                        {savingEmail ? (
                          <ActivityIndicator color="#000" />
                        ) : (
                          <Text style={styles.saveButtonText}>
                            Update Email
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.saveButton,
                          {
                            marginTop: 12,
                            backgroundColor: "#27272a",
                            flex: 1,
                          },
                        ]}
                        onPress={() => setVerifyEmailVisible(true)}
                      >
                        <Text
                          style={[styles.saveButtonText, { color: "#a1a1aa" }]}
                        >
                          I have a code
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={[styles.input, styles.disabledInput]}
                      value={user?.email}
                      editable={false}
                    />
                    <Text style={styles.helperText}>
                      Changing your email will require re-authentication for
                      security.
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <TouchableOpacity
                  style={styles.actionInput}
                  onPress={() => setChangePasswordVisible(true)}
                >
                  <Text style={styles.actionInputText}>Change Password</Text>
                  <Lock size={16} color="#52525b" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dangerZone}>
              <View style={styles.dangerHeader}>
                <Trash2 size={16} color="#ef4444" />
                <Text style={styles.dangerTitle}>Danger Zone</Text>
              </View>

              <TouchableOpacity
                style={[styles.dangerButton, isDeleting && { opacity: 0.5 }]}
                onPress={handleDeleteAllTasks}
                disabled={isDeleting}
              >
                <View>
                  <Text style={styles.dangerButtonTitle}>Delete All Tasks</Text>
                  <Text style={styles.dangerButtonDesc}>
                    {isDeleting
                      ? "Deleting..."
                      : "Permanently remove all tasks from your board"}
                  </Text>
                </View>
                <View style={styles.dangerIconBox}>
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={handleDeleteAccount}
              >
                <View>
                  <Text style={styles.dangerButtonTitle}>Delete Account</Text>
                  <Text style={styles.dangerButtonDesc}>
                    Permanently delete your account and all data
                  </Text>
                </View>
                <View style={styles.dangerIconBox}>
                  <Activity size={16} color="#ef4444" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dangerButton, { marginTop: 16 }]}
                onPress={handleSignOut}
              >
                <View>
                  <Text style={styles.dangerButtonTitle}>Sign Out</Text>
                  <Text style={styles.dangerButtonDesc}>
                    Log out of your session on this device
                  </Text>
                </View>
                <LogOut size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  const renderIntegrationCard = (
    Icon,
    title,
    desc,
    key,
    iconColor = "#fff",
  ) => {
    const isActive = isIntegrationActive(key);
    return (
      <View style={styles.integrationCard}>
        <View style={styles.integrationHeader}>
          <View style={styles.integrationIconBox}>
            <Icon size={24} color={iconColor} />
          </View>
          <View style={styles.integrationTitleBox}>
            <Text style={styles.integrationTitle}>{title}</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? "#10b981" : "#52525b" },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? "#10b981" : "#52525b" },
                ]}
              >
                {isActive ? "Active" : "Not connected"}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.integrationDesc}>{desc}</Text>
        <View style={styles.integrationFooter}>
          <TouchableOpacity
            style={styles.saveButtonSmall}
            onPress={() => handleIntegrationAction(key, title)}
          >
            <Text style={styles.saveButtonTextSmall}>
              {isActive ? "Disconnect" : "Connect"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.segmentedControlContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.segmentButton,
                activeTab === tab && styles.activeSegmentButton,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === tab && styles.activeSegmentText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>
      </KeyboardAvoidingView>

      <ConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        onCancel={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        isDestructive={modalConfig.isDestructive}
      />

      <InputModal
        visible={changePasswordVisible}
        title="Change Password"
        onCancel={() => {
          setChangePasswordVisible(false);
          setNewPassword("");
        }}
        onConfirm={handleChangePassword}
        confirmText="Update Password"
        loading={savingPassword}
      >
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          placeholderTextColor="#52525b"
          secureTextEntry
        />
      </InputModal>

      <InputModal
        visible={verifyEmailVisible}
        title="Verify Email Change"
        message={`Enter the code sent to ${newEmail}`}
        onCancel={() => {
          setVerifyEmailVisible(false);
          setVerificationCode("");
        }}
        onConfirm={handleVerifyEmailChange}
        confirmText="Verify Code"
        loading={verifyingEmail}
      >
        <TextInput
          style={[
            styles.input,
            { textAlign: "center", fontSize: 24, letterSpacing: 4 },
          ]}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="12345678"
          placeholderTextColor="#52525b"
          keyboardType="number-pad"
          maxLength={10}
        />
      </InputModal>

      <IntegrationSetupModal
        visible={setupModalConfig.visible}
        onClose={() =>
          setSetupModalConfig((prev) => ({ ...prev, visible: false }))
        }
        onSave={handleSetupSave}
        integrationTitle={setupModalConfig.title}
        fields={setupModalConfig.fields}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  setupModalContent: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  setupModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  setupModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  setupModalBody: {
    marginBottom: 24,
  },
  setupModalDesc: {
    fontSize: 14,
    color: "#a1a1aa",
    marginBottom: 20,
    lineHeight: 20,
  },
  setupModalFooter: {
    flexDirection: "row",
    gap: 12,
  },
  modalContent: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    width: "100%",
    maxWidth: 320,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 13,
    color: "#a1a1aa",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 18,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#27272a",
  },
  modalButtonPrimary: {
    backgroundColor: "#3b82f6",
  },
  modalButtonDestructive: {
    backgroundColor: "#ef4444",
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  modalButtonTextCancel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  modalButtonTextDestructive: {
    color: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#000000", // Deep black background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e4e4e7",
  },
  segmentedControlContainer: {
    flexDirection: "row",
    backgroundColor: "#18181b",
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  activeSegmentButton: {
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#71717a",
  },
  activeSegmentText: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    paddingBottom: 40,
  },
  sectionHeaderContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#09090b", // zinc-950
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 20,
    marginBottom: 24,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    position: "relative",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarTextLarge: {
    fontSize: 32,
    color: "#a1a1aa",
    fontWeight: "600",
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#27272a",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#09090b",
  },
  avatarInfo: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#71717a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  linkText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: "#52525b",
    lineHeight: 18,
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  disabledInput: {
    color: "#71717a",
    backgroundColor: "#09090b",
  },
  actionInput: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionInputText: {
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#27272a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  integrationsGrid: {
    gap: 16,
  },
  integrationCard: {
    backgroundColor: "#09090b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    padding: 20,
  },
  integrationHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  integrationIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
    marginRight: 16,
  },
  integrationTitleBox: {
    justifyContent: "center",
  },
  integrationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  integrationDesc: {
    color: "#71717a",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  integrationFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  saveButtonSmall: {
    backgroundColor: "#18181b",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  saveButtonTextSmall: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  dangerZone: {
    marginTop: 32,
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dangerTitle: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dangerButtonTitle: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  dangerButtonDesc: {
    color: "#7f1d1d",
    fontSize: 12,
  },
  dangerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
