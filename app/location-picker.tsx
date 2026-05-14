import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useLocation } from '../context/LocationContext';

export default function LocationPickerScreen() {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setIsFetchingLocation(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      
      // Reverse geocode to get a readable address
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addressObj = reverseGeocode[0];
        // Construct a readable string
        const street = addressObj.street || addressObj.name;
        const city = addressObj.city || addressObj.region;
        
        let newLocStr = '';
        if (street && city) newLocStr = `${street}, ${city}`;
        else if (street) newLocStr = street;
        else if (city) newLocStr = city;
        else newLocStr = 'Unknown Location';

        await setLocation(newLocStr);
        router.back();
      } else {
        alert('Could not determine your address.');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching location. Please ensure location services are enabled on your device.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSaveCustomLocation = async () => {
    if (searchInput.trim().length > 0) {
      await setLocation(searchInput.trim());
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.currentLocationLabel}>CURRENT SAVED LOCATION</Text>
        <View style={styles.currentLocationBox}>
          <Ionicons name="location" size={20} color="#E53935" />
          <Text style={styles.currentLocationText}>{location}</Text>
        </View>

        <TouchableOpacity 
          style={styles.gpsBtn} 
          onPress={handleGetCurrentLocation}
          disabled={isFetchingLocation}
        >
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="navigate" size={20} color="#FFF" />
              <Text style={styles.gpsBtnText}>Use Current Location</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.inputLabel}>Enter a new address manually</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search for a street, city, or landmark" 
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>
        
        {searchInput.trim().length > 0 && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCustomLocation}>
            <Text style={styles.saveBtnText}>Save Address</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  closeBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  currentLocationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  currentLocationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  currentLocationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 15,
    borderRadius: 12,
  },
  gpsBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#888',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginLeft: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    paddingRight: 15,
    fontSize: 16,
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
