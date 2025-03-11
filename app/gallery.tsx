import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert, 
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Plant {
  id: string;
  uri: string;
  name: string;
  description: string;
}

export default function GalleryScreen() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlantId, setCurrentPlantId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    async function loadPlants() {
      try {
        const storedPlants = await AsyncStorage.getItem("plants");
        if (storedPlants) {
          const parsedPlants: Plant[] = JSON.parse(storedPlants);
          const plantsWithIds = parsedPlants.map(plant => ({
            ...plant,
            id: plant.id || Date.now().toString()
          }));
          setPlants(plantsWithIds);
        }
      } catch (error) {
        console.error("Erro ao carregar plantas:", error);
      }
    }
    loadPlants();
  }, []);

  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deletePlant = async (id: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const updatedPlants = plants.filter(p => p.id !== id);
              setPlants(updatedPlants);
              await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
            } catch (error) {
              console.error("Erro ao excluir planta:", error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    const plant = plants.find(p => p.id === id);
    if (plant) {
      setEditedName(plant.name);
      setEditedDescription(plant.description);
      setCurrentPlantId(id);
      setIsModalVisible(true);
    }
  };

  const handleSave = async () => {
    if (!editedName.trim() || !editedDescription.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const updatedPlants = plants.map(plant => 
        plant.id === currentPlantId ? {
          ...plant,
          name: editedName,
          description: editedDescription,
        } : plant
      );
      
      setPlants(updatedPlants);
      await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
      setIsModalVisible(false);
      Alert.alert("Sucesso", "Planta atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar planta:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Sua Galeria</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push("/dashboard")}
          >
            <Text style={styles.buttonText}>🏡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou descrição..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* LISTA DE PLANTAS */}
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? "Nenhum resultado encontrado" : "Nenhuma planta cadastrada"}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              onError={(e) => console.log("Erro ao carregar imagem:", item.uri, e.nativeEvent.error)}
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton]} 
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton]} 
                onPress={() => deletePlant(item.id)}
              >
                <Text style={styles.actionButtonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* BOTÃO DE NOVA FOTO */}
      <TouchableOpacity 
        style={styles.captureButton} 
        onPress={() => router.push("/scan")}
      >
        <Text style={styles.buttonText}>📷 Nova Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.captureButton} 
        onPress={() => router.push("/identify")}
      >
        <Text style={styles.buttonText}>📷 Nova Identificação</Text>
      </TouchableOpacity>

      {/* MODAL DE EDIÇÃO */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior="padding" 
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Planta</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome da planta"
              value={editedName}
              onChangeText={setEditedName}
              autoFocus={true}
            />
            
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Descrição"
              value={editedDescription}
              onChangeText={setEditedDescription}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7F0",
  },
  header: {
    backgroundColor: '#F2F7F0',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeButton: {
    backgroundColor: '#6A9F6D',
    borderRadius: 10,
    padding: 11,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2B5B3C',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    marginHorizontal: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
  },
  
  captureButton: {
    backgroundColor: "#6A9F6D",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 40,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 15,
  },
  saveButtonText: {
    color: '#FFF',
  },
});