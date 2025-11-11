import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { openDaialler, openEmailClient, openMessageBox } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';

type CustomerInfoProps = {
  customerData: CustomerMetaModel;
  loading: boolean;
};

const CustomerInfo = ({ customerData, loading }: CustomerInfoProps) => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  return (
    <Card
      style={[
        globalStyles.cardShadowEffect,
        {
          marginVertical: hp('1.5%'),
          backgroundColor: isDark ? '#1A2238' : '#FFFFFF',
          borderColor: isDark ? '#2E3A57' : '#E5E7EB',
          paddingVertical: hp('2%'),
          paddingHorizontal: wp('4%'),
        },
      ]}
    >
      {/* Header */}
      <View
        className="flex-row items-center mb-3"
        style={{
          paddingBottom: hp('1%'),
        }}
      >
        <Feather name="user" size={wp('6%')} color={'#3B82F6'} />
        <Text
          style={[
            globalStyles.heading3Text,
            globalStyles.darkBlueTextColor,
            { marginLeft: wp('2%') },
          ]}
        >
          Billing Information
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <Skeleton style={{ width: wp('88%'), height: hp('22%'), borderRadius: 12 }} />
      ) : (
        <View className="flex flex-col" style={{ gap: hp('1.8%') }}>
          {/* Customer Name */}
          <View>
            <Text
              style={[
                globalStyles.heading3Text,
                globalStyles.themeTextColor,
                { marginBottom: 4 },
              ]}
            >
              {customerData?.name ?? 'N/A'}
            </Text>
            <Divider style={{ marginVertical: hp('1%'),backgroundColor: isDark ? '#2E3A57' : '#E5E7EB' }} />
          </View>

          {/* Phone Section */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2 flex-shrink">
              <Feather name="phone" size={wp('5%')} color={isDark ? '#E2E8F0' : '#182D53'} />
              <Text
                style={[
                  globalStyles.labelText,
                  globalStyles.themeTextColor,
                  { flexShrink: 1 },
                ]}
              >
                {customerData?.mobileNumber ?? 'Not provided'}
              </Text>
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => openDaialler(customerData?.mobileNumber)}
                activeOpacity={0.8}
              >
                <Feather name="phone-call" size={wp('5%')} color={'#3B82F6'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  openMessageBox(
                    customerData?.mobileNumber,
                    `Hi ${customerData?.name ?? ''}, hope you're doing well.`
                  )
                }
                activeOpacity={0.8}
              >
                <Feather name="message-square" size={wp('5%')} color={'#3B82F6'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <Divider style={{ marginVertical: hp('1%'),backgroundColor: isDark ? '#2E3A57' : '#E5E7EB' }} />

          {/* Email Section */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2 flex-shrink">
              <Feather name="mail" size={wp('5%')} color={isDark ? '#E2E8F0' : '#182D53'} />
              <Text
                style={[
                  globalStyles.labelText,
                  globalStyles.themeTextColor,
                  { flexShrink: 1 },
                ]}
              >
                {customerData?.email ?? 'Not provided'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => openEmailClient(customerData?.email)}
              activeOpacity={0.8}
            >
              <Feather name="send" size={wp('5%')} color={'#3B82F6'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Card>
  );
};

export default CustomerInfo;
