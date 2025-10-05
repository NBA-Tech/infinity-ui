import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import OrderCard from '../Orders/components/order-card';
import { OrderModel } from '@/src/types/order/order-type';
import { GlobalStatus } from '@/src/types/common';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import { useNavigation } from '@react-navigation/native';
const styles = StyleSheet.create({
    projectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingHorizontal: wp('3%'),
        paddingTop: hp('2%'),
    },
    cardContainer: {
        marginHorizontal: wp('1%'), // Balanced spacing between cards
        padding: wp('3%'), // Responsive padding
        minHeight: hp('12%'), // Compact card height
        borderRadius: 8, // Smooth card edges
        width: wp('30%'),
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
});
type ProjectInfoProps = {
    orderDetails: OrderModel[];
    customerMetaData: Record<string, any>;
    isLoading?: boolean
}
const ProjectInfo = (props: ProjectInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const navigation = useNavigation();
    const [statCount, setStatCount] = useState({
        completed: 0,
        pending: 0,
        cancelled: 0
    });

    const statInfo = useMemo(() => {
        const orders = props.orderDetails || [];

        const delivered = orders.filter(o => o.status === GlobalStatus.DELIVERED).length;
        const pendingCount = orders.filter(o => o.status === GlobalStatus.PENDING).length;
        const cancelledCount = orders.filter(o => o.status === GlobalStatus.CANCELLED).length;

        return {
            delivered: {
                title: "Delivered",
                value: delivered.toString(),
                color: "#3B82F6",
            },
            pending: {
                title: "Pending",
                value: pendingCount.toString(),
                color: "#F59E0B",
            },
            cancelled: {
                title: "Cancelled",
                value: cancelledCount.toString(),
                color: "#EF4444",
            },
        };
    }, [props.orderDetails]);


    return (
        <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
        >
            <View className='flex flex-col'>
                <View style={styles.projectContainer}>
                    {Object.values(statInfo).map((stat, index) => (
                        <Card
                            style={[
                                styles.cardContainer,
                                { backgroundColor: `${stat.color}20` }, // Subtle background
                            ]}
                            key={index}
                        >
                            <View style={styles.textContainer}>
                                <Text
                                    style={[
                                        globalStyles.normalTextColor,
                                        globalStyles.labelText,
                                        {
                                            color: stat.color,
                                        },
                                    ]}
                                >
                                    {props?.isLoading ? "Loading..." : stat.title}
                                </Text>
                                <View className="flex-row items-center gap-1 mt-1">
                                    <Text
                                        style={[
                                            globalStyles.normalTextColor,
                                            globalStyles.labelText,
                                            {
                                                color: stat.color,
                                            },
                                        ]}
                                    >
                                        {props?.isLoading ? "Loading..." : stat.value}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>


            </View>
            <View style={{ margin: hp('2%'), gap: hp('2%') }}>
                {!props?.isLoading && props?.orderDetails?.length === 0 && (
                    <EmptyState variant="orders" onAction={()=>navigation.navigate('Orders', { screen: 'CreateOrder' })}/>
                )

                }
                {props.isLoading ? (
                    <View>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                style={{
                                    width: wp('90%'),       // width of each item
                                    height: hp('10%'),       // height of each item
                                    marginRight: wp('2%'),  // horizontal spacing
                                    marginBottom: hp('2%'), // vertical spacing
                                }}
                            />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={props?.orderDetails || []}
                        renderItem={({ item }) => (
                            <OrderCard cardData={item} customerMetaData={props?.customerMetaData} />
                        )}
                        contentContainerStyle={{ paddingBottom: hp('2%'),gap: hp('2%') }} // optional spacing at bottom
                        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                    />
                )}


            </View>
        </ScrollView>
    );
};

export default ProjectInfo; 