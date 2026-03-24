import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AboutScreen() {

  const router = useRouter();

  return (

    <SafeAreaView style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>About MedCare+</Text>

        <View style={{ width: 30 }} />

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* App Description */}

        <View style={styles.card}>

          <Text style={styles.title}>MedCare+</Text>

          <Text style={styles.description}>
            MedCare+ is a mobile-based medication safety and interaction
            awareness system designed to help users understand potential
            risks when using medicines.
          </Text>

          <Text style={styles.description}>
            The application provides warnings for:
          </Text>

          <Text style={styles.list}>
            • Drug–Drug Interactions{"\n"}
            • Drug–Disease Interactions{"\n"}
            • Food–Drug Interactions{"\n"}
            • Age-based Medication Safety
          </Text>

          <Text style={styles.description}>
            The goal of MedCare+ is to increase medication safety awareness,
            especially in rural and underserved communities where access to
            medical guidance may be limited.
          </Text>

          <Text style={styles.description}>
            This application is designed for informational purposes only and
            does not replace professional medical advice.
          </Text>

        </View>

        {/* Safety Notice */}

        <View style={styles.noticeBox}>

          <Ionicons name="warning-outline" size={22} color="#b45309" />

          <Text style={styles.noticeText}>
            Always consult a doctor or pharmacist before making decisions
            about medications or treatments.
          </Text>

        </View>

        {/* Version */}

        <View style={styles.versionCard}>
          <Text style={styles.versionText}>MedCare+ Version 1.0.0</Text>
        </View>

      </ScrollView>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#f3f4f6",
    paddingHorizontal:20,
    paddingTop:10
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:30
  },

  headerTitle:{
    fontSize:20,
    fontWeight:"600"
  },

  card:{
    backgroundColor:"#ffffff",
    borderRadius:18,
    padding:20,
    marginTop:25,
    borderWidth:1,
    borderColor:"#e5e7eb"
  },

  title:{
    fontSize:22,
    fontWeight:"700",
    color:"#1c8ca6",
    marginBottom:10
  },

  description:{
    fontSize:15,
    color:"#374151",
    lineHeight:22,
    marginTop:10
  },

  list:{
    fontSize:15,
    marginTop:10,
    color:"#111827",
    lineHeight:24
  },

  noticeBox:{
    backgroundColor:"#fef3c7",
    padding:16,
    borderRadius:16,
    marginTop:20,
    flexDirection:"row",
    gap:10,
    alignItems:"flex-start"
  },

  noticeText:{
    flex:1,
    color:"#92400e",
    lineHeight:20
  },

  versionCard:{
    marginTop:20,
    marginBottom:40,
    alignItems:"center"
  },

  versionText:{
    color:"#6b7280"
  }

});