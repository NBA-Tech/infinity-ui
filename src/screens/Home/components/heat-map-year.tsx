import { Card } from '@/components/ui/card';
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: wp('2%'),
    marginVertical: hp('2%'),
    padding: wp('4%'),
    height: hp('50%'),
  },
  heatContainer: {
    borderRadius: wp('2%'),
    height: hp('10%'),
    width: wp('25%'),
    justifyContent: 'flex-end',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthWrapper: {
    alignItems: 'center',
    marginBottom: hp('2%'),
    width: wp('28%'),
  },
});

const months = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

const HeatMapYear = () => {
  const globalStyles = useContext(StyleContext);

  // Generate random values for each month
  const values = months.map(() => Math.floor(Math.random() * 100));

  // Function to calculate violet shade based on value
  const getColor = (val: number) => {
    const opacity = Math.min(1, val / 100); // scale 0–100 → 0–1
    return `rgba(138, 43, 226, ${0.3 + opacity * 0.7})`; // violet with brightness variation
  };

  return (
    <View>
      <Card style={styles.cardContainer}>
        {/* Header */}
        <View className="flex flex-row justify-between items-center">
          <View>
            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
              Booking Heatmap
            </Text>
            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
              Busiest month of the year
            </Text>
          </View>
          <Feather name="info" size={wp('5%')} color="#000" />
        </View>

        {/* Divider */}
        <Divider style={{ marginVertical: hp('1.5%') }} />

        {/* Heatmap Grid */}
        <View style={styles.grid}>
          {months.map((month, idx) => (
            <View key={month} style={styles.monthWrapper}>
              <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>
                {month}
              </Text>
              <View style={[styles.heatContainer, { backgroundColor: getColor(values[idx]) }]}>
                <Text
                  style={[
                    globalStyles.whiteTextColor,
                    globalStyles.normalText,
                    { textAlign: 'center', marginBottom: hp('1%') },
                  ]}
                >
                  {values[idx]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
};

export default HeatMapYear;
