import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");

const FREQUENCIES = [
  {
    id: "1",
    label: "Once Daily",
    icon: "sunny-outline" as const,
    times: ["09:00"],
  },
  {
    id: "2",
    label: "Twice daily",
    icon: "sync-outline" as const,
    times: ["09:00", "21:00"],
  },
  {
    id: "3",
    label: "Three times daily",
    icon: "time-outline" as const,
    times: ["09:00", "15:00", "21:00"],
  },
  {
    id: "4",
    label: "Four times daily",
    icon: "repeat-outline" as const,
    times: ["09:00", "13:00", "17:00", "21:00"],
  },
  {
    id: "5",
    label: "As needed",
    icon: "calendar-outline" as const,
    times: [],
  },
];

const DURATIONS = [
  {
    id: "1",
    label: "7days",
    value: 7,
  },
  {
    id: "2",
    label: "14 days",
    value: 14,
  },
  {
    id: "3",
    label: "30 days",
    value: 30,
  },
  {
    id: "4",
    label: "90 days",
    value: 90,
  },
  {
    id: "5",
    label: "Ongoing",
    value: -1,
  },
];

export default function AddFlower() {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    startDate: new Date(),
    times: ["09:00"],
    notes: "",
    reminderEnabled: true,
    refillReminder: false,
    currentSupply: "",
    refillAt: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const renderFrequencyOptions = () => {
    return (
      <View style={styles.optionsGrid}>
        {FREQUENCIES.map((freq) => (
          <TouchableOpacity
            key={freq.id}
            // onPress={}
            style={[
              styles.optionCard,
              selectedFrequency === freq.label && styles.selectedOptionCard,
            ]}
          >
            <View
              style={[
                styles.optionIcon,
                selectedFrequency === freq.label && styles.selectedOptionIcon,
              ]}
            >
              <Ionicons
                name={freq.icon}
                size={24}
                color={selectedFrequency === freq.label ? "white" : "#666"}
              />
              <Text
                style={[
                  styles.optionLabel,
                  selectedFrequency === freq.label &&
                    styles.selectedOptionLabel,
                ]}
              >
                {freq.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDurationOptions = () => {
    return (
      <View style={styles.optionsGrid}>
        {DURATIONS.map((duration) => (
          <TouchableOpacity
            key={duration.id}
            //onPress={}
            style={[
              styles.optionCard,
              selectedDuration === duration.label && styles.selectedOptionCard,
            ]}
          >
            <Text
              style={[
                styles.durationNumber,
                selectedDuration === duration.label &&
                  styles.selectedDurationNumber,
              ]}
            >
              {duration.value > 0 ? duration.value : "∞"}
            </Text>
            <Text
              style={[
                styles.optionLabel,
                selectedDuration === duration.label &&
                  styles.selectedOptionLabel,
              ]}
            >
              {duration.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A8E2D", "146922"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={"#1A8E2D"} />
            <Text style={styles.headerTitle}>New Plant</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={styles.formContentContainer}
        >
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.mainInput, errors.name && styles.inputError]}
                placeholder="Plant name"
                placeholderTextColor={"#999"}
                value={form.name}
                onChangeText={(text) => {
                  setForm({ ...form, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Dosage"
                placeholderTextColor={"#999"}
                style={[styles.mainInput, errors.name && styles.inputError]}
                value={form.dosage}
                onChangeText={(text) => {
                  setForm({ ...form, dosage: text });
                  if (errors.dosage) {
                    setErrors({ ...errors, dosage: "" });
                  }
                }}
              />
              {errors.dosage && (
                <Text style={styles.errorText}>{errors.dosage}</Text>
              )}
            </View>
            <View style={styles.container}>
              <Text style={styles.sectionTitle}>How often?</Text>
              {/* frequency option */}
              {errors.frequency && (
                <Text style={styles.errorText}>{errors.frequency}</Text>
              )}
              {renderFrequencyOptions()}
              <Text style={styles.sectionTitle}>For how long?</Text>
              {errors.duration && (
                <Text style={styles.errorText}>{errors.duration}</Text>
              )}
              {/* render duration */}
              {renderDurationOptions()}
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateIconContainer}>
                  <Ionicons name="calendar" size={20} color={"1A8E2D"} />
                </View>
                <Text style={styles.dateButtonText}>
                  Starts: {form.startDate.toLocaleDateString()}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={"#666"} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={form.startDate}
                  mode="date"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setForm({ ...form, startDate: date });
                  }}
                />
              )}

              {form.frequency && form.frequency !== "As needed" && (
                <View style={styles.timeContainer}>
                  <Text style={styles.timesTitle}>Watering Time</Text>
                  {form.times.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.timeButton}
                      onPress={() => {
                        setShowDatePicker(true);
                      }}
                    >
                      <View style={styles.timeIconContainer}>
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color={"#1A8E2D"}
                        />
                      </View>
                      <Text style={styles.timeButtonText}>{time}</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={"#666"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {showTimePicker && (
                <DateTimePicker
                  mode="time"
                  value={(() => {
                    const [hours, minutes] = form.times[0]
                      .split(":")
                      .map(Number);
                    const date = new Date();
                    date.setHours(hours, minutes, 0, 0);
                    return date;
                  })()}
                  display="default"
                  onChange={(event, date) => {
                    setShowTimePicker(false);
                    if (date) {
                      const newTime = date.toLocaleDateString("default", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });
                      setForm((prev) => ({
                        ...prev,
                        times: prev.times.map((t, i) =>
                          i === 0 ? newTime : t
                        ),
                      }));
                    }
                  }}
                />
              )}
              <DateTimePicker
                mode="date"
                value={form.startDate}
                display="default"
              />
            </View>
            {/* Reminders */}
            <View style={styles.section}>
              <View style={styles.card}>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabelContainer}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="notifications" color={"#1A8E2D"} />
                    </View>
                    <View>
                      <Text style={styles.switchLabel}>Reminders</Text>
                      <Text style={styles.switchSubLabel}>
                        Get notified when it is time to water the plant
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={form.reminderEnabled}
                    thumbColor={"white"}
                    trackColor={{ false: "#ddd", true: "#1A8E2D" }}
                    onValueChange={(value) => 
                      setForm({...form,reminderEnabled:value})
                    }
                  />
                </View>
              </View>
            </View>
            {/* notes */}
            <View style={styles.section}>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Add notes if needed"
                  placeholderTextColor={""}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity>
            <LinearGradient
              colors={["#1A8E2D", "#146922"]}
              style={""}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={""}>
                Add Flower
                {/* {isSubmitting ? "Adding..." : "Add Flower"} */}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Cancel</Text>
          </TouchableOpacity>
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
  formContentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 15,
    marginTop: 10,
  },
  mainInput: {
    fontSize: 20,
    color: "#333",
    padding: 15,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  optionCard: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    margin: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOptionCard: {
    backgroundColor: "#1A8E2D",
    borderColor: "#1A8E2D",
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedOptionIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedOptionLabel: {
    color: "white",
  },
  durationNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A8E2D",
    marginBottom: 5,
  },
  selectedDurationNumber: {
    color: "white",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  timeContainer: {
    marginTop: 20,
  },
  timesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },

  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
