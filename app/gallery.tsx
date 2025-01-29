import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GalleryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [plants, setPlants] = useState<{ uri: string; name: string; description: string }[]>([]);

  useEffect(() => {
    async function loadPlants() {
      try {
        const storedPlants = await AsyncStorage.getItem("plants");
        if (storedPlants) {
          setPlants(JSON.parse(storedPlants));
        }
      } catch (error) {
        console.error("Erro ao carregar plantas:", error);
      }
    }
    loadPlants();
  }, []);

  // Função para excluir uma planta da galeria
  const deletePlant = async (index: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const updatedPlants = plants.filter((_, i) => i !== index); // Remove o item pelo índice
              setPlants(updatedPlants);
              await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants)); // Atualiza o AsyncStorage
            } catch (error) {
              console.error("Erro ao excluir planta:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title}>Sua Galeria</Text>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => router.push("/dashboard")}>
          <Text style={styles.buttonText}>🏡
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={plants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SafeAreaView style={styles.card}>
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              onError={(e) => console.log("Erro ao carregar imagem:", item.uri, e.nativeEvent.error)}
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {/* Botão de excluir */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => deletePlant(index)}>
              <Text style={styles.deleteButtonText}>🗑
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      />

      <TouchableOpacity style={styles.captureButton} onPress={() => router.push("/scan")}>
        <Text style={styles.buttonText}>📷 Nova Foto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7F0",
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2B5B3C",
  },
  buttonSmall: {
    backgroundColor: "#6A9F6D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#4A7856",
    textAlign: "center",
  },
  captureButton: {
    backgroundColor: "#6A9F6D",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
