import React from "react";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Image } from "react-native";

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [plantDescription, setPlantDescription] = useState("");
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      if (photoData) {
        console.log("📸 Foto capturada:", photoData.uri);
      } else {
        console.error("❌ Erro: Foto não capturada.");
      }

      if (photoData) {
        const fileName = `plant_${Date.now()}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;

        try {
          await FileSystem.moveAsync({
            from: photoData.uri,
            to: newPath,
          });

          console.log("✅ Foto salva em:", newPath);
          setPhoto(newPath);
          setModalVisible(true);
        } catch (error) {
          console.error("❌ Erro ao salvar imagem:", error);
        }
      }
    }
  }

  async function savePlantInfo() {
    if (!photo) {
      console.error("Erro: Nenhuma foto foi capturada!");
      return;
    }

    const newPlant = {
      uri: photo,
      name: plantName || "Planta sem nome",
      description: plantDescription || "Sem descrição",
    };

    try {
      const storedPlants = await AsyncStorage.getItem("plants");
      const plantsArray = storedPlants ? JSON.parse(storedPlants) : [];

      const updatedPlants = [...plantsArray, newPlant];

      await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));

      console.log("✅ Planta salva no AsyncStorage", updatedPlants);

      setModalVisible(false);
      router.push("/gallery");
    } catch (error) {
      console.error("❌ Erro ao salvar no AsyncStorage:", error);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={(ref) => (cameraRef.current = ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.text}>📷</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {photo && <Image source={{ uri: photo }} style={styles.preview} />}
          <TextInput style={styles.input} placeholder="Nome da Planta" value={plantName} onChangeText={setPlantName} />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={plantDescription}
            onChangeText={setPlantDescription}
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={savePlantInfo}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    camera: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingBottom: 20,
    },
    button: {
      backgroundColor: "#6A9F6D",
      padding: 10,
      borderRadius: 5,
    },
    captureButton: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 50,
    },
    text: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.8)",
      padding: 20,
    },
    preview: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
    },
    input: {
      width: "90%",
      backgroundColor: "#FFF",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    saveButton: {
      backgroundColor: "#6A9F6D",
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 18,
      color: "#FFF",
      fontWeight: "bold",
    },
    message: {
      fontSize: 18,
      color: "#4A7856",
      textAlign: "center",
    },
  });
  
