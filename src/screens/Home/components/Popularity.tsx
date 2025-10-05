import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { OrderModel } from '@/src/types/order/order-type';
import Skeleton from '@/components/ui/skeleton';
const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: wp('2%'),
        marginVertical: hp('2%'),
        padding: wp('4%'),
        height: hp('40%'), // fixed height for scroll
    },
})
type PopularityProps = {
    orderDetails: OrderModel[]
    isLoading: boolean
}
const Popularity = (props: PopularityProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [percentageStat, setPercentageStat] = useState<{ eventType: string; percentage: number; value: number }[]>([]);




    useEffect(() => {
        if (!props?.orderDetails) return;

        // Get unique event types
        const uniqueEventTypes = Array.from(new Set(props.orderDetails.map((item) => item.eventType)));

        // Calculate percentage and count
        const stats = uniqueEventTypes.map((eventType) => {
            const filtered = props.orderDetails.filter((item) => item.eventType === eventType);
            return {
                eventType,
                value: filtered.length,
                percentage: Math.round((filtered.length / props.orderDetails.length) * 100),
            };
        });

        setPercentageStat(stats);
    }, [props.orderDetails]);
    return (
        <View>
            <Card style={[styles.cardContainer]}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Service Popularity
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                            Distribution of bookings
                        </Text>
                    </View>
                    <Feather name="info" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                </View>
                <Divider style={{ marginVertical: hp('1.5%') }} />
                {props?.isLoading ? (
                    <Skeleton height={hp('30%')} width={wp('88%')} />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: hp('2%') }}
                        nestedScrollEnabled={true}
                    >
                        {percentageStat && percentageStat.map((item, index) => (
                            <View style={{ marginTop: hp('2%') }}>
                                <View className='flex flex-row justify-between items-center'>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        {item.eventType}
                                    </Text>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        {item.value}
                                    </Text>
                                </View>
                                <View style={{ marginTop: hp('1%') }}>
                                    <Progress value={item.percentage} style={{ width: wp('40%') }}>
                                        <ProgressFilledTrack style={{ backgroundColor: '#4F46E5' }} />
                                    </Progress>
                                </View>

                            </View>
                        ))

                        }
                    </ScrollView>
                )

                }




            </Card>

        </View>
    );
};

export default Popularity;