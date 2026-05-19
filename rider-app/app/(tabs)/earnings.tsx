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
import { useTheme } from '../../context/ThemeContext';

export default function EarningsScreen() {
  const { colors } = useTheme();
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
    { day: 'Mon', amount: 85, height: 40 },
    { day: 'Tue', amount: 110, height: 55 },
    { day: 'Wed', amount: 95, height: 45 },
    { day: 'Thu', amount: 140, height: 70 },
    { day: 'Fri', amount: 190, height: 95 },
    { day: 'Sat', amount: 120, height: 60 },
    { day: 'Sun', amount: earnings.today, height: Math.min((earnings.today / 200) * 100, 100) },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Earnings & Wallet</Text>

        {/* Cash Out confirmation alert banner */}
        {cashedOutSuccess && (
          <View style={styles.successBanner}>
            <Landmark stroke="#FFFFFF" size={18} />
            <Text style={styles.successBannerText}>GH₵ Transfer sent to Mobile Money wallet!</Text>
          </View>
        )}

        {/* Main Wallet Payout Card */}
        <View style={[styles.walletCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.walletHeader}>
            <View style={styles.walletLabelContainer}>
              <Wallet stroke={colors.primary} size={20} />
              <Text style={styles.walletLabel}>MAIN BALANCE</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE SHIFT</Text>
            </View>
          </View>

          <Text style={[styles.walletValue, { color: colors.text }]}>GH₵ {earnings.total.toFixed(2)}</Text>
          <Text style={styles.todayEarnings}>Today: +GH₵ {earnings.today.toFixed(2)}</Text>

          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={[styles.cashOutBtn, { backgroundColor: colors.primary }]} onPress={handleCashOut}>
            <Landmark stroke="#FFFFFF" size={18} />
            <Text style={styles.cashOutText}>Cash Out (Mobile Money)</Text>
            <ArrowUpRight stroke="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>

        {/* Chowdeck Gamified Incentive Targets */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Award stroke={colors.primary} size={18} />
            <Text style={styles.sectionTitleLabel}>DAILY CHALLENGE</Text>
          </View>
          <Text style={[styles.challengeTitle, { color: colors.text }]}>Weekend Rush Boost</Text>
          <Text style={styles.challengeDesc}>
            Complete {bonusTarget.target} deliveries today to secure an extra GH₵ {bonusTarget.amount.toFixed(2)} boost.
          </Text>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: colors.primary, width: `${(bonusTarget.current / bonusTarget.target) * 100}%` },
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
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <TrendingUp stroke={colors.primary} size={18} />
            <Text style={styles.sectionTitleLabel}>WEEKLY STATISTICS</Text>
          </View>

          {/* Bar Chart Container */}
          <View style={styles.chartContainer}>
            {weeklyData.map((data, idx) => (
              <View key={idx} style={styles.chartBarCol}>
                <View style={[styles.chartBarBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.chartBarFill, { backgroundColor: colors.primary, height: `${data.height}%` as any }]} />
                </View>
                <Text style={styles.chartBarLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transaction History list */}
        <Text style={[styles.historyTitle, { color: colors.text }]}>Trip History</Text>

        <View style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.historyLeft}>
            <Calendar stroke={colors.icon} size={18} />
            <View>
              <Text style={[styles.historyRest, { color: colors.text }]}>Mama's Kitchen</Text>
              <Text style={styles.historyDate}>Today, 12:30 PM</Text>
            </View>
          </View>
          <View style={styles.historyRight}>
            <Text style={[styles.historyAmount, { color: colors.primary }]}>+GH₵ 8.50</Text>
            <ChevronRight stroke={colors.icon} size={16} />
          </View>
        </View>

        <View style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.historyLeft}>
            <Calendar stroke={colors.icon} size={18} />
            <View>
              <Text style={[styles.historyRest, { color: colors.text }]}>Pizza Palace</Text>
              <Text style={styles.historyDate}>Yesterday, 7:15 PM</Text>
            </View>
          </View>
          <View style={styles.historyRight}>
            <Text style={[styles.historyAmount, { color: colors.primary }]}>+GH₵ 12.00</Text>
            <ChevronRight stroke={colors.icon} size={16} />
          </View>
        </View>

        <View style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.historyLeft}>
            <Calendar stroke={colors.icon} size={18} />
            <View>
              <Text style={[styles.historyRest, { color: colors.text }]}>Shawarma Zone</Text>
              <Text style={styles.historyDate}>May 12, 1:45 PM</Text>
            </View>
          </View>
          <View style={styles.historyRight}>
            <Text style={[styles.historyAmount, { color: colors.primary }]}>+GH₵ 9.50</Text>
            <ChevronRight stroke={colors.icon} size={16} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
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
    marginVertical: 20,
  },
  cashOutBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
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
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 7,
  },
  chartBarLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyRest: {
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
    fontSize: 15,
    fontWeight: '800',
  },
});
