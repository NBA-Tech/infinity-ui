import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GradientCard from '@/src/utils/gradient-card';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import QuotationDetails from './step-components/quotation-details';
import { BillingInfo, Invoice } from '@/src/types/invoice/invoice-type';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { ApiGeneralRespose, FormFields, RootStackParamList, SearchQueryRequest } from '@/src/types/common';
import { getOrderDataListAPI, getOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { formatDate, isAllLoadingFalse, patchState, validateValues } from '@/src/utils/utils';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import LineItemsComponent from './step-components/line-items-component';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { CustomerApiResponse } from '@/src/types/customer/customer-type';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import PaymentComponent from './step-components/payment-component';
import { useUserStore } from '@/src/store/user/user-store';
import { OrderModel, OrderType } from '@/src/types/order/order-type';
import TemplateBuilderComponent from '../Orders/components/template-builder-component';
import { Card } from '@/components/ui/card';
import { buildHtml } from '../Orders/utils/html-builder';
import Share from 'react-native-share';
import { generatePDF } from 'react-native-html-to-pdf';
import Modal from 'react-native-modal';
import TemplatePreview from '../Orders/components/template-preview';
import { createInvoiceAPI, getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getInvoiceFields } from '@/src/utils/invoice/invoice-utils';
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
type Props = NativeStackScreenProps<RootStackParamList, "CreateInvoice">;
const CreateInvoice = ({ navigation, route }: Props) => {
    const { invoiceId } = route.params || {};
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [currStep, setCurrStep] = useState(0);
    const stepIcon = ["user", "calendar", "clock", "dollar-sign"]
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [orderDetails, setOrderDetails] = useState<OrderModel>();
    const { customerMetaInfoList, getCustomerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore()
    const { userDetails, getUserDetailsUsingID } = useUserStore()
    const [orderInfo, setOrderInfo] = useState<any>(null);
    const [isOpen, setIsOpen] = useState({
        invoiceDate: false,
        modal: false
    });
    const { getItem } = useDataStore()
    const showToast = useToastMessage();
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice>({
        userId: getItem("USERID") as string,
    });
    const [loadingProvider, setloadingProvider] = useState({
        saveLoading: false,
        intialLoading: false
    });

    const getOrderDetails = async () => {
        setloadingProvider({ ...loadingProvider, intialLoading: true });
        const orderDetails = await getOrderDetailsAPI(invoiceDetails?.orderId as string)
        if (!orderDetails.success) {
            showToast({ type: "error", title: "Error", message: orderDetails.message });
        }
        else {
            setOrderDetails(orderDetails?.data)
            // getCustomerInfo(orderDetails?.data?.orderBasicInfo?.customerID as string)
            loadCustomerMetaInfoList(invoiceDetails?.userId as string)
            setloadingProvider({ ...loadingProvider, intialLoading: false });
        }
    }
    const handleCheckboxChange = (value: any, stateKeyMap: Record<string, string>) => {
        patchState(stateKeyMap.parentKey, stateKeyMap.childKey, value, true, setInvoiceDetails, setErrors)
    }
    const getInvoiceDetailsList = async (orderId: string) => {
        const userId = getItem("USERID");
        const filters: SearchQueryRequest = {
            filters: { "userId": userId, "orderId": orderId },
            requiredFields: ["invoiceId", "amountPaid", "orderId"],
            getAll: true,
        }
        const orderMetaDataResponse: ApiGeneralRespose = await getInvoiceListBasedOnFiltersAPI(filters)
        if (!orderMetaDataResponse.success) {
            showToast({ type: "error", title: "Error", message: orderMetaDataResponse.message });
        }
        else {
            const totalAmount = orderMetaDataResponse?.data?.reduce((total: number, invoice: any) => total + invoice?.amountPaid, 0);
            setOrderDetails((prev) => ({
                ...prev,
                totalAmountCanPay: (prev?.totalPrice ?? 0) - (totalAmount ?? 0)
            }))

            // setInvoiceDetails(orderMetaDataResponse?.data)
        }
    }



    const getOrderMetaData = async () => {
        if (!invoiceDetails?.userId) {
            showToast({ type: "error", title: "Error", message: "User not found" });
            return
        }
        const filter: SearchQueryRequest = {
            filters: { "userId": invoiceDetails?.userId },
            requiredFields: ["orderBasicInfo", "_id", "eventInfo.eventTitle"],
            getAll: true,
        }
        const orderMetaDataResponse: ApiGeneralRespose = await getOrderDataListAPI(filter)
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
            isLoading: loadingProvider.intialLoading,
            dropDownItems: orderInfo?.map((order: any) => ({ label: order?.eventInfo?.eventTitle || "N/A", value: order?.orderId || "N/A" })) || [],
            value: invoiceDetails?.orderId || undefined,
            onChange(value: string, label: string) {
                patchState('', 'orderId', value, true, setInvoiceDetails, setErrors)
                patchState('', 'orderName', label, true, setInvoiceDetails, setErrors)
            },
        }

    }), [invoiceDetails, orderInfo])


    const paymentForm: FormFields = useMemo(() => ({
        amountPaid: {
            key: "amountPaid",
            label: "Amount Paid",
            placeholder: "Eg: $100",
            icon: <Feather name="dollar-sign" size={wp('5%')} color="#3B82F6" />,
            type: "number",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: invoiceDetails?.amountPaid || undefined,
            onChange(value: string) {
                if(Number(value) > orderDetails?.totalAmountCanPay){
                   return  showToast({ type: "error", title: "Error", message: `Amount can't be greater than ₹ ${orderDetails?.totalAmountCanPay}` });
                }
                patchState('', 'amountPaid', value, true, setInvoiceDetails, setErrors)
            }
        },
        invoiceDate: {
            key: "invoiceDate",
            label: "Invoice Date",
            placeholder: "Eg: 12/02/2003",
            icon: <Feather name="calendar" size={wp('5%')} color="#3B82F6" />,
            type: "date",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: invoiceDetails?.invoiceDate || undefined,
            isOpen: isOpen.invoiceDate,
            setIsOpen: (value: boolean) => {
                setIsOpen({ ...isOpen, invoiceDate: value });
            },
            onChange(value: string) {
                patchState('', 'invoiceDate', value, true, setInvoiceDetails, setErrors)
            },
        },
        paymentType: {
            key: "paymentType",
            label: "Payment Type",
            placeholder: "Eg UPI",
            icon: <Feather name="calendar" size={wp('5%')} color="#3B82F6" />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isLoading: loadingProvider.intialLoading,
            dropDownItems: [{ label: "Cash", value: "cash" }, { label: "Bank", value: "bank" }],
            isDisabled: false,
            value: invoiceDetails?.paymentType || undefined,
            onChange(value: string) {
                patchState('', 'paymentType', value, true, setInvoiceDetails, setErrors)
            }
        }
    }), [isOpen, invoiceDetails])

    const invoiceFields = useMemo(
    () => getInvoiceFields(userDetails, invoiceDetails, orderDetails),
    [userDetails, invoiceDetails, orderDetails]
  );
    const handleShareQuotation = async () => {
        try {
            const message = `
                        Hello Sir/Mam 👋,
                        Thank you for showing interest in our photography services 📸.
                        Please find attached your customized quotation with detailed packages, services, and pricing.
    
                        If you have any questions or would like to make changes, feel free to reach out. We’d love to be part of your special moments ✨.
    
                        📍 Studio Address: ${userDetails?.userBillingInfo?.address}, ${userDetails?.userBillingInfo?.city}, ${userDetails?.userBillingInfo?.state}, ${userDetails?.userBillingInfo?.zipCode}, ${userDetails?.userBillingInfo?.country}
                        📞 Phone: ${userDetails?.userBusinessInfo?.businessPhoneNumber}
                        📧 Email: ${userDetails?.userBusinessInfo?.businessEmail}
                        🌐 Website: ${userDetails?.userBusinessInfo?.websiteURL}
    
                        Looking forward to capturing memories together! 💫
    
                        Warm regards,
                            `;

            const options = {
                html: buildHtml("1", new Date().toLocaleDateString(), invoiceFields),
                fileName: `Quotation_${orderDetails?.eventInfo?.eventTitle}`,
            };
            const file = await generatePDF(options);
            const shareOptions = {
                title: options.fileName,
                message: message,
                url: `file://${file.filePath}`,
                type: 'application/pdf',
            }


            await Share.open(shareOptions);

        } catch (err) {
            console.error("Error generating PDF:", err);
        }
    };

    const handleNext = () => {
        const validateInput = validateValues(invoiceDetails, currStep == 0 ? quotaionForm : paymentForm)
        if (!validateInput?.success || Object.keys(errors).length > 0) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validateInput?.message ?? "Please fill all the required fields",
            })
        }
        setCurrStep(currStep + 1)

    }

    const handleCreateInvoice = async () => {
        setloadingProvider({ ...loadingProvider, saveLoading: true })
        const billingInfo: BillingInfo = {
            name: orderDetails?.customerInfo?.firstName + " " + orderDetails?.customerInfo?.lastName,
            email: orderDetails?.customerInfo?.email,
            mobileNumber: orderDetails?.customerInfo?.mobileNumber

        }
        let invoicePayload: Invoice = {
            ...invoiceDetails,
            billingInfo,
            totalAmount: orderDetails?.totalPrice ?? 0,

        }
        const response = await createInvoiceAPI(invoicePayload)
        setloadingProvider({ ...loadingProvider, saveLoading: false })
        if (response?.success) {
            showToast({
                type: "success",
                title: "Success",
                message: response?.message ?? "Invoice created successfully",
            })
            navigation.navigate("Success", { text: response?.message ?? "Invoice created successfully" })
            setInvoiceDetails({})
            setOrderDetails({})
            setCurrStep(0)
        }
        else {
            showToast({
                type: "error",
                title: "Error",
                message: response?.message ?? "Something went wrong",
            })
        }
    }

    useEffect(() => {
        getOrderMetaData()
        getUserDetailsUsingID(invoiceDetails?.userId, showToast)
    }, [])

    useEffect(() => {
        if (!invoiceDetails?.orderId) return
        getOrderDetails()
        getInvoiceDetailsList(invoiceDetails?.orderId)
        setInvoiceDetails({ userId: invoiceDetails?.userId, orderId: invoiceDetails?.orderId, orderName: invoiceDetails?.orderName });
    }, [invoiceDetails?.orderId])

    useEffect(() => {
        if (orderDetails?.orderBasicInfo?.customerID && customerMetaInfoList.length > 0 && !orderDetails?.customerInfo) {
            const customerDetails = customerMetaInfoList.find(c => c.customerID === orderDetails?.orderBasicInfo?.customerID as string)
            if (customerDetails) {
                setOrderDetails((prev: any) => ({ ...prev, customerInfo: customerDetails }))
                setInvoiceDetails((prev: any) => ({ ...prev, customerId: customerDetails?.customerID }))
            }
        }

    }, [customerMetaInfoList, orderDetails])

    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <BackHeader screenName="Create Invoice" />
            <Modal
                isVisible={isOpen?.modal}
                onBackdropPress={() => setIsOpen({ ...isOpen, modal: false })}
                onBackButtonPress={() => setIsOpen({ ...isOpen, modal: false })}
            >
                <TemplatePreview html={buildHtml("1", new Date().toLocaleDateString(), invoiceFields)} />

            </Modal>

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
                            {Array.from({ length: 3 }).map((_, index) => (
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
                                        {index != 2 && (
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
                            <QuotationDetails orderForm={quotaionForm} orderDetails={orderDetails} isLoading={loadingProvider.intialLoading} />
                        </>
                    )

                    }
                    {/* {currStep === 1 &&
                        <LineItemsComponent offeringInfo={orderDetails?.offeringInfo} items={invoiceDetails?.items} setInvoiceDetails={setInvoiceDetails} setErrors={setErrors} />
                    } */}
                    {currStep === 1 &&
                        <PaymentComponent paymentForm={paymentForm} />
                    }
                    {currStep === 2 &&
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: isDark ? "#3B0A2A" : "#FDF2F8", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                    <View className='flex flex-row items-center gap-2'>
                                        <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                        <Text
                                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                        >
                                            Template Builder
                                        </Text>
                                    </View>
                                    <View className='flex flex-row items-center gap-2'>
                                        <TouchableOpacity onPress={() => setIsOpen({ ...isOpen, modal: true })}>
                                            <Feather name="eye" size={wp("5%")} color="#8B5CF6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleShareQuotation}>
                                            <Feather name="share-2" size={wp("5%")} color="#8B5CF6" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <TemplateBuilderComponent quotationFields={invoiceFields} handleCheckboxChange={handleCheckboxChange} templateValueData={invoiceDetails} />

                        </Card>

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
                    isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}
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
                    isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}
                    onPress={() => currStep == 2 ? handleCreateInvoice() : handleNext()}
                >
                    {loadingProvider.saveLoading && <ButtonSpinner size={wp("4%")} color="#fff" />}
                    <ButtonText style={globalStyles.buttonText}>
                        {loadingProvider.saveLoading ? "Creating..." : currStep == 2 ? "Create Invoice" : "Next"}
                    </ButtonText>
                    {currStep != 2 && !loadingProvider.saveLoading && (
                        <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                    )}
                </Button>
            </View>

        </SafeAreaView>
    );
};

export default CreateInvoice;