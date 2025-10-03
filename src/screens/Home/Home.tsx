import Header from '@/src/components/header';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import GradientCard from '@/src/utils/gradient-card';
import { BarChart } from 'react-native-chart-kit';
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
import { calculateImprovement, getUpcomingByTimeframe } from '@/src/utils/utils';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { ApiGeneralRespose, GlobalStatus, SearchQueryRequest } from '@/src/types/common';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { OrderModel } from '@/src/types/order/order-type';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import { Invoice } from '@/src/types/invoice/invoice-type';
import RevenueTrendChart from './components/home-line-chart';
const styles = StyleSheet.create({
    scrollContainer: {
        gap: wp('2%')
    }
})


const Home = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const { getItem } = useDataStore();
    const showToast = useToastMessage();
    const [orderDetails, setOrderDetails] = useState<OrderModel[]>();
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice[]>([]);
    const [orderStatus, setOrderStatus] = useState();
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
                count: `$ ${invoiceDetails?.reduce((a, b) => a + b.amountPaid, 0) || 0}`,
                percentageOfChange: calculateImprovement<ApiGeneralRespose>(
                    invoiceDetails,
                    "invoiceDate",
                    "month"
                ).formatted,
                tooltip: "Gets the total revenue of all orders"
            },
            upcomingShoots: {
                label: "Upcoming Shoots",
                backgroundColor: "#EF4444",
                icon: <Feather name="calendar" size={wp('6%')} color={'#fff'} />,
                gradientColors: ["#EF4444", "#F87171"],
                isTrending: false,
                count: getUpcomingByTimeframe(orderDetails, "eventDate", "month")?.length || 0,
                tooltip: "Gets the total number of upcoming shoots in the month",
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
                tooltip: "Gets the total number of delivered orders",
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
                tooltip: "Gets the total number of pending orders",
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
                tooltip: "Gets the total number of invoices",
            },
        };
    }, [customerMetaInfoList, orderStatus, orderDetails]);

    const getOrderDetails = async (userId: string) => {
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["orderId", "status", "eventInfo.eventDate", "eventInfo.eventTitle","eventInfo.eventType","orderBasicInfo.customerID"]
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
        console.log(normalisedOrders)
        setOrderDetails(normalisedOrders)
        setOrderStatus({
            delivered: orderMetaDataResponse?.data?.filter((order: OrderModel) => order?.status === GlobalStatus.DELIVERED),
            pending: orderMetaDataResponse?.data?.filter((order: OrderModel) => order?.status === GlobalStatus.PENDING),
        })
    }

    const getInvoiceDetails = async (userId: string) => {
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["invoiceId", "amountPaid", "invoiceDate"]
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


    useEffect(() => {
        const userId = getItem("USERID")
        if (!userId) {
            return showToast({
                type: "error",
                title: "Error",
                message: "User not found Please login again",
            })
        }
        loadCustomerMetaInfoList(userId, showToast);
        getOrderDetails(userId)
        getInvoiceDetails(userId)
    }, [])

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
                                renderItem={({ item, index }) => <StatInfo item={item} index={index} />}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={0.7}
                            />

                        </View>
                        <View>
                            <RevenueTrendChart invoiceDetails={invoiceDetails} />
                        </View>
                        <View>
                            <EventDateKeeper />
                        </View>

                        <View>
                            <Popularity orderDetails={orderDetails}/>
                        </View>
                        <View>
                            <DeadLines orderDetails={orderDetails} />

                        </View>
                        <View>
                            <TopClient orderDetails={orderDetails} customerMetaInfo={customerMetaInfoList} />
                        </View>
                        <View>
                            <Activity />
                        </View>
                        <View>
                            <HeatmapYear orderDetails={orderDetails}/>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;