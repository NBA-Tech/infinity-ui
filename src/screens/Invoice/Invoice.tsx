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
import { deleteCustomerAPI } from '@/src/api/customer/customer-api-service';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { Invoice } from '@/src/types/invoice/invoice-type';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteInvoiceAPI, getInvoiceListBasedOnFiltersAPI, getInvoiceMetaInfoDetailsAPI } from '@/src/api/invoice/invoice-api-service';
import debounce from "lodash.debounce";
import FilterComponent from '@/src/components/filter-component';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import { useUserStore } from '@/src/store/user/user-store';
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



const InvoiceCardSkeleton = ({ count }: { count: number }) => (
    <View className='flex flex-col justify-between'>
        {[...Array(count)].map((_, index) => (
            <View key={index}>
                <Skeleton style={{ width: wp('95%'), height: hp('15%'), marginHorizontal: wp('2%') }} />
            </View>
        ))}
    </View>
);
const InvoiceList = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const navigation = useNavigation<NavigationProp>()
    const [filters, setFilters] = useState<SearchQueryRequest>({ page: 1, pageSize: 10 });
    const [hasMore, setHasMore] = useState(true);
    const [invoiceData, setInvoiceData] = useState<Invoice[]>();
    const [customerListFilter, setCustomerListFilter] = useState<string[]>([]);
    const [orderTypeFilter, setOrderTypeFilter] = useState<string[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [currID, setCurrID] = useState<string>('');
    const [refresh, setRefresh] = useState<boolean>(false);
    const { customerMetaInfoList, deleteCustomerMetaInfo, loadCustomerMetaInfoList } = useCustomerStore();
    const { getItem } = useDataStore()
    const showToast = useToastMessage()
    const { triggerReloadInvoices } = useReloadContext();
    const { userDetails } = useUserStore()




    const getInvoiceListData = async (reset: boolean = false) => {
        setLoading(true);
        const currFilters: SearchQueryRequest = {
            filters: { userId: getItem("USERID") },
            requiredFields: ["invoiceId", "orderId", "orderName", "amountPaid", "invoiceDate", "billingInfo"],
            ...filters
        }
        try {
            const invoiceDataResponse: ApiGeneralRespose = await getInvoiceListBasedOnFiltersAPI(currFilters);
            if (!invoiceDataResponse?.success) {
                showToast({ type: "error", title: "Error", message: invoiceDataResponse?.message });
                setLoading(false);
                return;
            }
            setInvoiceData(prev =>
                reset ? invoiceDataResponse?.data ?? [] : [...prev ?? [], ...(invoiceDataResponse?.data ?? [])]
            );
            setHasMore(
                (invoiceDataResponse?.data?.length ?? 0) > 0 &&
                (((filters?.page ?? 1) * (filters?.pageSize ?? 10)) < (invoiceDataResponse?.total ?? 0))
            );
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    const loadInvoiceMetaData = async (userId: string) => {
        const invoiceMetaDataResponse = await getInvoiceMetaInfoDetailsAPI(userId);
        if (!invoiceMetaDataResponse?.success) {
            showToast({
                type: 'error',
                title: 'Error',
                message: invoiceMetaDataResponse?.message
            })
            return
        }
        setCustomerListFilter(invoiceMetaDataResponse?.data?.customerIds);
        setOrderTypeFilter(invoiceMetaDataResponse?.data?.orderMapping);
        setTotalCount(invoiceMetaDataResponse?.data?.totalCounts);

    }
    const handleSearch = (value: string) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: value,
            searchField: "orderName",
            page: 1,
        }));
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

    const deleteInvoice = async () => {
        if (!currID) return
        setLoadingDelete(true);
        const deleteInvoiceResponse = await deleteInvoiceAPI(currID);
        if (!deleteInvoiceResponse?.success) {
            showToast({
                type: 'error',
                title: 'Error',
                message: deleteInvoiceResponse?.message
            })
            setLoadingDelete(false);
            return
        }
        showToast({
            type: 'success',
            title: 'Success',
            message: deleteInvoiceResponse?.message
        })
        setOpenDelete(false);
        setLoadingDelete(false);
        setFilters(prev => ({ ...prev, page: 1, pageSize: 10 }));
        triggerReloadInvoices()
    }


    useFocusEffect(
        useCallback(() => {
            const reset = filters?.page === 1;
            getInvoiceListData(reset || refresh);

            return () => {
                setInvoiceData([]);
            };
        }, [filters, refresh])
    );

    useEffect(() => {
        const userId = getItem("USERID")
        loadInvoiceMetaData(userId)
        loadCustomerMetaInfoList(userId)
    }, [])

    useFocusEffect(
        useCallback(() => {
            const userId = getItem("USERID")
            loadInvoiceMetaData(userId)
        }, [])
    )


    const InvoiceCardComponent = ({ item }: { item: Invoice }) => {
        return (
            <Card style={[styles.cardContainer, globalStyles.cardShadowEffect, { borderRadius: 16, padding: 16 }]}>
                <View className="flex flex-col gap-3">

                    {/* Header */}
                    <View className="flex flex-row justify-between items-center">
                        <View className="flex flex-row items-center gap-2">
                            <MaterialCommunityIcons name="file-document-outline" size={wp('5%')} color="#3B82F6" />
                            <Text style={[globalStyles.subHeadingText, { color: "#3B82F6" }]}>
                                {item?.orderName}
                            </Text>
                        </View>
                    </View>

                    {/* Details */}
                    <View className="flex flex-row justify-between gap-3">
                        <View>
                            <Text style={[globalStyles.normalBoldText, { color: "#6B7280" }]}>Invoice ID</Text>
                            <Text style={[globalStyles.normalText, { color: isDark ? "#fff" : "#111827",width:wp('20%') }]}>#{item?.invoiceId}</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.normalBoldText, { color: "#6B7280" }]}>Quotation ID</Text>
                            <Text style={[globalStyles.normalText, { color: isDark ? "#fff" : "#111827",width:wp('20%') }]}>#{item?.orderId}</Text>
                        </View>
                    </View>

                    <View className="flex flex-row justify-between">
                        <View>
                            <Text style={[globalStyles.normalBoldText, { color: "#6B7280" }]}>Customer</Text>
                            <Text style={[globalStyles.normalText, { color: isDark ? "#fff" : "#111827" }]}>{item?.billingInfo?.name}</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.normalBoldText, { color: "#6B7280" }]}>Date</Text>
                            <Text style={[globalStyles.normalText, { color: isDark ? "#fff" : "#111827" }]}>{formatDate(item?.invoiceDate ?? "")}</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#E5E7EB", marginVertical: 8 }} />

                    {/* Footer with Amount + Actions */}
                    <View className="flex flex-row justify-between items-center">
                        <View className="flex flex-row items-center gap-2">
                            <Text style={[globalStyles.heading3Text, { color: "#22C55E" }]}>{userDetails?.currencyIcon ?? "$"}</Text>
                            <Text style={[globalStyles.heading3Text, { color: "#22C55E" }]}>{item?.amountPaid ?? 0}</Text>
                        </View>

                        <View className="flex flex-row gap-5">
                            <TouchableOpacity onPress={() => navigation.navigate('InvoiceDetails', { invoiceId: item?.invoiceId })}>
                                <Feather name="eye" size={wp('5%')} color="#3B82F6" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('CreateInvoice', { invoiceId: item?.invoiceId })}>
                                <Feather name="edit" size={wp('5%')} color="#22C55E" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setOpenDelete(true)
                                setCurrID(item?.invoiceId)
                            }}>
                                <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        )
    }


    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            {openDelete && (
                <DeleteConfirmation
                    openDelete={openDelete}
                    setOpenDelete={setOpenDelete}
                    loading={loadingDelete}
                    handleDelete={deleteInvoice}
                />
            )

            }

            <View>
                <FilterComponent
                    filterName='invoice'
                    filters={filters}
                    setFilters={setFilters}
                    openFilter={openFilter}
                    setOpenFilter={setOpenFilter}
                    setRefresh={setRefresh}
                    extraValue={{
                        customerList: customerMetaInfoList?.filter(
                            c => customerListFilter?.some((f) => f === c.customerID)
                        )?.map((c) => ({
                            label: `${c.firstName} ${c.lastName}`,
                            value: c.customerID
                        })),
                        orderList: orderTypeFilter && Object?.keys(orderTypeFilter)?.map((key) => ({
                            label: orderTypeFilter[key],
                            value: key
                        }))
                    }} />

                <View className={isDark ? 'bg-[#1F2028]' : 'bg-[#fff]'} style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>Invoice</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>{invoiceData?.length} Invoices Found </Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={() => navigation.navigate('CreateInvoice')}>
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
                                placeholder="Search Invoices"
                                onChangeText={debouncedSearch}
                            />

                        </Input>
                        <TouchableOpacity onPress={() => setOpenFilter(true)}>
                            <MaterialCommunityIcons name={isFilterApplied(filters) ? "filter" : "filter-outline"} size={wp('8%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>


                </View>
                {loading && (
                    <InvoiceCardSkeleton count={4} />
                )
                }
                {!loading && invoiceData?.length === 0 ? (
                    <EmptyState variant={"invoices"} onAction={() => navigation.navigate('CreateInvoice')} />
                ) : (
                    <FlatList
                        data={invoiceData}
                        style={{ height: hp('60%') }}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                                <InvoiceCardComponent item={item} />
                            </View>
                        )}
                        onEndReached={() => {
                            if (hasMore && !loading) setFilters(prev => ({ ...prev, page: (prev?.page ?? 1) + 1 }));
                        }}
                        onEndReachedThreshold={0.7}
                        ListFooterComponent={(hasMore && loading) ? <InvoiceCardSkeleton count={1} /> : null}
                        refreshing={loading}
                        onRefresh={() => {
                            setFilters(prev => ({ ...prev, page: 1 }));
                        }}
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

export default InvoiceList;