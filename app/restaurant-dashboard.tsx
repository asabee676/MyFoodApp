// Restaurant Dashboard Screen - Chowdeck/KaleDash Premium Merchant Interface
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Touch = TouchableOpacity as any;

const { width } = Dimensions.get('window');

export default function RestaurantDashboard() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const stats = [
    { id: '1', title: t('todays_orders'), value: '24', icon: 'cart-outline', color: '#4CAF50' },
    { id: '2', title: t('revenue'), value: 'GH₵ 1,250', icon: 'cash-outline', color: '#2196F3' },
    { id: '3', title: t('avg_prep_time'), value: '18 min', icon: 'time-outline', color: '#FF9800' },
    { id: '4', title: t('rating'), value: '4.8', icon: 'star-outline', color: '#F44336' },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'Abel A.', items: '2x Jollof, 1x Sobolo', status: t('in_kitchen'), statusCode: 'kitchen', time: '5m ago' },
    { id: 'ORD002', customer: 'Sarah M.', items: '1x Banku & Tilapia', status: t('ready'), statusCode: 'ready', time: '12m ago' },
    { id: 'ORD003', customer: 'John D.', items: '3x Waakye Mix', status: t('pickup'), statusCode: 'pickup', time: '15m ago' },
  ];

  const renderStatCard = ({ item }: { item: any }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderLeftColor: item.color }]}>
      <Ionicons name={item.icon} size={24} color={item.color} />
      <Text style={[styles.statValue, { color: colors.text }]}>{item.value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Touch onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Touch>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('merchant_dashboard')}</Text>
        <Touch style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.notifBadge} />
        </Touch>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>{t('welcome_back')},</Text>
          <Text style={[styles.restaurantName, { color: colors.text }]}>KFC Ghana - Osu Branch 🍗</Text>
        </View>

        <View style={styles.statsContainer}>
          <FlatList
            data={stats}
            renderItem={renderStatCard}
            keyExtractor={(item: any) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.statRow}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('live_orders')}</Text>
          <Touch>
            <Text style={[styles.seeAll, { color: colors.primary }]}>{t('view_history')}</Text>
          </Touch>
        </View>

        {recentOrders.map((order) => (
          <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.card }]}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderId, { color: colors.textSecondary }]}>{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: order.statusCode === 'ready' ? (isDark ? '#1B5E20' : '#E8F5E9') : (isDark ? '#E65100' : '#FFF3E0') }]}>
                <Text style={[styles.statusText, { color: order.statusCode === 'ready' ? (isDark ? '#81C784' : '#2E7D32') : (isDark ? '#FFB74D' : '#EF6C00') }]}>{order.status}</Text>
              </View>
            </View>
            <Text style={[styles.customerName, { color: colors.text }]}>{order.customer}</Text>
            <Text style={[styles.orderItems, { color: colors.textSecondary }]}>{order.items}</Text>
            <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.orderTime, { color: colors.textSecondary }]}>{order.time}</Text>
            </View>
          </View>
        ))}

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('quick_actions')}</Text>
          <View style={styles.actionGrid}>
            <Touch style={[styles.actionBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="restaurant-outline" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>{t('manage_menu')}</Text>
            </Touch>
            <Touch style={[styles.actionBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>{t('shop_settings')}</Text>
            </Touch>
            <Touch style={[styles.actionBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>{t('support')}</Text>
            </Touch>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notifBtn: {
    padding: 5,
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 14,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statsContainer: {
    marginBottom: 25,
  },
  statRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statTitle: {
    fontSize: 12,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderItems: {
    fontSize: 14,
    marginBottom: 10,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  orderTime: {
    fontSize: 12,
    marginLeft: 5,
  },
  quickActions: {
    marginTop: 10,
    marginBottom: 30,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionBtn: {
    width: (width - 60) / 3,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});
