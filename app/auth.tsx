import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function AuthScreen() {
  const [hasBioMetrics, setBioMetrics] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>("");
  const router = useRouter();

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setBioMetrics(hasBioMetrics && isEnrolled);
  };

  useEffect(() => {
    checkBiometrics();
  }, []);

  const authenticate = async () => {
    try {
      setIsAuthenticating(true);
      setError("");

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync;

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage:
          hasHardware && hasBioMetrics
            ? "Use faceID/TouchID"
            : "Enter your PIN for access",
        fallbackLabel: "Use PIN",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (auth.success) {
        router.replace("/home");
      } else {
        setError("Authentication failed, please try again");
      }
    } catch (error) {
      setError("Authentication error: " + error);
    }
  };

  return (
    <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="flower-outline" size={80} color="white" />
        </View>
        <Text style={styles.title}>DryPlant</Text>
        <Text style={styles.subtitle}>Caring for your plants</Text>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.instructionText}>
            {hasBioMetrics
              ? "Use faceID/TouchID or PIN for access"
              : "Enter your PIN"}
          </Text>
          <TouchableOpacity
            style={[styles.button, isAuthenticating && styles.buttonDisable]}
            disabled={isAuthenticating}
            onPress={authenticate}
          >
            <Ionicons
              name={hasBioMetrics ? "finger-print-outline" : "keypad-outline"}
              size={24}
              color="white"
            />
            <Text style={styles.buttonText}>
              {isAuthenticating
                ? "Verifying..."
                : hasBioMetrics
                ? "Authenticate"
                : "Enter PIN"}
            </Text>
          </TouchableOpacity>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#f44336" />
              <Text>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: width - 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonDisable: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginLeft: 8,
  },
});
