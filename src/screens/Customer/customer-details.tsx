import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Feather from "react-native-vector-icons/Feather";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import BackHeader from "@/src/components/back-header";
import { StyleContext, ThemeToggleContext } from "@/src/providers/theme/global-style-provider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "@/components/ui/divider";
import { GeneralInfo } from "./genera-iInfo";
import ProjectInfo from "./order-info";
import InvoiceInfo from "./invoice-info";
import { RootStackParamList, SearchQueryRequest } from "@/src/types/common";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCustomerDetailsAPI } from "@/src/api/customer/customer-api-service";
import { useToastMessage } from "@/src/components/toast/toast-message";
import { CustomerModel } from "@/src/types/customer/customer-type";
import { formatDate } from "@/src/utils/utils";
import { getOrderDataListAPI } from "@/src/api/order/order-api-service";
import { OrderModel } from "@/src/types/order/order-type";
import { Invoice } from "@/src/types/invoice/invoice-type";
import { getInvoiceListBasedOnFiltersAPI } from "@/src/api/invoice/invoice-api-service";

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        margin: wp('2%')
    },
    detailsContainer: {
        marginVertical: hp('2%'),
        gap: hp('2%')
    },
    scene: {
        flex: 1
    }
})


const DeliverablesRoute = () => (
    <ScrollView style={styles.scene} contentContainerStyle={{ padding: 16 }}>
        <Text>Deliverables</Text>
    </ScrollView>
);



// ---------------- Main Screen ----------------
type Props = NativeStackScreenProps<RootStackParamList, "CustomerDetails">;
export default function CustomerDetails({ navigation, route }: Props) {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { customerID } = route.params ?? {}
    const showToast = useToastMessage();
    const [index, setIndex] = useState(0);
    const [customerDetails, setCustomerDetails] = useState<CustomerModel>();
    const [orderDetails, setOrderDetails] = useState<OrderModel[]>([]);
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice[]>([]);
    const [paymentMetaDetails, setPaymentMetaDetails] = useState<Record<string, any>>({
        totalAmount: 0,
        totalPaid: 0,
    });
    const [loading, setLoading] = useState(false);
    const [routes] = useState([
        { key: "general", title: "General", icon: "user" },
        { key: "orders", title: "Orders", icon: "camera" },
        { key: "invoices", title: "Invoices", icon: "file-text" },
    ]);
    const [reload, setReload] = useState(false);

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case "general":
                return <GeneralInfo key={route.key} customerDetails={customerDetails} paymentDetails={paymentMetaDetails} isLoading={loading} />;
            case "orders":
                return <ProjectInfo key={route.key} orderDetails={orderDetails} customerMetaData={
                    {
                        name: customerDetails?.customerBasicInfo?.name,
                    }
                } isLoading={loading} 
                reload={reload} setReload={setReload}/>;
            case "invoices":
                return <InvoiceInfo key={route.key} invoiceDetails={invoiceDetails} isLoading={loading} />;
            default:
                return null;
        }
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={{ backgroundColor: globalStyles.appBackground.backgroundColor, marginBottom: hp('3%') }}
            indicatorStyle={{ backgroundColor: '#3B82F6', height: 3, borderRadius: 2 }}
            activeColor={isDark ? "#fff" : "#000"}
            inactiveColor={isDark ? "#3B82F6" : "#6B7280"}
            pressColor="rgba(139,92,246,0.15)"
            tabStyle={{ width: 'auto' }}
        />
    );

    const getOrderDetails = async (customerId: string) => {
        const payload: SearchQueryRequest = {
            filters: {
                "orderBasicInfo.customerID": customerId
            },
            getAll: true,
            requiredFields: ["orderId", "createdDate", "status", "eventInfo", "offeringInfo", "totalPrice","approvalStatus"]
        }
        const orderDetailsResponse = await getOrderDataListAPI(payload)
        if (!orderDetailsResponse?.success) {
            return showToast({ type: "error", title: "Error", message: orderDetailsResponse?.message })
        }
        setOrderDetails(orderDetailsResponse.data as OrderModel[])
        setPaymentMetaDetails((prev) => ({
            ...prev,
            totalAmount: orderDetailsResponse?.data?.reduce(
                (total: number, order: OrderModel) => total + (order?.totalPrice || 0),
                0
            ),
        }));
    }

    const getCustomerDetails = async (customerId: string) => {
        const customerDetailsResponse = await getCustomerDetailsAPI(customerId)
        if (!customerDetailsResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message:
                    customerDetailsResponse?.message ||
                    "Failed to fetch customer details",
            });
        }
        setCustomerDetails(customerDetailsResponse.data as CustomerModel)
    }

    const getInvoiceDetails = async (customerId: string) => {
        const payload: SearchQueryRequest = {
            filters: {
                "customerId": customerId
            },
            getAll: true,
            requiredFields: ["invoiceId", "invoiceDate", "orderName", "amountPaid"]
        }
        const invoiceDetailsResponse = await getInvoiceListBasedOnFiltersAPI(payload)
        if (!invoiceDetailsResponse?.success) {
            return showToast({ type: "error", title: "Error", message: invoiceDetailsResponse?.message })
        }
        setInvoiceDetails(invoiceDetailsResponse.data as Invoice[])
        setPaymentMetaDetails((prev) => ({
            ...prev,
            totalPaid: invoiceDetailsResponse?.data?.reduce(
                (total: number, invoice: Invoice) => total + (invoice?.amountPaid || 0),
                0
            ),
        }))
    }


    useEffect(() => {
        if (!customerID) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    getCustomerDetails(customerID),
                    getOrderDetails(customerID),
                    getInvoiceDetails(customerID),
                ]);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            } finally {
                setLoading(false); // only set false when all are done
            }
        };

        fetchData();
    }, [customerID,reload]);


    return (
        <View style={globalStyles.appBackground}>
            {/* Header */}
            <BackHeader screenName="Customer Details" />

            {/* Top Info Section */}
            <View style={{marginTop:hp('2%')}}>
                <View
                    className="flex flex-row justify-between items-center gap-4"
                    style={{ marginHorizontal: wp("4%") }}
                >
                    <Avatar
                        style={{
                            backgroundColor: "#2C426A",
                            transform: [{ scale: 1.2 }],
                        }}
                    >
                        <AvatarFallbackText style={globalStyles.whiteTextColor}>
                            {customerDetails?.customerBasicInfo?.name}
                        </AvatarFallbackText>
                    </Avatar>

                    <View className="flex flex-col justify-center">
                        <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>{customerDetails?.customerBasicInfo?.name}</Text>
                        <Text
                            style={[
                                globalStyles.smallText,
                                globalStyles.themeTextColor,
                            ]}
                        >
                            Created On : {formatDate(customerDetails?.createdDate)}
                        </Text>
                    </View>

                    <View
                        className="flex flex-row justify-end items-center"
                        style={{ flex: 1 }}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate("CreateCustomer", { customerID: customerID })}>
                            <Feather name="edit" size={wp("6%")} color={"#2C426A"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Tab View */}
            <View style={{ flex: 1, marginTop: hp('2%') }}>
                <TabView
                    commonOptions={{
                        icon: ({ route, focused, color }) => (
                            <Feather
                                name={route.icon}
                                size={wp("5%")}
                                color={focused ? "#3B82F6" : "#6B7280"}
                            />
                        ),
                    }}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: wp("100%") }}
                    renderTabBar={renderTabBar}
                />
            </View>
        </View>
    );
}

