import Header from '@/src/components/header';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import GradientCard from '@/src/utils/gradient-card';
import { GeneralCardModel, GeneralStatInfoModel } from './types/home-type';
import { StatInfo } from './components/stat-info';
import EventDateKeeper from './components/event-date-keeper';
import Activity from './components/activity';
import Popularity from './components/popularity';
import DeadLines from './components/dead-lines';
import HeatmapYear from './components/heat-map-year';
import TopClient from './components/top-client';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { calculateImprovement, getCurrencySymbol, getUpcomingByTimeframe } from '@/src/utils/utils';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { ApiGeneralRespose, GlobalStatus, SearchQueryRequest } from '@/src/types/common';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { OrderModel, OrderStatus } from '@/src/types/order/order-type';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import { Invoice } from '@/src/types/invoice/invoice-type';
import RevenueTrendChart from './components/home-line-chart';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import { useUserStore } from '@/src/store/user/user-store';
import { getInvestmentDetailsBasedOnFiltersAPI } from '@/src/api/investment/investment-api-service';
import { InvestmentModel } from '@/src/types/investment/investment-type';
import { NotificationContext } from '@/src/providers/notification/notification-provider';
const styles = StyleSheet.create({
    scrollContainer: {
        gap: wp('2%')
    }
})


const Home = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const { reloadCustomer, reloadOrders, reloadInvoices, reloadInvestments, triggerReloadActivity } = useReloadContext()
    const { getItem } = useDataStore();
    const showToast = useToastMessage();
    const [orderDetails, setOrderDetails] = useState<OrderModel[]>();
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice[]>([]);
    const { userDetails, setUserDetails, getUserDetailsUsingID } = useUserStore()
    const [investmentDataList, setInvestmentDataList] = useState<InvestmentModel[]>([]);
    const [orderStatus, setOrderStatus] = useState();
    const { setReqPermission } = useContext(NotificationContext)
    const [loadingProvider, setLoadingProvider] = useState({ allLoading: false, customerLoading: false, invoiceLoading: false, orderLoading: false, investmentLoading: false });
    const generalStatData = useMemo<GeneralStatInfoModel>(() => {
        return {
            customer: {
                label: "Total Customers",
                backgroundColor: "#66D8E6",
                icon: <Feather name="users" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#3B82F6", "#22D3EE", "#06B6D4"],
                isTrending: true,
                count: customerMetaInfoList.length,
                percentageOfChange: calculateImprovement<CustomerMetaModel>(
                    customerMetaInfoList,
                    "createdDate",
                    "month"
                ).formatted,
                tooltip: "Gets the total number of customers"
            },
            revenue: {
                label: "Total Revenue",
                backgroundColor: "#22C55E",
                icon: <Feather name="dollar-sign" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#22C55E", "#10B981"],
                isTrending: true,
                count: `${userDetails?.currencyIcon} ${invoiceDetails?.reduce((a, b) => a + b.amountPaid, 0) || 0}`,
                percentageOfChange: calculateImprovement<ApiGeneralRespose>(
                    invoiceDetails,
                    "invoiceDate",
                    "month"
                ).formatted,
                tooltip: "Gets the total revenue of all orders in this month"
            },
            upcomingShoots: {
                label: "Upcoming Shoots",
                backgroundColor: "#EF4444",
                icon: <Feather name="calendar" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#EF4444", "#F87171"],
                isTrending: false,
                count: getUpcomingByTimeframe(orderDetails?.filter((item) => item.status !== OrderStatus.PENDING), "eventDate", "month")?.length || 0,
                tooltip: "Gets the total number of upcoming shoots in theis month",
            },
            deliveredOrders: {
                label: "Delivered Orders",
                backgroundColor: "#F59E0B",
                icon: <Feather name="check-circle" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#F59E0B", "#FBBF24"],
                isTrending: true,
                count: `${orderStatus?.delivered?.length || 0}`,
                percentageOfChange: calculateImprovement<OrderModel>(
                    orderStatus?.delivered,
                    "createdDate",
                    "month"
                )?.formatted,
                tooltip: "Gets the total number of delivered orders in this month",
            },
            pendingOrders: {
                label: "Pending Orders",
                backgroundColor: "#8B5CF6",
                icon: <Feather name="clock" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#8B5CF6", "#A78BFA"],
                isTrending: true,
                count: orderStatus?.pending?.length || 0,
                percentageOfChange: calculateImprovement<OrderModel>(
                    orderStatus?.pending,
                    "createdDate",
                    "month"
                )?.formatted,
                tooltip: "Gets the total number of pending orders in this month",
            },
            totalInvoice: {
                label: "Total Invoice",
                backgroundColor: "#3B82F6",
                icon: <Feather name="file-text" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#3B82F6", "#2563EB"],
                isTrending: true,
                count: invoiceDetails?.length || 0,
                percentageOfChange: calculateImprovement<ApiGeneralRespose>(
                    invoiceDetails,
                    "invoiceDate",
                    "month"
                )?.formatted,
                tooltip: "Gets the total number of invoices in this month",
            },
        };
    }, [customerMetaInfoList, orderStatus, orderDetails,invoiceDetails]);

    const getOrderDetails = async (userId: string) => {
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["orderId", "status", "eventInfo.eventDate", "eventInfo.eventTitle", "eventInfo.eventType", "orderBasicInfo.customerID"]
        }
        const orderMetaDataResponse: ApiGeneralRespose = await getOrderDataListAPI(payload)
        if (!orderMetaDataResponse.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: orderMetaDataResponse.message,
            })
        }
        const normalisedOrders = orderMetaDataResponse?.data?.map((order: OrderModel) => {
            const { orderBasicInfo, eventInfo, ...rest } = order
            return {
                ...rest,
                ...eventInfo,
                ...orderBasicInfo
            };
        })
        setOrderDetails(normalisedOrders)
        setOrderStatus({
            delivered: orderMetaDataResponse?.data?.filter((order: OrderModel) => order?.status === GlobalStatus.DELIVERED),
            pending: orderMetaDataResponse?.data?.filter((order: OrderModel) => order?.status === GlobalStatus.PENDING),
        })
    }

    const getInvoiceDetails = async (userId: string) => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);      // Jan 1, 00:00:00
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);   // Dec 31, 23:59:59
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["invoiceId", "amountPaid", "invoiceDate"],
            dateField: "invoiceDate",
            startDate: startOfYear,
            endDate: endOfYear
        }
        const orderMetaDataResponse: ApiGeneralRespose = await getInvoiceListBasedOnFiltersAPI(payload)
        if (!orderMetaDataResponse.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: orderMetaDataResponse.message,
            })
        }
        setInvoiceDetails(orderMetaDataResponse?.data)
    }

    const getInvestmentDetails = async (userId: string) => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);      // Jan 1, 00:00:00
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);   // Dec 31, 23:59:59

        const payload: SearchQueryRequest = {
            filters: {
                userId: userId,
            },
            getAll: true,
            requiredFields: ["investmentId", "investedAmount", "investmentDate"],
            dateField: "investmentDate",
            startDate: startOfYear,
            endDate: endOfYear,
        };
        const investmentDetails: ApiGeneralRespose = await getInvestmentDetailsBasedOnFiltersAPI(payload)
        if (!investmentDetails.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: investmentDetails.message,
            })
        }
        setInvestmentDataList(investmentDetails?.data as InvestmentModel[])

    }

    // ----------------- User -----------------

    useEffect(() => {
        const userId = getItem("USERID")
        if (!userId) showToast({ type: "error", title: "Error", message: "User not found please login again" })
        getUserDetailsUsingID(userId, showToast)
    }, [])

    useEffect(() => {
        if (!userDetails?.currencyIcon) {
            setUserDetails({
                ...userDetails,
                currencyIcon: getCurrencySymbol(userDetails?.userBillingInfo?.country)
            })
        }
    }, [userDetails])


    // ----------------- Customer -----------------
    useEffect(() => {
        const loadCustomerData = async () => {
            const userId = await getItem("USERID");
            if (!userId) return showToast({ type: "error", title: "Error", message: "User not found" });
            setLoadingProvider(prev => ({ ...prev, customerLoading: true }));
            try {
                await loadCustomerMetaInfoList(userId, showToast);
            } finally {
                triggerReloadActivity()
                setLoadingProvider(prev => ({ ...prev, customerLoading: false }));
            }
        };
        loadCustomerData();
    }, [reloadCustomer]);

    // ----------------- Orders -----------------
    useEffect(() => {
        const loadOrdersData = async () => {
            const userId = await getItem("USERID");
            if (!userId) return;
            setLoadingProvider(prev => ({ ...prev, orderLoading: true }));
            try {
                await getOrderDetails(userId);
            } finally {
                triggerReloadActivity()
                setLoadingProvider(prev => ({ ...prev, orderLoading: false }));
            }
        };
        loadOrdersData();
    }, [reloadOrders]);

    // ----------------- Invoices -----------------
    useEffect(() => {
        const loadInvoicesData = async () => {
            const userId = await getItem("USERID");
            if (!userId) return;
            setLoadingProvider(prev => ({ ...prev, invoiceLoading: true }));
            try {
                await getInvoiceDetails(userId);
            } finally {
                triggerReloadActivity()
                setLoadingProvider(prev => ({ ...prev, invoiceLoading: false }));
            }
        };
        loadInvoicesData();
    }, [reloadInvoices]);

    //----------------- Investments -----------------
    useEffect(() => {
        const loadInvestmentsData = async () => {
            const userId = await getItem("USERID");
            if (!userId) return;
            setLoadingProvider(prev => ({ ...prev, investmentLoading: true }));
            try {
                await getInvestmentDetails(userId);
            } finally {
                triggerReloadActivity()
                setLoadingProvider(prev => ({ ...prev, investmentLoading: false }));
            }
        }
        loadInvestmentsData()
    }, [reloadInvestments])

    useEffect(()=>{
        setReqPermission(true)
    },[])



    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ margin: hp('1%') }}>
                    <View>
                        <View>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContainer}
                                data={Object.values(generalStatData)}
                                renderItem={({ item, index }) => <StatInfo item={item} index={index} isLoading={loadingProvider.allLoading} />}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={0.7}
                            />

                        </View>
                        <View>
                            <RevenueTrendChart invoiceDetails={invoiceDetails} investmentDetails={investmentDataList} isLoading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading} />
                        </View>
                        <View>
                            <EventDateKeeper />
                        </View>

                        <View>
                            <Popularity orderDetails={orderDetails?.filter((order) => order.status !== OrderStatus.PENDING)} isLoading={loadingProvider.orderLoading} />
                        </View>
                        <View>
                            <DeadLines orderDetails={orderDetails?.filter((order) => order.status !== OrderStatus.PENDING)} isLoading={loadingProvider.orderLoading} />

                        </View>
                        <View>
                            <TopClient orderDetails={orderDetails} customerMetaInfo={customerMetaInfoList} isLoading={loadingProvider.customerLoading || loadingProvider.orderLoading} />
                        </View>
                        <View>
                            <Activity />
                        </View>
                        <View>
                            <HeatmapYear orderDetails={orderDetails?.filter((order) => order.status !== OrderStatus.PENDING)} isLoading={loadingProvider.orderLoading} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;