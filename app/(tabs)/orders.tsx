import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import data from '../../data/sample-restaurants.json';

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' or 'past'
  const orders = data.orders || [];

  const ongoingOrders = orders.filter((o: any) => o.status === 'ongoing');
  const pastOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'cancelled');

  const renderActiveOrder = (order: any) => (
    <View key={order.id} style={styles.activeOrderCard}>
      <View style={styles.activeOrderHeader}>
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantIconPlaceholder}>
            <Ionicons name="restaurant" size={20} color="#E53935" />
          </View>
          <View>
            <Text style={styles.restaurantName}>{order.restaurant}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
        </View>
        <View style={styles.statusBadgeOngoing}>
          <Text style={styles.statusTextOngoing}>Preparing</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderItemsContainer}>
        <Text style={styles.itemsText}>{order.items.join(', ')}</Text>
        <Text style={styles.totalText}>₵{order.total.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      {order.rider && (
        <View style={styles.riderContainer}>
          <Image source={{ uri: order.rider.avatar }} style={styles.riderAvatar} />
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{order.rider.name}</Text>
            <Text style={styles.riderVehicle}>{order.rider.vehicle}</Text>
          </View>
          <View style={styles.riderActions}>
            <TouchableOpacity style={styles.riderBtn}>
              <Ionicons name="call" size={18} color="#E53935" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.riderBtn}>
              <Ionicons name="chatbubble" size={18} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.trackingContainer}>
        <Text style={styles.etaText}>Estimated Delivery: {order.estimatedTime}</Text>
        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackBtnText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPastOrder = (order: any) => (
    <View key={order.id} style={styles.pastOrderCard}>
      <View style={styles.pastOrderHeader}>
        <Text style={styles.restaurantName}>{order.restaurant}</Text>
        <Text style={styles.totalText}>₵{order.total.toFixed(2)}</Text>
      </View>
      <View style={styles.pastOrderMeta}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <View style={styles.statusBadgeDelivered}>
          <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
          <Text style={styles.statusTextDelivered}>Delivered</Text>
        </View>
      </View>
      <Text style={styles.itemsText} numberOfLines={1}>{order.items.join(', ')}</Text>
      
      <View style={styles.pastOrderActions}>
        <TouchableOpacity style={styles.rateBtn}>
          <Text style={styles.rateBtnText}>Rate Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reorderBtn}>
          <Text style={styles.reorderBtnText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            Active ({ongoingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'ongoing' ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map(renderActiveOrder)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#CCC" />
              <Text style={styles.emptyTitle}>No Active Orders</Text>
              <Text style={styles.emptySubtitle}>You don't have any ongoing orders at the moment.</Text>
            </View>
          )
        ) : (
          pastOrders.length > 0 ? (
            pastOrders.map(renderPastOrder)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={60} color="#CCC" />
              <Text style={styles.emptyTitle}>No Past Orders</Text>
              <Text style={styles.emptySubtitle}>Your order history will appear here.</Text>
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E53935',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#E53935',
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
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  activeOrderCard: {
    backgroundColor: '#FFF',
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
    backgroundColor: '#FBE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
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
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  orderItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    marginRight: 15,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  riderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
    color: '#333',
    marginBottom: 2,
  },
  riderVehicle: {
    fontSize: 12,
    color: '#777',
  },
  riderActions: {
    flexDirection: 'row',
  },
  riderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBE8E8',
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
    color: '#444',
  },
  trackBtn: {
    backgroundColor: '#E53935',
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
    backgroundColor: '#FFF',
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
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextDelivered: {
    color: '#4CAF50',
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
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  rateBtnText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  reorderBtn: {
    flex: 1,
    backgroundColor: '#FBE8E8',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  reorderBtnText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 14,
  },
});
