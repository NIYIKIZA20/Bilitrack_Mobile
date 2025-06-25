import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Card,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

const DataEntryScreen = ({ navigation }) => {
  const [bluetoothData, setBluetoothData] = useState('');
  const [dataName, setDataName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();
  const { addDataEntry } = useDatabase();

  const handleSave = async () => {
    if (!bluetoothData.trim()) {
      Alert.alert('Error', 'Please enter Bluetooth data');
      return;
    }

    if (!dataName.trim()) {
      Alert.alert('Error', 'Please enter a name for this data');
      return;
    }

    setIsLoading(true);
    try {
      await addDataEntry(bluetoothData.trim(), dataName.trim());
      Alert.alert(
        'Success',
        'Data saved successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setBluetoothData('');
    setDataName('');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={4}>
        <Text style={styles.title}>Manual Data Entry</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Data Information</Text>
            
            <TextInput
              label="Bluetooth Data"
              value={bluetoothData}
              onChangeText={setBluetoothData}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Enter the data received from Bluetooth module"
            />
            
            <TextInput
              label="Data Name"
              value={dataName}
              onChangeText={setDataName}
              mode="outlined"
              style={styles.input}
              placeholder="Enter a name for this data"
            />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Operator:</Text>
              <Text style={styles.infoValue}>{currentUser?.username}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date/Time:</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
            icon="content-save"
          >
            Save Data
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleClear}
            style={styles.button}
            disabled={isLoading}
            icon="eraser"
          >
            Clear
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            disabled={isLoading}
            icon="arrow-left"
          >
            Back
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2196F3',
  },
  card: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  infoValue: {
    color: '#2196F3',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

export default DataEntryScreen; 