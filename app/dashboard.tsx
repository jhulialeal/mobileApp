import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";

export default function Deashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Olá!</Text>
      <Text style={styles.subtitle}>Todas as suas plantas catalogadas estão aqui</Text>

      <Link href="/cameraScreen" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Catalogar</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(144, 238, 144, 0.3)", // Verde claro com transparência
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F4F4F", // Cor do título
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#2F4F4F",
    marginBottom: 500,
  },
  button: {
    backgroundColor: "#6A9F6D", // Verde escuro
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});
