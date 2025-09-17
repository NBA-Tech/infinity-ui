import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
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
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { CustomerApiResponse } from '@/src/types/customer/customer-type';
import { getCustomerDetails } from '@/src/api/customer/customer-api-service';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import Skeleton from '@/components/ui/skeleton';
import debounce from "lodash.debounce";
import { EmptyState } from '@/src/components/empty-state-data';

const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
});

const OrderCardSkeleton = () => (
    <View className='flex flex-col justify-between'>
        {[...Array(4)].map((_, index) => (
            <View key={index}>
                <Skeleton style={{ width: wp('95%'), height: hp('15%'), marginHorizontal: wp('2%') }} />
            </View>
        ))}
    </View>
);

const Orders = () => {
    const globalStyles = useContext(StyleContext);
    const [filters, setFilters] = useState<SearchQueryRequest>({ page: 1, pageSize: 10 });
    const [orderData, setOrderData] = useState<OrderModel[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const showToast = useToastMessage();
    const { getItem } = useDataStore();
    const { customerMetaInfoList, getCustomerMetaInfoList, setCustomerMetaInfoList } = useCustomerStore();

    const getOrderListData = async (reset: boolean = false) => {
        setLoading(true);
        const currFilters: SearchQueryRequest = {
            filters: { userId: getItem("USERID") },
            requiredFields: ["orderId", "status", "totalPrice", "orderBasicInfo.customerID", "eventInfo"],
            ...filters
        };
        try {
            const orderDataResponse: ApiGeneralRespose = await getOrderDataListAPI(currFilters);
            if (!orderDataResponse?.success) {
                showToast({ type: "error", title: "Error", message: orderDataResponse.message });
                return;
            }

            setOrderData(prev =>
                reset ? orderDataResponse?.data ?? [] : [...prev, ...(orderDataResponse?.data ?? [])]
            );

            setHasMore(
                (orderDataResponse?.data?.length ?? 0) > 0 &&
                (((filters?.page ?? 1) * (filters?.pageSize ?? 10)) < (orderDataResponse?.total ?? 0))
            );
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const getCustomerMetaData = async () => {
        const customerMetaData = getCustomerMetaInfoList();
        if (customerMetaData?.length > 0) return;

        const userId = getItem("USERID");
        const payload: SearchQueryRequest = {
            filters: { userId },
            getAll: true,
            requiredFields: ["customerBasicInfo.firstName", "customerBasicInfo.lastName", "_id"],
        };
        const customerListResponse: CustomerApiResponse = await getCustomerDetails(payload);
        if (!customerListResponse?.success) {
            return showToast({ type: "error", title: "Error", message: customerListResponse?.message ?? "Something went wrong" });
        }
        if (!customerListResponse?.customerList?.length) return;

        const metaList = toCustomerMetaModelList(customerListResponse.customerList);
        setCustomerMetaInfoList(metaList);
    };

    const handleSearch = (value: string) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: value,
            searchField: "eventInfo.eventTitle",
            page: 1,
        }));
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

    useEffect(() => {
        const reset = filters?.page === 1;
        getOrderListData(reset);
    }, [filters]);

    useEffect(() => {
        getCustomerMetaData();
    }, []);

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
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>{orderData.length} Orders found</Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]}>
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create New</ButtonText>
                            </Button>
                        </View>
                    </View>
                    <View className="flex flex-row items-center gap-3" style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                        <Input size="lg" style={styles.inputContainer}>
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Orders"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                                onChangeText={debouncedSearch}
                            />
                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>
                </View>

                {loading && <OrderCardSkeleton />}
                {!loading && orderData.length <= 0 && <EmptyState variant={!filters?.searchQuery?"order":"search"} />}

                <FlatList
                    data={orderData ?? []}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={{ height: hp("60%") }}
                    contentContainerStyle={{ paddingVertical: hp("1%") }}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: wp("3%"), marginVertical: hp("1%") }}>
                            <OrderCard
                                cardData={item}
                                customerMetaData={customerMetaInfoList?.find(c => c?.customerID === item?.orderBasicInfo?.customerID) ?? []}
                            />
                        </View>
                    )}
                    onEndReached={() => {
                        if (hasMore) setFilters(prev => ({ ...prev, page: (prev?.page ?? 1) + 1 }));
                    }}
                    onEndReachedThreshold={0.7}
                    ListFooterComponent={hasMore && !loading ? OrderCardSkeleton : null}
                />

                <Fab size="lg" placement="bottom right" style={{ backgroundColor: '#8B5CF6' }}>
                    <Feather name="plus" size={wp('6%')} color="#fff" />
                </Fab>
            </View>
        </SafeAreaView>
    );
};

export default Orders;
