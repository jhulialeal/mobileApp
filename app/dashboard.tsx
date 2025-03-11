import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>Bem-vindo ao Leafeon!</Text>
      <Text style={styles.description}>
        Capture imagens das plantas ao seu redor e descubra mais sobre elas.
      </Text>

      <View
        style={styles.button_container}
      >
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/scan")}
        >
          <Text style={styles.buttonText}>Abrir Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/gallery")}
        >
          <Text style={styles.buttonText}>Abrir sua galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/identify")}
        >
          <Text style={styles.buttonText}>Identificar Planta</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F7F0",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2B5B3C",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#4A7856",
    textAlign: "center",
    marginBottom: 40,
  },
  button_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6A9F6D",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 20,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});
