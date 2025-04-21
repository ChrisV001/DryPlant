import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    startDay: new Date(),
    times: ["09:00"],
    notes: "",
    reminderEnabled: true,
    refillReminder: false,
    currentSupply: "",
    refillAt: "",
  });

  const renderFrequencyOptions = () => {
    return (
      <View>
        {FREQUENCIES.map((freq) => (
          <TouchableOpacity
            key={freq.id}
            // onPress={}
          >
            <View>
              <Ionicons
                name={freq.icon}
                size={24}
                //color={}
              />
              <Text>{freq.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDurationOptions = () => {
    return (
      <View>
        {DURATIONS.map((duration) => (
          <TouchableOpacity
            key={duration.id}
            //onPress={}
          >
            <View>
              <Text>{duration.value > 0 ? duration.value : "∞"}</Text>
              <Text>{duration.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <View>
      <LinearGradient
        colors={["#1A8E2D", "146922"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View>
        <View>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={28} color={"#1A8E2D"} />
            <Text>New Plant</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <TextInput
                placeholder="Plant name"
                placeholderTextColor={"#999"}
              ></TextInput>
            </View>
            <View>
              <TextInput placeholder="Dosage" placeholderTextColor={"#999"} />
            </View>
            <View>
              <Text>How often?</Text>
              {/* frequency option */}
              {renderFrequencyOptions()}
              <Text>For how long?</Text>
              {/* render duration */}
              {renderDurationOptions()}
              <TouchableOpacity>
                <View>
                  <Ionicons name="calendar" size={20} color={"1A8E2D"} />
                </View>
                <Text>Starts: {}</Text>
              </TouchableOpacity>
              <DateTimePicker mode="date" value={form.startDay} />
              <DateTimePicker
                mode="time"
                value={(() => {
                  const [hours, minutes] = form.times[0].split(":").map(Number);
                  const date = new Date();
                  date.setHours(hours, minutes, 0, 0);
                  return date;
                })()}
              />
            </View>
            <View>
              <View>
                <View>
                  <View>
                    <View>
                      <Ionicons name="notifications" color={"#1A8E2D"} />
                    </View>
                    <View>
                      <Text>Reminders</Text>
                      <Text>
                        Get notified when it is time to water the plant
                      </Text>
                    </View>
                  </View>
                  <Switch
                    thumbColor={"white"}
                    trackColor={{ false: "#ddd", true: "#1A8E2D" }}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
