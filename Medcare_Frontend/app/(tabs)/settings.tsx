import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {

  const router = useRouter();

  const [notifications, setNotifications] = useState(true);

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Settings</Text>

      {/* Language */}

      <View style={styles.card}>

        <View style={styles.left}>

          <Ionicons name="language-outline" size={22} color="#374151" />

          <Text style={styles.text}>Language</Text>

        </View>

        <Text style={styles.value}>English</Text>

      </View>

      {/* Notifications */}

      <View style={styles.card}>

        <View style={styles.left}>

          <Ionicons name="notifications-outline" size={22} color="#374151" />

          <Text style={styles.text}>Notifications</Text>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />

      </View>

      {/* About MedCare+ */}

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/about")}
      >

        <View style={styles.left}>

          <Ionicons name="information-circle-outline" size={22} color="#374151" />

          <Text style={styles.text}>About MedCare+</Text>

        </View>

        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />

      </TouchableOpacity>

      {/* Version */}

      <View style={styles.card}>

        <View style={styles.left}>

          <Ionicons name="code-outline" size={22} color="#374151" />

          <Text style={styles.text}>Version</Text>

        </View>

        <Text style={styles.value}>1.0.0</Text>

      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1c8ca6",
    marginTop: 60,
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    marginLeft: 14,
    color: "#111827",
    fontWeight: "500",
  },

  value: {
    fontSize: 15,
    color: "#6b7280",
  },

});