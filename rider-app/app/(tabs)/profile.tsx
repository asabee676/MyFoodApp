import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Phone, Mail, Bike, ShieldCheck, ChevronRight, MessageSquare, LogOut, Bell, Moon } from 'lucide-react-native';
import { useRiderStore } from '../../store/riderStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, setTheme } = useTheme();
  const { earnings } = useRiderStore();
  const [notifications, setNotifications] = useState(true);
  const [vehicle, setVehicle] = useState('Motorbike'); // Motorbike, Bicycle, Car

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Rider Profile</Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi' }}
              style={styles.avatar as any}
            />
            <View>
              <Text style={[styles.riderName, { color: colors.text }]}>Kofi Mensah</Text>
              <View style={styles.roleBadge}>
                <ShieldCheck stroke="#FFFFFF" size={12} />
                <Text style={styles.roleText}>SUPER RIDER</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Performance Grid - Chowdeck Influence */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.text }]}>98%</Text>
              <Text style={styles.metricLabel}>Acceptance</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.text }]}>★ {earnings.rating}</Text>
              <Text style={styles.metricLabel}>Rating</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.text }]}>99.5%</Text>
              <Text style={styles.metricLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Active Vehicle Info Block - Hubtel Style */}
        <Text style={styles.sectionTitle}>Active Vehicle</Text>
        <View style={[styles.vehicleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.vehicleHeader}>
            <Bike stroke={colors.primary} size={24} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.vehicleName, { color: colors.text }]}>Yamaha Crux 110</Text>
              <Text style={styles.vehiclePlate}>Plate: GH-2341-22</Text>
            </View>
            <View style={styles.vehicleBadge}>
              <Text style={styles.vehicleBadgeText}>VERIFIED</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 12 }]} />

          <Text style={styles.selectorLabel}>Switch Vehicle Mode</Text>
          <View style={styles.selectorContainer}>
            {['Bicycle', 'Motorbike', 'Car'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.selectorBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  vehicle === type && [styles.selectorBtnActive, { backgroundColor: colors.primary, borderColor: colors.primary }]
                ]}
                onPress={() => setVehicle(type)}
              >
                <Text style={[styles.selectorText, { color: colors.textSecondary }, vehicle === type && styles.selectorTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Options & Settings */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={[styles.optionRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionLeft}>
            <Bell stroke={colors.icon} size={20} />
            <Text style={[styles.optionText, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#3E3E3E', true: colors.primary }}
            thumbColor={notifications ? '#FFFFFF' : '#8E8E93'}
          />
        </View>

        <View style={[styles.optionRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionLeft}>
            <Moon stroke={colors.icon} size={20} />
            <Text style={[styles.optionText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
            trackColor={{ false: '#3E3E3E', true: colors.primary }}
            thumbColor={isDark ? '#FFFFFF' : '#8E8E93'}
          />
        </View>

        <TouchableOpacity style={[styles.optionLink, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionLeft}>
            <MessageSquare stroke={colors.icon} size={20} />
            <Text style={[styles.optionText, { color: colors.text }]}>Live Support Chat</Text>
          </View>
          <ChevronRight stroke={colors.icon} size={18} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut stroke={colors.primary} size={20} />
          <Text style={[styles.logoutText, { color: colors.primary }]}>Logout from Account</Text>
        </TouchableOpacity>
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
  profileCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E53935',
    backgroundColor: '#121212',
  },
  riderName: {
    fontSize: 18,
    fontWeight: '800',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  vehicleCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '800',
  },
  vehiclePlate: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 2,
  },
  vehicleBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  vehicleBadgeText: {
    color: '#4CAF50',
    fontSize: 9,
    fontWeight: '900',
  },
  selectorLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  selectorBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  selectorBtnActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  selectorText: {
    fontSize: 12,
    fontWeight: '700',
  },
  selectorTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  optionRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  optionLink: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 57, 53, 0.3)',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
