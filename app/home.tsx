import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number;
  totalWatered: number;
  completedWatered: number;
}

function CircularProgress({
  progress,
  totalWatered,
  completedWatered,
}: CircularProgressProps) {
  const animationValue = useRef(new Animated.Value(0)).current;
  const size = width * 0.55;
  const strokedWidth = size * 0.1;
  const center = size / 2;
  const radius = size / 2 - strokedWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start;
  }, [progress]);

  const strokeDashoffset = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        <Text style={styles.progressLabel}>
          {completedWatered} of {totalWatered} watered
        </Text>
      </View>
      <Svg width={size} height={size} style={styles.progressRing}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokedWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokedWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <LinearGradient colors={["#1A8E2D", "#146922"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetings}>Daily Progress</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              {
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>1</Text>
                </View>
              }
            </TouchableOpacity>
          </View>
          <CircularProgress
            progress={50}
            totalWatered={10}
            completedWatered={5}
          />
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  greetings: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    opacity: 0.8,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  notificationButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    marginLeft: 8,
  },

  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff5252",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    minWidth: 20,
    borderColor: "#146922",
  },

  notificationCount: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },

  progressDetail: {
    fontSize: 11,
    color: "white",
    fontWeight: "bold",
  },

  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  progressTextContainer: {
    position: "absolute",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercentage: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },

  progressRing: {
    transform: [{ rotate: "-90deg" }],
  },
});
