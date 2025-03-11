import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

/**
 * Tela de identificação de plantas usando a API Pl@ntNet.
 */
export default function IdentifyScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantData, setPlantData] = useState<any>(null);
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);

  const API_KEY = "2b10qasfnhNKzsaGVSQiLpQTwO"; 
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?api-key=${API_KEY}&lang=pt`;

  // Verifica permissões da câmera
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos de permissão para acessar a câmera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  /**
   * Captura a foto e envia para a API Pl@ntNet via multipart/form-data
   */
  async function takePictureAndIdentify() {
    if (!cameraRef.current) return;
    try {
      setIsLoading(true);

          // 1) Captura a foto (sem base64)
          const photoData = await cameraRef.current.takePictureAsync();
          if (!photoData?.uri) {
            console.error("Foto não capturada corretamente");
            setIsLoading(false);
            return;
          }
    
          // 2) Move para o FileSystem
          const fileName = `plant_${Date.now()}.jpg`;
          const newPath = `${FileSystem.documentDirectory}${fileName}`;
          await FileSystem.moveAsync({
            from: photoData.uri,
            to: newPath,
          });
    
          // 3) Salva no estado para exibir
          setPhoto(newPath);
    
          // 4) Chama a função de identificação
          const result = await identifyPlant(newPath);
          setPlantData(result);
    
        } catch (error) {
          console.error("Erro ao capturar/identificar a foto:", error);
        } finally {
          setIsLoading(false);
        }
      }

  /**
   * Função que monta o FormData e chama a API da Pl@ntNet
   */
  async function identifyPlant(photoDataUri: string) {
    const formData = new FormData();
    formData.append("images", {
      uri: photoDataUri,
      name: "plant.jpg",
      type: "image/jpeg",
    });
    formData.append("organs", "flower");

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const json = await response.json();
    console.log("Resposta da API Pl@ntNet:", json);
    return json;
  }

  async function savePlantInfo() {
    if (!photo || !plantData) {
      console.error("Falta foto ou dados da planta para salvar");
      return;
    }

    // Exemplo de como extrair dados
    const firstResult = plantData.results?.[0];
    const newPlant = {
      uri: photo,
      name: firstResult?.species?.scientificName || "Planta sem nome",
      description: "Identificada via Pl@ntNet",
      family: firstResult?.species?.family?.scientificNameWithoutAuthor || "",
      probability: firstResult?.score ? (firstResult.score * 100).toFixed(2) + "%" : "N/A",
    };

    try {
      // Lê o que já existe
      const storedPlants = await AsyncStorage.getItem("plants");
      const plantsArray = storedPlants ? JSON.parse(storedPlants) : [];

      // Adiciona a nova planta
      const updatedPlants = [...plantsArray, newPlant];
      await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));

      console.log("Planta salva no AsyncStorage:", newPlant);
      router.push("/gallery");
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  }


  return (
    <View style={styles.container}>
      {/* Se ainda não identificou nada, exibe a câmera */}
      {!plantData ? (
        <>
          <CameraView style={styles.camera} facing={facing} ref={(ref) => (cameraRef.current = ref)}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.buttonText}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureButton} onPress={takePictureAndIdentify}>
                <Text style={styles.buttonText}>Identify</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
          {isLoading && <ActivityIndicator size="large" color="#6A9F6D" style={styles.loading} />}
        </>
      ) : (
        // Se já identificou, mostra a foto e as infos
        <View style={styles.resultContainer}>
          {photo && <Image source={{ uri: photo }} style={styles.preview} />}
          <Text style={styles.resultTitle}>Resultado da Identificação:</Text>

          {plantData.results && plantData.results.length > 0 ? (
            <View style={styles.plantInfo}>
              <Text style={styles.infoText}>
                Nome Comum: {plantData.results[0].species.commonNames?.[0] || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                Nome Científico: {plantData.results[0].species.scientificName || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                Família:{" "}
                {plantData.results[0].species.family?.scientificNameWithoutAuthor || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                Probabilidade: {(plantData.results[0].score * 100).toFixed(2)}%
              </Text>
            </View>
          ) : (
            <Text style={styles.infoText}>Nenhum resultado encontrado.</Text>
          )}

          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.addButton} onPress={savePlantInfo}>
              <Text style={styles.buttonText}>Adicionar à Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/dashboard")}
            >
              <Text style={styles.buttonText}>Voltar ao Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    backgroundColor: "#6A9F6D",
    padding: 10,
    borderRadius: 5,
  },
  captureButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  plantInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  resultButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#6A9F6D",
    padding: 10,
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: "#6A9F6D",
    padding: 10,
    borderRadius: 5,
  },
});