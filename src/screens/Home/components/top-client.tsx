import { Card } from '@/components/ui/card';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { OrderModel } from '@/src/types/order/order-type';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { GlobalStatus } from '@/src/types/common';
import Skeleton from '@/components/ui/skeleton';
import Tooltip, { Placement } from 'react-native-tooltip-2';
import { EmptyState } from '@/src/components/empty-state-data';

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: wp('2%'),
        marginVertical: hp('2%'),
        padding: wp('4%'),
    },
    innerCard: {
        marginRight: wp('3%'),
        width: wp('60%'),
    }
});
type TopClientProps = {
    orderDetails: OrderModel[]
    customerMetaInfo: CustomerMetaModel
    isLoading: boolean
}
const TopClient = (props: TopClientProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [topCustomers, setTopCustomers] = useState([]);

    const getTopCustomersSummary = (orders: OrderModel[], topN: number = 10) => {
        const countMap: Record<string, { count: number; deliveredCount: number }> = {};

        orders?.forEach(order => {
            if (!order?.customerID) return;

            if (!countMap[order.customerID]) {
                countMap[order.customerID] = { count: 0, deliveredCount: 0 };
            }

            countMap[order.customerID].count += 1;
            if (order?.status === GlobalStatus.DELIVERED) {
                countMap[order.customerID].deliveredCount += 1;
            }
        });

        // Convert to array and sort by total count descending
        const sortedCustomers = Object.entries(countMap)
            .map(([customerID, data]) => ({ customerID, ...data }))
            .sort((a, b) => b.count - a.count);

        return sortedCustomers.slice(0, topN);
    };

    useEffect(() => {
        const sortedOrders = getTopCustomersSummary(props?.orderDetails, 10)
        setTopCustomers(sortedOrders)
    }, [props?.orderDetails])

    const renderClientCard = ({ item }: any) => (
        <Card style={[globalStyles.cardShadowEffect, styles.innerCard]}>
            <View className='flex flex-col items-center justify-center gap-2'>
                <Avatar
                    style={{
                        backgroundColor: "#8B5CF6",
                        transform: [{ scale: 1.2 }],
                    }}
                >
                    <AvatarFallbackText style={globalStyles.whiteTextColor}>
                        {props?.customerMetaInfo?.find((customer) => customer.customerID === item?.customerID)?.name}
                    </AvatarFallbackText>
                </Avatar>
                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                    {props?.customerMetaInfo?.find((customer) => customer.customerID === item?.customerID)?.name}
                </Text>
            </View>
            <View className='flex flex-row justify-between items-center mt-2'>
                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                    Total Orders : {item?.count}
                </Text>
                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                    Delivered : {item?.deliveredCount}
                </Text>
            </View>
        </Card>
    );

    return (
        <View>
            <Card style={styles.cardContainer}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Top Clients
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                            Highest revenue contributors
                        </Text>
                    </View>
                    <Tooltip
                        isVisible={toolTipVisible}
                        content={<Text>This Widget displays the top 10 customers based on the total number of orders placed.</Text>}
                        placement={Placement.BOTTOM}
                        onClose={() => setToolTipVisible(false)}>
                        <TouchableOpacity onPress={() => setToolTipVisible(true)}>
                            <Feather name="info" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                        </TouchableOpacity>

                    </Tooltip>
                </View>

                <Divider style={{ marginVertical: hp('1.5%') }} />
                {!props?.isLoading && topCustomers?.length<=0 && (
                    <EmptyState title="No Customers Found" noAction={true}/>
                )

                }
                {(props?.isLoading) ? (
                    <View className='flex flex-row items-center gap-3'>
                        <FlatList
                            horizontal
                            data={[1, 2, 3, 4]}
                            renderItem={({ item }) => (
                                <Skeleton key={item} width={wp('60%')} height={hp('15%')} />
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: hp('2%') }}
                        />

                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={topCustomers}
                        renderItem={renderClientCard}
                        keyExtractor={(item) => item.customerID}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginVertical: hp('2%') }}

                    />
                )

                }


            </Card>
        </View>
    );
};

export default TopClient;
