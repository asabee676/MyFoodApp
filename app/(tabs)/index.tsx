import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, TextInput, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import data from '../../data/sample-restaurants.json';
import { useLocation } from '../../context/LocationContext';

export default function HomeScreen() {
  const router = useRouter();
  const { categories, restaurants, promos } = data;
  const [searchQuery, setSearchQuery] = useState('');
  const { location } = useLocation();

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    restaurant.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.restaurantCard} 
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cuisineText}>{item.cuisine.join(' • ')}</Text>
        <View style={styles.deliveryInfo}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
          <Text style={styles.dot}>•</Text>
          <Ionicons name="bicycle-outline" size={14} color="#666" />
          <Text style={styles.deliveryText}>${item.deliveryFee.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <TouchableOpacity style={styles.locationContainer} onPress={() => router.push('/location-picker')}>
            <Ionicons name="location" size={16} color="#E53935" />
            <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abel' }} style={styles.profileImg} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput 
            placeholder="What are you craving?" 
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Promo Banner - Only show if not searching */}
        {searchQuery === '' && (
          <View style={styles.promoBanner}>
            <Image source={{ uri: promos[0].image }} style={styles.promoImage} />
            <View style={styles.promoOverlay}>
              <Text style={styles.promoTag}>{promos[0].tag}</Text>
              <Text style={styles.promoTitle}>{promos[0].title}</Text>
              <Text style={styles.promoSubtitle}>{promos[0].subtitle}</Text>
            </View>
          </View>
        )}

        {/* Categories - Only show if not searching */}
        {searchQuery === '' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
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
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Featured Restaurants'}
          </Text>
          {!searchQuery && <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>}
        </View>
        
        <View style={styles.restaurantsList}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant: any) => (
              <React.Fragment key={restaurant.id}>
                {renderRestaurant({ item: restaurant })}
              </React.Fragment>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
              No restaurants found matching "{searchQuery}"
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10, 
    paddingBottom: 15,
    backgroundColor: '#FFF',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#FFF',
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
    backgroundColor: '#E53935',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#E53935',
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
    backgroundColor: '#E53935',
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
    color: '#333',
  },
  seeAllText: {
    color: '#E53935',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFF',
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
    color: '#444',
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: '#FFF',
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
    color: '#333',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B8860B',
    marginLeft: 4,
  },
  cuisineText: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  dot: {
    marginHorizontal: 8,
    color: '#CCC',
  },
});
