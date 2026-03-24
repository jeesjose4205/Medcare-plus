import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

export default function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    marginVertical: 8,
  },
  text: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "600",
  },
});