import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>MedCare+</Text>
        <Text style={styles.subtitle}>
          Check medication safety and interactions
        </Text>
      </View>

      {/* Cards */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dosage Safety */}
        <TouchableOpacity
          style={[styles.card, styles.redCard]}
          onPress={() => router.push("/dosage-safety")}
        >
          <View style={styles.iconBoxRed}>
            <Ionicons
              name="shield-checkmark-outline"
              size={26}
              color="#dc2626"
            />
          </View>
          <Text style={styles.cardTitle}>Dosage Safety</Text>
          <Text style={styles.cardText}>
            Check maximum safe dose and timing guidance for medicines
          </Text>
        </TouchableOpacity>

        {/* Drug–Drug */}
        <TouchableOpacity
          style={[styles.card, styles.blueCard]}
          onPress={() => router.push("/drug-drug")}
        >
          <View style={styles.iconBoxBlue}>
            <Ionicons name="medkit-outline" size={26} color="#1c8ca6" />
          </View>
          <Text style={styles.cardTitle}>Drug–Drug Interaction</Text>
          <Text style={styles.cardText}>
            Check if two medicines are safe to take together
          </Text>
        </TouchableOpacity>

        {/* Drug–Disease */}
        <TouchableOpacity
          style={[styles.card, styles.orangeCard]}
          onPress={() => router.push("/drug-disease")}
        >
          <View style={styles.iconBoxOrange}>
            <Ionicons name="warning-outline" size={26} color="#f25c05" />
          </View>
          <Text style={styles.cardTitle}>Drug–Disease Warning</Text>
          <Text style={styles.cardText}>
            Verify if a medicine is safe for your condition
          </Text>
        </TouchableOpacity>

        {/* Food–Drug */}
        <TouchableOpacity
          style={[styles.card, styles.greenCard]}
          onPress={() => router.push("/food-drug")}
        >
          <View style={styles.iconBoxGreen}>
            <Ionicons name="nutrition-outline" size={26} color="#1ba672" />
          </View>
          <Text style={styles.cardTitle}>Food–Drug Interaction</Text>
          <Text style={styles.cardText}>
            Learn how foods affect your medications
          </Text>
        </TouchableOpacity>

        {/* Doctor Consultation */}
        <TouchableOpacity
          style={[styles.card, styles.purpleCard]}
          onPress={() => router.push("/doctor-consultation")}
        >
          <View style={styles.iconBoxPurple}>
            <Ionicons name="videocam-outline" size={26} color="#7c3aed" />
          </View>
          <Text style={styles.cardTitle}>Doctor Consultation</Text>
          <Text style={styles.cardText}>
            Connect with doctors from different departments
          </Text>
        </TouchableOpacity>

        {/* Drug Information */}
        <TouchableOpacity
          style={[styles.card, styles.tealCard]}
          onPress={() => router.push("/drug-info")}
        >
          <View style={styles.iconBoxTeal}>
            <Ionicons name="search-outline" size={26} color="#0ea5a4" />
          </View>
          <Text style={styles.cardTitle}>Drug Information</Text>
          <Text style={styles.cardText}>
            Search and view detailed information about any medicine
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1c8ca6",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  card: {
    height: 160,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    justifyContent: "center",
    backgroundColor: "#ffffff",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },

  iconBoxBlue: {
    backgroundColor: "#e6f4f7",
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  iconBoxOrange: {
    backgroundColor: "#fff1e6",
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  iconBoxGreen: {
    backgroundColor: "#e7f6ef",
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  iconBoxRed: {
    backgroundColor: "#fee2e2",
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  iconBoxPurple: {
    backgroundColor: "#f3e8ff",
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  iconBoxTeal: {
    backgroundColor: "#e6fffa",
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  blueCard: {},
  orangeCard: {},
  greenCard: {},
  redCard: {},
  purpleCard: {},
  tealCard: {},
});