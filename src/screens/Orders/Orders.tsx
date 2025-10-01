import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import Header from '@/src/components/header';
import GradientCard from '@/src/utils/gradient-card';
import { Divider } from '@/components/ui/divider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Fab } from '@/components/ui/fab';
import OrderCard from './components/order-card';
import { ApiGeneralRespose, NavigationProp, SearchQueryRequest } from '@/src/types/common';
import { OrderModel } from '@/src/types/order/order-type';
import { deleteOrderAPI, getOrderDataListAPI, getOrderMetaDataAPI } from '@/src/api/order/order-api-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import Skeleton from '@/components/ui/skeleton';
import debounce from "lodash.debounce";
import { EmptyState } from '@/src/components/empty-state-data';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FilterComponent from '@/src/components/filter-component';
import { isFilterApplied } from '@/src/utils/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
    },
});

const OrderCardSkeleton = ({ count }: { count: number }) => (
    <View className='flex flex-col justify-between'>
        {[...Array(count)].map((_, index) => (
            <View key={index}>
                <Skeleton style={{ width: wp('95%'), height: hp('15%'), marginHorizontal: wp('2%') }} />
            </View>
        ))}
    </View>
);

const Orders = () => {
    const navigation = useNavigation<NavigationProp>();
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [filters, setFilters] = useState<SearchQueryRequest>({ page: 1, pageSize: 10 });
    const [orderData, setOrderData] = useState<OrderModel[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const showToast = useToastMessage();
    const { getItem } = useDataStore();
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const [currID, setCurrID] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [customerListFilter, setCustomerListFilter] = useState<string[]>();
    const [eventTypeFilter, setEventTypeFilter] = useState<string[]>();
    const [totalCount, setTotalCount] = useState(0);

    const getOrderListData = async (reset: boolean = false) => {
        setLoading(true);
        const currFilters: SearchQueryRequest = {
            requiredFields: [
                "orderId",
                "status",
                "totalPrice",
                "orderBasicInfo.customerID",
                "eventInfo",
                "offeringInfo"
            ],
            ...filters,
            filters: {
                ...(filters?.filters || {}),
                userId: getItem("USERID"),
            },
        };

        try {
            const orderDataResponse: ApiGeneralRespose = await getOrderDataListAPI(currFilters);
            if (!orderDataResponse?.success) {
                showToast({ type: "error", title: "Error", message: orderDataResponse?.message });
                setLoading(false);
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

    const loadOrdersMetaData = async (userId: string) => {
        const orderMetaDataResponse = await getOrderMetaDataAPI(userId);
        if (!orderMetaDataResponse.success) {
            showToast({ type: "error", title: "Error", message: orderMetaDataResponse.message });
        }
        else {
            setTotalCount(orderMetaDataResponse.data?.totalCounts);
            setCustomerListFilter(orderMetaDataResponse.data?.customerIDs);
            setEventTypeFilter(orderMetaDataResponse.data?.eventTypes);
        }
    }

    const handleSearch = (value: string) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: value,
            searchField: "eventInfo.eventTitle",
            page: 1,
        }));
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

    const handleDelete = async () => {
        setLoading(true);
        const deleteOrderResponse = await deleteOrderAPI(currID);
        if (!deleteOrderResponse.success) {
            showToast({ type: "error", title: "Error", message: deleteOrderResponse.message });
        }
        else {
            showToast({ type: "success", title: "Success", message: deleteOrderResponse.message });
            setRefresh(!refresh);
        }
        setLoading(false);
        setOpenDelete(false);
    }

    const handleDeletePopUp = (orderId: string) => {
        setCurrID(orderId);
        setOpenDelete(true);
    }

    const handleEdit = (orderId: string) => {
        navigation.navigate("CreateOrder", { orderId: orderId });
    }
    const handleView = (orderId: string) => {
        navigation.navigate("OrderDetails", { orderId: orderId });
    }

    useFocusEffect(
        useCallback(() => {
            const reset = filters?.page === 1;
            getOrderListData(reset);
        }, [filters, refresh])
    );

    useEffect(() => {
        const userId = getItem("USERID");
        loadCustomerMetaInfoList(userId, {}, {}, showToast);
        loadOrdersMetaData(userId);
    }, []);

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <FilterComponent
                filterName='orders'
                filters={filters}
                setFilters={setFilters}
                setOpenFilter={setOpenFilter}
                openFilter={openFilter}
                setRefresh={setRefresh}
                extraValue={{
                    customerList: customerMetaInfoList
                        ?.filter(c => customerListFilter?.some(cust => cust === c.customerID))
                        .map(c => ({
                            label: `${c.firstName} ${c.lastName}`,
                            value: c.customerID
                        })),
                    eventTypeList: eventTypeFilter?.map(e => ({ label: e, value: e }))
                }}
            />
            <View>
                <DeleteConfirmation openDelete={openDelete} loading={loading} setOpenDelete={setOpenDelete} handleDelete={handleDelete} />
                <View className={isDark ? "bg-[#1F2028]" : "bg-[#fff]"} style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>Orders</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>{orderData?.length} Orders found</Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={() => navigation.navigate("CreateOrder")}>
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create New</ButtonText>
                            </Button>
                        </View>
                    </View>
                    <View className="flex flex-row items-center gap-3" style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                        <Input size="lg" style={styles.inputContainer}>
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color={isDark ? "#fff" : "#00"} />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Orders"
                                onChangeText={debouncedSearch}
                            />
                        </Input>
                        <TouchableOpacity onPress={() => setOpenFilter(true)}>
                            <MaterialCommunityIcons name={isFilterApplied(filters) ? "filter" : "filter-outline"} size={wp('8%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>
                </View>

                {loading && <OrderCardSkeleton count={4} />}
                {!loading && orderData.length <= 0 && <EmptyState variant={!filters?.searchQuery ? "order" : "search"} onAction={() => navigation.navigate("CreateOrder")} />}

                <FlatList
                    data={orderData ?? []}
                    style={{ height: hp("60%") }}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: hp("1%") }}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: wp("3%"), marginVertical: hp("1%") }}>
                            <OrderCard
                                cardData={item}
                                customerMetaData={customerMetaInfoList?.find(c => c?.customerID === item?.orderBasicInfo?.customerID) ?? []}
                                actions={{
                                    delete: handleDeletePopUp,
                                    edit: handleEdit,
                                    view: handleView
                                }}
                            />
                        </View>
                    )}
                    onEndReached={() => {
                        if (hasMore) setFilters(prev => ({ ...prev, page: (prev?.page ?? 1) + 1 }));
                    }}
                    onEndReachedThreshold={0.7}
                    ListFooterComponent={(hasMore && loading) ? <OrderCardSkeleton count={1} /> : null}
                    refreshing={loading}
                    onRefresh={() => {
                        setFilters(prev => ({ ...prev, page: 1 }));
                    }}
                />

                {/* <Fab size="lg" placement="bottom right" style={{ backgroundColor: '#8B5CF6' }}>
                    <Feather name="plus" size={wp('6%')} color="#fff" />
                </Fab> */}
            </View>
        </SafeAreaView>
    );
};

export default Orders;
