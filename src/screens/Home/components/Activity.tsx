import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { getActivityDataAPI } from '@/src/services/activity/user-activity-service';
import { UserActivity } from '@/src/types/activity/user-activity-type';
import { formatDate } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import { useReloadContext } from '@/src/providers/reload/reload-context';
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
const ICONS = {
  WARNING: {
    icon: 'alert-triangle', // Feather icon
    color: '#F59E0B',       // Amber/Yellow
  },
  ERROR: {
    icon: 'alert-circle',   // Feather icon
    color: '#EF4444',       // Red
  },
  INFO: {
    icon: 'info',           // Feather icon
    color: '#3B82F6',       // Blue
  },
  SUCCESS: {
    icon: 'check-circle',   // Feather icon
    color: '#10B981',       // Green
  },
};


const Activity = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const [recentActivityList, setRecentActivityList] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false)
  const { getItem } = useDataStore();
  const showToast = useToastMessage();
  const {reloadActivity}=useReloadContext()


  const getRecentActivityList = async (userId: string) => {
    setLoading(true)
    const recentActivityData = await getActivityDataAPI(userId, 10)
    setLoading(false)
    if (!recentActivityData?.success) {
      return showToast({
        type: "error",
        title: "Error",
        message: recentActivityData?.message ?? "Something went wrong",
      });
    }
    setRecentActivityList(recentActivityData?.data)
    console.log(recentActivityData?.data)
  }


  useEffect(() => {
    const userId = getItem("USERID");
    console.log("recent activity")
    if (!userId) {
      return showToast({
        type: "error",
        title: "Error",
        message: "User not found. Please login again",
      });
    }
    getRecentActivityList(userId)

  }, [reloadActivity])

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
          <Feather name="info" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
        </View>

        {/* Divider */}
        <Divider style={{ marginVertical: hp('1.5%') }} />
        {!loading && recentActivityList?.length === 0 && (
          <EmptyState
            title="No Activity Found"
            description="You have no recent activity."
            noAction={true}
          />
        )

        }

        {/* Scrollable Activities */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('2%') }}
          nestedScrollEnabled={true}
        >
          {loading ? (
            <View>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton style={{ height: hp('10%'), borderRadius: wp('2%') }} />
              ))
              }
            </View>
          ) : (
            <FlatList
              data={recentActivityList}
              renderItem={({ item }) => (
                <View style={styles.activityRow} key={item?.activityId}>
                  <View style={styles.statusWrapper}>
                    <Feather name={ICONS[item?.activityType]?.icon} size={wp('5%')} color={ICONS[item?.activityType]?.color} />
                  </View>

                  <View style={styles.textWrapper}>
                    <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>
                      {item?.activityTitle}
                    </Text>
                    <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                      {item?.activityMessage}
                    </Text>
                  </View>

                  <View style={styles.timeWrapper}>
                    <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                      {formatDate(item?.createdDate)}
                    </Text>
                  </View>
                </View>
              )}
            />
          )

          }

        </ScrollView>
      </Card>
    </View>
  );
};

export default Activity;
