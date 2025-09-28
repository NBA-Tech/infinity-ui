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
import { ApiGeneralRespose, FormFields, SearchQueryRequest } from '@/src/types/common';
import { getOrderDataListAPI, getOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { formatDate, patchState, validateValues } from '@/src/utils/utils';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import LineItemsComponent from './step-components/line-items-component';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { CustomerApiResponse } from '@/src/types/customer/customer-type';
import { getCustomerDetails } from '@/src/api/customer/customer-api-service';
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
import { createInvoiceAPI } from '@/src/api/invoice/invoice-api-service';
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
    const [loadingProviders, setLoadingProviders] = useState({
        saveLoading:false
    });

    const getOrderDetails = async () => {
        const orderDetails = await getOrderDetailsAPI(invoiceDetails?.orderId as string)
        if (!orderDetails.success) {
            showToast({ type: "error", title: "Error", message: orderDetails.message });
        }
        else {
            setOrderDetails(orderDetails?.data)
            const payloadToUse: SearchQueryRequest = {
                filters: { userId: invoiceDetails?.userId },
                getAll: true,
                requiredFields: [
                    "customerBasicInfo.firstName",
                    "customerBasicInfo.lastName",
                    "_id",
                    "customerBasicInfo.mobileNumber",
                    "customerBasicInfo.email",
                ],
            };
            // getCustomerInfo(orderDetails?.data?.orderBasicInfo?.customerID as string)
            loadCustomerMetaInfoList(invoiceDetails?.userId as string, payloadToUse)
        }
    }
    const handleCheckboxChange = (value: any, stateKeyMap: Record<string, string>) => {
        patchState(stateKeyMap.parentKey, stateKeyMap.childKey, value, true, setInvoiceDetails, setErrors)
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
            dropDownItems: orderInfo?.map((order: any) => ({ label: order?.eventInfo?.eventTitle || "N/A", value: order?.orderId || "N/A" })) || [],
            value: invoiceDetails?.orderId || undefined,
            onChange(value: string,label:string) {
                patchState('', 'orderId', value, true, setInvoiceDetails, setErrors)
                patchState('', 'orderName', label, true, setInvoiceDetails, setErrors)
            },
        }

    }), [invoiceDetails, orderInfo])


    const paymentForm: FormFields = useMemo(() => ({
        amoutPaid:{
            key: "amoutPaid",
            label: "Amount Paid",
            placeholder: "Eg: $100",
            icon: <Feather name="dollar-sign" size={wp('5%')} color="#3B82F6" />,
            type: "number",
            isRequired:true,
            isDisabled:false,
            value: invoiceDetails?.amoutPaid || undefined,
            onChange(value: string) {
                patchState('', 'amoutPaid', value, true, setInvoiceDetails, setErrors)
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
            dropDownItems: [{ label: "Cash", value: "cash" }, { label: "Bank", value: "bank" }],
            isDisabled: false,
            value: invoiceDetails?.paymentType || undefined,
            onChange(value: string) {
                patchState('', 'paymentType', value, true, setInvoiceDetails, setErrors)
            }
        }
    }), [isOpen, invoiceDetails])

    const invoiceFields = useMemo(() => ({
        headerSection: {
            label: "Header Section",
            icon: <Feather name="layout" size={wp("5%")} color="#8B5CF6" />,
            fields: [
                {
                    key: "logo",
                    heading: "Logo",
                    container: "studio-info",
                    description: "The logo of the photography studio",
                    icon: <Feather name="image" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>
                        <img src=${userDetails?.userBusinessInfo?.companyLogoURL} width='50%' height='50' alt="Logo" />
                        </div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "logo"),
                },
                {
                    key: "companyName",
                    heading: "Studio/Photographer Name",
                    container: "studio-info",
                    description: "The name of the photography studio or photographer",
                    icon: <Feather name="user" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div style="font-weight:bold;">${userDetails?.userBusinessInfo?.companyName}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "companyName"),
                },
                {
                    key: "address",
                    heading: "Studio Address",
                    container: "studio-info",
                    description: "The official address of the studio/photographer",
                    icon: <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>${userDetails?.userBillingInfo?.address}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "address"),
                },
                {
                    key: "contactPhone",
                    heading: "Contact Phone",
                    container: "contact-info",
                    description: "Primary contact phone number",
                    icon: <Feather name="phone" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>📞 ${userDetails?.userBusinessInfo?.businessPhoneNumber}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactPhone"),
                },
                {
                    key: "contactEmail",
                    heading: "Contact Email",
                    container: "contact-info",
                    description: "Primary contact email address",
                    icon: <Feather name="mail" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>✉️ ${userDetails?.userBusinessInfo?.businessEmail}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactEmail"),
                },
                {
                    key: "contactWebsite",
                    heading: "Contact Website",
                    container: "contact-info",
                    description: "Official website link",
                    icon: <Feather name="globe" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>🌐 ${userDetails?.userBusinessInfo?.websiteURL}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactWebsite"),
                },
            ],
        },

        bodySection: {
            label: "Body Section",
            icon: <Feather name="file-text" size={wp("5%")} color="#10B981" />,
            fields: [
                {
                    key: "clientName",
                    heading: "Client Name",
                    container: "card",
                    description: "Full name of the client",
                    icon: <Feather name="user-check" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Client Name:</span>${orderDetails?.customerInfo?.firstName} ${orderDetails?.customerInfo?.lastName}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "clientName"),
                },
                {
                    key: "eventType",
                    heading: "Event Type",
                    container: "card",
                    description: "Type of event (wedding, birthday, corporate, etc.)",
                    icon: <Feather name="camera" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Type:</span> ${orderDetails?.eventInfo?.eventType}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventType"),
                },
                {
                    key: "eventDate",
                    heading: "Event Date & Time",
                    container: "card",
                    description: "Scheduled date and time of the shoot",
                    icon: <Feather name="calendar" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Date & Time:</span>${formatDate(orderDetails?.eventInfo?.eventDate)} : ${orderDetails?.eventInfo?.eventTime}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventDate"),
                },
                {
                    key: "eventLocation",
                    heading: "Event Location",
                    container: "card",
                    description: "Venue or location of the event",
                    icon: <Feather name="map" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Location:</span>${orderDetails?.eventInfo?.eventLocation}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventLocation"),
                },
                {
                    key: "packageName",
                    heading: "Package Name",
                    container: "card",
                    description: "Photography package selected",
                    icon: <Feather name="package" size={wp("5%")} color="#10B981" />,
                    html: invoiceDetails?.items?.[0]?.itemType === OrderType.PACKAGE ?
                        `<div class="field"><span>Package:</span>${invoiceDetails?.items?.[0]?.itemName}</div>` : "",
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "packageName"),
                },
                {
                    key: "pricingTable",
                    heading: "Pricing Table",
                    description: "Breakdown of package and services pricing",
                    icon: <Feather name="dollar-sign" size={wp("5%")} color="#10B981" />,
                    html: `<div class="pricing-container">
                                 <div class="pricing-row header-row">
                                    <div class="col name heading">Service</div>
                                    <div class="col count heading">Qty</div>
                                    <div class="col price heading">Unit Price</div>
                                    <div class="col total heading">Total</div>
                                </div>
                                ${invoiceDetails?.items?.map(
                        (item) => `
                                            <div class="pricing-row">
                                                <div class="col name">${item?.itemName}</div>
                                                <div class="col count">${item?.quantity}</div>
                                                <div class="col price">₹ ${item?.unitPrice}</div>
                                                <div class="col total">₹ ${item?.totalPaid}</div>
                                            </div>
                                            `
                    ).join("")}
                                <div class="pricing-row grand-total">
                                    <div class="col name heading">Grand Total</div>
                                    <div class="col count"></div>
                                    <div class="col price"></div>
                                    <div class="col total heading">₹ ${orderDetails?.totalPrice}</div>
                                </div>
                                </div>
                                `,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "pricingTable"),
                },
            ],
        },

        footerSection: {
            label: "Footer Section",
            icon: <Feather name="file" size={wp("5%")} color="#F59E0B" />,
            fields: [
                {
                    key: "terms",
                    heading: "Terms & Conditions",
                    description: "Payment terms, delivery timeline, rights",
                    icon: <Feather name="file-text" size={wp("5%")} color="#F59E0B" />,
                    html: `<div class="card"><span>Terms & Conditions:</span> {{terms}}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "terms"),
                },
                {
                    key: "signature",
                    heading: "Authorized Signature",
                    description: "Signature of the photographer/studio",
                    icon: <Feather name="edit-3" size={wp("5%")} color="#F59E0B" />,
                    html: `<div class="signature-box">Authorized Signature<br/>____________________</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((section) => section?.key === "signature"),
                },
            ],
        },
    }), [invoiceDetails]);
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
            console.log(validateInput)
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validateInput?.message ?? "Please fill all the required fields",
            })
        }
        setCurrStep(currStep + 1)

    }

    const handleCreateInvoice = async () => {
        setLoadingProviders({...loadingProviders,saveLoading:true})
        const billingInfo:BillingInfo={
            name: orderDetails?.customerInfo?.firstName + " " + orderDetails?.customerInfo?.lastName,
            email: orderDetails?.customerInfo?.email,
            mobileNumber: orderDetails?.customerInfo?.mobileNumber
            
        }
        let invoicePayload:Invoice={
            ...invoiceDetails,
            billingInfo,
            totalAmount: orderDetails?.totalPrice ?? 0,

        }
        const response = await createInvoiceAPI(invoicePayload)
        setLoadingProviders({...loadingProviders,saveLoading:false})
        if (response?.success) {
            showToast({
                type: "success",
                title: "Success",
                message: response?.message ?? "Invoice created successfully",
            })
            setInvoiceDetails({})
            setOrderDetails({})
            setCurrStep(0)
        }
        else{
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
        setInvoiceDetails({userId: invoiceDetails?.userId ,orderId: invoiceDetails?.orderId,orderName:invoiceDetails?.orderName });
    }, [invoiceDetails?.orderId])

    useEffect(() => {
        if (orderDetails?.orderBasicInfo?.customerID && customerMetaInfoList.length > 0 && !orderDetails?.customerInfo) {
            const customerDetails = customerMetaInfoList.find(c => c.customerID === orderDetails?.orderBasicInfo?.customerID as string)
            if (customerDetails) {
                setOrderDetails((prev: any) => ({ ...prev, customerInfo: customerDetails }))
                setInvoiceDetails((prev: any) => ({ ...prev, customerId: customerDetails?.customerID }))
            }
        }

    }, [customerMetaInfoList,orderDetails])

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
                            <QuotationDetails orderForm={quotaionForm} orderDetails={orderDetails} />
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
                    isDisabled={loadingProviders.saveLoading || Object.keys(errors).length > 0}
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
                    isDisabled={loadingProviders.saveLoading || Object.keys(errors).length > 0}
                    onPress={() => currStep == 2 ? handleCreateInvoice() : handleNext()}
                >
                    {loadingProviders.saveLoading && <ButtonSpinner size={wp("4%")} color="#fff" />}
                    <ButtonText style={globalStyles.buttonText}>
                        {loadingProviders.saveLoading ? "Creating..." : currStep == 2 ? "Create Invoice" : "Next"}
                    </ButtonText>
                    {currStep != 2 && !loadingProviders.saveLoading && (
                        <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                    )}
                </Button>
            </View>

        </SafeAreaView>
    );
};

export default CreateInvoice;