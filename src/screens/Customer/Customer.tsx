import React, { act, useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Header from '@/src/components/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-card';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarBadge, AvatarFallbackText } from "@/components/ui/avatar"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab"
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu"
import { Button, ButtonText } from '@/components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { ApiGeneralRespose, NavigationProp, SearchQueryRequest } from '@/src/types/common';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import { formatDate, isFilterApplied, openDaialler, openEmailClient, openMessageBox, openWhatsApp } from '@/src/utils/utils';
import { deleteCustomerAPI, getCustomerListBasedOnFilters } from '@/src/api/customer/customer-api-service';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import FilterComponent from '@/src/components/filter-component';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import debounce from "lodash.debounce";
import { useUserStore } from '@/src/store/user/user-store';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
    },
    cardContainer: {
        borderRadius: wp('2%'),
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    details: {
        justifyContent: 'space-between',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    status: {
        borderRadius: wp('1.5%'),
        backgroundColor: 'orange',
        padding: wp('1.5%')
    },
    createdOn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: wp('3%'),
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    }
})


const CustomerCardSkeleton = ({ count }: { count: number }) => (
    <View className='flex flex-col justify-between'>
        {[...Array(count)].map((_, index) => (
            <View key={index}>
                <Skeleton style={{ width: wp('95%'), height: hp('15%'), marginHorizontal: wp('2%') }} />
            </View>
        ))}
    </View>
);
const Customer = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const navigation = useNavigation<NavigationProp>()
    const [customerData, setCustomerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [currID, setCurrID] = useState<string>('');
    const [filters, setFilters] = useState<SearchQueryRequest>({});
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const { deleteCustomerMetaInfo } = useCustomerStore();
    const { userDetails } = useUserStore()
    const { getItem } = useDataStore()
    const showToast = useToastMessage()
    const { triggerReloadCustomer } = useReloadContext()


    const getCustomerDetails = async (reset: boolean = false) => {
        const userID = getItem("USERID");
        if (!userID) {
            showToast({
                type: "error",
                title: "Error",
                message: "User ID not found",
            });
            return;
        }

        reset ? setLoading(true) : setLoadingMore(true);

        try {
            // Step 1: Get customers
            const customerFilters: SearchQueryRequest = filters
            customerFilters.filters = { ...(customerFilters.filters || {}), userId: userID };

            const customerDetailsResponse: ApiGeneralRespose =
                await getCustomerListBasedOnFilters(customerFilters);

            if (!customerDetailsResponse?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message:
                        customerDetailsResponse?.message ||
                        "Failed to fetch customer details",
                });
                return;
            }

            const customers = customerDetailsResponse?.data ?? [];
            const customerIds = customers.map((item: any) => item?.customerID);

            // Step 2: Get orders for those customers
            const orderFilters: SearchQueryRequest = {
                searchQuery: [customerIds],
                searchField: "orderBasicInfo.customerID",
                ...filters,
            };
            orderFilters.filters = { ...(orderFilters.filters || {}), userId: userID };

            const orderDetailsResponse: ApiGeneralRespose =
                await getOrderDataListAPI(orderFilters);

            if (!orderDetailsResponse?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message:
                        orderDetailsResponse?.message ||
                        "Failed to fetch order details",
                });
                return;
            }

            const orders = orderDetailsResponse?.data ?? [];
            const orderIds = orders.map((item: any) => item.orderId);

            // Step 3: Get invoices for those orders
            const invoiceFilters: SearchQueryRequest = {
                searchQuery: [orderIds],
                searchField: "orderId",
                ...filters,
            };
            invoiceFilters.filters = { ...(invoiceFilters.filters || {}), userId: userID };

            const invoiceDetailsResponse: ApiGeneralRespose =
                await getInvoiceListBasedOnFiltersAPI(invoiceFilters);

            if (!invoiceDetailsResponse?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message:
                        invoiceDetailsResponse?.message ||
                        "Failed to fetch invoice details",
                });
                return;
            }

            const invoices = invoiceDetailsResponse?.data ?? [];

            const updatedCustomers = customers.map((c: any) => {
                // Orders for this customer
                const customerOrders = orders.filter(
                    (o: any) => o.orderBasicInfo.customerID === c.customerID
                );

                // Quotations (sum totalPrice of all orders)
                const totalQuotation = customerOrders.reduce(
                    (total: number, o: any) => total + (o.totalPrice || 0),
                    0
                );

                // Invoices (sum amountPaid for this customer's orders)
                const customerOrderIds = customerOrders.map((o: any) => o.orderId);
                const customerInvoices = invoices.filter((inv: any) =>
                    customerOrderIds.includes(inv.orderId)
                );
                const totalInvoice = customerInvoices.reduce(
                    (total: number, inv: any) => total + (inv.amountPaid || 0),
                    0
                );

                return {
                    ...c,
                    totalQuotation,
                    totalInvoice,
                };
            });

            setCustomerData((prev) =>
                reset ? updatedCustomers : [...prev, ...updatedCustomers]
            );
            setHasMore(customers.length === (filters.pageSize || 10));
        } catch (err) {
            console.error("Error fetching customer details:", err);
            showToast({
                type: "error",
                title: "Error",
                message: "Unexpected error occurred",
            });
        } finally {
            reset ? setLoading(false) : setLoadingMore(false);
        }
    };


    const deleteCustomer = async () => {
        if (!currID) return;
        setLoadingDelete(true);
        const deleteCustomerResponse = await deleteCustomerAPI(currID);
        if (!deleteCustomerResponse?.success) {
            showToast({
                type: 'error',
                title: 'Error',
                message: deleteCustomerResponse?.message || 'Failed to delete customer'
            })
            setLoadingDelete(false);
            return
        }
        setLoadingDelete(false);
        setCustomerData(prev => prev.filter(item => item.customerID !== currID));
        deleteCustomerMetaInfo(currID);
        showToast({
            type: 'success',
            title: 'Success',
            message: 'Customer deleted successfully'
        })
        setOpenDelete(false);
        triggerReloadCustomer()
    }

    const handleSearch = (value: string) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: value,
            searchField: ["customerBasicInfo.name"],
            page: 1,
        }));
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 300), []);


    useFocusEffect(
        useCallback(() => {
            const reset = filters?.page === 1 || !filters?.page;
            getCustomerDetails(reset || refresh);
        }, [filters, refresh])
    );

    const CustomerCardComponent = ({ item }: any) => {
        return (
            <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                <View>
                    <View style={styles.cardContent}>
                        {/* Left Side (Avatar + Details) */}
                        <View style={styles.leftSection}>
                            <Avatar size={'md'} style={{ backgroundColor: '#2C426A', transform: [{ scale: 1.2 }] }}>
                                <AvatarFallbackText style={globalStyles.whiteTextColor}>
                                    {item?.customerBasicInfo?.name}
                                </AvatarFallbackText>
                            </Avatar>

                            <View style={styles.details}>
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor, { width: wp('60%') }]} numberOfLines={1}>{item?.customerBasicInfo?.name}</Text>

                                <View style={styles.detailRow}>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Created Date : {formatDate(item?.createdDate)}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Total Quoted : {userDetails?.currencyIcon || "$"} {item?.totalQuotation || 0}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Total Paid : {userDetails?.currencyIcon || "$"} {item?.totalInvoice || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.statusContainer}>
                            <Menu
                                placement="bottom"
                                offset={5}
                                style={globalStyles.appBackground}
                                trigger={({ ...triggerProps }) => {
                                    return (
                                        <Button {...triggerProps} variant="ghost" style={{ backgroundColor: 'transparent' }}>
                                            <MaterialDesign name="dots-vertical" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                        </Button>
                                    )
                                }}
                            >
                                <MenuItem key="view" textValue="eye" className='gap-2' onPress={() => navigation.navigate('CustomerDetails', { customerID: item?.customerID })}>
                                    <Feather name="eye" size={wp('5%')} color="#3B82F6" />
                                    <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]} >View</MenuItemLabel>
                                </MenuItem>
                                <MenuItem key="edit" textValue="eye" className='gap-2' onPress={() => navigation.navigate('CreateCustomer', { customerID: item?.customerID })}>
                                    <Feather name="edit-2" size={wp('5%')} color="#3B82F6" />
                                    <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]} >Edit</MenuItemLabel>
                                </MenuItem>
                                <MenuItem key="delete" textValue="Delete" className='gap-2' onPress={() => { setCurrID(item?.customerID); setOpenDelete(true); }}>
                                    <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                                    <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>Delete</MenuItemLabel>
                                </MenuItem>
                            </Menu>
                        </View>


                    </View>
                    <View style={styles.createdOn}>
                        <TouchableOpacity onPress={() => { openDaialler(item?.customerBasicInfo?.mobileNumber) }}>
                            <Feather name="phone" size={wp('5%')} color={isDark ? "#A3BFFA" : "#1372F0"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { openWhatsApp(item?.customerBasicInfo?.mobileNumber,"Hi hope you are doing good,") }}>
                            <FontAwesome name="whatsapp" size={wp('5%')} color={isDark ? "#25D366" : "#22C55E"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { openEmailClient(item?.customerBasicInfo?.email) }}>
                            <Feather name="mail" size={wp('5%')} color={isDark ? "#F87171" : "#EF4444"} />
                        </TouchableOpacity>

                    </View>
                </View>
            </Card>
        )
    }

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <FilterComponent filterName='customer' openFilter={openFilter} setOpenFilter={setOpenFilter} filters={filters} setFilters={setFilters} setRefresh={setRefresh} />

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
                            Customers
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View className="flex flex-row justify-between items-start">
                        {/* Total Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Total Customers
                            </Text>
                            <View
                                className="flex flex-row justify-center items-center rounded-full"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    paddingVertical: hp('1%'),
                                    paddingHorizontal: wp('3%'),
                                }}
                            >
                                <Feather name="users" size={wp('5%')} color="#fff" />
                                <Text
                                    style={[globalStyles.headingText, globalStyles.whiteTextColor]}>
                                    {customerData?.length}
                                </Text>
                            </View>
                        </View>

                        {/* Create Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Create Customers
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
                                onPress={() => navigation.navigate('CreateCustomer')}
                            >
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>
            </GradientCard>

            {openDelete && (
                <DeleteConfirmation
                    openDelete={openDelete}
                    setOpenDelete={setOpenDelete}
                    loading={loadingDelete}
                    handleDelete={deleteCustomer}
                />
            )

            }


            <View>
                <View style={{ backgroundColor: globalStyles.appBackground.backgroundColor }}>
                    {/* Customer Search is here */}
                    <View
                        className="flex flex-row items-center gap-3"
                        style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                            variant='rounded'
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Customer"
                                onChangeText={debouncedSearch}
                            />

                        </Input>
                        <TouchableOpacity onPress={() => setOpenFilter(true)}>
                            <MaterialCommunityIcons name={isFilterApplied(filters) ? "filter" : "filter-outline"} size={wp('8%')} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>


                </View>
                {loading && (
                    <CustomerCardSkeleton count={5} />
                )
                }
                {!loading && customerData.length === 0 ? (
                    <EmptyState variant={"customers"} onAction={() => navigation.navigate('CreateCustomer')} />
                ) : (
                    <FlatList
                        data={customerData}
                        style={{ height: hp("70%") }}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: hp("1%") }}
                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                                <CustomerCardComponent item={item} />
                            </View>
                        )}
                        refreshing={loading}
                        onRefresh={() => {
                            setFilters(prev => ({
                                ...prev,
                                page: 1,
                            }))
                        }}
                        onEndReached={() => {
                            if (hasMore && !loading) {
                                setFilters(prev => ({
                                    ...prev,
                                    page: prev.page ? prev.page + 1 : 2,
                                }))
                            }
                        }}
                        onEndReachedThreshold={0.7}
                        ListFooterComponent={loadingMore && <CustomerCardSkeleton count={2} />}

                    />
                )

                }

                {/* <Fab
                    size="lg"
                    placement="bottom right"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    style={{ backgroundColor: '#8B5CF6' }}
                >
                    <Feather name="plus" size={wp('6%')} color="#fff" />
                </Fab> */}
            </View>


        </SafeAreaView>
    );
};

export default Customer;