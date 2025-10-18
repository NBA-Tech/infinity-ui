import React, { useContext, useEffect, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import CustomerInfo from './details-component/customer-info';
import OfferingDetails from './details-component/offering-details';
import QuotationDetails from './details-component/quotation-details';
import InvoiceDetails from './details-component/invoice-details';
import TimeLineDetails from './details-component/timeline-details';
import { ApiGeneralRespose, GlobalStatus, GLOBALSTATUS, RootStackParamList, SearchQueryRequest } from '@/src/types/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerApiResponse, CustomerMetaModel } from '@/src/types/customer/customer-type';
import { getCustomerListBasedOnFilters } from '@/src/api/customer/customer-api-service';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { getOrderDetailsAPI, updateOrderStatusAPI } from '@/src/api/order/order-api-service';
import { OrderModel, OrderType } from '@/src/types/order/order-type';
import EventInfoCard from './details-component/event-info';
import { TabView, TabBar } from "react-native-tab-view";
import { useOfferingStore } from '@/src/store/offering/offering-store';
import Deliverables from './details-component/deliverables';
import SwipeButton from '@/src/components/swippable-button';
import Skeleton from '@/components/ui/skeleton';
import { COLORCODES } from '@/src/constant/constants';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { getNextStatus, isAllLoadingFalse } from '@/src/utils/utils';
import { useConfetti } from '@/src/providers/confetti/confetti-provider';
import { useUserStore } from '@/src/store/user/user-store';
import InvestmentInfo from './details-component/investment-info';
import { InvestmentModel } from '@/src/types/investment/investment-type';
import { getInvestmentDetailsBasedOnFiltersAPI } from '@/src/api/investment/investment-api-service';
const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('3%'),
        borderRadius: wp('50%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%')
    }
})

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

const OrderDetails = ({ route, navigation }: Props) => {
    const { orderId } = route?.params ?? {};
    const [customerList, setCustomerList] = useState<CustomerMetaModel[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderModel>();
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [index, setIndex] = useState(0);
    const [investmentDataList, setInvestmentDataList] = useState<InvestmentModel[]>([]);
    const { customerMetaInfoList, getCustomerMetaInfoList, setCustomerMetaInfoList } = useCustomerStore();
    const { serviceData, packageData, loadOfferings } = useOfferingStore();
    const { getItem } = useDataStore();
    const showToast = useToastMessage();
    const { userDetails } = useUserStore()
    const [routes] = useState([
        { key: "customer", title: "Customer", icon: "user" },
        { key: "event", title: "Event", icon: "calendar" },
        { key: "deliverables", title: "Deliverables", icon: "package" },
        { key: "quotation", title: "Quotation", icon: "file-text" },
        { key: "invoice", title: "Invoice", icon: "credit-card" },
        { key: "investments", title: "Investments", icon: "dollar-sign" },
        { key: "links", title: "Links", icon: "link" },
    ]);
    const { triggerConfetti } = useConfetti()
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice[]>([]);
    const [loadingProvider, setLoadingProvider] = useState({ intialLoading: false, saveLoading: false });


    const actionButtons = [
        {
            id: 1,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
            onPress: () => navigation.navigate("CreateOrder", { orderId: orderDetails?.orderId })
        },
        {
            id: 2,
            label: 'Cancel',
            icon: <Feather name="x" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
            onPress: () => handleStatusChange({ key: GlobalStatus.CANCELLED })
        }
    ]

    const getCustomerNameList = async () => {
        const customerMetaData = getCustomerMetaInfoList();

        if (customerMetaData?.length > 0) {
            setCustomerList(customerMetaData);
            return;
        }

        const userId = getItem("USERID");
        const payload: SearchQueryRequest = {
            filters: { userId },
            getAll: true,
            requiredFields: ["customerBasicInfo.firstName", "customerBasicInfo.lastName", "_id", "customerBasicInfo.mobileNumber", "customerBasicInfo.email"],
        };

        const customerListResponse: CustomerApiResponse = await getCustomerListBasedOnFilters(payload);

        if (!customerListResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: customerListResponse?.message ?? "Something went wrong",
            });
        }

        if (customerListResponse?.customerList?.length === 0) return;

        const metaList = toCustomerMetaModelList(customerListResponse.customerList);

        setCustomerMetaInfoList(metaList);
        setCustomerList(metaList);
    };

    const getOrderDetails = async (orderId: string) => {
        setLoadingProvider({ ...loadingProvider, intialLoading: true });
        const orderDetails: ApiGeneralRespose = await getOrderDetailsAPI(orderId)
        if (!orderDetails?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: orderDetails?.message ?? "Something went wrong ",
            })
        }
        setOrderDetails(orderDetails.data)
        setLoadingProvider({ ...loadingProvider, intialLoading: false });
    }
    const getAllInvoiceData = async () => {
        setLoadingProvider({ ...loadingProvider, intialLoading: true });
        const userId = getItem("USERID");
        const payload: SearchQueryRequest = {
            filters: { userId: userId, orderId: orderDetails?.orderId },
            getAll: true,
        };
        const invoiceResponse = await getInvoiceListBasedOnFiltersAPI(payload);
        if (!invoiceResponse.success) {
            return showToast({ type: "error", title: "Error", message: invoiceResponse.message });
        }
        setInvoiceDetails(invoiceResponse.data);
        setLoadingProvider({ ...loadingProvider, intialLoading: false });
    }

    const getInvestmentList = async (orderId: string) => {
        const payload: SearchQueryRequest = {
            filters: { orderId: orderId },
            getAll: true
        }
        const invesmentResponse: ApiGeneralRespose = await getInvestmentDetailsBasedOnFiltersAPI(payload);
        if (!invesmentResponse?.success) {
            return showToast({ type: "error", title: "Error", message: invesmentResponse.message });
        }
        setInvestmentDataList(invesmentResponse.data);
    }

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case "customer":
                return <CustomerInfo
                    key={orderDetails?.orderId}
                    customerData={customerList.find((customer) => customer.customerID === orderDetails?.orderBasicInfo?.customerID) as CustomerMetaModel}
                    orderBasicInfo={orderDetails?.orderBasicInfo}
                    isLoading={loadingProvider.intialLoading} />

            case "event":
                return <EventInfoCard
                    key={orderDetails?.orderId}
                    eventData={orderDetails?.eventInfo}
                    serviceLength={orderDetails?.offeringInfo?.services?.length}
                    isPackage={orderDetails?.offeringInfo?.orderType === OrderType.PACKAGE}
                    isLoading={loadingProvider.intialLoading} />
            case "deliverables":
                return <OfferingDetails
                    key={orderDetails?.orderId}
                    orderId={orderDetails?.orderId}
                    offeringData={orderDetails?.offeringInfo}
                    totalPrice={orderDetails?.totalPrice}
                    isLoading={loadingProvider.intialLoading}
                    setOrderDetails={setOrderDetails} />
            case "quotation":
                return <QuotationDetails
                    key={orderDetails?.orderId}
                    orderDetails={orderDetails}
                    createdOn={orderDetails?.createdDate}
                    packageData={packageData}
                    serviceData={serviceData}
                    borderColor={"#3B82F6"} />
            case "invoice":
                return (
                    <ScrollView contentContainerStyle={{ padding: 5 }} showsVerticalScrollIndicator={false}>
                        <InvoiceDetails
                            key={orderDetails?.orderId}
                            orderDetails={orderDetails}
                            invoiceDetails={invoiceDetails}
                        />
                    </ScrollView>
                )
            case "links":
                return (
                    <ScrollView contentContainerStyle={{ padding: 5 }} showsVerticalScrollIndicator={false}>
                        <Deliverables orderDetails={orderDetails} setOrderDetails={setOrderDetails} />
                    </ScrollView>
                )
            case "investments":
                return (
                    <ScrollView contentContainerStyle={{ padding: 5 }} showsVerticalScrollIndicator={false}>
                        <InvestmentInfo orderId={orderDetails?.orderId} investmentDataList={investmentDataList} setInvestmentDataList={setInvestmentDataList} />
                    </ScrollView>
                )
            default:
                return null;
        }
    }

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            scrollEnabled
            style={{ backgroundColor: globalStyles.appBackground.backgroundColor, marginBottom: hp('3%') }}
            indicatorStyle={{ backgroundColor: "transparent", height: 3, borderRadius: 2 }}
            activeColor={isDark ? "#fff" : "#000"}
            inactiveColor={isDark ? "#6B7280" : "#6B7280"}
            pressColor="rgba(139,92,246,0.15)"
            tabStyle={{ width: "auto" }}
        />
    );
    const handleStatusChange = async (status: any) => {
        if (status == undefined) return
        setLoadingProvider({ ...loadingProvider, saveLoading: true });
        const updateOrderStatusResponse = await updateOrderStatusAPI(orderDetails?.orderId, status?.key)
        if (!updateOrderStatusResponse?.success) {
            return showToast({ type: "error", title: "Error", message: updateOrderStatusResponse?.message })
        }
        setOrderDetails({ ...orderDetails, status: status?.key })
        setLoadingProvider({ ...loadingProvider, saveLoading: false });

        if (status?.key != GlobalStatus.CANCELLED) triggerConfetti()
    }

    useEffect(() => {
        const userId = getItem("USERID")
        getCustomerNameList()
        getOrderDetails(orderId)
        getInvestmentList(orderId)
        loadOfferings(userId, showToast)
    }, [])

    useEffect(() => {
        if (orderDetails?.orderId) {
            getAllInvoiceData()
        }

    }, [orderDetails?.orderId])


    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader>
                <View className='flex flex-col'>
                    <View className="flex flex-row justify-between items-center w-full">
                        {/* Left side */}
                        <View className="flex flex-row items-center gap-3">
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Feather name="arrow-left" size={wp('7%')} color={isDark ? '#fff' : '#000'} />
                            </TouchableOpacity>
                            <View className="flex flex-col">
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Order Details</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>
                                    Order #{orderDetails?.orderId}
                                </Text>
                            </View>
                        </View>

                        {/* Right side */}
                        <View className="flex items-center">
                            <View style={[styles.statusContainer, { backgroundColor: orderDetails?.status ? (GLOBALSTATUS[orderDetails?.status]?.color) : '#6B7280' }]}>
                                <Text style={globalStyles.whiteTextColor}>{orderDetails?.status}</Text>
                            </View>
                        </View>
                    </View>
                    <View className='flex flex-row justify-end items-center gap-3' style={{ marginVertical: hp('2%') }}>
                        {actionButtons.map((action) => (
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground} onPress={action.onPress}>
                                {action.icon}
                                <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>{action.label}</ButtonText>
                            </Button>
                        ))
                        }
                    </View>
                </View>
            </BackHeader>
            <View>
                <View className='flex flex-row justify-between items-center'>
                    <Card
                        style={[globalStyles.cardShadowEffect, { width: wp('30%'), height: hp('10%'), marginHorizontal: wp('2%') }]}>
                        <View className='flex flex-col justify-center items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Total Quoted</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{loadingProvider.intialLoading ? <Skeleton height={hp('5%')} /> : `${userDetails?.currencyIcon} ${orderDetails?.totalPrice}`}</Text>

                        </View>
                    </Card>

                    <Card
                        style={[globalStyles.cardShadowEffect, { width: wp('30%'), height: hp('10%'), marginHorizontal: wp('2%') }]}>
                        <View className='flex flex-col justify-center items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Total Paid</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{loadingProvider.intialLoading ? <Skeleton height={hp('5%')} /> : `${userDetails?.currencyIcon} ${invoiceDetails?.reduce((total, invoice) => total + invoice?.amountPaid, 0)}`}</Text>

                        </View>
                    </Card>
                    <Card
                        style={[globalStyles.cardShadowEffect, { width: wp('30%'), height: hp('10%'), marginHorizontal: wp('2%') }]}>
                        <View className='flex flex-col justify-center items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Total Invested</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{loadingProvider.intialLoading ? <Skeleton height={hp('5%')} /> : `${userDetails?.currencyIcon} ${investmentDataList?.reduce((total, investment) => total + investment?.investedAmount, 0)}`}</Text>

                        </View>
                    </Card>

                </View>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: hp("100%") }} // swap width/height
                renderTabBar={(props) => renderTabBar({ ...props, vertical: true })}
                commonOptions={{
                    icon: ({ route, focused, color }) => (
                        <Feather
                            name={route.icon}
                            size={wp("5%")}
                            color={focused ? "#8B5CF6" : "#6B7280"}
                        />
                    ),
                }}

            />
            {(orderDetails?.status != GlobalStatus.DELIVERED && orderDetails?.status != GlobalStatus.CANCELLED) && !loadingProvider.intialLoading && (
                <SwipeButton
                    text={`Swipe to make order as ${getNextStatus(orderDetails?.status as GlobalStatus)?.label}`}
                    isDisabled={loadingProvider.saveLoading}
                    isReset={!loadingProvider.saveLoading}
                    onConfirm={() => handleStatusChange(getNextStatus(orderDetails?.status as GlobalStatus))} />
            )

            }

        </SafeAreaView>

    );
};

export default OrderDetails;