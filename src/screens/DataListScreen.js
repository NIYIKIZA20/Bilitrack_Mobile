import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  List,
  Divider,
  FAB,
  Portal,
  Dialog,
  Searchbar,
  Chip,
} from 'react-native-paper';
import { useDatabase } from '../context/DatabaseContext';

const DataListScreen = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { getAllData, deleteDataEntry, clearAllData } = useDatabase();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, dataList]);

  const loadData = async () => {
    try {
      const data = await getAllData();
      setDataList(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(dataList);
      return;
    }

    const filtered = dataList.filter(item =>
      item.bluetooth_data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date_created.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      await deleteDataEntry(selectedItem.id);
      await loadData();
      setShowDeleteDialog(false);
      setSelectedItem(null);
      Alert.alert('Success', 'Item deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await loadData();
              Alert.alert('Success', 'All data cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderDataItem = (item, index) => (
    <Card key={item.id || index} style={styles.dataCard}>
      <Card.Content>
        <View style={styles.dataHeader}>
          <Text style={styles.dataId}>#{item.id}</Text>
          <Chip icon="calendar" mode="outlined" style={styles.dateChip}>
            {formatDate(item.date_created)}
          </Chip>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Bluetooth Data:</Text>
          <Text style={styles.dataValue}>{item.bluetooth_data}</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Data Name:</Text>
          <Text style={styles.dataValue}>{item.data_name}</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Date Created:</Text>
          <Text style={styles.dataValue}>{formatDate(item.date_created)}</Text>
        </View>
        
        <View style={styles.actionRow}>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedItem(item);
              setShowDeleteDialog(true);
            }}
            icon="delete"
            style={styles.actionButton}
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search data..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.headerActions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('DataEntry')}
            icon="plus"
            style={styles.headerButton}
          >
            Add Data
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleClearAll}
            icon="delete-sweep"
            style={styles.headerButton}
            textColor="#F44336"
          >
            Clear All
          </Button>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <Card style={styles.loadingCard}>
            <Card.Content>
              <Text style={styles.loadingText}>Loading data...</Text>
            </Card.Content>
          </Card>
        ) : filteredData.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No data found matching your search.' : 'No data available.'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Showing {filteredData.length} of {dataList.length} records
              </Text>
            </View>
            
            {filteredData.map(renderDataItem)}
          </>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={showDeleteDialog} dismissable={false}>
          <Dialog.Title>Delete Data Entry</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this data entry?</Text>
            <Text style={styles.deleteDataText}>
              Data: {selectedItem?.bluetooth_data}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteItem} textColor="#F44336">
              Delete
            </Button>
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
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchbar: {
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  statsText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  dataCard: {
    marginBottom: 16,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dateChip: {
    backgroundColor: '#f0f0f0',
  },
  divider: {
    marginVertical: 8,
  },
  dataRow: {
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
  },
  actionRow: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  actionButton: {
    minWidth: 100,
  },
  loadingCard: {
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  deleteDataText: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    fontFamily: 'monospace',
  },
});

export default DataListScreen; 