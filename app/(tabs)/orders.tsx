import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { getSocket, joinOrderRoom, leaveOrderRoom } from '../../utils/socket';

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' or 'past'
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const socket = getSocket();

    const handleStatusUpdate = (data: any) => {
      setOrders(prevOrders => prevOrders.map(o => {
        if (o.id === data.orderId) {
          return { ...o, status: data.status, riderName: data.riderName || o.riderName, estimatedTime: data.estimatedTime || o.estimatedTime };
        }
        return o;
      }));
    };

    socket.on('order:status_updated', handleStatusUpdate);
    socket.on('order:updated', handleStatusUpdate);

    return () => {
      socket.off('order:status_updated', handleStatusUpdate);
      socket.off('order:updated', handleStatusUpdate);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/client');
      const fetchedOrders = response.data.data || [];
      setOrders(fetchedOrders);
      
      // Join room for each active order
      fetchedOrders.forEach((order: any) => {
        if (['pending', 'processing', 'heading_to_restaurant', 'at_restaurant', 'heading_to_customer', 'at_customer'].includes(order.status)) {
          joinOrderRoom(order.id);
        }
      });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const ongoingOrders = orders.filter((o: any) => ['pending', 'processing', 'heading_to_restaurant', 'at_restaurant', 'heading_to_customer', 'at_customer'].includes(o.status));
  const pastOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'cancelled');

  const renderActiveOrder = (order: any) => (
    <View key={order.id} style={[styles.activeOrderCard, { backgroundColor: colors.card }]}>
      <View style={styles.activeOrderHeader}>
        <View style={styles.restaurantInfo}>
          <View style={[styles.restaurantIconPlaceholder, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
            <Ionicons name="restaurant" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.restaurantName, { color: colors.text }]}>{order.restaurantName || order.restaurant}</Text>
            <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{new Date(order.date).toLocaleString()}</Text>
          </View>
        </View>
      <View style={[styles.statusBadgeOngoing, { backgroundColor: isDark ? '#4A2B00' : '#FFF3E0' }]}>
        <Text style={[styles.statusTextOngoing, { color: isDark ? '#FFB74D' : '#F57C00' }]}>{order.status}</Text>
      </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.orderItemsContainer}>
        <Text style={[styles.itemsText, { color: colors.textSecondary }]}>{order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</Text>
        <Text style={[styles.totalText, { color: colors.text }]}>₵{order.total.toFixed(2)}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {order.riderName && (
        <View style={[styles.riderContainer, { backgroundColor: isDark ? '#222' : '#F9F9F9' }]}>
          <View style={styles.riderAvatar} />
          <View style={styles.riderInfo}>
            <Text style={[styles.riderName, { color: colors.text }]}>{order.riderName}</Text>
            <Text style={[styles.riderVehicle, { color: colors.textSecondary }]}>{order.riderPhone || 'Courier'}</Text>
          </View>
          <View style={styles.riderActions}>
            <TouchableOpacity style={[styles.riderBtn, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
              <Ionicons name="call" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.riderBtn, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
              <Ionicons name="chatbubble" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.trackingContainer}>
        <Text style={[styles.etaText, { color: colors.text }]}>{t('estimated_delivery')}: {order.estimatedTime || 'N/A'}</Text>
        <TouchableOpacity style={[styles.trackBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.trackBtnText}>{t('track_order')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPastOrder = (order: any) => (
    <View key={order.id} style={[styles.pastOrderCard, { backgroundColor: colors.card }]}>
      <View style={styles.pastOrderHeader}>
        <Text style={[styles.restaurantName, { color: colors.text }]}>{order.restaurantName || order.restaurant}</Text>
        <Text style={[styles.totalText, { color: colors.text }]}>₵{order.total.toFixed(2)}</Text>
      </View>
      <View style={styles.pastOrderMeta}>
        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{new Date(order.date).toLocaleString()}</Text>
        <View style={[styles.statusBadgeDelivered, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
          <Ionicons name={order.status === 'cancelled' ? 'close-circle' : 'checkmark-circle'} size={14} color={order.status === 'cancelled' ? '#E53935' : (isDark ? '#81C784' : '#4CAF50')} />
          <Text style={[styles.statusTextDelivered, { color: order.status === 'cancelled' ? '#E53935' : (isDark ? '#81C784' : '#4CAF50') }]}>{order.status}</Text>
        </View>
      </View>
      <Text style={[styles.itemsText, { color: colors.textSecondary }]} numberOfLines={1}>{order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</Text>
      
      <View style={styles.pastOrderActions}>
        <TouchableOpacity style={[styles.rateBtn, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
          <Text style={[styles.rateBtnText, { color: colors.text }]}>{t('rate_order')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.reorderBtn, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
          <Text style={[styles.reorderBtnText, { color: colors.primary }]}>{t('reorder')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('my_orders')}</Text>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ongoing' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'ongoing' && { color: colors.primary }]}>
            {t('active')} ({ongoingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'past' && { color: colors.primary }]}>
            {t('past_orders')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : activeTab === 'ongoing' ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map(renderActiveOrder)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('no_active_orders')}</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{t('no_active_subtitle')}</Text>
            </View>
          )
        ) : (
          pastOrders.length > 0 ? (
            pastOrders.map(renderPastOrder)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('no_past_orders')}</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{t('no_past_subtitle')}</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  activeOrderCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadgeOngoing: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextOngoing: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  orderItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsText: {
    fontSize: 14,
    flex: 1,
    marginRight: 15,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  riderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  riderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  riderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  riderVehicle: {
    fontSize: 12,
  },
  riderActions: {
    flexDirection: 'row',
  },
  riderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  trackingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  trackBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  pastOrderCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  pastOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pastOrderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadgeDelivered: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextDelivered: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  pastOrderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  rateBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  rateBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  reorderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  reorderBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
