import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function LocationPickerScreen() {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
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
      
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addressObj = reverseGeocode[0];
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('delivery_address')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.currentLocationLabel, { color: colors.textSecondary }]}>{t('current_saved_location')}</Text>
        <View style={[styles.currentLocationBox, { backgroundColor: colors.card }]}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={[styles.currentLocationText, { color: colors.text }]}>{location}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.gpsBtn, { backgroundColor: colors.primary }]} 
          onPress={handleGetCurrentLocation}
          disabled={isFetchingLocation}
        >
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="navigate" size={20} color="#FFF" />
              <Text style={styles.gpsBtnText}>{t('use_current_location')}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>{t('or')}</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Text style={[styles.inputLabel, { color: colors.text }]}>{t('enter_new_address')}</Text>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput 
            placeholder={t('search_address_placeholder')}
            style={[styles.searchInput, { color: colors.text }]}
            placeholderTextColor={colors.textSecondary}
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>
        
        {searchInput.trim().length > 0 && (
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.text }]} onPress={handleSaveCustomLocation}>
            <Text style={[styles.saveBtnText, { color: colors.background }]}>{t('save_address')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  currentLocationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  currentLocationBox: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  dividerText: {
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  saveBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
