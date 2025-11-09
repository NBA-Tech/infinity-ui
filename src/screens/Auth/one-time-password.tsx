import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { WaveHandIcon } from '@/src/assets/Icons/SvgIcons';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { AuthResponse } from '@/src/types/auth/auth-type';
import { registerUser } from '@/src/api/auth/auth-api-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    padding: hp('2.5%'),
    width: wp('85%'),
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    gap: wp('2%'),
  },
  subHeading: {
    marginBottom: hp('3%'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('2%'),
  },
  otpBox: {
    width: wp('18%'),
    height: hp('7%'),
    borderRadius: wp('2%'),
    textAlign: 'center',
    fontSize: wp('6%'),
    fontWeight: '600',
  },
});

const OneTimePassword = ({ navigation, route }: { navigation: any; route: any }) => {
  const { authData, otpCode } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);

  const { isDark } = useContext(ThemeToggleContext);
  const globalStyle = useContext(StyleContext);
  const showToast = useToastMessage();
  const { setItem } = useDataStore();

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) setActiveIndex(index + 1);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      setActiveIndex(index - 1);
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < otp.length) {
      return showToast({ type: 'error', title: 'Error', message: 'Please enter all digits' });
    }
    if (otpCode !== enteredOtp) {
      return showToast({ type: 'error', title: 'Error', message: 'Invalid OTP' });
    }

    setLoading(true);
    const register: AuthResponse = await registerUser(authData);
    if (!register?.success) {
      setLoading(false);
      return showToast({ type: 'error', title: 'Error', message: register?.message ?? 'Something went wrong' });
    }

    await setItem('USERID', register?.userId);
    showToast({ type: 'success', title: 'Success', message: register?.message ?? 'Successfully registered' });
    setLoading(false);
    navigation.reset({ index: 0, routes: [{ name: 'UserOnBoarding' }] });
  };

  return (
    <View style={[styles.container, globalStyle.appBackground]}>
      <Card size="md" variant="filled" style={globalStyle.cardShadowEffect}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.heading}>
            <WaveHandIcon />
            <Text style={[globalStyle.heading2Text, globalStyle.themeTextColor]}>
              OTP Verification
            </Text>
          </View>

          <View style={styles.subHeading}>
            <Text style={[globalStyle.labelText, globalStyle.greyTextColor]}>
              Enter the 4-digit OTP sent to your registered email.
            </Text>
          </View>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((value, i) => (
              <TextInput
                key={i}
                value={value}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={activeIndex === i} // ✅ focus handled by state
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: isDark ? '#1A2238' : '#F5F7FB',
                    color: isDark ? '#E2E8F0' : '#1E3A8A',
                    borderWidth: 2,
                    borderColor: value
                      ? '#3B82F6'
                      : isDark
                      ? '#2E3A57'
                      : '#E5E7EB',
                  },
                ]}
                selectionColor="#3B82F6"
                placeholder="-"
                placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
              />
            ))}
          </View>

          {/* Verify Button */}
          <Button
            size="lg"
            variant="solid"
            action="primary"
            style={[globalStyle.buttonColor, { marginTop: hp('4%') }]}
            onPress={handleSubmit}
            isDisabled={loading}
          >
            {loading && <ButtonSpinner color="#fff" size={wp('4%')} />}
            <ButtonText style={globalStyle.buttonText}>Verify OTP</ButtonText>
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default OneTimePassword;
