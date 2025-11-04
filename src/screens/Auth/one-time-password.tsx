import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { WaveHandIcon } from '@/src/assets/Icons/SvgIcons';
import Background from '../../assets/images/Background.png';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { AuthResponse } from '@/src/types/auth/auth-type';
import { registerUser } from '@/src/api/auth/auth-api-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';

const styles = StyleSheet.create({
  otpBodyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp('7%'),
  },
  cardContainer: {
    padding: hp('2%'),
    width: wp('85%'),
  },
  body: {
    flex: 1,
    marginVertical: hp('15%'),
  },
  heading: {
    flexDirection: 'row',
    marginVertical: hp('2%'),
    gap: wp('2%'),
    alignItems: 'center',
  },
  subHeading: {
    marginBottom: hp('2%'),
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: wp('18%'),
    height: hp('8%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('1%'),
  },
});

const OneTimePassword = ({ navigation, route }: { navigation: any; route: any }) => {
  const { authData, otpCode } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState('');
  const numInputs = 4;

  const { isDark } = useContext(ThemeToggleContext);
  const globalStyle = useContext(StyleContext);
  const showToast = useToastMessage();
  const { setItem } = useDataStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (otp.length < numInputs) {
      return showToast({ type: 'error', title: 'Error', message: 'Please enter all digits' });
    }
    if (otpCode !== otp) {
      return showToast({ type: 'error', title: 'Error', message: 'Invalid OTP' });
    }

    setLoading(true);
    const register: AuthResponse = await registerUser(authData);
    if (!register?.success) {
      setLoading(false);
      return showToast({ type: 'error', title: 'Error', message: register?.message ?? 'Something went wrong' });
    } else {
      setLoading(false);
      showToast({ type: 'success', title: 'Success', message: register?.message ?? 'Successfully registered' });
      await setItem('USERID', register?.userId);
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserOnBoarding' }],
      });
    }
  };

  return (
    <ImageBackground source={Background} resizeMode="cover" style={{ flex: 1 }}>
      <View style={styles.body}>
        <View style={styles.otpBodyContainer}>
          <Card size="md" variant="filled" style={[globalStyle.cardShadowEffect]}>
            <View style={styles.cardContainer}>
              <View style={styles.heading}>
                <WaveHandIcon />
                <Text style={[globalStyle.themeTextColor, globalStyle.heading3Text]}>
                  OTP Verification
                </Text>
              </View>

              <View style={styles.subHeading}>
                <Text style={[globalStyle.labelText, globalStyle.themeTextColor]}>
                  For verification, please enter the OTP sent to your email. If you haven’t received the code yet, please check your spam folder.
                </Text>
              </View>

              {/* Hidden Input */}
              <TextInput
                style={{ opacity: 0, position: 'absolute' }}
                keyboardType="number-pad"
                maxLength={numInputs}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/[^0-9]/g, '')); // only digits
                }}
                autoFocus
              />

              {/* Display Boxes */}
              <TouchableOpacity
                style={styles.otpContainer}
                activeOpacity={1}
                onPress={() => {
                  // focus hidden input when user taps the boxes
                }}>
                {Array.from({ length: numInputs }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.otpBox,
                      { borderWidth: otp.length === i ? 2 : 1, borderColor: otp.length === i ? '#6839eb' : '#ccc' },
                    ]}>
                    <Text style={[globalStyle.normalBoldText,globalStyle.whiteTextColor]}>{otp[i] || ''}</Text>
                  </View>
                ))}
              </TouchableOpacity>

              <Button
                size="lg"
                variant="solid"
                action="primary"
                style={[globalStyle.purpleBackground, { marginVertical: hp('3%') }]}
                onPress={handleSubmit}
                isDisabled={loading}>
                {loading && <ButtonSpinner color={'#fff'} size={wp('4%')} />}
                <ButtonText style={globalStyle.buttonText}>Verify OTP</ButtonText>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ImageBackground>
  );
};

export default OneTimePassword;
