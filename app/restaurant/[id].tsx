import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import data from '../../data/sample-restaurants.json';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, totalItems, totalPrice } = useCart();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  
  const restaurant = data.restaurants.find((r: any) => r.id === id);

  if (!restaurant) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('restaurant_not_found')}</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtnError, { backgroundColor: colors.primary }]}>
          <Text style={{color: '#FFF'}}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMenuItem = (item: any) => (
    <View key={item.id} style={[styles.menuItem, { backgroundColor: colors.card }]}>
      <View style={styles.menuItemInfo}>
        <Text style={[styles.menuItemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.menuItemDesc, { color: colors.textSecondary }]} numberOfLines={2}>{item.desc}</Text>
        <Text style={[styles.menuItemPrice, { color: colors.primary }]}>₵{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.menuItemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary, borderColor: colors.card }]}
          onPress={() => addToCart(item, restaurant.id)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const menuByCategory = restaurant.menu.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.coverImageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.coverImage} />
          <View style={styles.headerControls}>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="heart-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>{restaurant.name}</Text>
          <Text style={[styles.tags, { color: colors.textSecondary }]}>{restaurant.tags.join(' • ')}</Text>
          
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={[styles.statText, { color: colors.text }]}><Text style={{fontWeight: 'bold'}}>{restaurant.rating}</Text> ({restaurant.reviews})</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.text }]}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="bicycle-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.text }]}>₵{restaurant.deliveryFee.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {Object.keys(menuByCategory).map(category => (
            <View key={category} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>{category}</Text>
              {menuByCategory[category].map((item: any) => renderMenuItem(item))}
            </View>
          ))}
        </View>
      </ScrollView>

      {totalItems > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.viewCartBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/cart')}>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalItems}</Text></View>
            <Text style={styles.viewCartText}>{t('view_cart')}</Text>
            <Text style={styles.viewCartTotal}>₵{totalPrice.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnError: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  coverImageContainer: {
    height: 250,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerControls: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    paddingBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tags: {
    fontSize: 14,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    marginLeft: 6,
  },
  menuContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  menuItemDesc: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuItemImageContainer: {
    position: 'relative',
  },
  menuItemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  viewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
  },
  cartBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewCartText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewCartTotal: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
