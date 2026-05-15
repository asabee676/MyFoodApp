import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { location } = useLocation();
  const { theme, setTheme, colors, isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const nextLang = i18n.language === 'en' ? 'fr' : i18n.language === 'fr' ? 'tw' : 'en';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('user-language', nextLang);
  };

  const getLanguageName = () => {
    switch(i18n.language) {
      case 'fr': return 'Français';
      case 'tw': return 'Twi (Ghana)';
      default: return 'English';
    }
  };

  const renderSettingItem = (icon: any, title: string, subtitle?: string, hasSwitch?: boolean, value?: boolean, onValueChange?: (val: boolean) => void) => (
    <TouchableOpacity style={styles.settingItem} disabled={hasSwitch}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color="#E53935" />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch
          trackColor={{ false: '#767577', true: '#ffcdd2' }}
          thumbColor={value ? '#E53935' : '#f4f3f4'}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abel' }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>Abel</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>abel@example.com</Text>
            <TouchableOpacity style={[styles.editProfileBtn, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
              <Text style={[styles.editProfileText, { color: colors.primary }]}>{t('edit_profile')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('orders')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.text }]}>4</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('favorites')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.text }]}>₵150</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('wallet')}</Text>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('merchants')}</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={() => router.push('/restaurant-dashboard')}>
              <View style={[styles.settingIconContainer, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
                <Ionicons name="business-outline" size={22} color={colors.text} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('merchant_dashboard')}</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{t('manage_orders_menus')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('my_account')}</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
               <View style={[styles.settingIconContainer, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
                <Ionicons name="location-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('delivery_addresses')}</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('app_settings')}</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            {/* Dark Mode Toggle */}
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={[styles.settingIconContainer, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
                <Ionicons name={isDark ? "moon" : "moon-outline"} size={22} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('dark_mode')}</Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#EF9A9A' }}
                thumbColor={isDark ? colors.primary : '#f4f3f4'}
                onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
                value={isDark}
              />
            </View>

            {/* Language Toggle */}
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: colors.border }]} 
              onPress={toggleLanguage}
            >
              <View style={[styles.settingIconContainer, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]}>
                <Ionicons name="globe-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('language')}</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{getLanguageName()}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: isDark ? '#333' : '#FBE8E8' }]} onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={22} color={colors.primary} />
          <Text style={[styles.logoutText, { color: colors.primary }]}>{t('logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  editProfileBtn: {
    backgroundColor: '#FBE8E8',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#777',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEE',
  },
  section: {
    marginTop: 25,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FBE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBE8E8',
    marginHorizontal: 15,
    marginTop: 30,
    padding: 15,
    borderRadius: 16,
  },
  logoutText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    marginTop: 20,
    marginBottom: 10,
  },
});
