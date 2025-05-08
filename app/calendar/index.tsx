import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  getFlowers,
  getDoseHistory,
  recordDose,
  Flower,
  DoseHistory,
} from "@/utils/storage";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarScreen() {
  return (
    <View>
      <LinearGradient
        colors={["#1A8E2D", "#146922"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View>
        <View>
            <TouchableOpacity>
                <Ionicons name="chevron-back" size={28} color={"#1A8E2D"}/>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
