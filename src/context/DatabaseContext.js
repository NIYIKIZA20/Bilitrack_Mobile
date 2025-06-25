import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      const database = SQLite.openDatabase('bluetoothData.db');
      setDb(database);

      // Create the data table if it doesn't exist
      database.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bluetooth_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bluetooth_data TEXT NOT NULL,
            data_name TEXT NOT NULL,
            date_created TEXT NOT NULL
          );`
        );
      }, 
      (error) => {
        console.error('Error creating table:', error);
      },
      () => {
        setIsInitialized(true);
      });
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  const addDataEntry = (bluetoothData, dataName) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const dateCreated = new Date().toISOString();

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO bluetooth_data (bluetooth_data, data_name, date_created) VALUES (?, ?, ?)',
          [bluetoothData, dataName, dateCreated],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const getAllData = () => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM bluetooth_data ORDER BY date_created DESC',
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const deleteDataEntry = (id) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM bluetooth_data WHERE id = ?',
          [id],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const clearAllData = () => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM bluetooth_data',
          [],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const value = {
    isInitialized,
    addDataEntry,
    getAllData,
    deleteDataEntry,
    clearAllData,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}; 