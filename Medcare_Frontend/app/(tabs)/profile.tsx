import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ConditionKeys =
  | "diabetes"
  | "bp"
  | "cholesterol"
  | "kidney"
  | "liver"
  | "asthma";

export default function ProfileScreen() {
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(false);

  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [allergy, setAllergy] = useState("");

  const [conditions, setConditions] = useState({
    diabetes: false,
    bp: false,
    cholesterol: false,
    kidney: false,
    liver: false,
    asthma: false,
  });

  // LOAD PROFILE
  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem("user_profile");

      if (saved) {
        const data = JSON.parse(saved);

        setName(data.name || "");
        setAgeGroup(data.ageGroup || "");
        setGender(data.gender || "");
        setHeight(data.height || "");
        setWeight(data.weight || "");
        setAllergy(data.allergy || "");
        setConditions(data.conditions || conditions);
        setIsSaved(true);
      }
    } catch {
      console.log("Profile load error");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  // SAVE PROFILE
  const saveProfile = async () => {
    const profileData = {
      name,
      ageGroup,
      gender,
      height,
      weight,
      allergy,
      conditions,
    };

    try {
      await AsyncStorage.setItem(
        "user_profile",
        JSON.stringify(profileData)
      );
    } catch {
      console.log("Profile save error");
    }
  };

  const toggleCondition = (key: ConditionKeys) => {
    if (isSaved) return;
    setConditions({ ...conditions, [key]: !conditions[key] });
  };

  const handleProfileButton = () => {
    if (!isSaved) {
      saveProfile();
    }
    setIsSaved(!isSaved);
  };

  const renderSegment = (
    options: string[],
    selected: string,
    setValue: (value: string) => void
  ) => {
    return (
      <View style={styles.segmentContainer}>
        {options.map((item) => (
          <TouchableOpacity
            key={item}
            disabled={isSaved}
            style={[
              styles.segmentItem,
              selected === item && styles.segmentActive,
            ]}
            onPress={() => setValue(item)}
          >
            <Text
              style={[
                styles.segmentText,
                selected === item && styles.segmentTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={{ width: 30 }} />
        </View>

        {/* Basic Information */}
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          editable={!isSaved}
          onChangeText={setName}
        />

        <Text style={styles.label}>Age Group</Text>
        {renderSegment(["Child", "Adult", "Senior"], ageGroup, setAgeGroup)}

        <Text style={styles.label}>Gender</Text>
        {renderSegment(["Male", "Female", "Other"], gender, setGender)}

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter height"
              value={height}
              editable={!isSaved}
              keyboardType="numeric"
              onChangeText={setHeight}
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight"
              value={weight}
              editable={!isSaved}
              keyboardType="numeric"
              onChangeText={setWeight}
            />
          </View>
        </View>

        {/* Conditions */}
        <Text style={styles.sectionTitle}>Existing Conditions</Text>
        <Text style={styles.subtitle}>
          Select any conditions that apply to you
        </Text>

        <View style={styles.card}>
          {[
            ["diabetes", "Diabetes"],
            ["bp", "High Blood Pressure"],
            ["cholesterol", "High Cholesterol"],
            ["kidney", "Kidney Disease"],
            ["liver", "Liver Disease"],
            ["asthma", "Asthma"],
          ].map(([key, label]) => {
            const conditionKey = key as ConditionKeys;

            return (
              <View key={key} style={styles.switchRow}>
                <Text style={styles.switchLabel}>{label}</Text>

                <Switch
                  value={conditions[conditionKey]}
                  onValueChange={() => toggleCondition(conditionKey)}
                  trackColor={{ false: "#d1d5db", true: "#1c8ca6" }}
                  thumbColor="#ffffff"
                  disabled={isSaved}
                />
              </View>
            );
          })}
        </View>

        {/* Allergies */}
        <Text style={styles.sectionTitle}>Allergies</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter allergy (optional)"
          value={allergy}
          editable={!isSaved}
          onChangeText={setAllergy}
        />

        {/* Save/Edit Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleProfileButton}
        >
          <Text style={styles.saveText}>
            {isSaved ? "Edit Profile" : "Save Profile"}
          </Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Your profile is stored locally on your device and used only to
            enhance safety warnings. No data is shared externally.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#f3f4f6", paddingHorizontal:20, paddingTop:10 },

  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:30 },

  headerTitle:{ fontSize:20, fontWeight:"600" },

  sectionTitle:{ fontSize:22, fontWeight:"700", marginTop:25, marginBottom:10 },

  subtitle:{ color:"#6b7280", marginBottom:8 },

  label:{ fontSize:16, fontWeight:"600", marginTop:12 },

  input:{ backgroundColor:"#ffffff", borderRadius:16, padding:14, marginTop:6, borderWidth:1, borderColor:"#e5e7eb" },

  row:{ flexDirection:"row", justifyContent:"space-between" },

  half:{ width:"48%" },

  segmentContainer:{ flexDirection:"row", backgroundColor:"#e5e7eb", borderRadius:16, marginTop:8, padding:4 },

  segmentItem:{ flex:1, padding:10, alignItems:"center", borderRadius:12 },

  segmentActive:{ backgroundColor:"#1c8ca6" },

  segmentText:{ color:"#374151" },

  segmentTextActive:{ color:"#ffffff", fontWeight:"600" },

  card:{ backgroundColor:"#ffffff", borderRadius:16, marginTop:8, borderWidth:1, borderColor:"#e5e7eb" },

  switchRow:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:10, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor:"#f1f5f9" },

  switchLabel:{ fontSize:15 },

  saveButton:{ backgroundColor:"#1c8ca6", padding:18, borderRadius:20, marginTop:25, alignItems:"center" },

  saveText:{ color:"#ffffff", fontSize:18, fontWeight:"600" },

  infoBox:{ backgroundColor:"#e0f2fe", padding:18, borderRadius:16, marginTop:20, marginBottom:40 },

  infoText:{ color:"#075985", lineHeight:20 }
});