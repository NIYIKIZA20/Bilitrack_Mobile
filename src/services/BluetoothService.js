import { BleManager } from 'react-native-ble-plx';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
    this.isScanning = false;
    this.isConnected = false;
    this.currentDevice = null;
    this.onDataReceived = null;
    this.mockDevices = [
      { id: 'device1', name: 'HC-05 Module' },
      { id: 'device2', name: 'ESP32 Device' },
      { id: 'device3', name: 'Arduino Nano' }
    ];
  }

  // Request Bluetooth permissions
  async requestPermissions() {
    try {
      // For demo purposes, we'll simulate permission granted
      console.log('Bluetooth permissions requested');
      return true;
    } catch (error) {
      console.error('Error requesting Bluetooth permissions:', error);
      return false;
    }
  }

  // Check if Bluetooth is enabled
  async isBluetoothEnabled() {
    try {
      // For demo purposes, we'll simulate Bluetooth enabled
      console.log('Checking Bluetooth status');
      return true;
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      return false;
    }
  }

  // Enable Bluetooth
  async enableBluetooth() {
    try {
      console.log('Bluetooth enable requested');
      return true;
    } catch (error) {
      console.error('Error enabling Bluetooth:', error);
      return false;
    }
  }

  // Start scanning for devices
  async startScan(onDeviceFound) {
    if (this.isScanning) {
      return false;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Bluetooth permission not granted');
      }

      const isEnabled = await this.isBluetoothEnabled();
      if (!isEnabled) {
        throw new Error('Bluetooth is not enabled. Please enable Bluetooth in settings.');
      }

      this.isScanning = true;
      console.log('Starting Bluetooth scan...');
      
      // Simulate device discovery
      setTimeout(() => {
        this.mockDevices.forEach((device, index) => {
          setTimeout(() => {
            if (onDeviceFound) {
              onDeviceFound(device);
            }
          }, index * 1000); // Discover devices with 1-second intervals
        });
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error starting Bluetooth scan:', error);
      this.isScanning = false;
      return false;
    }
  }

  // Stop scanning
  async stopScan() {
    try {
      console.log('Stopping Bluetooth scan...');
      this.isScanning = false;
      return true;
    } catch (error) {
      console.error('Error stopping Bluetooth scan:', error);
      return false;
    }
  }

  // Connect to a device
  async connectToDevice(deviceId) {
    try {
      if (this.isConnected) {
        await this.disconnect();
      }

      console.log(`Connecting to device: ${deviceId}`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.isConnected = true;
      this.currentDevice = { id: deviceId, name: 'Connected Device' };

      // Simulate data reception after connection
      setTimeout(() => {
        if (this.onDataReceived) {
          const mockData = {
            value: `Sample data from ${deviceId} at ${new Date().toLocaleTimeString()}`
          };
          this.onDataReceived(mockData);
        }
      }, 3000);

      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      this.isConnected = false;
      this.currentDevice = null;
      return false;
    }
  }

  // Disconnect from current device
  async disconnect() {
    try {
      console.log('Disconnecting from device...');
      this.isConnected = false;
      this.currentDevice = null;
      return true;
    } catch (error) {
      console.error('Error disconnecting:', error);
      return false;
    }
  }

  // Set callback for data received
  setDataReceivedCallback(callback) {
    this.onDataReceived = callback;
  }

  // Get current connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isScanning: this.isScanning,
      currentDevice: this.currentDevice?.id || null,
    };
  }

  // Clean up listeners
  cleanup() {
    try {
      console.log('Cleaning up Bluetooth service...');
    } catch (error) {
      console.error('Error cleaning up Bluetooth service:', error);
    }
  }
}

export default new BluetoothService(); 