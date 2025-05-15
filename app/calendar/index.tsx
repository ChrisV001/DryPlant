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
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            today && styles.today,
            hasDoses && styles.hasEvents,
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[styles.dayText, today && styles.todayText]}>{day}</Text>
          {hasDoses && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );

      if ((firstDay + day) % 7 === 0 || day === days) {
        calendar.push(
          <View key={day} style={styles.calendarWeek}>
            {week}
          </View>
        );
        week = [];
      }
    }

    return calendar;
  };

  const renderFlowersForDate = () => {
    const dateStr = selectedDate.toDateString();
    const dayDoses = doseHistory.filter(
      (dose) => new Date(dose.timestamp).toDateString() === dateStr
    );

    return flowers.map((flower) => {
      const watered = dayDoses.some(
        (dose) => dose.flowerId === flower.id && dose.watered
      );
      return (
        <View key={flower.id} style={styles.flowerCard}>
          <View
            style={[styles.flowerColor, { backgroundColor: flower.color }]}
          />
          <View style={styles.flowerInfo}>
            <Text style={styles.flowerName}>{flower.name}</Text>
            <Text style={styles.flowerDosage}>{flower.dosage}</Text>
            <Text style={styles.flowerTime}>{flower.times[0]}</Text>
          </View>
          {watered ? (
            <View style={styles.wateredBadge}>
              <Ionicons name="checkmark-circle" size={20} color={"#4CAF50"} />
              <Text style={styles.wateredText}>Watered</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                await recordDose(flower.id, true, new Date().toISOString());
                loadData();
              }}
              style={[
                styles.wateredDoseButton,
                { backgroundColor: flower.color },
              ]}
            >
              <Text style={styles.wateredDoseText}>Water</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.headerGradient}
        colors={["#1A8E2D", "#146922"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color={"#1A8E2D"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
        <View style={styles.calendarContainer}>
          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() - 1,
                    1
                  )
                )
              }
            >
              <Ionicons name="chevron-back" size={24} color={"#333"} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {selectedDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() + 1,
                    1
                  )
                )
              }
            >
              <Ionicons name="chevron-forward" size={24} color={"#333"} />
            </TouchableOpacity>
          </View>
          <View style={styles.weekdayHeader}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>
          {renderCalendar()}
        </View>
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>
            {selectedDate.toLocaleDateString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderFlowersForDate()}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 140 : 120,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginLeft: 15,
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    color: "#666",
    fontWeight: "500",
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  today: {
    backgroundColor: "#1a8e2d15",
  },
  todayText: {
    color: "#1a8e2d",
    fontWeight: "600",
  },
  hasEvents: {
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1a8e2d",
    position: "absolute",
    bottom: "15%",
  },
  calendarWeek: {
    flexDirection: "row",
    marginBottom: 5,
  },
  flowerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  flowerColor: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 15,
  },
  flowerInfo: {
    flex: 1,
  },
  flowerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  flowerDosage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  flowerTime: {
    fontSize: 14,
    color: "#666",
  },
  wateredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  wateredText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  wateredDoseButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  wateredDoseText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
