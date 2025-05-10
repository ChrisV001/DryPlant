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
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [doseHistory, setDoseHistory] = useState<DoseHistory[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [flowers, history] = await Promise.all([
        getFlowers(),
        getDoseHistory(),
      ]);

      setFlowers(flowers);
      setDoseHistory(history);
    } catch (error) {
      console.error("Error loading calendar data: ", error);
    }
  }, [selectedDate]);
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
            <Ionicons name="chevron-back" size={28} color={"#1A8E2D"} />
          </TouchableOpacity>
          <Text>
            {selectedDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={28} color={"#1A8E2D"} />
          </TouchableOpacity>
        </View>
        <View>
          {WEEKDAYS.map((day) => (
            <Text key={day}>day</Text>
          ))}
        </View>
        {/* Render the calendar */}
        <View>
          <Text>
            {selectedDate.toLocaleDateString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <ScrollView>
            {/* Flowers that need to be watered for the given date */}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
