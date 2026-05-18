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
import { User, Phone, Mail, Bike, ShieldCheck, ChevronRight, MessageSquare, LogOut, Bell } from 'lucide-react-native';
import { useRiderStore } from '../../store/riderStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { earnings } = useRiderStore();
  const [notifications, setNotifications] = useState(true);
  const [vehicle, setVehicle] = useState('Motorbike'); // Motorbike, Bicycle, Car

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={styles.screenTitle}>Rider Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.riderName}>Kofi Mensah</Text>
              <View style={styles.roleBadge}>
                <ShieldCheck color="#FFFFFF" size={12} />
                <Text style={styles.roleText}>SUPER RIDER</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Performance Grid - Chowdeck Influence */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>98%</Text>
              <Text style={styles.metricLabel}>Acceptance</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>★ {earnings.rating}</Text>
              <Text style={styles.metricLabel}>Rating</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>99.5%</Text>
              <Text style={styles.metricLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Active Vehicle Info Block - Hubtel Style */}
        <Text style={styles.sectionTitle}>Active Vehicle</Text>
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <Bike color="#FF3D00" size={24} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleName}>Yamaha Crux 110</Text>
              <Text style={styles.vehiclePlate}>Plate: GH-2341-22</Text>
            </View>
            <View style={styles.vehicleBadge}>
              <Text style={styles.vehicleBadgeText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.divider} style={{ marginVertical: 12 }} />

          <Text style={styles.selectorLabel}>Switch Vehicle Mode</Text>
          <View style={styles.selectorContainer}>
            {['Bicycle', 'Motorbike', 'Car'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.selectorBtn, vehicle === type && styles.selectorBtnActive]}
                onPress={() => setVehicle(type)}
              >
                <Text style={[styles.selectorText, vehicle === type && styles.selectorTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Options & Settings */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Bell color="#E0E0E0" size={20} />
            <Text style={styles.optionText}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#3E3E3E', true: '#FF3D00' }}
            thumbColor={notifications ? '#FFFFFF' : '#8E8E93'}
          />
        </View>

        <TouchableOpacity style={styles.optionLink}>
          <View style={styles.optionLeft}>
            <MessageSquare color="#E0E0E0" size={20} />
            <Text style={styles.optionText}>Live Support Chat</Text>
          </View>
          <ChevronRight color="#555555" size={18} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color="#FF3D00" size={20} />
          <Text style={styles.logoutText}>Logout from Account</Text>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D2D',
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
    borderColor: '#FF3D00',
    backgroundColor: '#121212',
  },
  riderName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF3D00',
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
    backgroundColor: '#2D2D2D',
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
    color: '#FFFFFF',
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
    backgroundColor: '#2D2D2D',
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  vehicleCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 24,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleName: {
    color: '#FFFFFF',
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
    fontWeight: '950',
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
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectorBtnActive: {
    backgroundColor: '#FF3D00',
    borderColor: '#FF3D00',
  },
  selectorText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '700',
  },
  selectorTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  optionRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 10,
  },
  optionLink: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    marginBottom: 24,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '750',
  },
  logoutBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 61, 0, 0.3)',
    marginBottom: 20,
  },
  logoutText: {
    color: '#FF3D00',
    fontSize: 15,
    fontWeight: '800',
  },
});
