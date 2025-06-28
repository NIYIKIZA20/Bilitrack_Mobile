import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bluetoothData, setBluetoothData] = useState('');
  const [dataName, setDataName] = useState('');
  const [dataList, setDataList] = useState([]);

  const handleLogin = () => {
    if (username === 'admin' && password === 'password123') {
      setIsLoggedIn(true);
      Alert.alert('Success', 'Login successful!');
    } else {
      Alert.alert('Error', 'Invalid credentials. Use admin/password123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const saveData = () => {
    if (!bluetoothData.trim() || !dataName.trim()) {
      Alert.alert('Error', 'Please enter both data and data name');
      return;
    }

    const newEntry = {
      id: Date.now(),
      bluetoothData: bluetoothData.trim(),
      dataName: dataName.trim(),
      dateCreated: new Date().toLocaleString(),
    };

    setDataList(prev => [newEntry, ...prev]);
    setBluetoothData('');
    setDataName('');
    Alert.alert('Success', 'Data saved successfully!');
  };

  const deleteData = (id) => {
    setDataList(prev => prev.filter(item => item.id !== id));
    Alert.alert('Success', 'Data deleted successfully!');
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Bluetooth Data Manager</Text>
          <Text style={styles.subtitle}>Operator Login</Text>
          
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          <Text style={styles.credentials}>
            Demo: admin / password123
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Bluetooth Data Manager</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Entry</Text>
          <TextInput
            style={styles.input}
            placeholder="Bluetooth Data"
            value={bluetoothData}
            onChangeText={setBluetoothData}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Data Name"
            value={dataName}
            onChangeText={setDataName}
          />
          <TouchableOpacity style={styles.button} onPress={saveData}>
            <Text style={styles.buttonText}>Save Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Records ({dataList.length})</Text>
          {dataList.map((item) => (
            <View key={item.id} style={styles.dataItem}>
              <Text style={styles.dataLabel}>Data: {item.bluetoothData}</Text>
              <Text style={styles.dataLabel}>Name: {item.dataName}</Text>
              <Text style={styles.dataLabel}>Date: {item.dateCreated}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteData(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
  },
  dataItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  dataLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  credentials: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontStyle: 'italic',
  },
}); 