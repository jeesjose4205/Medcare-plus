import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default function SafetyBadge({
  level,
}: {
  level: "safe" | "warning" | "danger";
}) {
  const config = {
    safe: { color: Colors.success, text: "Safe" },
    warning: { color: Colors.warning, text: "Caution" },
    danger: { color: Colors.danger, text: "Avoid" },
  };

  return (
    <View style={[styles.badge, { backgroundColor: config[level].color }]}>
      <Text style={styles.text}>{config[level].text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    padding: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  text: { color: "#fff", fontWeight: "bold" },
});