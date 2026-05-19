import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { updateLocation } from '../utils/socket';

export default function DeliveryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { status, activeOrder, advanceStatus, currentLocation } = useRiderStore();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [useMockMap, setUseMockMap] = useState(Platform.OS === 'web');

  // Stream location while order is active
  useEffect(() => {
    if (activeOrder && status !== 'completed' && currentLocation) {
      const interval = setInterval(() => {
        updateLocation(activeOrder.id, currentLocation.latitude, currentLocation.longitude);
      }, 5000); // stream every 5 seconds
      return () => clearInterval(interval);
    }
  }, [activeOrder, status, currentLocation]);

  if (!activeOrder) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>No active trip matched.</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => router.replace('/(tabs)')}>
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
      <SafeAreaView style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.awardCircle}>
            <Award stroke="#FFFFFF" size={50} />
          </View>
          <Text style={styles.successTitle}>DELIVERY COMPLETE!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>Trip successfully delivered to {activeOrder.customerName}</Text>
          <View style={[styles.payoutSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.payoutLabel, { color: colors.textSecondary }]}>YOU EARNED</Text>
            <Text style={[styles.payoutValue, { color: colors.text }]}>GH₵ {activeOrder.estimatedEarnings.toFixed(2)}</Text>
          </View>
          <Text style={styles.autoReturnText}>Returning to searching state shortly...</Text>
          <TouchableOpacity style={[styles.returnBtn, { backgroundColor: colors.primary }]} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.returnText}>Go to Dashboard Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dynamic Map displaying routing lines */}
      {useMockMap ? (
        <View style={[styles.mockMap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Compass stroke={colors.primary} size={40} style={{ opacity: 0.15, position: 'absolute' } as any} />
          <Text style={[styles.mockMapText, { color: colors.textSecondary }]}>Active Routing Map Simulation</Text>
          <Text style={styles.mockMapSubtext}>
            From: Accra Start Point {'->'} To: {destinationName}
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
          customMapStyle={colors.mapStyle}
          // Fallback handled via useMockMap state
        >
          {/* Markers */}
          <Marker coordinate={activeOrder.restaurantLocation} title={activeOrder.restaurantName}>
            <View style={[styles.pinCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.pinText}>R</Text>
            </View>
          </Marker>

          <Marker coordinate={activeOrder.customerLocation} title={activeOrder.customerName}>
            <View style={[styles.pinCircle, { backgroundColor: colors.success }]}>
              <Text style={styles.pinText}>C</Text>
            </View>
          </Marker>

          {/* Polyline connecting route */}
          <Polyline
            coordinates={[
              activeOrder.restaurantLocation,
              activeOrder.customerLocation
            ]}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        </MapView>
      )}

      {/* Floating Header Navigation Step */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <View style={[styles.topCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.stepTitle, { color: colors.primary }]}>{stepTitle}</Text>
          <Text style={[styles.stepSubtitle, { color: colors.text }]}>{stepSubtitle}</Text>
        </View>
      </SafeAreaView>

      {/* Bottom Interactive Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Customer / Restaurant Profile Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <View style={styles.avatarCircle}>
                <MapPin stroke={colors.primary} size={24} />
              </View>
              <View style={styles.infoDetails}>
                <Text style={[styles.locationTitle, { color: colors.text }]}>{destinationName}</Text>
                <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>{destinationAddress}</Text>
              </View>
            </View>

            {/* Direct contact controls */}
            <View style={styles.contactRow}>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Phone stroke={colors.icon} size={18} />
                <Text style={[styles.contactText, { color: colors.text }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <MessageSquare stroke={colors.icon} size={18} />
                <Text style={[styles.contactText, { color: colors.text }]}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Checklist (At Restaurant) */}
          {showChecklist && (
            <View style={[styles.checklistCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardHeader, { color: colors.textSecondary }]}>VERIFY PACKAGE ITEMS</Text>
              {activeOrder.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.checkRow, { borderColor: colors.border }]}
                  onPress={() => toggleCheckItem(item)}
                >
                  <View style={[styles.checkBox, { borderColor: colors.border }, checkedItems[item] && styles.checkBoxActive]}>
                    {checkedItems[item] && <Check stroke="#FFFFFF" size={12} strokeWidth={3} />}
                  </View>
                  <Text style={[styles.checkText, { color: colors.text }, checkedItems[item] && [styles.checkTextActive, { color: colors.textSecondary }]]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Payment Block (At Customer Dropoff - Hubtel cash collection style) */}
          {showPaymentBlock && (
            <View style={[styles.paymentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardHeader, { color: colors.textSecondary }]}>PAYMENT INSTRUCTION</Text>
              <View style={styles.paymentRow}>
                <DollarSign stroke={colors.primary} size={28} />
                <View>
                  <Text style={[styles.paymentType, { color: colors.text }]}>{activeOrder.paymentMethod}</Text>
                  <Text style={[styles.paymentDue, { color: colors.primary }]}>
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
            <View style={[styles.notesCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardHeader, { color: colors.textSecondary }]}>DELIVERY NOTES</Text>
              <Text style={[styles.notesText, { color: colors.text }]}>"{activeOrder.deliveryNotes}"</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer Swipe confirming action progression */}
        <View style={[styles.footerControls, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <SwipeButton
            onSwipeSuccess={advanceStatus}
            title={swipeActionLabel}
            color={
              showChecklist && !allItemsChecked
                ? '#555555' // Disabled grey if items not checked yet
                : colors.primary
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
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.45,
  },
  mockMap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  mockMapText: {
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSheet: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    marginTop: -24,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoDetails: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  locationAddress: {
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '700',
  },
  checklistCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
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
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '700',
  },
  checkTextActive: {
    textDecorationLine: 'line-through',
  },
  paymentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '800',
  },
  paymentDue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  notesCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  footerControls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  
  // Error View
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Success state layout (Hubtel shift success summary feel)
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  successCard: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
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
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  payoutSummary: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 1,
  },
  payoutLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  payoutValue: {
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
