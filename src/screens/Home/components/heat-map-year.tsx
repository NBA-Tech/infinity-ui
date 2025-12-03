import { Card } from '@/components/ui/card';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { OrderModel } from '@/src/types/order/order-type';
import Skeleton from '@/components/ui/skeleton';
import Tooltip, { Placement } from 'react-native-tooltip-2';

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: wp('2%'),
    marginVertical: hp('2%'),
    padding: wp('5%'),
    minHeight: hp('35%'), // Adjusted min height
  },
  heatContainer: {
    borderRadius: wp('3%'),
    height: hp('8%'), // smaller height to avoid overflow
    width: wp('20%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
  },
  monthWrapper: {
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
});

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

type HeatMapYearProps = {
  orderDetails: OrderModel[]
  isLoading: boolean
};

const HeatMapYear = ({ orderDetails, isLoading }: HeatMapYearProps) => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const currentYear = new Date().getFullYear();

  // Calculate counts for each month of current year
  const values = months.map((_, idx) => {
    const monthIndex = idx; // Jan=0, Feb=1, etc
    return orderDetails?.filter((order) => {
      const eventDate = order?.eventDate ? new Date(order?.eventDate) : null;
      return eventDate && eventDate.getFullYear() === currentYear && eventDate.getMonth() === monthIndex;
    }).length;
  });

  // Function to calculate violet shade based on value
  const getColor = (val: number) => {
    const opacity = Math.min(1, val / Math.max(...values, 1)); // scale relative to max value
    return `rgba(59, 130, 246, ${0.3 + opacity * 0.7})`; // violet with brightness variation
  };

  return (
    <View>
      <Card style={styles.cardContainer}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
              Booking Heatmap
            </Text>
            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
              Busiest month of the year
            </Text>
          </View>
          <Tooltip
            isVisible={toolTipVisible}
            content={<Text style={globalStyles.normalText}>This Widget displays the busiest month of the year.</Text>}
            placement={Placement.BOTTOM}
            onClose={() => setToolTipVisible(false)}>
            <TouchableOpacity onPress={() => setToolTipVisible(true)}>
              <Feather name="info" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>

          </Tooltip>
        </View>

        {/* Divider */}
        <Divider style={{ marginVertical: hp('1.5%') }} />

        {/* Heatmap Grid */}
        <View style={styles.grid}>
          {months.map((month, idx) => (
            <View key={month} style={styles.monthWrapper}>
              <Text
                style={[
                  globalStyles.normalText,
                  idx === new Date().getMonth()
                    ? [globalStyles.blueTextColor,globalStyles.normalBoldText]   // 🔵 highlight current month
                    : globalStyles.normalTextColor
                ]}
              >
                {month}
              </Text>
              {isLoading ? (
                <Skeleton width={wp('20%')} height={hp('8%')} />
              ) : (
                <View style={[styles.heatContainer, { backgroundColor: getColor(values[idx]) }]}>
                  <Text
                    style={[
                      globalStyles.whiteTextColor,
                      globalStyles.normalText,
                      { textAlign: 'center', marginBottom: hp('0.5%') },
                    ]}
                  >
                    {values[idx]}
                  </Text>
                </View>
              )

              }

            </View>
          ))}
        </View>
      </Card>
    </View>
  );
};

export default HeatMapYear;
