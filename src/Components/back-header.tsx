import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/user/user-store';
import { useDataStore } from '../providers/data-store/data-store-provider';
import { useToastMessage } from './toast/toast-message';

interface BackHeaderProps {
  screenName?: string;
  children?: React.ReactNode;
  style?: any;
}

const BackHeader: React.FC<BackHeaderProps> = ({ screenName, children, style }) => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const navigation = useNavigation();
  const { userDetails, getUserDetailsUsingID } = useUserStore();
  const { getItem } = useDataStore()
  const showToast = useToastMessage()

  useEffect(() => {
    const userId = getItem("USERID")
    getUserDetailsUsingID(userId, showToast)
  }, [])

  return (
    <SafeAreaView>
      <Card style={[globalStyles.cardShadowEffect, { marginBottom: hp('1%'), backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
        <View className="flex flex-row justify-start items-center gap-3" style={style}>
          {children ? (
            // Custom mode → render whatever children you pass
            children
          ) : (
            // Default mode → back button + text
            <>
              <TouchableOpacity onPress={() => navigation.getParent()?.goBack()}>
                <Feather name="arrow-left" size={wp('7%')} color={isDark ? "#fff" : "#000"} />
              </TouchableOpacity>
              {screenName && (
                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>{screenName}</Text>
              )}
            </>
          )}
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default BackHeader;
