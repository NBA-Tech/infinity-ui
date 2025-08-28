import React, { useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: wp('2%'),
    marginVertical: hp('2%'),
    padding: wp('4%'),
    height: hp('50%'), // fixed height for scroll
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  statusWrapper: {
    padding: hp('1%'),
    borderRadius: wp('50%'),
    backgroundColor: '#d1fae5',
    marginRight: wp('3%'),
  },
  textWrapper: {
    flex: 1,
  },
  timeWrapper: {
    alignItems: 'flex-end',
  },
});

const Activity = () => {
  const globalStyles = useContext(StyleContext);

  return (
    <View>
      <Card style={styles.cardContainer}>
        {/* Header */}
        <View className='flex flex-row justify-between items-center'>
          <View>
            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
              Recent Activity
            </Text>
            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
              Latest updates
            </Text>
          </View>
          <Feather name="info" size={wp('5%')} color="#000" />
        </View>

        {/* Divider */}
        <Divider style={{ marginVertical: hp('1.5%') }} />

        {/* Scrollable Activities */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('2%') }}
          nestedScrollEnabled={true}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <View style={styles.activityRow} key={index}>
              <View style={styles.statusWrapper}>
                <Feather name="check" size={wp('5%')} color="#228B22" />
              </View>

              <View style={styles.textWrapper}>
                <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>
                  Pre-Wedding PhotoShoot
                </Text>
                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                  Wedding Photography
                </Text>
              </View>

              <View style={styles.timeWrapper}>
                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                  1 day ago
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Card>
    </View>
  );
};

export default Activity;
