import React from "react";
import { Link } from 'expo-router';
import { Text, View, Pressable, ImageBackground, StyleSheet } from "react-native";

export default function Index() {
  return (
    <ImageBackground
      source={require("../assets/images/Background.png")}
      style={styles.background}
    >

      <View style={styles.overlay}>
        <Text style={styles.title}>Leafeon</Text>
        <Text style={styles.subtitle}>Biblioteca de plantas</Text>
        <Text style={styles.description}>Uma janela para o universo das plantas.</Text>

      <Link href={{ pathname: "/dashboard" }} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Começar</Text>
        </Pressable>
      </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "#2B5B3C",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#C1E8D6",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#A9D7B4",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#6A9F6D",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});