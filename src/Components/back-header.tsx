import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/user/user-store';
import { useDataStore } from '../providers/data-store/data-store-provider';
import { useToastMessage } from './toast/toast-message';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getPaddingBasedOS } from '../utils/utils';

interface BackHeaderProps {
  screenName?: string;
  children?: React.ReactNode;
  style?: any;
}

const BackHeader: React.FC<BackHeaderProps> = ({ screenName, children, style }) => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const navigation = useNavigation();
  const { getItem } = useDataStore();
  const { getUserDetailsUsingID } = useUserStore();
  const showToast = useToastMessage();

  useEffect(() => {
    const userId = getItem("USERID");
    if (userId) getUserDetailsUsingID(userId, showToast);
  }, []);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: isDark ? "#0D162A" : "#E8F0FF", // modern subtle tint
        paddingTop: getPaddingBasedOS(),                // notch-aware padding
        paddingBottom: hp("2%"),
        paddingHorizontal: wp("4%"),
        
        // 🟦 Modern curved bottom
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,

        // 🟦 Soft modern shadow
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          },
          style,
        ]}
      >
        {children ? (
          children
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={wp("7%")}
                color={isDark ? "#FFF" : "#000"}
              />
            </TouchableOpacity>

            {screenName && (
              <Text
                style={[
                  globalStyles.heading3Text,
                  globalStyles.themeTextColor,
                  { fontSize: wp("5.2%") },
                ]}
              >
                {screenName}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default BackHeader;
