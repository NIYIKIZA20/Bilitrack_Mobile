# Bluetooth Data Manager

A React Native mobile application that receives string data from Bluetooth modules, associates it with data names, and stores it securely with timestamps.

## Features

- **Bluetooth Connectivity**: Scan, discover, and connect to Bluetooth Low Energy (BLE) devices
- **Secure Authentication**: Operator login system with encrypted credentials
- **Data Management**: Store and manage Bluetooth data with data names and timestamps
- **Real-time Data Reception**: Automatically receive and process incoming Bluetooth data
- **Data Table**: Three-column storage (Bluetooth Data, Data Name, Date Created)
- **Search & Filter**: Search through stored data records
- **Manual Entry**: Add data entries manually when needed
- **Data Export**: View all stored data in a organized table format

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Clone or download the project**
   ```bash
   cd "Mobile app"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally (if not already installed)**
   ```bash
   npm install -g @expo/cli
   ```

## Setup

### 1. Configure Bluetooth Permissions

The app is already configured with necessary Bluetooth permissions in `app.json`:

- **Android**: BLUETOOTH, BLUETOOTH_ADMIN, BLUETOOTH_CONNECT, BLUETOOTH_SCAN, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION
- **iOS**: NSBluetoothAlwaysUsageDescription, NSBluetoothPeripheralUsageDescription

### 2. Default Login Credentials

For testing purposes, use these credentials:
- **Username**: `admin`
- **Password**: `password123`

## Running the App

### Development Mode

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on device/simulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your phone

### Building for Production

1. **Build for Android**
   ```bash
   expo build:android
   ```

2. **Build for iOS**
   ```bash
   expo build:ios
   ```

## Usage Guide

### 1. Login
- Open the app and enter the operator credentials
- The system uses secure storage for authentication tokens

### 2. Bluetooth Connection
- Navigate to the Dashboard
- Tap "Start Scan" to discover nearby Bluetooth Low Energy devices
- Select a device and tap "Connect"
- The app will automatically listen for incoming data

### 3. Data Reception
- When Bluetooth data is received, a dialog will appear
- Enter a **name for this data** (not your operator name)
- Tap "Save" to store the entry

### 4. Data Management
- View all stored data in the "Data Records" section
- Search through records using the search bar
- Delete individual entries or clear all data
- Add manual entries if needed

### 5. Data Structure
Each data entry contains:
- **Bluetooth Data**: The string received from the Bluetooth module
- **Data Name**: The name/label given to this data by the operator
- **Date Created**: Timestamp when the data was received and stored

## Project Structure

```
src/
├── context/
│   ├── AuthContext.js          # Authentication management
│   └── DatabaseContext.js      # SQLite database operations
├── screens/
│   ├── LoginScreen.js          # Login interface
│   ├── DashboardScreen.js      # Main dashboard with Bluetooth controls
│   ├── DataEntryScreen.js      # Manual data entry
│   └── DataListScreen.js       # Data table view
└── services/
    └── BluetoothService.js     # Bluetooth functionality
```

## Technical Details

### Database Schema
```sql
CREATE TABLE bluetooth_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bluetooth_data TEXT NOT NULL,
    data_name TEXT NOT NULL,
    date_created TEXT NOT NULL
);
```

### Security Features
- Secure credential storage using Expo SecureStore
- Encrypted authentication tokens
- Protected data access requiring login

### Bluetooth Implementation
- Uses react-native-ble-plx for Bluetooth Low Energy (BLE) compatibility
- Automatic device discovery and connection
- Real-time data reception with callbacks
- Proper permission handling

## Troubleshooting

### Common Issues

1. **Bluetooth not working**
   - Ensure Bluetooth is enabled on your device
   - Check that location permissions are granted
   - Restart the app after granting permissions

2. **Cannot connect to device**
   - Make sure the Bluetooth module is in pairing mode
   - Check if the device is compatible with your phone
   - Try restarting the Bluetooth service

3. **App crashes on startup**
   - Clear app data and cache
   - Reinstall the app
   - Check for any missing dependencies

### Development Notes

- The app uses Expo SDK 49 for compatibility
- SQLite is used for local data storage
- React Native Paper provides the UI components
- Navigation is handled by React Navigation
- react-native-ble-plx is used for Bluetooth Low Energy functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the Expo documentation
3. Create an issue in the repository

---

**Note**: This app is designed for industrial use where operators need to securely manage Bluetooth data with proper authentication and audit trails. The operator enters a name/label for each piece of data received, not their own operator name. 