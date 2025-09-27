import React, { useContext, useEffect, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import CustomerInfo from './details-component/customer-info';
import OfferingDetails from './details-component/offering-details';
import QuotationDetails from './details-component/quotation-details';
import InvoiceDetails from './details-component/invoice-details';
import TimeLineDetails from './details-component/timeline-details';
import { ApiGeneralRespose, RootStackParamList, SearchQueryRequest } from '@/src/types/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerApiResponse, CustomerMetaModel } from '@/src/types/customer/customer-type';
import { getCustomerDetails } from '@/src/api/customer/customer-api-service';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { getOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { OrderModel, OrderType } from '@/src/types/order/order-type';
import EventInfoCard from './details-component/event-info';
import { TabView, TabBar } from "react-native-tab-view";
import { OfferingModel } from '@/src/types/offering/offering-type';
const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('3%'),
        borderRadius: wp('30%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#065F46',
        gap: wp('1%')
    }
})

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

const OrderDetails = ({ route, navigation }: Props) => {
    const { orderId } = route?.params;
    const [customerList, setCustomerList] = useState<CustomerMetaModel[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderModel>();
    const [packageData, setPackageData] = useState<OfferingModel[]>([]);
    const [serviceData, setServiceData] = useState<OfferingModel[]>([]);
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [index, setIndex] = useState(0);
    const { customerMetaInfoList, getCustomerMetaInfoList, setCustomerMetaInfoList } = useCustomerStore();
    const { getItem } = useDataStore();
    const showToast = useToastMessage();
    const [routes] = useState([
        { key: "customer", title: "Customer", icon: "user" },
        { key: "event", title: "Event", icon: "calendar" },
        { key: "offering", title: "Offerings", icon: "package" },
        { key: "quotation", title: "Quotation", icon: "file-text" },
        { key: "invoice", title: "Invoice", icon: "credit-card" },
        { key: "timeline", title: "Timeline", icon: "clock" },
    ]);


    const actionButtons = [
        {
            id: 1,
            label: 'Share',
            icon: <Feather name="share-2" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        },
        {
            id: 2,
            label: 'Invoice',
            icon: <Feather name="file" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        },
        {
            id: 3,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
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

        const customerListResponse: CustomerApiResponse = await getCustomerDetails(payload);

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
        console.log("fuck")
        const orderDetails: ApiGeneralRespose = await getOrderDetailsAPI(orderId)
        if (!orderDetails?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: orderDetails?.message ?? "Something went wrong ",
            })
        }
        console.log(orderDetails.data)
        setOrderDetails(orderDetails.data)
    }

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case "customer":
                return <CustomerInfo
                    customerData={customerList.find((customer) => customer.customerID === orderDetails?.orderBasicInfo?.customerID) as CustomerMetaModel}
                    orderBasicInfo={orderDetails?.orderBasicInfo} />
            case "event":
                return <EventInfoCard
                    eventData={orderDetails?.eventInfo}
                    serviceLength={orderDetails?.offeringInfo?.services?.length}
                    isPackage={orderDetails?.offeringInfo?.orderType === OrderType.PACKAGE} />
            case "offering":
                return <OfferingDetails
                    offeringData={orderDetails?.offeringInfo}
                    totalPrice={orderDetails?.totalPrice}
                    setPackageData={setPackageData}
                    setServiceData={setServiceData} />
            case "quotation":
                return <QuotationDetails orderDetails={orderDetails} createdOn={orderDetails?.createdDate} packageData={packageData} serviceData={serviceData} />
            case "invoice":
                return <InvoiceDetails />
            case "timeline":
                return <TimeLineDetails />
            default:
                return null;
        }
    }

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={{ backgroundColor: globalStyles.appBackground.backgroundColor,marginBottom:hp('3%') }}
            indicatorStyle={{ backgroundColor: "#8B5CF6", height: 3, borderRadius: 2 }}
            activeColor={isDark ? "#fff" : "#000"}
            inactiveColor={isDark ? "#6B7280" : "#6B7280"}
            pressColor="rgba(139,92,246,0.15)"
            tabStyle={{ width: "auto" }}
            renderIcon={({ route, focused, color }: any) => (
                <Feather
                    name={route.icon}
                    size={wp("5%")}
                    color={focused ? "#8B5CF6" : "#6B7280"}
                />
            )}
        />
    );

    useEffect(() => {
        getCustomerNameList()
        getOrderDetails(orderId)
    }, [])


    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader>
                <View className='flex flex-col'>
                    <View className="flex flex-row justify-between items-center w-full">
                        {/* Left side */}
                        <View className="flex flex-row items-center gap-3">
                            <Feather name="arrow-left" size={wp('7%')} color={isDark ? '#fff' : '#000'} />
                            <View className="flex flex-col">
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Order Details</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>
                                    Order #{orderDetails?.orderId}
                                </Text>
                            </View>
                        </View>

                        {/* Right side */}
                        <View className="flex items-center">
                            <View style={styles.statusContainer}>
                                <Text style={globalStyles.whiteTextColor}>{orderDetails?.status}</Text>
                            </View>
                        </View>
                    </View>
                    <View className='flex flex-row justify-between items-center' style={{ marginVertical: hp('2%') }}>
                        {actionButtons.map((action) => (
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                {action.icon}
                                <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>{action.label}</ButtonText>
                            </Button>
                        ))
                        }
                    </View>
                </View>
            </BackHeader>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: wp("100%") }}
                renderTabBar={renderTabBar}
            />


        </SafeAreaView>

    );
};

export default OrderDetails;