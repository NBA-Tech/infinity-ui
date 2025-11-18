import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { configureGoogleSignin } from '@/src/services/auth/auth-service';

// Auth screens
import Login from './login';
import Register from './register';
import ForgotPassword from './forgot-password';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
  },
  mainAnimation: {
    width: wp('100%'),
    height: wp('50%'),
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  titleText: {
    textAlign: 'center',
    marginTop: hp('0.5%'),
  },
  appName: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: hp('1.5%'), // smaller spacing
    marginBottom: 0, // ✅ no bottom gap
  },
});

const Authentication = () => {
  const globalStyles = useContext(StyleContext);
  const [currScreen, setCurrScreen] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    configureGoogleSignin();
  }, []);

  const renderAuthContent = () => (
    <View style={styles.body}>
      {/* Animation Section */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../assets/animations/login.json')}
          autoPlay
          loop
          style={styles.mainAnimation}
        />
      </View>
  
      {/* Header + Auth Form */}
      <View style={styles.formContainer}>
        {/* Title Section (Moved here) */}
        <View style={styles.headingContainer}>
          <Text
            style={[
              globalStyles.headingText,
              globalStyles.themeTextColor,
              styles.titleText,
            ]}
          >
            {currScreen === 'login'
              ? 'Sign in to'
              : currScreen === 'register'
              ? 'Sign up to'
              : 'Reset your password for'}
          </Text>
  
          <Text
            style={[
              globalStyles.headingText,
              globalStyles.blueTextColor,
              styles.appName,
            ]}
          >
            INFINITY CRM
          </Text>
        </View>
  
        {/* Auth Card */}
        {currScreen === 'login' ? (
          <Login setCurrScreen={setCurrScreen} />
        ) : currScreen === 'register' ? (
          <Register setCurrScreen={setCurrScreen} />
        ) : (
          <ForgotPassword setCurrScreen={setCurrScreen} />
        )}
      </View>
    </View>
  );
  

  return (
    <SafeAreaView
      style={[
        globalStyles.appBackground,
        styles.container,
        { paddingBottom: 0 }, // ✅ remove SafeAreaView padding bottom
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 0, // ✅ removes any ScrollView bottom padding
          }}
        >
          {renderAuthContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Authentication;
