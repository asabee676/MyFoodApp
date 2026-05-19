import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Lock, ChevronRight, Compass } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (!phone || phone.length < 9) return;
    setLoading(true);
    // Mock network call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) return;
    setLoading(true);
    // Mock verification
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.logoSection}>
          <View style={styles.iconCircle}>
            <Compass stroke={colors.primary} size={40} strokeWidth={2.5} />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Kale<Text style={{ color: colors.primary }}>Dash</Text> Rider</Text>
          <Text style={styles.logoSubtitle}>Fastest Deliveries, Guaranteed Earnings</Text>
        </View>

        <View style={styles.formSection}>
          {step === 1 ? (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Enter phone number</Text>
              <Text style={styles.sectionSubtitle}>We will send a 4-digit code to verify your account.</Text>

              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Phone stroke={colors.icon} size={20} />
                <Text style={[styles.countryCode, { color: colors.text }]}>+233</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="55 123 4567"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, !phone && styles.disabledButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                onPress={handleSendOtp}
                disabled={!phone || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Get Verification Code</Text>
                    <ChevronRight stroke="#FFFFFF" size={20} />
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Verify Code</Text>
              <Text style={styles.sectionSubtitle}>Enter the code sent to +233 {phone}</Text>

              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Lock stroke={colors.icon} size={20} />
                <TextInput
                  style={[styles.input, styles.otpInput, { color: colors.text }]}
                  placeholder="0 0 0 0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, otp.length < 4 && styles.disabledButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                onPress={handleVerifyOtp}
                disabled={otp.length < 4 || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Start Delivering</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendButton} onPress={() => setStep(1)}>
                <Text style={[styles.resendText, { color: colors.primary }]}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to KaleDash Rider Terms</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  formSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    marginBottom: 24,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 0,
    marginLeft: 4,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 18,
  },
  primaryButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#555555',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
