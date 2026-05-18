import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Navigation, DollarSign, Target, Bell, Compass, Radio } from 'lucide-react-native';
import { useRiderStore } from '../../store/riderStore';
import { SwipeButton } from '../../components/SwipeButton';
import { OrderAlertModal } from '../../components/OrderAlertModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const router = useRouter();
  const {
    isOnline,
    status,
    currentLocation,
    toggleOnline,
    earnings,
    bonusTarget,
  } = useRiderStore();

  const [useMockMap, setUseMockMap] = useState(Platform.OS === 'web');

  // Trigger redirection when order accepted
  useEffect(() => {
    if (
      status === 'heading_to_restaurant' ||
      status === 'at_restaurant' ||
      status === 'heading_to_customer' ||
      status === 'at_customer'
    ) {
      router.push('/delivery');
    }
  }, [status]);

  return (
    <View style={styles.container}>
      {/* Map Section */}
      {useMockMap ? (
        // Beautiful dark futuristic vector map mock for web and testing fallback
        <View style={styles.mockMapContainer}>
          <Compass color="#FF3D00" size={50} style={styles.mockCompass} />
          {status === 'searching' && (
            <View style={styles.radarContainer}>
              <View style={styles.radarRing1} />
              <View style={styles.radarRing2} />
              <View style={styles.radarRing3} />
              <Radio color="#FF3D00" size={32} />
              <Text style={styles.radarText}>Searching for matching orders...</Text>
            </View>
          )}
          {status === 'offline' && (
            <Text style={styles.offlineMapText}>You are currently offline</Text>
          )}
        </View>
      ) : (
        // Real MapView for Native Android/iOS
        <MapView
          style={styles.map}
          initialRegion={{
            ...currentLocation,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          customMapStyle={darkMapStyle}
          onError={() => setUseMockMap(true)} // Fallback if maps failure
        >
          <Marker coordinate={currentLocation}>
            <View style={styles.riderMarker}>
              <View style={styles.riderMarkerCore} />
            </View>
          </Marker>

          {isOnline && (
            <>
              {/* Surge heatmaps or demand zones */}
              <Circle
                center={{ latitude: 5.6322, longitude: -0.1585 }}
                radius={800}
                fillColor="rgba(255, 61, 0, 0.15)"
                strokeColor="rgba(255, 61, 0, 0.3)"
              />
              <Circle
                center={{ latitude: 5.6062, longitude: -0.1762 }}
                radius={600}
                fillColor="rgba(255, 61, 0, 0.1)"
                strokeColor="rgba(255, 61, 0, 0.2)"
              />
            </>
          )}
        </MapView>
      )}

      {/* Ticking Radar Indicator for Online State (Overlay) */}
      {isOnline && status === 'searching' && !useMockMap && (
        <View style={styles.searchingOverlay}>
          <ActivityIndicator color="#FF3D00" size="small" />
          <Text style={styles.searchingText}>Searching for trips near East Legon...</Text>
        </View>
      )}

      {/* Floating Status Bar / Header (Always Visible) */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.statsHeader}>
          {/* Today's Earning Summaries - The Chowdeck influence */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TODAY</Text>
            <Text style={styles.statValue}>GH₵ {earnings.today.toFixed(2)}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TRIPS</Text>
            <Text style={styles.statValue}>{earnings.tripsCompleted}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RATING</Text>
            <Text style={styles.statValue}>★ {earnings.rating}</Text>
          </View>
        </View>

        {/* Active Incentives - Chowdeck Gamification */}
        {isOnline && (
          <View style={styles.incentiveCard}>
            <Target color="#FF3D00" size={16} />
            <Text style={styles.incentiveText}>
              Incentive: Complete {bonusTarget.target} trips for GH₵ {bonusTarget.amount} bonus ({bonusTarget.current}/{bonusTarget.target})
            </Text>
          </View>
        )}
      </SafeAreaView>

      {/* Bottom Swipe Controls */}
      <View style={styles.bottomControls}>
        <SwipeButton
          onSwipeSuccess={toggleOnline}
          title={isOnline ? "SWIPE TO GO OFFLINE" : "SWIPE TO GO ONLINE"}
          color={isOnline ? "#E53935" : "#4CAF50"} // Green for Online, Red for Offline
        />
      </View>

      {/* Incoming Order Modal Component */}
      <OrderAlertModal />
    </View>
  );
}

// Visual premium styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  mockMapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockCompass: {
    opacity: 0.1,
    position: 'absolute',
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
  },
  offlineMapText: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '700',
  },
  riderMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 61, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.4)',
  },
  riderMarkerCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3D00',
  },
  searchingOverlay: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  searchingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#2D2D2D',
  },
  incentiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    gap: 8,
    width: '100%',
  },
  incentiveText: {
    color: '#E0E0E0',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  
  // Custom radar pulsing mock styling
  radarRing1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.1)',
  },
  radarRing2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.05)',
  },
  radarRing3: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.02)',
  },
});

// Sleek Uber/Chowdeck dark mode styling for MapView
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#161616' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#161616' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#747474' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#505050' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#121212' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#252525' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1d1d1d' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#303030' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0d0d0d' }],
  },
];
