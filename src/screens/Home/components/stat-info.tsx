import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import GradientCard from '@/src/utils/gradient-card';
import { Card } from '@/components/ui/card';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GeneralCardModel } from '../types/home-type';
import { StyleContext } from '@/src/providers/theme/global-style-provider';

const styles = StyleSheet.create({
  cardContainer: {
    width: wp('46%'),
    borderRadius: 12,
    padding: 12,
  },
  iconWrapper: {
    padding: wp('2%'),
    borderRadius: 8,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  bottomStats: {
    marginTop: 12,
  },
});

export const StatInfo = ({ item, index }: { item: GeneralCardModel; index: number }) => {
  const globalStyles = useContext(StyleContext);

  return (
    <Card style={[styles.cardContainer, { backgroundColor: item.backgroundColor }]}>
      {/* Info icon */}
      <View style={{ alignItems: 'flex-end' }}>
        <Feather name="info" size={wp('5%')} color="#fff" />
      </View>

      {/* Main row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <GradientCard style={styles.iconWrapper} colors={item.gradientColors || ['#ccc', '#999']}>
          {item.icon}
        </GradientCard>

        {/* Trending info */}
        {item?.isTrending &&
          <View style={styles.trendingRow}>
            <Feather name={item?.percentageOfChange?.includes('-') ? 'trending-down' : 'trending-up'} size={wp('5%')} color="#fff" />
            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText, { marginLeft: 4 }]}>{item?.percentageOfChange}</Text>
          </View>
        }

      </View>

      {/* Bottom stats */}
      <View style={styles.bottomStats}>
        <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>{item.count}</Text>
        <Text style={[globalStyles.whiteTextColor, globalStyles.normalText]}>{item.label}</Text>
      </View>
    </Card>
  );
};
