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
          <View></View>
        </ScrollView>
      </View>
    </View>
  );
}
