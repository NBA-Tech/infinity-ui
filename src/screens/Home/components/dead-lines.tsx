import { Card } from '@/components/ui/card';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Divider } from '@/components/ui/divider';
import { OrderModel } from '@/src/types/order/order-type';
import { GlobalStatus } from '@/src/types/common';
import Skeleton from '@/components/ui/skeleton';
import Tooltip, { Placement } from 'react-native-tooltip-2';
import { EmptyState } from '@/src/components/empty-state-data';

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: wp('2%'),
        marginVertical: hp('2%'),
        padding: wp('4%'),
        height: hp('50%'),
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('2%'),
        gap: wp('2%')
    },
    dot: {
        width: wp('3%'),
        height: wp('3%'),
        borderRadius: wp('100%')
    },
    textWrapper: {
        flex: 1,
    },
    timeWrapper: {
        alignItems: 'flex-end',
    },
});

type DeadLinesProps = {
    orderDetails: OrderModel[];
    isLoading: boolean;
};

const DeadLines = (props: DeadLinesProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [weeklyOrderData, setWeeklyOrderData] = useState<OrderModel[]>([]);
    const [toolTipVisible, setToolTipVisible] = useState(false);

    const getTimeToEvent = (eventDateStr: string) => {
        const eventDate = new Date(eventDateStr);
        const today = new Date();

        const eventUTC = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
        const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

        const diffInDays = Math.round((eventUTC - todayUTC) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "1 day to go";
        if (diffInDays > 1) return `${diffInDays} days to go`;
        return null; // expired: hide
    };

    const deadLineComponent = ({ item }: { item: OrderModel }) => {
        return (
            <View style={{ marginTop: hp('2%') }}>
                <View style={styles.activityRow}>
                    <View style={[styles.dot, { backgroundColor: "red" }]} />
                    <View style={styles.textWrapper}>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>
                            {item?.eventTitle}
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                            {item?.eventType}
                        </Text>
                    </View>
                    <View style={styles.timeWrapper}>
                        <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                            {getTimeToEvent(item?.eventDate)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // 🚀 FILTER + SORT HERE
    useEffect(() => {
        if (!props.orderDetails) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const cleanedData = props.orderDetails
            .filter((item) => {
                if (item.status === GlobalStatus.COMPLETED) return false;

                const eventDate = new Date(item.eventDate);
                eventDate.setHours(0, 0, 0, 0);

                return eventDate >= today; // keep today + future only
            })
            .sort(
                (a, b) =>
                    new Date(a.eventDate).getTime() -
                    new Date(b.eventDate).getTime()
            );

        setWeeklyOrderData(cleanedData);
    }, [props.orderDetails]);

    return (
        <View>
            <Card style={[styles.cardContainer]}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Upcoming Deadlines
                        </Text>
                    </View>

                    <Tooltip
                        isVisible={toolTipVisible}
                        content={<Text style={globalStyles.normalText}>This widget shows upcoming deadlines.</Text>}
                        placement={Placement.BOTTOM}
                        onClose={() => setToolTipVisible(false)}
                    >
                        <TouchableOpacity onPress={() => setToolTipVisible(true)}>
                            <Feather name="info" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                        </TouchableOpacity>
                    </Tooltip>
                </View>

                <Divider style={{ marginVertical: hp('1.5%') }} />

                {!props.isLoading && weeklyOrderData.length <= 0 && (
                    <EmptyState
                        title='No Upcoming Deadlines'
                        description='Hooray!! You have no upcoming deadlines'
                        noAction={true}
                    />
                )}

                {props.isLoading ? (
                    <Skeleton height={hp('30%')} width={wp('88%')} />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: hp('2%') }}
                        nestedScrollEnabled={true}
                    >
                        <FlatList
                            data={weeklyOrderData}
                            renderItem={deadLineComponent}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                )}
            </Card>
        </View>
    );
};

export default DeadLines;
