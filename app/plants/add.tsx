import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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

const renderFrequencyOptions = () => {
  return (
    <View>
      {FREQUENCIES.map((freq) => (
        <TouchableOpacity
          key={freq.id}
          // onPress={}
        >
          <View>
            <Ionicons name={freq.icon}
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

export default function AddFlower() {
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
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
