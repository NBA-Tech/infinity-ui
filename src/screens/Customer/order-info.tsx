import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import OrderCard from '../orders/components/order-card';
import { ApprovalStatus, OrderModel } from '@/src/types/order/order-type';
import { GlobalStatus } from '@/src/types/common';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import { useNavigation } from '@react-navigation/native';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { deleteOrderAPI } from '@/src/api/order/order-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { useReloadContext } from '@/src/providers/reload/reload-context';
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
    reload: boolean
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}
const ProjectInfo = (props: ProjectInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const navigation = useNavigation();
    const [currId, setCurrId] = useState<string>('');
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const showToast = useToastMessage()
    const { triggerReloadOrders } = useReloadContext()
    const statInfo = useMemo(() => {
        const orders = props.orderDetails || [];
        console.log(orders)

        const pending = orders.filter(o => o.approvalStatus === ApprovalStatus.PENDING).length;
        const pendingCount = orders.filter(o => o.status === GlobalStatus.IN_PROGRESS).length;
        const cancelledCount = orders.filter(o => o.status === GlobalStatus.CANCELLED).length;

        return {
            pending: {
                title: "Pending",
                value: pending.toString(),
                color: "#F59E0B",
            },
            progress: {
                title: "Progress",
                value: pendingCount.toString(),
                color: "#3B82F6",
            },
            cancelled: {
                title: "Cancelled",
                value: cancelledCount.toString(),
                color: "#EF4444",
            },
        };
    }, [props.orderDetails]);

    const actions = {
        view: {
            onPress: (orderId: string) => navigation.navigate('Orders',{ screen: 'OrderDetails', params: { orderId: orderId }})
        },
        edit: {
            onPress: (orderId: string) => navigation.navigate('CreateOrder', { orderId })
        },
        delete: {
            onPress: (orderId: string) => {
                setCurrId(orderId);
                setOpenDelete(true);
            }
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true);
        const deleteOrderResponse = await deleteOrderAPI(currId);
        if (!deleteOrderResponse.success) {
            showToast({ type: "error", title: "Error", message: deleteOrderResponse.message });
        }
        else {
            showToast({ type: "success", title: "Success", message: deleteOrderResponse.message });
        }
        setDeleteLoading(false);
        setOpenDelete(false);
        props?.setReload(!props?.reload);
        triggerReloadOrders();
        
    }


    return (
        <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
        >
            <DeleteConfirmation openDelete={openDelete} loading={deleteLoading} setOpenDelete={setOpenDelete} handleDelete={handleDelete} />
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
                    <EmptyState variant="orders" onAction={() => navigation.navigate('CreateOrder')} />
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
                            <OrderCard cardData={item} customerMetaData={props?.customerMetaData} actions={
                                {
                                    view: actions.view.onPress,
                                    edit: actions.edit.onPress,
                                    delete: actions.delete.onPress
                                }
                            }/>
                        )}
                        contentContainerStyle={{gap: hp('0.3%') }} // optional spacing at bottom
                        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                    />
                )}


            </View>
        </ScrollView>
    );
};

export default ProjectInfo; 
