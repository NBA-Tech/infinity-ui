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
import { calculateImprovement, formatCurrency, getCurrencySymbol, getPaddingBasedOS, getUpcomingByTimeframe } from '@/src/utils/utils';
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
    const [orderDetails, setOrderDetails] = useState<Record<string, OrderModel[]>>({
        dashboardStats: [],
        deadLine: [],
        heatMap: []
    });
    const [invoiceDetails, setInvoiceDetails] = useState<Record<string, Invoice[]>>({
        homeHeader: [],
        dashboardStats: [],
        revenueTrendLineChart: [],
        revenueBarChart: []
    });
    const { userDetails, setUserDetails, getUserDetailsUsingID } = useUserStore()
    const [investmentDataList, setInvestmentDataList] = useState<Record<string, InvestmentModel[]>>({
        homeHeader: [],
        dashboardStats: [],
        revenueTrendLineChart: [],
        revenueBarChart: []
    });
    const { setReqPermission } = useContext(NotificationContext)
    const [loadingProvider, setLoadingProvider] = useState(
        {
            allLoading: false,
            customerLoading: false,
            invoiceLoading: false,
            orderLoading: false,
            investmentLoading: false,
            revenueBarChart: false,
            revenueTrendLineChart: false,
            heatMap: false,
        });

    const getOrderDetails = async (
        changeKey?: string,
        startTime?: Date,
        endTime?: Date
    ) => {
        try {
            changeKey ? setLoadingProvider(prev => ({ ...prev, [changeKey]: true })) : setLoadingProvider(prev => ({ ...prev, orderLoading: true }));

            const now = new Date();
            const startOfYear = startTime || new Date(now.getFullYear(), 0, 1);
            const endOfYear = endTime || new Date(now.getFullYear(), 11, 31, 23, 59, 59);

            const payload: SearchQueryRequest = {
                filters: {
                    userId: getItem("USERID"),
                },
                getAll: true,
                requiredFields: [
                    "orderId",
                    "status",
                    "eventInfo.eventDate",
                    "eventInfo.eventTitle",
                    "eventInfo.eventType",
                    "orderBasicInfo.customerID",
                    "approvalStatus",
                    "totalPrice",
                ],
                dateField: "eventInfo.eventDate",
                startDate: startOfYear,
                endDate: endOfYear,
            };

            const orderRes: ApiGeneralRespose = await getOrderDataListAPI(payload);

            if (!orderRes.success) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: orderRes.message,
                });
            }

            const normalizedOrders = orderRes.data.map((order: OrderModel) => {
                const { orderBasicInfo, eventInfo, ...rest } = order;

                return {
                    ...rest,
                    ...eventInfo,
                    ...orderBasicInfo,
                };
            });

            setOrderDetails(prev => ({
                ...prev,
                ...(changeKey
                    ? { [changeKey]: normalizedOrders }
                    : {
                        dashboardStats: normalizedOrders,
                        deadLine: normalizedOrders,
                        heatMap: normalizedOrders
                    })
            }));
        }
        catch (e) {
            showToast({
                type: "error",
                title: "Error",
                message: "Unexpected Error Occurred",
            });
        }
        finally {
            changeKey ? setLoadingProvider(prev => ({ ...prev, [changeKey]: false })) : setLoadingProvider(prev => ({ ...prev, orderLoading: false }));
        }
    };


    const getInvoiceDetails = async (
        changeKey?: string,
        startTime?: Date,
        endTime?: Date
    ) => {
        try {
            changeKey ? setLoadingProvider(prev => ({ ...prev, [changeKey]: true })) : setLoadingProvider(prev => ({ ...prev, invoiceLoading: true }));

            const now = new Date();

            const startOfYear = startTime || new Date(now.getFullYear(), 0, 1, 0, 0, 0);
            const endOfYear = endTime || new Date(now.getFullYear(), 11, 31, 23, 59, 59);

            const payload: SearchQueryRequest = {
                filters: {
                    userId: getItem("USERID"),
                },
                getAll: true,
                requiredFields: ["invoiceId", "amountPaid", "invoiceDate"],
                dateField: "invoiceDate",
                startDate: startOfYear,
                endDate: endOfYear,
            };

            const invoiceRes: ApiGeneralRespose = await getInvoiceListBasedOnFiltersAPI(payload);

            if (!invoiceRes.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message: invoiceRes.message,
                });
                return;
            }

            const data = invoiceRes.data as Invoice[];

            // Update only specific key OR all keys
            setInvoiceDetails(prev => ({
                ...prev,
                ...(changeKey
                    ? { [changeKey]: data }
                    : {
                        homeHeader: data,
                        dashboardStats: data,
                        revenueTrendLineChart: data,
                        revenueBarChart: data,
                    }),
            }));
        }
        catch (err) {
            showToast({
                type: "error",
                title: "Error",
                message: "Unexpected Error Occurred",
            });
        }
        finally {
            changeKey ? setLoadingProvider(prev => ({ ...prev, [changeKey]: false })) : setLoadingProvider(prev => ({ ...prev, invoiceLoading: false }));
        }
    };


    const getInvestmentDetails = async (changeKey?: string, startTime?: Date, endTime?: Date) => {
        try {
            changeKey ? setLoadingProvider(prev => ({ ...prev, [changeKey]: true })) : setLoadingProvider(prev => ({ ...prev, investmentLoading: true }));
            const now = new Date();
            const startOfYear = startTime || new Date(now.getFullYear(), 0, 1, 0, 0, 0);      // Jan 1, 00:00:00
            const endOfYear = endTime || new Date(now.getFullYear(), 11, 31, 23, 59, 59);   // Dec 31, 23:59:59

            const payload: SearchQueryRequest = {
                filters: {
                    userId: getItem("USERID"),
                },
                getAll: true,
                requiredFields: ["investmentId", "investedAmount", "investmentDate"],
                dateField: "investmentDate",
                startDate: startOfYear,
                endDate: endOfYear,
            };
            const investmentDetails: ApiGeneralRespose = await getInvestmentDetailsBasedOnFiltersAPI(payload)
            if (!investmentDetails.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message: investmentDetails.message,
                })
            }
            else {
                const data = investmentDetails?.data as InvestmentModel[];
                setInvestmentDataList(prev => ({
                    ...prev,
                    ...(changeKey
                        ? { [changeKey]: data }
                        : {
                            homeHeader: data,
                            dashboardStats: data,
                            revenueTrendLineChart: data,
                            revenueBarChart: data
                        })
                }));
            }
        }
        catch (err) {
            showToast({
                type: "error",
                title: "Error",
                message: "Unexpected Error Occurred",
            })
        }
        finally {
            changeKey ? setLoadingProvider(prev => ({ ...prev, [changeKey]: false })) : setLoadingProvider(prev => ({ ...prev, investmentLoading: false }));
        }

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
            await getOrderDetails();
        };
        loadOrdersData();
    }, [reloadOrders]);

    // ----------------- Invoices -----------------
    useEffect(() => {
        const loadInvoicesData = async () => {
            const userId = await getItem("USERID");
            if (!userId) return;
            await getInvoiceDetails();
        };
        loadInvoicesData();
    }, [reloadInvoices]);

    //----------------- Investments -----------------
    useEffect(() => {
        const loadInvestmentsData = async () => {
            const userId = await getItem("USERID");
            if (!userId) return;
            await getInvestmentDetails();
        }
        loadInvestmentsData()
    }, [reloadInvestments])

    useEffect(() => {
        setReqPermission(true)
    }, [])



    return (
        <View style={globalStyles.appBackground}>
            <HomeHeader invoiceDetails={invoiceDetails?.homeHeader} investmentDetails={investmentDataList?.homeHeader} loading={loadingProvider.invoiceLoading} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View>
                    <View>
                        <Card style={{ padding: 0, margin: 0 }}>
                            <DashboardStats investments={investmentDataList?.dashboardStats} invoices={invoiceDetails?.dashboardStats} loading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading} orders={orderDetails?.dashboardStats} />
                        </Card>
                        <View>
                            <RevenueTrendLineChart investments={investmentDataList?.revenueTrendLineChart} invoices={invoiceDetails?.revenueTrendLineChart} loading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading || loadingProvider.revenueTrendLineChart} getInvestmentDetails={getInvestmentDetails} getInvoiceDetails={getInvoiceDetails} />
                        </View>
                        <View>
                            <RevenueTrendChart invoiceDetails={invoiceDetails?.revenueBarChart} investmentDetails={investmentDataList?.revenueBarChart} loading={loadingProvider.invoiceLoading || loadingProvider.investmentLoading || loadingProvider.revenueBarChart} getInvestmentDetails={getInvestmentDetails} getInvoiceDetails={getInvoiceDetails} />
                        </View>
                        <View style={{ marginBottom: hp('2%') }}>
                            <Card style={{ padding: 0, margin: 0 }}>
                                <QuickActions />
                            </Card>

                        </View>
                        <View>
                            <EventDateKeeper />
                        </View>


                        <View>
                            <DeadLines orderDetails={orderDetails?.deadLine?.filter((order) => order.approvalStatus == ApprovalStatus.ACCEPTED)} isLoading={loadingProvider.orderLoading} />

                        </View>


                        <View>
                            <HeatmapYear orderDetails={orderDetails?.heatMap?.filter((order) => order.approvalStatus == ApprovalStatus.ACCEPTED)} isLoading={loadingProvider.orderLoading || loadingProvider.heatMap} getOrderDetails={getOrderDetails}/>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;