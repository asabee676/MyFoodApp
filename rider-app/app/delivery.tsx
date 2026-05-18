import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MapPin, Phone, MessageSquare, Check, DollarSign, Compass, Award } from 'lucide-react-native';
import { useRiderStore } from '../store/riderStore';
import { SwipeButton } from '../components/SwipeButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeliveryScreen() {
  const router = useRouter();
  const { status, activeOrder, advanceStatus } = useRiderStore();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [useMockMap, setUseMockMap] = useState(Platform.OS === 'web');

  if (!activeOrder) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No active trip matched.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.backText}>Return Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle Checklist Toggles
  const toggleCheckItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const allItemsChecked = activeOrder.items.every(item => checkedItems[item]);

  // Determine Active Instructions & Swipe labels based on current step
  let stepTitle = '';
  let stepSubtitle = '';
  let swipeActionLabel = '';
  let destinationName = '';
  let destinationAddress = '';
  let showChecklist = false;
  let showPaymentBlock = false;

  if (status === 'heading_to_restaurant' || status === 'at_restaurant') {
    stepTitle = status === 'heading_to_restaurant' ? 'HEADING TO PICKUP' : 'ARRIVED AT RESTAURANT';
    stepSubtitle = status === 'heading_to_restaurant' ? 'Drive safely to restaurant location.' : 'Confirm and verify the items with merchant.';
    swipeActionLabel = status === 'heading_to_restaurant' ? 'SWIPE: ARRIVED AT RESTAURANT' : 'SWIPE: CONFIRM PICKUP';
    destinationName = activeOrder.restaurantName;
    destinationAddress = activeOrder.restaurantAddress;
    showChecklist = status === 'at_restaurant';
  } else if (status === 'heading_to_customer' || status === 'at_customer') {
    stepTitle = status === 'heading_to_customer' ? 'DELIVERING TO CUSTOMER' : 'ARRIVED AT CUSTOMER';
    stepSubtitle = status === 'heading_to_customer' ? 'Drive safely to customer address.' : 'Hand over package to customer.';
    swipeActionLabel = status === 'heading_to_customer' ? 'SWIPE: ARRIVED AT CUSTOMER' : 'SWIPE: COMPLETE DELIVERY';
    destinationName = activeOrder.customerName;
    destinationAddress = activeOrder.customerAddress;
    showPaymentBlock = status === 'at_customer';
  } else if (status === 'completed') {
    // Deliver Complete Screen
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.awardCircle}>
            <Award color="#FFFFFF" size={50} />
          </View>
          <Text style={styles.successTitle}>DELIVERY COMPLETE!</Text>
          <Text style={styles.successSubtitle}>Trip successfully delivered to {activeOrder.customerName}</Text>
          <View style={styles.payoutSummary}>
            <Text style={styles.payoutLabel}>YOU EARNED</Text>
            <Text style={styles.payoutValue}>GH₵ {activeOrder.estimatedEarnings.toFixed(2)}</Text>
          </View>
          <Text style={styles.autoReturnText}>Returning to searching state shortly...</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.returnText}>Go to Dashboard Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dynamic Map displaying routing lines */}
      {useMockMap ? (
        <View style={styles.mockMap}>
          <Compass color="#FF3D00" size={40} style={{ opacity: 0.15, position: 'absolute' }} />
          <Text style={styles.mockMapText}>Active Routing Map Simulation</Text>
          <Text style={styles.mockMapSubtext}>
            From: Accra Start Point -> To: {destinationName}
          </Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (activeOrder.restaurantLocation.latitude + activeOrder.customerLocation.latitude) / 2,
            longitude: (activeOrder.restaurantLocation.longitude + activeOrder.customerLocation.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          customMapStyle={darkMapStyle}
          onError={() => setUseMockMap(true)}
        >
          {/* Markers */}
          <Marker coordinate={activeOrder.restaurantLocation} title={activeOrder.restaurantName}>
            <View style={[styles.pinCircle, { backgroundColor: '#FF3D00' }]}>
              <Text style={styles.pinText}>R</Text>
            </View>
          </Marker>

          <Marker coordinate={activeOrder.customerLocation} title={activeOrder.customerName}>
            <View style={[styles.pinCircle, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.pinText}>C</Text>
            </View>
          </Marker>

          {/* Polyline connecting route */}
          <Polyline
            coordinates={[
              activeOrder.restaurantLocation,
              activeOrder.customerLocation
            ]}
            strokeColor="#FF3D00"
            strokeWidth={4}
          />
        </MapView>
      )}

      {/* Floating Header Navigation Step */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <View style={styles.topCard}>
          <Text style={styles.stepTitle}>{stepTitle}</Text>
          <Text style={styles.stepSubtitle}>{stepSubtitle}</Text>
        </View>
      </SafeAreaView>

      {/* Bottom Interactive Sheet */}
      <View style={styles.bottomSheet}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Customer / Restaurant Profile Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.avatarCircle}>
                <MapPin color="#FF3D00" size={24} />
              </View>
              <View style={styles.infoDetails}>
                <Text style={styles.locationTitle}>{destinationName}</Text>
                <Text style={styles.locationAddress}>{destinationAddress}</Text>
              </View>
            </View>

            {/* Direct contact controls */}
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn}>
                <Phone color="#E0E0E0" size={18} />
                <Text style={styles.contactText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn}>
                <MessageSquare color="#E0E0E0" size={18} />
                <Text style={styles.contactText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Checklist (At Restaurant) */}
          {showChecklist && (
            <View style={styles.checklistCard}>
              <Text style={styles.cardHeader}>VERIFY PACKAGE ITEMS</Text>
              {activeOrder.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.checkRow}
                  onPress={() => toggleCheckItem(item)}
                >
                  <View style={[styles.checkBox, checkedItems[item] && styles.checkBoxActive]}>
                    {checkedItems[item] && <Check color="#FFFFFF" size={12} strokeWidth={3} />}
                  </View>
                  <Text style={[styles.checkText, checkedItems[item] && styles.checkTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Payment Block (At Customer Dropoff - Hubtel cash collection style) */}
          {showPaymentBlock && (
            <View style={styles.paymentCard}>
              <Text style={styles.cardHeader}>PAYMENT INSTRUCTION</Text>
              <View style={styles.paymentRow}>
                <DollarSign color="#FF3D00" size={28} />
                <View>
                  <Text style={styles.paymentType}>{activeOrder.paymentMethod}</Text>
                  <Text style={styles.paymentDue}>
                    {activeOrder.paymentMethod === 'Cash on Delivery'
                      ? `Collect: GH₵ ${activeOrder.totalPrice.toFixed(2)}`
                      : 'Amount Prepaid Online'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Customer delivery note */}
          {(status === 'heading_to_customer' || status === 'at_customer') && (
            <View style={styles.notesCard}>
              <Text style={styles.cardHeader}>DELIVERY NOTES</Text>
              <Text style={styles.notesText}>"{activeOrder.deliveryNotes}"</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer Swipe confirming action progression */}
        <View style={styles.footerControls}>
          <SwipeButton
            onSwipeSuccess={advanceStatus}
            title={swipeActionLabel}
            color={
              showChecklist && !allItemsChecked
                ? '#555555' // Disabled grey if items not checked yet
                : '#FF3D00'
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.45,
  },
  mockMap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.45,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#2D2D2D',
  },
  mockMapText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '700',
  },
  mockMapSubtext: {
    color: '#555555',
    fontSize: 12,
    marginTop: 4,
  },
  pinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pinText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  topCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  stepTitle: {
    color: '#FF3D00',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  stepSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#161616',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginTop: -24,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoDetails: {
    flex: 1,
  },
  locationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  locationAddress: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  contactText: {
    color: '#E0E0E0',
    fontSize: 13,
    fontWeight: '700',
  },
  checklistCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 16,
  },
  cardHeader: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#292929',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4E4E4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkTextActive: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  paymentCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentType: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  paymentDue: {
    color: '#FF3D00',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  notesCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 16,
  },
  notesText: {
    color: '#E0E0E0',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  footerControls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#161616',
    borderTopWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  
  // Error View
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FF3D00',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Success state layout (Hubtel shift success summary feel)
  successContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  successCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  awardCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  successTitle: {
    color: '#4CAF50',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  successSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  payoutSummary: {
    backgroundColor: '#161616',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#282828',
  },
  payoutLabel: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  payoutValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  autoReturnText: {
    color: '#555555',
    fontSize: 12,
    fontWeight: '600',
  },
  returnBtn: {
    marginTop: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3D00',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  returnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

// Sleek dark map style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#161616' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#161616' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#747474' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#252525' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
];
