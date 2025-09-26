import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import QuotationDetails from './step-components/quotation-details';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { ApiGeneralRespose, FormFields, SearchQueryRequest } from '@/src/types/common';
import { getOrderDataListAPI, getOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { patchState } from '@/src/utils/utils';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import LineItemsComponent from './step-components/line-items-component';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { CustomerApiResponse } from '@/src/types/customer/customer-type';
import { getCustomerDetails } from '@/src/api/customer/customer-api-service';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import PaymentComponent from './step-components/payment-component';
const styles = StyleSheet.create({
    userOnBoardBody: {
        margin: hp("2%"),
    },
    roundWrapper: {
        borderRadius: wp("50%"),
        width: wp("13%"),
    },
    divider: {
        width: wp("10%"),
        height: hp("0.5%"),
    },
})
const CreateInvoice = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [currStep, setCurrStep] = useState(0);
    const stepIcon = ["user", "calendar", "clock", "dollar-sign"]
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice>();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const { customerMetaInfoList, getCustomerMetaInfoList } = useCustomerStore()
    const [orderInfo, setOrderInfo] = useState<any>(null);
    const [isOpen, setIsOpen] = useState({
        invoiceDate: false,
        dueDate: false
    });
    const { getItem } = useDataStore()
    const showToast = useToastMessage();

    const getCustomerInfo = async (customerID: string) => {
        const customerMetaData = getCustomerMetaInfoList();
        if (customerMetaData.length > 0) {
            const customerDetails = customerMetaData.find(c => c.customerID === customerID)
            if (customerDetails) {
                console.log("customerDetails from store", customerDetails)
                setOrderDetails((prev: any) => ({ ...prev, customerInfo: customerDetails }))
                return
            }
        }
        const userID = getItem("USERID")
        const payload: SearchQueryRequest = {
            filters: {
                userId: userID,
                customerID: customerID
            },
            getAll: true,
            requiredFields: ["customerBasicInfo.firstName", "customerBasicInfo.lastName", "_id", "customerBasicInfo.mobileNumber", "customerBasicInfo.email"],
        };

        const customerListResponse: CustomerApiResponse = await getCustomerDetails(payload);
        if (!customerListResponse.success) {
            showToast({ type: "error", title: "Error", message: customerListResponse.message });
        }
        if (customerListResponse?.customerList?.length === 0) return;

        const metaList = toCustomerMetaModelList(customerListResponse.customerList);
        const customerDetails = metaList.find(c => c.customerID === customerID)
        if (customerDetails) {
            setOrderDetails((prev: any) => ({ ...prev, customerInfo: customerDetails }))
        }

    }

    const getOrderDetails = async () => {
        const orderDetails = await getOrderDetailsAPI(invoiceDetails?.orderId as string)
        if (!orderDetails.success) {
            showToast({ type: "error", title: "Error", message: orderDetails.message });
        }
        else {
            console.log("orderDetails", orderDetails)
            setOrderDetails(orderDetails?.data)
            getCustomerInfo(orderDetails?.data?.orderBasicInfo?.customerID as string)
        }
    }



    const getOrderMetaData = async () => {
        const userID = getItem("USERID")
        if (!userID) {
            showToast({ type: "error", title: "Error", message: "User not found" });
            return
        }
        const filter: SearchQueryRequest = {
            filters: { "userId": userID },
            requiredFields: ["orderBasicInfo", "_id", "eventInfo.eventTitle"],
            getAll: true,
        }
        const orderMetaDataResponse: ApiGeneralRespose = await getOrderDataListAPI(filter)
        console.log("orderMetaDataResponse", orderMetaDataResponse)
        if (!orderMetaDataResponse.success) {
            showToast({ type: "error", title: "Error", message: orderMetaDataResponse.message });
        }
        else {
            setOrderInfo(orderMetaDataResponse.data)
        }
    }
    const quotaionForm: FormFields = useMemo(() => ({
        orderId: {
            key: "orderId",
            label: "Select Order",
            placeholder: "Select Order",
            icon: <Feather name="file-text" size={wp('5%')} color="#3B82F6" />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            dropDownItems: orderInfo?.map((order: any) => ({ label: order?.eventInfo?.eventTitle || "N/A", value: order?.orderId })) || [],
            value: invoiceDetails?.orderId || undefined,
            onChange(value: string) {
                console.log("value", value)
                patchState('', 'orderId', value, true, setInvoiceDetails, setErrors)
            },
        }

    }), [invoiceDetails, orderInfo])


    const paymentForm: FormFields = useMemo(() => ({
        invoiceDate: {
            key: "invoiceDate",
            label: "Invoice Date",
            placeholder: "Invoice Date",
            icon: <Feather name="calendar" size={wp('5%')} color="#3B82F6" />,
            type: "date",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: invoiceDetails?.invoiceDate || undefined,
            isOpen: isOpen.invoiceDate,
            setIsOpen: (value: boolean) => {
                setIsOpen({ ...isOpen, invoiceDate: value });
            },
            onChange(value: string) {
                patchState('', 'invoiceDate', value, true, setInvoiceDetails, setErrors)
            },
        },
        dueDate: {
            key: "dueDate",
            label: "Due Date",
            placeholder: "Due Date",
            icon: <Feather name="calendar" size={wp('5%')} color="#3B82F6" />,
            type: "date",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: invoiceDetails?.dueDate || undefined,
            isOpen: isOpen.dueDate,
            setIsOpen: (value: boolean) => {
                setIsOpen({ ...isOpen, dueDate: value });
            },
            onChange(value: string) {
                patchState('', 'dueDate', value, true, setInvoiceDetails, setErrors)
            },
        },
        paymentType:{
            key: "paymentType",
            label: "Payment Type",
            placeholder: "Payment Type",
            icon: <Feather name="calendar" size={wp('5%')} color="#3B82F6" />,
            type: "select",
            style: "w-full",
            isRequired: true,
            dropDownItems: [{ label: "Cash", value: "cash" }, { label: "Bank", value: "bank" }],
            isDisabled: false,
            value: invoiceDetails?.paymentType || undefined,
            onChange(value: string) {
                patchState('', 'paymentType', value, true, setInvoiceDetails, setErrors)
            }
        }
    }), [isOpen,invoiceDetails])


    useEffect(() => {
        getOrderMetaData()
    }, [])

    useEffect(() => {
        if (!invoiceDetails?.orderId) return
        getOrderDetails()
        setInvoiceDetails({ orderId: invoiceDetails?.orderId });
    }, [invoiceDetails?.orderId])

    useEffect(() => {
        console.log("invoiceDetails", invoiceDetails)
    }, [invoiceDetails])
    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <BackHeader screenName="Create Invoice" />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className='flex justify-between items-center flex-row'>
                    <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                        <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>Create Invoice</Text>
                        <GradientCard style={{ width: wp('25%') }}>
                            <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                        </GradientCard>
                    </View>
                </View>
                <View>
                    <View className="flex justify-center items-center" style={styles.userOnBoardBody}>
                        <View className="flex flex-wrap flex-row align-middle items-center">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <View key={index} className="flex flex-row align-middle items-center">
                                    <View className="flex flex-row align-middle items-center">
                                        <GradientCard
                                            className="rounded-2xl p-4 mb-4"
                                            style={styles.roundWrapper}
                                            colors={
                                                currStep === index
                                                    ? ["#6B46C1", "#9F7AEA", "#D53F8C"] // Purple gradient
                                                    : currStep > index
                                                        ? ["#48BB78", "#38A169", "#2F855A"] // Green gradient
                                                        : ["#d1d5db", "#d1d5db", "#d1d5db"] // Normal grey gradient
                                            }
                                        >
                                            <View className="justify-center items-center">
                                                {currStep > index ? (
                                                    <Feather name="check" size={wp("5%")} color="white" />
                                                ) : (
                                                    < Feather name={stepIcon[index]} size={wp("5%")} color="#fff" />
                                                )}
                                            </View>
                                        </GradientCard>
                                        {index != 3 && (
                                            <Divider style={[styles.divider, { backgroundColor: currStep > index ? "#38A169" : "#d1d5db" }]} />
                                        )}

                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View>
                    {currStep === 0 && (
                        <>
                            <QuotationDetails orderForm={quotaionForm} orderDetails={orderDetails} />
                        </>
                    )

                    }
                    {currStep === 1 &&
                        <LineItemsComponent offeringInfo={orderDetails?.offeringInfo} items={invoiceDetails?.items} setInvoiceDetails={setInvoiceDetails} setErrors={setErrors} />
                    }
                    {currStep === 2 &&
                        <PaymentComponent paymentForm={paymentForm} />
                    }
                </View>

            </ScrollView>
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingVertical: hp("2%"),
                    paddingHorizontal: wp("4%"),
                    backgroundColor: isDark ? "#1F2028" : "#fff", // match theme
                    borderTopWidth: 1,
                    borderTopColor: isDark ? "#333" : "#E5E7EB", // subtle divider
                }}
                className="flex flex-row gap-2 justify-between items-center"
            >
                <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    style={[globalStyles.purpleBackground, { flex: 1, marginRight: wp("2%") }]}
                    isDisabled={false || Object.keys(errors).length > 0}
                    onPress={() => setCurrStep(currStep - 1)}
                >
                    <Feather name="arrow-left" size={wp("5%")} color="#fff" />
                    <ButtonText style={globalStyles.buttonText}>Prev</ButtonText>
                </Button>

                <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    style={[globalStyles.purpleBackground, { flex: 1, marginLeft: wp("2%") }]}
                    isDisabled={false || Object.keys(errors).length > 0}
                    onPress={() => setCurrStep(currStep + 1)}
                >
                    {false && <ButtonSpinner size={wp("4%")} color="#fff" />}
                    <ButtonText style={globalStyles.buttonText}>
                        {false ? "Creating..." : currStep == 3 ? "Create Order" : "Next"}
                    </ButtonText>
                    {currStep != 3 && !false && (
                        <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                    )}
                </Button>
            </View>

        </SafeAreaView>
    );
};

export default CreateInvoice;