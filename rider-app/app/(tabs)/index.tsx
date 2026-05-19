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
import { useTheme } from '../../context/ThemeContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map Section */}
      {useMockMap ? (
        // Beautiful futuristic vector map mock for web and testing fallback
        <View style={[styles.mockMapContainer, { backgroundColor: colors.surface }]}>
          <Compass stroke={colors.primary} size={50} style={styles.mockCompass as any} />
          {status === 'searching' && (
            <View style={styles.radarContainer}>
              <View style={styles.radarRing1} />
              <View style={styles.radarRing2} />
              <View style={styles.radarRing3} />
              <Radio stroke={colors.primary} size={32} />
              <Text style={[styles.radarText, { color: colors.textSecondary }]}>Searching for matching orders...</Text>
            </View>
          )}
          {status === 'offline' && (
            <Text style={[styles.offlineMapText, { color: colors.textSecondary }]}>You are currently offline</Text>
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
          customMapStyle={colors.mapStyle}
          // Fallback handled via useMockMap state
        >
          <Marker coordinate={currentLocation}>
            <View style={styles.riderMarker}>
              <View style={[styles.riderMarkerCore, { backgroundColor: colors.primary }]} />
            </View>
          </Marker>

          {isOnline && (
            <>
              {/* Surge heatmaps or demand zones */}
              <Circle
                center={{ latitude: 5.6322, longitude: -0.1585 }}
                radius={800}
                fillColor="rgba(229, 57, 53, 0.15)"
                strokeColor="rgba(229, 57, 53, 0.3)"
              />
              <Circle
                center={{ latitude: 5.6062, longitude: -0.1762 }}
                radius={600}
                fillColor="rgba(229, 57, 53, 0.1)"
                strokeColor="rgba(229, 57, 53, 0.2)"
              />
            </>
          )}
        </MapView>
      )}

      {/* Ticking Radar Indicator for Online State (Overlay) */}
      {isOnline && status === 'searching' && !useMockMap && (
        <View style={[styles.searchingOverlay, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={[styles.searchingText, { color: colors.text }]}>Searching for trips near East Legon...</Text>
        </View>
      )}

      {/* Floating Status Bar / Header (Always Visible) */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={[styles.statsHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Today's Earning Summaries - The Chowdeck influence */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TODAY</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>GH₵ {earnings.today.toFixed(2)}</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TRIPS</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{earnings.tripsCompleted}</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RATING</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>★ {earnings.rating}</Text>
          </View>
        </View>

        {/* Active Incentives - Chowdeck Gamification */}
        {isOnline && (
          <View style={[styles.incentiveCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Target stroke={colors.primary} size={16} />
            <Text style={[styles.incentiveText, { color: colors.text }]}>
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
          color={isOnline ? colors.primary : colors.success}
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
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  mockMapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
  },
  offlineMapText: {
    fontSize: 16,
    fontWeight: '700',
  },
  riderMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.4)',
  },
  riderMarkerCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  searchingOverlay: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  searchingText: {
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
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
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
    fontSize: 16,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  incentiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 8,
    width: '100%',
  },
  incentiveText: {
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
    borderColor: 'rgba(229, 57, 53, 0.1)',
  },
  radarRing2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.05)',
  },
  radarRing3: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.02)',
  },
});
