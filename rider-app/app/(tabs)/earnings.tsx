import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Wallet, Landmark, ArrowUpRight, TrendingUp, Calendar, ChevronRight, Award } from 'lucide-react-native';
import { useRiderStore } from '../../store/riderStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EarningsScreen() {
  const { earnings, bonusTarget, cashOut } = useRiderStore();
  const [cashedOutSuccess, setCashedOutSuccess] = useState(false);

  const handleCashOut = () => {
    if (earnings.today === 0) {
      alert("No earnings today to cash out!");
      return;
    }
    
    cashOut();
    setCashedOutSuccess(true);
    setTimeout(() => {
      setCashedOutSuccess(false);
    }, 3000);
  };

  // Mock weekly history statistics data
  const weeklyData = [
    { day: 'Mon', amount: 85, height: '40%' },
    { day: 'Tue', amount: 110, height: '55%' },
    { day: 'Wed', amount: 95, height: '45%' },
    { day: 'Thu', amount: 140, height: '70%' },
    { day: 'Fri', amount: 190, height: '95%' },
    { day: 'Sat', amount: 120, height: '60%' },
    { day: 'Sun', amount: earnings.today, height: `${Math.min((earnings.today / 200) * 100, 100)}%` },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={styles.screenTitle}>Earnings & Wallet</Text>

        {/* Cash Out confirmation alert banner */}
        {cashedOutSuccess && (
          <View style={styles.successBanner}>
            <Landmark color="#FFFFFF" size={18} />
            <Text style={styles.successBannerText}>GH₵ Transfer sent to Mobile Money wallet!</Text>
          </View>
        )}

        {/* Main Wallet Payout Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletLabelContainer}>
              <Wallet color="#FF3D00" size={20} />
              <Text style={styles.walletLabel}>MAIN BALANCE</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE SHIFT</Text>
            </View>
          </View>

          <Text style={styles.walletValue}>GH₵ {earnings.total.toFixed(2)}</Text>
          <Text style={styles.todayEarnings}>Today: +GH₵ {earnings.today.toFixed(2)}</Text>

          <View style={styles.cardDivider} />

          <TouchableOpacity style={styles.cashOutBtn} onPress={handleCashOut}>
            <Landmark color="#FFFFFF" size={18} />
            <Text style={styles.cashOutText}>Cash Out (Mobile Money)</Text>
            <ArrowUpRight color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>

        {/* Chowdeck Gamified Incentive Targets */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Award color="#FF3D00" size={18} />
            <Text style={styles.sectionTitleLabel}>DAILY CHALLENGE</Text>
          </View>
          <Text style={styles.challengeTitle}>Weekend Rush Boost</Text>
          <Text style={styles.challengeDesc}>
            Complete {bonusTarget.target} deliveries today to secure an extra GH₵ {bonusTarget.amount.toFixed(2)} boost.
          </Text>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(bonusTarget.current / bonusTarget.target) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {bonusTarget.current} / {bonusTarget.target} completed
            </Text>
          </View>
          
          {bonusTarget.current >= bonusTarget.target && (
            <View style={styles.congratsBadge}>
              <Text style={styles.congratsText}>✓ GH₵ 10.00 Boost Unlocked!</Text>
            </View>
          )}
        </View>

        {/* Weekly Earning Chart Representation */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#FF3D00" size={18} />
            <Text style={styles.sectionTitleLabel}>WEEKLY STATISTICS</Text>
          </View>

          {/* Bar Chart Container */}
          <View style={styles.chartContainer}>
            {weeklyData.map((data, idx) => (
              <View key={idx} style={styles.chartBarCol}>
                <View style={styles.chartBarBg}>
                  <View style={[styles.chartBarFill, { height: data.height }]} />
                </View>
                <Text style={styles.chartBarLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transaction History list */}
        <Text style={styles.historyTitle}>Trip History</Text>

        <View style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <Calendar color="#B0B0B0" size={18} />
            <View>
              <Text style={styles.historyRest}>Mama's Kitchen</Text>
              <Text style={styles.historyDate}>Today, 12:30 PM</Text>
            </View>
          </View>
          <View style={styles.historyRight}>
            <Text style={styles.historyAmount}>+GH₵ 8.50</Text>
            <ChevronRight color="#555555" size={16} />
          </View>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <Calendar color="#B0B0B0" size={18} />
            <View>
              <Text style={styles.historyRest}>Pizza Palace</Text>
              <Text style={styles.historyDate}>Yesterday, 7:15 PM</Text>
            </View>
          </View>
          <View style={styles.historyRight}>
            <Text style={styles.historyAmount}>+GH₵ 12.00</Text>
            <ChevronRight color="#555555" size={16} />
          </View>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <Calendar color="#B0B0B0" size={18} />
            <View>
              <Text style={styles.historyRest}>Shawarma Zone</Text>
              <Text style={styles.historyDate}>May 12, 1:45 PM</Text>
            </View>
          </View>
          <View style={styles.historyRight}>
            <Text style={styles.historyAmount}>+GH₵ 9.50</Text>
            <ChevronRight color="#555555" size={16} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  successBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  walletCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  activeBadgeText: {
    color: '#4CAF50',
    fontSize: 9,
    fontWeight: '900',
  },
  walletValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
  },
  todayEarnings: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#2D2D2D',
    marginVertical: 20,
  },
  cashOutBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3D00',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cashOutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitleLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  challengeDesc: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: 16,
    gap: 6,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2D2D2D',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF3D00',
    borderRadius: 4,
  },
  progressText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  congratsBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  congratsText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '800',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  chartBarCol: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarBg: {
    height: 90,
    width: 14,
    backgroundColor: '#2D2D2D',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#FF3D00',
    borderRadius: 7,
  },
  chartBarLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700',
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyRest: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  historyDate: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyAmount: {
    color: '#FF3D00',
    fontSize: 15,
    fontWeight: '800',
  },
});
