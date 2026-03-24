import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HistoryItem = {
  type: string;
  title: string;
  risk: string;
  interaction: string;
};

export default function HistoryScreen() {

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);

  const loadHistory = async () => {

    const stored = await AsyncStorage.getItem("interaction_history");

    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      setHistory([]);
    }

  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const toggleSelect = (index: number) => {

    if (!deleteMode) return;

    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }

  };

  const selectAll = () => {

    const all = history.map((_, i) => i);
    setSelected(all);

  };

  const handleDelete = async () => {

    // First press → enable delete mode
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    // Second press → delete selected
    const newHistory = history.filter(
      (_, i) => !selected.includes(i)
    );

    setHistory(newHistory);

    await AsyncStorage.setItem(
      "interaction_history",
      JSON.stringify(newHistory)
    );

    setSelected([]);
    setDeleteMode(false);

  };

  const getRiskStyle = (risk: string) => {

    const r = risk.toLowerCase();

    if (r.includes("high")) return styles.highRisk;
    if (r.includes("moderate")) return styles.moderateRisk;

    return styles.lowRisk;

  };

  return (

    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <Text style={styles.title}>History</Text>

        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>

      </View>

      {deleteMode && (
        <TouchableOpacity onPress={selectAll}>
          <Text style={styles.select}>Select All</Text>
        </TouchableOpacity>
      )}

      <ScrollView>

        {history.length === 0 && (
          <Text style={styles.empty}>
            No previous interaction searches
          </Text>
        )}

        {history.map((item, index) => (

          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              getRiskStyle(item.risk),
              selected.includes(index) && styles.selected
            ]}
            onPress={() => toggleSelect(index)}
            activeOpacity={deleteMode ? 0.7 : 1}
          >

            {deleteMode && (
              <Text style={styles.tick}>
                {selected.includes(index) ? "☑" : "☐"}
              </Text>
            )}

            <Text style={styles.type}>{item.type}</Text>

            <Text style={styles.risk}>{item.risk}</Text>

            <Text style={styles.titleText}>{item.title}</Text>

            <Text style={styles.interaction}>{item.interaction}</Text>

          </TouchableOpacity>

        ))}

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#f3f4f6",
    paddingHorizontal:20,
    paddingTop:40
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:10
  },

  title:{
    fontSize:26,
    fontWeight:"700",
    color:"#1c8ca6"
  },

  delete:{
    fontSize:16,
    color:"#dc2626",
    fontWeight:"700"
  },

  select:{
    fontSize:15,
    color:"#1c8ca6",
    marginBottom:10,
    fontWeight:"600"
  },

  empty:{
    fontSize:16,
    color:"#6b7280"
  },

  card:{
    padding:18,
    borderRadius:16,
    marginBottom:15,
    borderLeftWidth:6
  },

  selected:{
    borderWidth:2,
    borderColor:"#1c8ca6"
  },

  tick:{
    position:"absolute",
    right:15,
    top:15,
    fontSize:18
  },

  type:{
    fontSize:14,
    fontWeight:"600",
    color:"#1c8ca6",
    marginBottom:4
  },

  risk:{
    fontSize:16,
    fontWeight:"700"
  },

  titleText:{
    fontSize:16,
    fontWeight:"600",
    marginTop:4
  },

  interaction:{
    fontSize:14,
    marginTop:4,
    color:"#374151"
  },

  highRisk:{
    backgroundColor:"#fee2e2",
    borderLeftColor:"#dc2626"
  },

  moderateRisk:{
    backgroundColor:"#fef3c7",
    borderLeftColor:"#f59e0b"
  },

  lowRisk:{
    backgroundColor:"#dcfce7",
    borderLeftColor:"#16a34a"
  }

});