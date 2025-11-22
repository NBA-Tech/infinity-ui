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
import DashboardStats from './components/stat-info';
import EventDateKeeper from './components/event-date-keeper';
import DeadLines from './components/dead-lines';
import HeatmapYear from './components/heat-map-year';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { calculateImprovement, formatCurrency, getCurrencySymbol, getUpcomingByTimeframe } from '@/src/utils/utils';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { ApiGeneralRespose, GlobalStatus, SearchQueryRequest } from '@/src/types/common';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { ApprovalStatus, OrderModel, OrderStatus } from '@/src/types/order/order-type';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import { Invoice } from '@/src/types/invoice/invoice-type';
import RevenueTrendChart from './components/home-bar-chart';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import { useUserStore } from '@/src/store/user/user-store';
import { getInvestmentDetailsBasedOnFiltersAPI } from '@/src/api/investment/investment-api-service';
import { InvestmentModel } from '@/src/types/investment/investment-type';
import { NotificationContext } from '@/src/providers/notification/notification-provider';
import HomeHeader from './components/home-header';
import RevenueTrendLineChart from './components/home-trend-line-chart';
import QuickActions from './components/quick-actions';
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
    const { setReqPermission } = useContext(NotificationContext)
    const [loadingProvider, setLoadingProvider] = useState({ allLoading: false, customerLoading: false, invoiceLoading: false, orderLoading: false, investmentLoading: false });

    const getOrderDetails = async (userId: string) => {
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["orderId", "status", "eventInfo.eventDate", "eventInfo.eventTitle", "eventInfo.eventType", "orderBasicInfo.customerID","approvalStatus","totalPrice"]
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
    }

    const getInvoiceDetails = async (userId: string) => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);      
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);   
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
                // triggerReloadActivity()
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
                // triggerReloadActivity()
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
                // triggerReloadActivity()
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
                // triggerReloadActivity()
                setLoadingProvider(prev => ({ ...prev, investmentLoading: false }));
            }
        }
        loadInvestmentsData()
    }, [reloadInvestments])

    useEffect(() => {
        setReqPermission(true)
    }, [])



    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <HomeHeader invoiceDetails={invoiceDetails} investmentDetails={investmentDataList} loading={loadingProvider.invoiceLoading}/>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View>
                    <View>
                        <Card style={{ padding: 0, margin: 0 }}>
                            <DashboardStats investments={investmentDataList} invoices={invoiceDetails} loading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading} orders={orderDetails} />
                        </Card>
                        <View>
                            <RevenueTrendLineChart investments={investmentDataList} invoices={invoiceDetails} loading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading}/>
                        </View>
                        <View>
                            <RevenueTrendChart invoiceDetails={invoiceDetails} investmentDetails={investmentDataList} loading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading} />
                        </View>
                        <View style={{marginBottom:hp('2%')}}>
                            <Card style={{ padding: 0, margin: 0 }}>
                                <QuickActions/>
                            </Card>

                        </View>
                        <View>
                            <EventDateKeeper />
                        </View>


                        <View>
                            <DeadLines orderDetails={orderDetails?.filter((order) => order.approvalStatus == ApprovalStatus.ACCEPTED)} isLoading={loadingProvider.orderLoading} />

                        </View>


                        <View>
                            <HeatmapYear orderDetails={orderDetails?.filter((order) => order.approvalStatus ==  ApprovalStatus.ACCEPTED)} isLoading={loadingProvider.orderLoading} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;