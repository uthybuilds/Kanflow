import { Stack, router, Slot, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check guest mode first
        const guestMode = await AsyncStorage.getItem("guest_mode");
        if (guestMode === "true") {
          setIsGuest(true);
          setInitialized(true);
          return;
        }

        // Check initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setInitialized(true);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If we get a valid session, ensure guest mode is off
      if (session) {
        setIsGuest(false);
        AsyncStorage.removeItem("guest_mode");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const protectRoute = async () => {
      if (!initialized) return;

      // Always check fresh guest status to avoid stale state issues during navigation
      let isGuestUser = isGuest;
      try {
        const guestMode = await AsyncStorage.getItem("guest_mode");
        isGuestUser = guestMode === "true";
        if (isGuestUser !== isGuest) {
          setIsGuest(isGuestUser);
        }
      } catch (e) {
        console.error("Guest check failed:", e);
      }

      const inAuthGroup = segments[0] === "auth" || segments[0] === "landing";
      const isAuthenticated = session || isGuestUser;

      if (isAuthenticated && inAuthGroup) {
        // Redirect to home if authenticated
        router.replace("/");
      } else if (!isAuthenticated && !inAuthGroup) {
        // Redirect to landing if not authenticated and not in auth group
        router.replace("/landing");
      }
    };

    protectRoute();
  }, [session, isGuest, initialized, segments]);

  if (!initialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#09090b",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
