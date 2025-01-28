import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
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
      
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sua Galeria</Text>

            <FlatList
                data={plants}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.image}
                            onError={(e) => console.log("Erro ao carregar imagem:", item.uri, e.nativeEvent.error)}
                        />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.captureButton} onPress={() => router.push("/scan")}>
                <Text style={styles.buttonText}>📷 Nova Foto</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F2F7F0",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#2B5B3C",
      marginBottom: 10,
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
  });
  