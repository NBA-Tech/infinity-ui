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
import { formatDate, isFilterApplied, openDaialler, openEmailClient } from '@/src/utils/utils';
import { deleteCustomerAPI, getCustomerListBasedOnFilters } from '@/src/api/customer/customer-api-service';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import FilterComponent from '@/src/components/filter-component';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
    },
    cardContainer: {
        borderRadius: wp('2%'),
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
        gap: wp('3%'),
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
    const { getItem } = useDataStore()
    const showToast = useToastMessage()


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
            const customerIds = customers.map((item: any) => item.customerID);

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

            setHasMore(customers.length === (filters.pageSize || 3));
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


    }


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
                            <Avatar style={{ backgroundColor: '#8B5CF6', transform: [{ scale: 1.2 }] }}>
                                <AvatarFallbackText style={globalStyles.whiteTextColor}>
                                    {item?.customerBasicInfo?.firstName}
                                </AvatarFallbackText>
                            </Avatar>

                            <View style={styles.details}>
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>{item?.customerBasicInfo?.firstName} {item?.customerBasicInfo?.lastName}</Text>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="event" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Lead Source : {item?.leadSource || 'N/A'}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="date-range" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Created Date : {formatDate(item?.createdDate)}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="currency-rupee" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Total Package : ₹ {item?.totalQuotation || 0}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="currency-rupee" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Balance : ₹ {item?.totalInvoice || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.statusContainer}>
                            <Menu
                                placement="bottom"
                                offset={5}
                                style={{ backgroundColor: isDark ? '#1E1E2A' : '#fff' }}
                                trigger={({ ...triggerProps }) => {
                                    return (
                                        <Button {...triggerProps} variant="ghost" style={{ backgroundColor: 'transparent' }}>
                                            <MaterialDesign name="dots-vertical" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                        </Button>
                                    )
                                }}
                            >
                                <MenuItem key="Community" textValue="Edit" className='gap-2' onPress={() => navigation.navigate('CreateCustomer', { customerID: item?.customerID })}>
                                    <Feather name="edit-2" size={wp('5%')} color="#3B82F6" />
                                    <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]} >Edit</MenuItemLabel>
                                </MenuItem>
                                <MenuItem key="Plugins" textValue="Delete" className='gap-2' onPress={() => { setCurrID(item?.customerID); setOpenDelete(true); }}>
                                    <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                                    <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>Delete</MenuItemLabel>
                                </MenuItem>
                            </Menu>
                        </View>


                    </View>
                    <View style={styles.createdOn}>
                        <TouchableOpacity onPress={() => { openEmailClient(item?.customerBasicInfo?.email) }}>
                            <Feather name="mail" size={wp('5%')} color="#6B7280" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { openDaialler(item?.customerBasicInfo?.mobileNumber) }}>
                            <Feather name="phone" size={wp('5%')} color="#6B7280" />
                        </TouchableOpacity>

                    </View>
                </View>
            </Card>
        )
    }

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <FilterComponent filterName='customer' openFilter={openFilter} setOpenFilter={setOpenFilter} filters={filters} setFilters={setFilters} setRefresh={setRefresh} />

            <Header />
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
                <View className={isDark ? 'bg-[#1F2028]' : 'bg-[#fff]'} style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>Customers</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>{customerData?.length} customers found</Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={() => navigation.navigate('CreateCustomer')}>
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
                                <Feather name="search" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Customer"
                            />

                        </Input>
                        <TouchableOpacity onPress={() => setOpenFilter(true)}>
                             <MaterialCommunityIcons name={isFilterApplied(filters) ? "filter" : "filter-outline"} size={wp('8%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>


                </View>
                {loading && (
                    <CustomerCardSkeleton count={4} />
                )
                }
                {!loading && customerData.length === 0 ? (
                    <EmptyState variant={"customers"} onAction={() => navigation.navigate('CreateCustomer')} />
                ) : (
                    <FlatList
                        data={customerData}
                        style={{ height: hp("60%") }}
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
                        ListFooterComponent={loadingMore && <CustomerCardSkeleton count={1} />}

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