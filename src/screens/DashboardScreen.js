import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Button,
  Card,
  Text,
  Surface,
  List,
  Divider,
  FAB,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import BluetoothService from '../services/BluetoothService';

const DashboardScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedData, setReceivedData] = useState(null);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [dataName, setDataName] = useState('');
  const [dataCount, setDataCount] = useState(0);

  const { currentUser, logout } = useAuth();
  const { addDataEntry, getAllData } = useDatabase();

  useEffect(() => {
    loadDataCount();
    setupBluetoothCallbacks();
    
    return () => {
      BluetoothService.cleanup();
    };
  }, []);

  const setupBluetoothCallbacks = () => {
    BluetoothService.setDataReceivedCallback((data) => {
      console.log('Received Bluetooth data:', data);
      setReceivedData(data.value || data);
      setShowDataDialog(true);
    });
  };

  const loadDataCount = async () => {
    try {
      const allData = await getAllData();
      setDataCount(allData.length);
    } catch (error) {
      console.error('Error loading data count:', error);
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setDevices([]);
    
    const success = await BluetoothService.startScan((device) => {
      setDevices(prev => {
        const exists = prev.find(d => d.id === device.id);
        if (!exists) {
          return [...prev, device];
        }
        return prev;
      });
    });

    if (!success) {
      Alert.alert('Error', 'Failed to start Bluetooth scan');
      setIsScanning(false);
    }
  };

  const handleStopScan = async () => {
    await BluetoothService.stopScan();
    setIsScanning(false);
  };

  const handleConnect = async (deviceId) => {
    const success = await BluetoothService.connectToDevice(deviceId);
    if (success) {
      setIsConnected(true);
      Alert.alert('Success', 'Connected to Bluetooth device');
    } else {
      Alert.alert('Error', 'Failed to connect to device');
    }
  };

  const handleDisconnect = async () => {
    await BluetoothService.disconnect();
    setIsConnected(false);
    Alert.alert('Success', 'Disconnected from Bluetooth device');
  };

  const handleSaveData = async () => {
    if (!dataName.trim()) {
      Alert.alert('Error', 'Please enter a name for this data');
      return;
    }

    try {
      await addDataEntry(receivedData, dataName.trim());
      setShowDataDialog(false);
      setDataName('');
      setReceivedData(null);
      loadDataCount();
      Alert.alert('Success', 'Data saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Bluetooth Status</Text>
            <View style={styles.statusRow}>
              <Text>Connection: </Text>
              <Text style={isConnected ? styles.connected : styles.disconnected}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text>Scanning: </Text>
              <Text style={isScanning ? styles.scanning : styles.notScanning}>
                {isScanning ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Bluetooth Controls</Text>
            <View style={styles.buttonRow}>
              {!isScanning ? (
                <Button
                  mode="contained"
                  onPress={handleStartScan}
                  style={styles.button}
                  icon="bluetooth-search"
                >
                  Start Scan
                </Button>
              ) : (
                <Button
                  mode="outlined"
                  onPress={handleStopScan}
                  style={styles.button}
                  icon="stop"
                >
                  Stop Scan
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>

        {devices.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Discovered Devices</Text>
              {devices.map((device, index) => (
                <List.Item
                  key={device.id || index}
                  title={device.name || 'Unknown Device'}
                  description={device.id}
                  left={(props) => <List.Icon {...props} icon="bluetooth" />}
                  right={() => (
                    <Button
                      mode="outlined"
                      onPress={() => handleConnect(device.id)}
                      disabled={isConnected}
                    >
                      Connect
                    </Button>
                  )}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Data Statistics</Text>
            <View style={styles.statsRow}>
              <Text>Total Records: </Text>
              <Text style={styles.statValue}>{dataCount}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('DataList')}
                style={styles.button}
                icon="database"
              >
                View All Data
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>User Information</Text>
            <Text>Operator: {currentUser?.username}</Text>
            <Text>Role: {currentUser?.role}</Text>
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handleLogout}
                style={styles.button}
                icon="logout"
              >
                Logout
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={showDataDialog} dismissable={false}>
          <Dialog.Title>New Bluetooth Data Received</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dataText}>Data: {receivedData}</Text>
            <TextInput
              label="Data Name"
              value={dataName}
              onChangeText={setDataName}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="Enter a name for this data"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDataDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveData}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2196F3',
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  connected: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  disconnected: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  scanning: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  notScanning: {
    color: '#9E9E9E',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dataText: {
    fontSize: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  dialogInput: {
    marginTop: 8,
  },
});

export default DashboardScreen; 