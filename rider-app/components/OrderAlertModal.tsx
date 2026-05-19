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
import { useTheme } from '../context/ThemeContext';

export const OrderAlertModal: React.FC = () => {
  const { colors } = useTheme();
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
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Animated/ticking timer progress bar */}
          <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
            <View style={[styles.progressBar, { backgroundColor: colors.primary, width: `${timerPercentage}%` }]} />
          </View>

          <View style={styles.header}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>INCOMING TRIP</Text>
            </View>
            <Text style={styles.timerText}>{alertTimer}s left</Text>
          </View>

          {/* Earnings Estimate Section - The Chowdeck/Bolt influence */}
          <View style={[styles.earningsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.earningsLabel}>ESTIMATED PAYOUT</Text>
            <View style={styles.payoutRow}>
              <DollarSign stroke={colors.primary} size={32} strokeWidth={2.5} />
              <Text style={[styles.earningsAmount, { color: colors.text }]}>GH₵ {activeOrder.estimatedEarnings.toFixed(2)}</Text>
            </View>
            <Text style={styles.pricingDetails}>Includes peak surge boost & tips</Text>
          </View>

          {/* Trip Info Details */}
          <View style={[styles.infoGrid, { backgroundColor: colors.background }]}>
            <View style={styles.infoCol}>
              <Clock stroke={colors.icon} size={16} />
              <Text style={[styles.infoText, { color: colors.text }]}>{activeOrder.estimatedTime}</Text>
            </View>
            <View style={styles.infoCol}>
              <Navigation stroke={colors.icon} size={16} />
              <Text style={[styles.infoText, { color: colors.text }]}>{(parseFloat(activeOrder.pickupDistance) + parseFloat(activeOrder.dropoffDistance)).toFixed(1)} km total</Text>
            </View>
          </View>

          {/* Route Section */}
          <View style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Pickup */}
            <View style={styles.routeRow}>
              <View style={styles.dotContainer}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={[styles.line, { backgroundColor: colors.border }]} />
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={[styles.routeTitle, { color: colors.text }]}>{activeOrder.restaurantName}</Text>
                <Text style={styles.routeSubtitle}>{activeOrder.restaurantAddress}</Text>
              </View>
            </View>

            {/* Dropoff */}
            <View style={styles.routeRow}>
              <View style={styles.dotContainer}>
                <MapPin stroke={colors.icon} size={18} />
              </View>
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>DROPOFF</Text>
                <Text style={[styles.routeTitle, { color: colors.text }]}>{activeOrder.customerAddress}</Text>
                <Text style={styles.routeSubtitle}>Notes: {activeOrder.deliveryNotes}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.declineButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={rejectOrder}>
              <Text style={[styles.declineText, { color: colors.text }]}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.acceptButton, { backgroundColor: colors.primary }]} onPress={acceptOrder}>
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
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertBadge: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
  alertBadgeText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timerText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '800',
  },
  earningsCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
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
    borderRadius: 12,
    paddingVertical: 10,
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '700',
  },
  routeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
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
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    paddingBottom: 16,
  },
  routeLabel: {
    color: '#E53935',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  routeTitle: {
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  declineText: {
    fontSize: 16,
    fontWeight: '700',
  },
  acceptButton: {
    flex: 2,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
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
