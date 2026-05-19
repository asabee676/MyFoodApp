import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, TextInput, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import data from '../../data/sample-restaurants.json';
import { useLocation } from '../../context/LocationContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

export default function HomeScreen() {
  const router = useRouter();
  const { categories, promos } = data;
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { location } = useLocation();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants');
        setRestaurants(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    restaurant.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: colors.card }]}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.restaurantCard, { backgroundColor: colors.card }]} 
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={[styles.restaurantName, { color: colors.text }]}>{item.name}</Text>
          <View style={[styles.ratingBadge, { backgroundColor: isDark ? '#333' : '#FFF9E6' }]}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={[styles.ratingText, { color: isDark ? '#FFD700' : '#B8860B' }]}>{item.rating}</Text>
          </View>
        </View>
        <Text style={[styles.cuisineText, { color: colors.textSecondary }]}>{item.cuisine.join(' • ')}</Text>
        <View style={styles.deliveryInfo}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.deliveryText, { color: colors.textSecondary }]}>{item.deliveryTime}</Text>
          <Text style={[styles.dot, { color: colors.border }]}>•</Text>
          <Ionicons name="bicycle-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.deliveryText, { color: colors.textSecondary }]}>₵{item.deliveryFee.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>{t('greeting')}</Text>
          <TouchableOpacity style={styles.locationContainer} onPress={() => router.push('/location-picker')}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>{location}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abel' }} style={styles.profileImg} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput 
            placeholder={t('search_craving')} 
            style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            <Ionicons name="options" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Promo Banner - Only show if not searching */}
        {searchQuery === '' && (
          <View style={styles.promoBanner}>
            <Image source={{ uri: promos[0].image }} style={styles.promoImage} />
            <View style={styles.promoOverlay}>
              <Text style={[styles.promoTag, { backgroundColor: colors.primary }]}>{promos[0].tag}</Text>
              <Text style={styles.promoTitle}>{promos[0].title}</Text>
              <Text style={styles.promoSubtitle}>{promos[0].subtitle}</Text>
            </View>
          </View>
        )}

        {/* Categories - Only show if not searching */}
        {searchQuery === '' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('categories')}</Text>
              <TouchableOpacity><Text style={[styles.seeAllText, { color: colors.primary }]}>{t('see_all')}</Text></TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </>
        )}

        {/* Featured Restaurants / Search Results */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchQuery ? t('search_results') : t('featured_restaurants')}
          </Text>
          {!searchQuery && <TouchableOpacity><Text style={[styles.seeAllText, { color: colors.primary }]}>{t('see_all')}</Text></TouchableOpacity>}
        </View>
        
        <View style={styles.restaurantsList}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant: any) => (
              <React.Fragment key={restaurant.id}>
                {renderRestaurant({ item: restaurant })}
              </React.Fragment>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 20 }}>
              {t('no_results')} &quot;{searchQuery}&quot;
            </Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10, 
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEE',
    overflow: 'hidden',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 35,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingLeft: 45,
    paddingRight: 15,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  promoBanner: {
    marginHorizontal: 20,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  promoTag: {
    color: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promoSubtitle: {
    color: '#EEE',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cuisineText: {
    fontSize: 13,
    marginBottom: 10,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 13,
    marginLeft: 4,
  },
  dot: {
    marginHorizontal: 8,
  },
});
