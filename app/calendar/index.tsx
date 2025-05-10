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
import { useFocusEffect } from "@react-navigation/native";

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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);

  const renderCalendar = () => {
    const calendar: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-${i}`} />);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth()
      );

      const today = new Date().toDateString() === date.toDateString();
      const hasDoses = doseHistory.some(
        (dose) =>
          new Date(dose.timestamp).toDateString() === date.toDateString()
      );

      week.push(
        <TouchableOpacity key={day}>
          <Text>{day}</Text>
          {hasDoses && <View></View>}
        </TouchableOpacity>
      );

      if (firstDay + (day % 7) === 0 || day === days) {
        calendar.push(<View key={day}>{week}</View>);
      }
    }
  };

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
