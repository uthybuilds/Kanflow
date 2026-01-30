import { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { taskService } from "../src/services/taskService";
import { supabase } from "../src/lib/supabase";
import {
  Plus,
  LogOut,
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Zap,
  CheckCircle2,
  Settings,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Logo } from "../src/components/Logo";
import { WaterWidget } from "../src/components/widgets/WaterWidget";
import { QuoteWidget } from "../src/components/widgets/QuoteWidget";
import { WorldClockWidget } from "../src/components/widgets/WorldClockWidget";
import { HabitTrackerWidget } from "../src/components/widgets/HabitTrackerWidget";
import { StopwatchWidget } from "../src/components/widgets/StopwatchWidget";
import { QuickNotesWidget } from "../src/components/widgets/QuickNotesWidget";
import { TeamCommsWidget } from "../src/components/widgets/TeamCommsWidget";
import { CalendarWidget } from "../src/components/widgets/CalendarWidget";
import { IntegrationsGridWidget } from "../src/components/widgets/IntegrationsGridWidget";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("Good morning");

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserName(user.user_metadata?.full_name || user.email.split("@")[0]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
      fetchUser();
    }, []),
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchTasks(), fetchUser()]).then(() => {
      setRefreshing(false);
    });
  }, []);

  const handleLogout = async () => {
    try {
      // Clear guest mode flag
      await AsyncStorage.removeItem("guest_mode");
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Redirect to landing page
      router.replace("/landing");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Stats Logic
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const inReviewTasks = tasks.filter((t) => t.status === "review").length;

  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          ((completedTasks * 1.0 +
            inReviewTasks * 0.75 +
            inProgressTasks * 0.5) /
            totalTasks) *
            100,
        );

  const points = completedTasks * 10 + inReviewTasks * 8 + inProgressTasks * 5;

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "#0A84FF"; // Apple Blue
      case "in-progress":
        return "#FF9F0A"; // Apple Orange
      case "done":
        return "#30D158"; // Apple Green
      default:
        return "#8E8E93"; // Apple Gray
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#FF453A"; // Apple Red
      case "medium":
        return "#FF9F0A"; // Apple Orange
      case "low":
        return "#0A84FF"; // Apple Blue
      default:
        return "#8E8E93";
    }
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskRow}
      onPress={() => router.push(`/tasks/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.taskContentContainer}>
        <View style={styles.taskLeft}>
          <View
            style={[
              styles.circularStatus,
              { borderColor: getStatusColor(item.status) },
              item.status === "done" && {
                backgroundColor: getStatusColor(item.status),
              },
            ]}
          >
            {item.status === "done" && <CheckSquare size={12} color="#000" />}
          </View>
          <View style={styles.taskTextContent}>
            <Text
              style={[
                styles.taskTitle,
                item.status === "done" && styles.taskTitleDone,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text style={styles.taskSubtitle} numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.taskRight}>
          {item.due_date && (
            <Text style={styles.dateText}>
              {new Date(item.due_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Text>
          )}
          <View
            style={[
              styles.miniPriorityDot,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const WidgetsSection = () => (
    <View style={styles.widgetsGrid}>
      <HabitTrackerWidget />
      <WaterWidget />
      <StopwatchWidget />
      <QuickNotesWidget />
      <TeamCommsWidget />
      <WorldClockWidget />
      <QuoteWidget />
      <CalendarWidget />
      <IntegrationsGridWidget />
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContent}>
      {/* Welcome Section */}
      <View style={styles.welcomeCardContainer}>
        <LinearGradient
          colors={["#18181b", "#09090b"]}
          style={styles.welcomeCard}
        >
          <View style={styles.ambientBlue} />
          <View style={styles.ambientPurple} />

          <View style={styles.welcomeTextContainer}>
            <Text style={styles.greetingTitle}>
              {greeting}, <Text style={styles.userName}>{userName}</Text>
            </Text>

            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statsLabel}>Overall Progress</Text>
                <Text style={styles.statsValue}>{progressPercentage}%</Text>
              </View>
              <View style={styles.statsDivider} />
              <View>
                <Text style={styles.statsLabel}>Productivity XP</Text>
                <View style={styles.xpRow}>
                  <Text style={[styles.statsValue, { color: "#60a5fa" }]}>
                    {points}
                  </Text>
                  <Text style={styles.xpLabel}>points</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsGrid}>
        <View style={styles.quickStatCard}>
          <View style={styles.quickStatHeader}>
            <View style={styles.quickStatIcon}>
              <Zap size={20} color="#0A84FF" />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.quickStatValue}>{inProgressTasks}</Text>
          <Text style={styles.quickStatLabel}>Tasks in progress</Text>
        </View>

        <View style={styles.quickStatCard}>
          <View style={styles.quickStatHeader}>
            <View style={styles.quickStatIcon}>
              <CheckCircle2 size={20} color="#30D158" />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Done</Text>
            </View>
          </View>
          <Text style={styles.quickStatValue}>{completedTasks}</Text>
          <Text style={styles.quickStatLabel}>Total Completed</Text>
        </View>
      </View>

      {tasks.length > 0 && (
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.logoContainer}>
          <Logo size={28} />
          <Text style={styles.appName}>KanFlow</Text>
        </View>
        <View style={styles.appBarActions}>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={styles.iconButton}
          >
            <Settings size={20} color="#a1a1aa" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <LogOut size={20} color="#a1a1aa" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={WidgetsSection}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
          ListEmptyComponent={null}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tasks/create")}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  appBarActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "#18181b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  headerContent: {
    paddingTop: 20,
    gap: 24,
  },
  welcomeCardContainer: {
    paddingHorizontal: 20,
  },
  welcomeCard: {
    borderRadius: 22,
    borderWidth: 0,
    overflow: "hidden",
    padding: 24,
  },
  ambientBlue: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 100,
  },
  ambientPurple: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    borderRadius: 100,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  userName: {
    color: "#60a5fa",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#71717a",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#27272a",
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  xpLabel: {
    fontSize: 12,
    color: "#71717a",
    fontWeight: "500",
  },
  quickStatsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: "#1C1C1E", // iOS System Gray 6
    borderRadius: 22,
    padding: 20,
    // Removed border to match widgets
  },
  quickStatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  quickStatIcon: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#2C2C2E", // iOS System Gray 5
  },
  badge: {
    backgroundColor: "rgba(24, 24, 27, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#a1a1aa",
  },
  quickStatValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#71717a",
    fontWeight: "500",
  },
  widgetsGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    gap: 16,
  },
  taskRow: {
    backgroundColor: "#1C1C1E", // iOS System Gray 6 Dark
    padding: 16,
    borderRadius: 16, // Apple-style curvature
    marginHorizontal: 20,
    marginBottom: 8,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  taskContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  circularStatus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  taskTextContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.3, // SF Pro tight tracking
  },
  taskTitleDone: {
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  taskSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  taskRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  miniPriorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Removed old task styles
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A84FF", // Apple Blue
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#a1a1aa",
    marginTop: 4,
  },
});
