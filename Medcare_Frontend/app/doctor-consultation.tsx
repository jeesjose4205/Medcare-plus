import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Doctor = {
  id: number;
  name: string;
  department: string;
  phone: string;
  startTime: number;
  endTime: number;
};

export default function DoctorConsultation() {

  const router = useRouter();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. John Smith",
      department: "Cardiology",
      phone: "+916238382548",
      startTime: 9,
      endTime: 13,
    },
    {
      id: 2,
      name: "Dr. Alice Brown",
      department: "Neurology",
      phone: "+919207395601",
      startTime: 14,
      endTime: 23,
    },
    {
      id: 3,
      name: "Dr. David Lee",
      department: "Dermatology",
      phone: "+917306392907",
      startTime: 10,
      endTime: 16,
    },
    {
      id: 4,
      name: "Dr. Sarah Wilson",
      department: "Orthopedics",
      phone: "+919188394512",
      startTime: 12,
      endTime: 20,
    },
    {
      id: 5,
      name: "Dr. Michael Johnson",
      department: "Pediatrics",
      phone: "+919207395601",
      startTime: 8,
      endTime: 12,
    },
    {
      id: 6,
      name: "Dr. Emma Davis",
      department: "General Medicine",
      phone: "+919207395601",
      startTime: 15,
      endTime: 22,
    },
  ];

  const departments = [
    "All",
    "Cardiology",
    "Neurology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
  ];

  const isDoctorAvailable = (doctor: Doctor) => {

    const hour = currentTime.getHours();

    return hour >= doctor.startTime && hour < doctor.endTime;

  };

  const startVideoCall = (phone: string) => {

    const cleanPhone = phone.replace(/[^\d]/g, "");

    Linking.openURL(`https://wa.me/${cleanPhone}`);

  };

  const filteredDoctors =
    selectedDepartment === "All"
      ? doctors
      : doctors.filter((d) => d.department === selectedDepartment);

  return (

    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>
          Doctor Consultation
        </Text>

        <View style={{ width: 24 }} />

      </View>

      {/* Department Filters */}
      <View style={styles.filterWrapper}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          {departments.map((dept) => (

            <TouchableOpacity
              key={dept}
              style={[
                styles.departmentChip,
                selectedDepartment === dept &&
                  styles.departmentChipActive,
              ]}
              onPress={() => setSelectedDepartment(dept)}
            >

              <Text
                style={[
                  styles.departmentText,
                  selectedDepartment === dept &&
                    styles.departmentTextActive,
                ]}
              >
                {dept}
              </Text>

            </TouchableOpacity>

          ))}

        </ScrollView>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >

        <Text style={styles.subtitle}>
          Connect with medical specialists for consultation
        </Text>

        {filteredDoctors.map((doctor) => {

          const available = isDoctorAvailable(doctor);

          return (

            <View key={doctor.id} style={styles.card}>

              <View style={styles.topRow}>

                <View style={styles.avatar}>
                  <Ionicons
                    name="person"
                    size={28}
                    color="#2563eb"
                  />
                </View>

                <View style={{ flex: 1 }}>

                  <Text style={styles.doctorName}>
                    {doctor.name}
                  </Text>

                  <Text style={styles.department}>
                    {doctor.department}
                  </Text>

                  <Text style={styles.time}>
                    Available {doctor.startTime}:00 - {doctor.endTime}:00
                  </Text>

                  <View style={styles.statusRow}>

                    <View
                      style={[
                        styles.statusDot,
                        available
                          ? styles.greenDot
                          : styles.redDot,
                      ]}
                    />

                    <Text
                      style={[
                        styles.statusText,
                        available
                          ? styles.availableText
                          : styles.offlineText,
                      ]}
                    >
                      {available ? "Available" : "Offline"}
                    </Text>

                  </View>

                </View>

              </View>

              <View style={styles.contactRow}>
                <Ionicons
                  name="call-outline"
                  size={16}
                  color="#6b7280"
                />
                <Text style={styles.phone}>
                  {doctor.phone}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.callButton,
                  !available && styles.disabledButton,
                ]}
                disabled={!available}
                onPress={() => startVideoCall(doctor.phone)}
              >

                <Ionicons
                  name="videocam-outline"
                  size={18}
                  color="#fff"
                />

                <Text style={styles.callText}>
                  Video Call
                </Text>

              </TouchableOpacity>

            </View>

          );

        })}

      </ScrollView>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  filterWrapper: {
    paddingLeft: 20,
    paddingBottom: 10,
  },

  departmentChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    marginRight: 8,
  },

  departmentChipActive: {
    backgroundColor: "#2563eb",
  },

  departmentText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  departmentTextActive: {
    color: "#fff",
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0ecff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  doctorName: {
    fontSize: 17,
    fontWeight: "700",
  },

  department: {
    color: "#6b7280",
  },

  time: {
    fontSize: 13,
    color: "#6b7280",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  greenDot: {
    backgroundColor: "#16a34a",
  },

  redDot: {
    backgroundColor: "#dc2626",
  },

  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },

  availableText: {
    color: "#16a34a",
  },

  offlineText: {
    color: "#dc2626",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  phone: {
    marginLeft: 6,
  },

  callButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#9ca3af",
  },

  callText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

});