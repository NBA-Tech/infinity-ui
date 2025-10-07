import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import GradientCard from '@/src/utils/gradient-card';
import { Card } from '@/components/ui/card';
import { GeneralCardModel } from '../types/home-type';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import Tooltip, { Placement } from "react-native-tooltip-2";
import Skeleton from '@/components/ui/skeleton';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
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

export const StatInfo = ({ item,isLoading,index }: { item: GeneralCardModel;isLoading: boolean;index: number }) => {
  const globalStyles = useContext(StyleContext);
  const [toolTipVisible, setToolTipVisible] = useState(false);

  if(isLoading){
    return (
      <Skeleton height={hp('20%')} width={wp('45%')} />
    );
  }

  return (
    <Card style={[styles.cardContainer, { backgroundColor: item.backgroundColor }]}>
      {/* Info icon */}
      <View style={{ alignItems: 'flex-end' }}>
        <Tooltip
          isVisible={toolTipVisible}
          content={<Text>{item.tooltip}</Text>}
          placement={Placement.BOTTOM}
          onClose={() => setToolTipVisible(false)}>
          <TouchableOpacity onPress={()=> setToolTipVisible(true)}>
            <Feather name="info" size={wp('5%')} color="#fff" />
          </TouchableOpacity>

        </Tooltip>

      </View>

      {/* Main row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <GradientCard style={styles.iconWrapper} colors={item.gradientColors || ['#ccc', '#999']}>
          {item.icon}
        </GradientCard>

        {/* Trending info */}
        {item?.isTrending &&
          <View style={styles.trendingRow}>
            <Feather name={item?.percentageOfChange && item?.percentageOfChange?.includes('-') ? 'trending-down' : 'trending-up'} size={wp('5%')} color="#fff" />
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
