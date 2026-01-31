import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import { Quote, RefreshCw, Share as ShareIcon } from "lucide-react-native";

export const QuoteWidget = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const shareQuote = async () => {
    if (quote) {
      try {
        await Share.share({
          message: `"${quote.quote}" - ${quote.author}`,
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Quote size={18} color="#AF52DE" />
          </View>
          <Text style={styles.title}>Daily Quote</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={shareQuote} style={styles.controlButton}>
            <ShareIcon size={18} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchQuote} style={styles.controlButton}>
            <RefreshCw size={18} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading && !quote ? (
          <ActivityIndicator size="small" color="#8E8E93" />
        ) : (
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote?.quote}"</Text>
            <Text style={styles.authorText}>— {quote?.author}</Text>
          </View>
        )}
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
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  controls: {
    flexDirection: "row",
    gap: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 26,
    fontWeight: "400",
    fontFamily: "System", // San Francisco
  },
  authorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93", // iOS System Gray
    textAlign: "center",
  },
});
