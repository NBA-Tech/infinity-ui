import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Header from '@/src/components/header';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Fab } from '@/components/ui/fab';
import OrderCard from './components/order-card';
import { ApiGeneralRespose, SearchQueryRequest } from '@/src/types/common';
import { OrderModel } from '@/src/types/order/order-type';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import { generateRandomString } from '@/src/utils/utils';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { CustomerApiResponse } from '@/src/types/customer/customer-type';
import { getCustomerDetails } from '@/src/api/customer/customer-api-service';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import {Skeleton} from '@/components/ui/skeleton';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
})
const OrderCardSkeleton = () => {
    return (
        <View className='flex flex-row justify-between'>
            {[...Array(6)].map((_, index) => (
                <View style={{width: wp('45%')}} key={index}>
                    <Skeleton width="100%" height={hp('15%')} />
                    <Skeleton width="100%" height={hp('5%')} style={{ marginTop: 8 }} />
                </View>
            ))}
        </View>
    );
};

const Orders = () => {
    const globalStyles = useContext(StyleContext);
    const [filters, setFilters] = useState<SearchQueryRequest>()
    const [orderData, setOrderData] = useState<OrderModel>()
    const [hasMore, setHasMore] = useState(true);
    const showToast = useToastMessage();
    const { getItem } = useDataStore()
    const { customerMetaInfoList, getCustomerMetaInfoList, setCustomerMetaInfoList } = useCustomerStore();
    const [loading, setLoading] = useState(false);


    const getOrderListData = async (reset: boolean = false) => {
        const currFilters: SearchQueryRequest = {
            filters: { userId: getItem("USERID") },
            requiredFields: ["orderId", "status", "totalPrice", "orderBasicInfo.customerID", "eventInfo"],
            ...filters
        }
        const orderDataResponse: ApiGeneralRespose = await getOrderDataListAPI(currFilters);
        console.log(orderDataResponse)
        if (!orderDataResponse?.success) {
            showToast({
                type: "error",
                title: "Error",
                message: orderDataResponse.message
            })
            return
        }
        setOrderData((prev = []) =>
            reset
                ? orderDataResponse?.data ?? []
                : [...(prev ?? []), ...(orderDataResponse?.data ?? [])]
        );

        setHasMore(
            (orderDataResponse?.data?.length ?? 0) > 0 &&
            (((filters?.page ?? 1) * (filters?.pageSize ?? 10)) < (orderDataResponse?.total ?? 0))
        );

    }
    const getCustomerMetaData = async () => {
        const customerMetaData = getCustomerMetaInfoList();
        console.log(customerMetaInfoList)
        if (customerMetaData?.length > 0) return;

        const userId = getItem("USERID");
        const payload: SearchQueryRequest = {
            filters: { userId },
            getAll: true,
            requiredFields: ["customerBasicInfo.firstName", "customerBasicInfo.lastName", "_id"],
        };

        const customerListResponse: CustomerApiResponse = await getCustomerDetails(payload);

        if (!customerListResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: customerListResponse?.message ?? "Something went wrong",
            });
        }

        if (customerListResponse?.customerList?.length === 0) return;

        const metaList = toCustomerMetaModelList(customerListResponse.customerList);
        console.log(metaList)
        setCustomerMetaInfoList(metaList);
    }


    useEffect(() => {
        getOrderListData()
    }, [filters])

    useEffect(() => {
        getCustomerMetaData()
    }, [])
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <View>
                <View className='bg-[#fff]' style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text]}>Orders</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>8 Orders found</Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]}>
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create New</ButtonText>
                            </Button>
                        </View>
                    </View>
                    {/* Customer Search is here */}
                    <View
                        className="flex flex-row items-center gap-3"
                        style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Orders"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />

                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>


                </View>
                <OrderCardSkeleton/>
                <FlatList
                    data={orderData ?? []}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={{ height: hp("60%") }}
                    contentContainerStyle={{ paddingVertical: hp("1%") }}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                marginHorizontal: wp("3%"),
                                marginVertical: hp("1%"),
                            }}
                        >
                            <OrderCard cardData={item} customerMetaData={customerMetaInfoList?.find(customer => customer?.customerID === item?.orderBasicInfo?.customerID) ?? []} />
                        </View>
                    )}
                />
                <Fab
                    size="lg"
                    placement="bottom right"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    style={{ backgroundColor: '#8B5CF6' }}
                >
                    <Feather name="plus" size={wp('6%')} color="#fff" />
                </Fab>
            </View>
        </SafeAreaView>
    );
};

export default Orders;