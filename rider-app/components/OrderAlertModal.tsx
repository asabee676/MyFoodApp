import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MapPin, DollarSign, Clock, Navigation } from 'lucide-react-native';
import { useRiderStore } from '../store/riderStore';

export const OrderAlertModal: React.FC = () => {
  const { status, activeOrder, alertTimer, acceptOrder, rejectOrder, decrementTimer } = useRiderStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'order_alert') {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  if (status !== 'order_alert' || !activeOrder) return null;

  // Calculate percentage of timer left for progress bar
  const timerPercentage = (alertTimer / 15) * 100;

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Animated/ticking timer progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${timerPercentage}%` }]} />
          </View>

          <View style={styles.header}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>INCOMING TRIP</Text>
            </View>
            <Text style={styles.timerText}>{alertTimer}s left</Text>
          </View>

          {/* Earnings Estimate Section - The Chowdeck/Bolt influence */}
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>ESTIMATED PAYOUT</Text>
            <View style={styles.payoutRow}>
              <DollarSign color="#FF3D00" size={32} strokeWidth={2.5} />
              <Text style={styles.earningsAmount}>GH₵ {activeOrder.estimatedEarnings.toFixed(2)}</Text>
            </View>
            <Text style={styles.pricingDetails}>Includes peak surge boost & tips</Text>
          </View>

          {/* Trip Info Details */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Clock color="#B0B0B0" size={16} />
              <Text style={styles.infoText}>{activeOrder.estimatedTime}</Text>
            </View>
            <View style={styles.infoCol}>
              <Navigation color="#B0B0B0" size={16} />
              <Text style={styles.infoText}>{(parseFloat(activeOrder.pickupDistance) + parseFloat(activeOrder.dropoffDistance)).toFixed(1)} km total</Text>
            </View>
          </View>

          {/* Route Section */}
          <View style={styles.routeCard}>
            {/* Pickup */}
            <View style={styles.routeRow}>
              <View style={styles.dotContainer}>
                <View style={[styles.dot, { backgroundColor: '#FF3D00' }]} />
                <View style={styles.line} />
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.routeTitle}>{activeOrder.restaurantName}</Text>
                <Text style={styles.routeSubtitle}>{activeOrder.restaurantAddress}</Text>
              </View>
            </View>

            {/* Dropoff */}
            <View style={styles.routeRow}>
              <View style={styles.dotContainer}>
                <MapPin color="#FFFFFF" size={18} />
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>DROPOFF</Text>
                <Text style={styles.routeTitle}>{activeOrder.customerAddress}</Text>
                <Text style={styles.routeSubtitle}>Notes: {activeOrder.deliveryNotes}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.declineButton} onPress={rejectOrder}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={acceptOrder}>
              <Text style={styles.acceptText}>Accept Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  container: {
    width: Dimensions.get('window').width - 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF3D00',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertBadge: {
    backgroundColor: 'rgba(255, 61, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 0, 0.3)',
  },
  alertBadgeText: {
    color: '#FF3D00',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timerText: {
    color: '#FF3D00',
    fontSize: 16,
    fontWeight: '800',
  },
  earningsCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#292929',
  },
  earningsLabel: {
    color: '#B0B0B0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginLeft: 2,
  },
  pricingDetails: {
    color: '#757575',
    fontSize: 12,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#161616',
    borderRadius: 12,
    paddingVertical: 10,
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '700',
  },
  routeCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#292929',
  },
  routeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dotContainer: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#333333',
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    paddingBottom: 16,
  },
  routeLabel: {
    color: '#FF3D00',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  routeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  routeSubtitle: {
    color: '#9E9E9E',
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  declineText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '700',
  },
  acceptButton: {
    flex: 2,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3D00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
