import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useUserStore } from '@/src/store/user/user-store';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { formatCurrency, formatDate } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';

type InvoiceInfoProps = {
  invoiceDetails: Invoice;
  loading: boolean;
};

const InvoiceInfo = ({ invoiceDetails, loading }: InvoiceInfoProps) => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const { userDetails } = useUserStore();

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
        <Feather name="file-text" size={wp('6%')} color={'#3B82F6'} />
        <Text
          style={[
            globalStyles.heading3Text,
            globalStyles.darkBlueTextColor,
            { marginLeft: wp('2%') },
          ]}
        >
          Invoice Information
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <Skeleton style={{ width: wp('88%'), height: hp('22%'), borderRadius: 12 }} />
      ) : (
        <View className="flex flex-col" style={{ gap: hp('2%') }}>
          {/* Row 1 */}
          <View
            className="flex-row justify-between items-center"
            style={{ gap: wp('4%') }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[globalStyles.labelText, globalStyles.themeTextColor]}
              >
                Event Name
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  globalStyles.normalText,
                  globalStyles.greyTextColor,
                  { marginTop: 2 },
                ]}
              >
                {invoiceDetails?.orderName || '-'}
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={[globalStyles.labelText, globalStyles.themeTextColor]}
              >
                Invoice ID
              </Text>
              <Text
                style={[
                  globalStyles.normalText,
                  globalStyles.greyTextColor,
                  { marginTop: 2 },
                ]}
              >
                #{invoiceDetails?.invoiceId || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: isDark ? '#2E3A57' : '#E5E7EB',
              marginVertical: hp('1%'),
            }}
          />

          {/* Row 2 */}
          <View
            className="flex-row justify-between items-center"
            style={{ gap: wp('4%') }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[globalStyles.labelText, globalStyles.themeTextColor]}
              >
                Invoice Date
              </Text>
              <Text
                style={[
                  globalStyles.normalText,
                  globalStyles.greyTextColor,
                  { marginTop: 2 },
                ]}
              >
                {formatDate(invoiceDetails?.invoiceDate) || '-'}
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={[globalStyles.labelText, globalStyles.themeTextColor]}
              >
                Amount Paid
              </Text>
              <Text
                style={[
                  globalStyles.normalText,
                  globalStyles.greenTextColor,
                  { fontWeight: '600', marginTop: 2 },
                ]}
              >
                {formatCurrency(invoiceDetails?.amountPaid ?? 0)}
              </Text>
            </View>
          </View>

          {/* Row 3 */}
          {invoiceDetails?.balanceDue !== undefined && (
            <View
              className="flex-row justify-between items-center"
              style={{ marginTop: hp('0.5%') }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[globalStyles.labelText, globalStyles.themeTextColor]}
                >
                  Balance Due
                </Text>
              </View>
              <Text
                style={[
                  globalStyles.normalText,
                  {
                    color: invoiceDetails?.balanceDue > 0 ? '#DC2626' : '#16A34A',
                    fontWeight: '600',
                  },
                ]}
              >
                {formatCurrency(invoiceDetails?.balanceDue ?? 0)}
              </Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

export default InvoiceInfo;
