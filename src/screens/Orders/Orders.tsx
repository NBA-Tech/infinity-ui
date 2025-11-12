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
import { ApprovalStatus, OrderModel } from '@/src/types/order/order-type';
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
import { useReloadContext } from '@/src/providers/reload/reload-context';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
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
    const [deleteLoading, setDeleteLoading] = useState(false);
    const showToast = useToastMessage();
    const { getItem } = useDataStore();
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const [currID, setCurrID] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [intialLoading, setIntialLoading] = useState(true);
    const [customerListFilter, setCustomerListFilter] = useState<string[]>();
    const [eventTypeFilter, setEventTypeFilter] = useState<string[]>();
    const [totalCount, setTotalCount] = useState(0);
    const { triggerReloadOrders } = useReloadContext()

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
                approvalStatus:ApprovalStatus.ACCEPTED
            },
        };
        console.log(currFilters)

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
        setDeleteLoading(true);
        const deleteOrderResponse = await deleteOrderAPI(currID);
        if (!deleteOrderResponse.success) {
            showToast({ type: "error", title: "Error", message: deleteOrderResponse.message });
        }
        else {
            showToast({ type: "success", title: "Success", message: deleteOrderResponse.message });
            setRefresh(!refresh);
        }
        setDeleteLoading(false);
        setOpenDelete(false);
        triggerReloadOrders();
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
            let reset = filters?.page === 1;
            if(!intialLoading){
                reset=intialLoading
            }
            getOrderListData(reset);
            setIntialLoading(true)
            return()=>{
                setOrderData([]);
                setIntialLoading(false)
            }
        }, [filters, refresh])
    );
    

    useEffect(() => {
        const userId = getItem("USERID");
        loadCustomerMetaInfoList(userId, {}, {}, showToast);
        loadOrdersMetaData(userId);
    }, []);

    return (
        <SafeAreaView style={globalStyles.appBackground}>
           <GradientCard
                colors={isDark
                    ? ["#0D3B8F", "#1372F0"]  // Dark mode: deep navy → vibrant blue
                    : ["#1372F0", "#6FADFF"]  // Light mode: vibrant blue → soft sky blue
                }
            >
                <View className="flex flex-col p-4 gap-5">
                    {/* Header */}
                    <View className="flex flex-row justify-center items-center mb-2" style={{ marginTop: hp('2.5%') }}>
                        <Text
                            style={[
                                globalStyles.headingText,
                                globalStyles.whiteTextColor,
                                { letterSpacing: 1, textTransform: 'uppercase' },
                            ]}
                        >
                            Orders
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View className="flex flex-row justify-between items-start">
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Total Orders
                            </Text>
                            <View
                                className="flex flex-row justify-center items-center rounded-full"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    paddingVertical: hp('1%'),
                                    paddingHorizontal: wp('3%'),
                                }}
                            >
                                <Feather name="package" size={wp('5%')} style={{marginRight: wp('2%')}} color="#fff" />
                                <Text
                                    style={[globalStyles.headingText, globalStyles.whiteTextColor]}>
                                    8
                                </Text>
                            </View>
                        </View>

                        {/* Create Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Create Orders
                            </Text>
                            <Button
                                size="md"
                                variant="solid"
                                action="primary"
                                style={[
                                    globalStyles.buttonColor,
                                    {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderColor: "rgba(255,255,255,0.3)",
                                        borderWidth: 1,
                                        borderRadius: wp('2%'),
                                    },
                                ]}
                                onPress={() => navigation.navigate('CreateOrder')}
                            >
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>
            </GradientCard>
            <FilterComponent
                filterName='orders'
                filters={filters}
                setFilters={setFilters}
                setOpenFilter={setOpenFilter}
                openFilter={openFilter}
                setRefresh={setRefresh}
                extraValue={{
                    customerList: customerMetaInfoList
                        ?.map(c => ({
                            label: `${c.name}`,
                            value: c.customerID
                        })),
                    eventTypeList: eventTypeFilter?.map(e => ({ label: e, value: e }))
                }}
            />
            <View>
                <DeleteConfirmation openDelete={openDelete} loading={deleteLoading} setOpenDelete={setOpenDelete} handleDelete={handleDelete} />
                <View  style={{ marginVertical: hp('1%') }}>
                    <View className="flex flex-row items-center gap-3" style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                        <Input size="lg" style={styles.inputContainer} variant='rounded'>
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
                            <MaterialCommunityIcons name={isFilterApplied(filters) ? "filter" : "filter-outline"} size={wp('8%')} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>
                </View>

                {loading && <OrderCardSkeleton count={5} />}
                {!loading && orderData.length <= 0 && <EmptyState variant={!filters?.searchQuery ? "orders" : "search"} onAction={() => navigation.navigate("CreateOrder")} />}

                <FlatList
                    data={orderData ?? []}
                    style={{ height: hp("65%") }}
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
