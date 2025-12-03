import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import Share from "react-native-share";
import Modal from "react-native-modal";
import { generatePDF } from "react-native-html-to-pdf";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import BackHeader from "@/src/components/back-header";
import GradientCard from "@/src/utils/gradient-card";
import { Divider } from "@/components/ui/divider";
import QuotationDetails from "./step-components/quotation-details";
import PaymentComponent from "./step-components/payment-component";
import TemplateBuilderComponent from "../orders/components/template-builder-component";
import TemplatePreview from "../orders/components/template-preview";
import { Card } from "@/components/ui/card";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";

import {
    getOrderDataListAPI,
    getOrderDetailsAPI,
} from "@/src/api/order/order-api-service";
import {
    createInvoiceAPI,
    getInvoiceDetailsAPI,
    getInvoiceListBasedOnFiltersAPI,
    updateInvoiceAPI,
} from "@/src/api/invoice/invoice-api-service";

import { useCustomerStore } from "@/src/store/customer/customer-store";
import { useUserStore } from "@/src/store/user/user-store";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { useToastMessage } from "@/src/components/toast/toast-message";

import {
    ApiGeneralRespose,
    FormFields,
    GlobalStatus,
    RootStackParamList,
    SEARCH_MODE,
    SearchQueryRequest,
} from "@/src/types/common";
import { BillingInfo, Invoice } from "@/src/types/invoice/invoice-type";
import { ApprovalStatus, OrderModel, OrderStatus } from "@/src/types/order/order-type";

import {
    formatCurrency,
    formatDate,
    generateRandomStringBasedType,
    isAllLoadingFalse,
    patchState,
    validateValues,
} from "@/src/utils/utils";
import { buildHtml } from "../orders/utils/html-builder";
import { getInvoiceFields } from "@/src/utils/invoice/invoice-utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNewActivityAPI } from "@/src/services/activity/user-activity-service";
import { ACTIVITY_TYPE } from "@/src/types/activity/user-activity-type";
import { useReloadContext } from "@/src/providers/reload/reload-context";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
    userOnBoardBody: { margin: hp("2%") },
    roundWrapper: {
        width: wp("12%"),
        height: wp("12%"), // ✅ Add height equal to width for perfect circle
        borderRadius: wp("6%"), // ✅ Half of width for circle
        justifyContent: "center",
        alignItems: "center",
    },
    divider: { width: wp("6%"), height: hp("0.5%") },
});

type Props = NativeStackScreenProps<RootStackParamList, "CreateInvoice">;

const CreateInvoice = ({ navigation, route }: Props) => {
    const { invoiceId } = route.params || {};
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const showToast = useToastMessage();
    const { getItem } = useDataStore();
    const { userDetails, getUserDetailsUsingID } = useUserStore();
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const { triggerReloadInvoices } = useReloadContext()

    const [currStep, setCurrStep] = useState(0);
    const stepIcon = ["user", "calendar", "clock", "credit-card"];
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [orderDetails, setOrderDetails] = useState<OrderModel>();
    const [orderInfo, setOrderInfo] = useState<any[]>([]);
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice>({
        userId: getItem("USERID") as string,
    });

    const [isOpen, setIsOpen] = useState({ invoiceDate: false, modal: false });
    const [loadingProvider, setLoadingProvider] = useState({
        saveLoading: false,
        intialLoading: false,
    });



    /** ───────────────────────────────
     * FETCH FUNCTIONS
     * ───────────────────────────────*/
    const getOrderMetaData = async (userId: string) => {
        const filter: SearchQueryRequest = {
            filters: { userId, approvalStatus: ApprovalStatus.ACCEPTED },
            requiredFields: ["orderBasicInfo", "_id", "eventInfo.eventTitle", "status"],
            getAll: true,
            searchField: "status",
            searchMode: SEARCH_MODE.EXCLUDE,
            searchQuery: GlobalStatus.PENDING

        };
        const res = await getOrderDataListAPI(filter);
        if (res.success) {
            const filteredData = res.data.filter((item: any) => (item.status != OrderStatus.CANCELLED))
            setOrderInfo(filteredData || [])
        }

        else showToast({ type: "error", title: "Error", message: res.message });
    };

    const getOrderDetails = async (orderId: string) => {
        setLoadingProvider((p) => ({ ...p, intialLoading: true }));
        const res = await getOrderDetailsAPI(orderId);
        setLoadingProvider((p) => ({ ...p, intialLoading: false }));

        if (!res.success)
            return showToast({ type: "error", title: "Error", message: res.message });

        const customerID = res?.data?.orderBasicInfo?.customerID;

        const customerInfo = customerMetaInfoList?.find(
            (meta) => meta.customerID === customerID
        );

        setOrderDetails({
            ...(res?.data ?? {}),
            customerInfo,
        });
    };

    const getInvoiceDetailsList = async (orderId: string) => {
        const userId = getItem("USERID");
        const filters: SearchQueryRequest = {
            filters: { userId, orderId },
            requiredFields: ["invoiceId", "amountPaid", "orderId"],
            getAll: true,
        };

        const res = await getInvoiceListBasedOnFiltersAPI(filters);
        if (!res.success)
            return showToast({ type: "error", title: "Error", message: res.message });

        const totalAmountPaid =
            res.data?.reduce((total: number, inv: any) => total + inv.amountPaid, 0) || 0;

        setOrderDetails((prev) => ({
            ...prev,
            totalAmountCanPay: (prev?.totalPrice ?? 0) - totalAmountPaid,
        }));
    };

    const getInvoiceDetails = async (id: string) => {
        const res = await getInvoiceDetailsAPI(id);
        if (!res.success)
            return showToast({ type: "error", title: "Error", message: res.message });

        setInvoiceDetails(res.data);
    };

    /** ───────────────────────────────
     * FORM STRUCTURE
     * ───────────────────────────────*/
    const quotaionForm: FormFields = useMemo(
        () => ({
            orderId: {
                key: "orderId",
                label: "Select Order",
                placeholder: "Select Order",
                icon: (
                    <Feather
                        name="camera"
                        size={wp("5%")}
                        style={{ paddingRight: wp("3%") }}
                        color={isDark ? "#fff" : "#000"}
                    />
                ),
                type: "select",
                isRequired: true,
                isLoading: loadingProvider.intialLoading,
                dropDownItems:
                    orderInfo?.map((order) => ({
                        label: order?.eventInfo?.eventTitle || "N/A",
                        value: order?.orderId || "N/A",
                    })) || [],
                value: invoiceDetails?.orderId,

                onChange(value: string, label: string) {
                    patchState("", "orderId", value, true, setInvoiceDetails, setErrors);
                    patchState("", "orderName", label, true, setInvoiceDetails, setErrors);
                },
            },
        }),
        [orderInfo, invoiceDetails?.orderId, loadingProvider.intialLoading]
    );

    const paymentForm: FormFields = useMemo(
        () => ({
            invoiceDescription: {
                key: "invoiceDescription",
                label: "Invoice Description",
                placeholder: "Eg: Invoice Description",
                icon: (
                    <Feather
                        name="camera"
                        size={wp("5%")}
                        color={isDark ? "#fff" : "#000"}
                    />
                ),
                type: "text",
                isRequired: true,
                value: invoiceDetails?.invoiceDescription,
                onChange(value: string) {
                    patchState("", "invoiceDescription", value, true, setInvoiceDetails, setErrors);
                },
            },
            amountPaid: {
                key: "amountPaid",
                label: "Amount Paid",
                placeholder: "Eg: ₹100",
                icon: <FontAwesome name="money"  size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
                type: "number",
                isRequired: true,
                value: invoiceDetails?.amountPaid,
                onChange(value: string) {
                    const numVal = Number(value);
                    const maxValue = orderDetails?.totalAmountCanPay ?? orderDetails?.totalPrice ?? 0
                    if (orderDetails?.totalAmountCanPay && numVal > maxValue) {
                        showToast({
                            type: "error",
                            title: "Error",
                            message: `Amount can't exceed ${formatCurrency(maxValue)}`,
                        });
                    }
                    else {
                        patchState("", "amountPaid", value, true, setInvoiceDetails, setErrors);
                    }
                },
            },
            invoiceDate: {
                key: "invoiceDate",
                label: "Invoice Date",
                placeholder: "Eg: 12/02/2003",
                icon: <Feather name="calendar" style={{ paddingRight: wp("3%") }} size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
                type: "date",
                maxDate: new Date(),
                value: invoiceDetails?.invoiceDate
                    ? new Date(invoiceDetails.invoiceDate)
                    : undefined,
                isOpen: isOpen.invoiceDate,
                setIsOpen: (val: boolean) => setIsOpen({ ...isOpen, invoiceDate: val }),
                onChange(value: string) {
                    patchState("", "invoiceDate", value, true, setInvoiceDetails, setErrors);
                },
            },
        }),
        [isOpen, invoiceDetails, orderDetails]
    );

    const invoiceFields = useMemo(
        () => getInvoiceFields(userDetails, invoiceDetails, orderDetails),
        [userDetails, invoiceDetails, orderDetails]
    );

    /** ───────────────────────────────
     * BUTTON HANDLERS
     * ───────────────────────────────*/
    const handleNext = () => {
        const form = currStep === 0 ? quotaionForm : paymentForm;
        const validate = validateValues(invoiceDetails, form);

        if (currStep === 1) {
            if (invoiceDetails?.amountPaid > (orderDetails?.totalAmountCanPay ?? orderDetails?.totalPrice ?? 0)) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: `Amount can't exceed ${formatCurrency(orderDetails?.totalAmountCanPay ?? orderDetails?.totalPrice ?? 0)}`,
                });
            }
        }

        if (!validate?.success || Object.keys(errors).length > 0)
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validate?.message ?? "Please fill all required fields",
            });

        setCurrStep((prev) => Math.min(prev + 1, 2));
    };


    const handlePrev = () => setCurrStep((prev) => Math.max(prev - 1, 0));

    const handleCreateInvoice = async () => {
        setLoadingProvider((p) => ({ ...p, saveLoading: true }));

        const billingInfo: BillingInfo = {
            name: orderDetails?.customerInfo?.name,
            email: orderDetails?.customerInfo?.email,
            mobileNumber: orderDetails?.customerInfo?.mobileNumber,
        };

        const payload: Invoice = {
            ...invoiceDetails,
            billingInfo,
            customerId: orderDetails?.customerInfo?.customerID,
            totalAmount: orderDetails?.totalPrice ?? 0,
        };
        let res;

        if (invoiceId) {
            res = await updateInvoiceAPI(payload);
        }
        else {
            payload.invoiceDate = new Date()
            res = await createInvoiceAPI(payload);
        }
        setLoadingProvider((p) => ({ ...p, saveLoading: false }));

        if (res?.success) {
            triggerReloadInvoices();
            // if (payload?.invoiceId) {
            //     createNewActivityAPI({
            //         userId: getItem("USERID"),
            //         activityType: ACTIVITY_TYPE.INFO,
            //         activityTitle: "Invoice Updated",
            //         activityMessage: "Invoice Updated for Event: " + orderDetails?.eventInfo?.eventTitle
            //     })
            // }
            // else {
            //     createNewActivityAPI({
            //         userId: getItem("USERID"),
            //         activityType: ACTIVITY_TYPE.SUCCESS,
            //         activityTitle: "Invoice Created",
            //         activityMessage: "Invoice Created for Event: " + orderDetails?.eventInfo?.eventTitle
            //     })
            // }

            showToast({ type: "success", title: "Success", message: res.message });
            navigation.navigate("Success", {
                text: res.message ?? "Invoice created successfully",
            });
            setCurrStep(0);
            setInvoiceDetails({ userId: getItem("USERID") });
            setOrderDetails(undefined);
        } else {
            showToast({ type: "error", title: "Error", message: res.message });
        }
    };

    const handleShareQuotation = async () => {
        try {
            const html = buildHtml(invoiceDetails?.invoiceId, formatDate(new Date()), invoiceFields,"Invoice");
            const pdf = await generatePDF({
                html,
                fileName: `Quotation_${orderDetails?.eventInfo?.eventTitle || "Invoice"}`,
            });

            await Share.open({
                title: "Quotation",
                message: "Please find attached your quotation PDF.",
                url: `file://${pdf.filePath}`,
                type: "application/pdf",
            });
        } catch (err) {
            console.error("PDF Share Error:", err);
        }
    };

    /** ───────────────────────────────
 * LOAD INITIAL DATA
 * ───────────────────────────────*/
    useEffect(() => {
        const userId = getItem("USERID");
        if (!userId) return;

        getUserDetailsUsingID(userId, showToast);
        loadCustomerMetaInfoList(userId);
        getOrderMetaData(userId);
    }, []);

    /** ───────────────────────────────
     * LOAD INVOICE (EDIT MODE)
     * ───────────────────────────────*/
    useEffect(() => {
        if (invoiceId) getInvoiceDetails(invoiceId);
    }, [invoiceId]);

    /** ───────────────────────────────
     * WHEN ORDER CHANGES
     * ───────────────────────────────*/
    useEffect(() => {
        if (!invoiceDetails?.orderId) return;
        getOrderDetails(invoiceDetails.orderId);
        getInvoiceDetailsList(invoiceDetails.orderId);
    }, [invoiceDetails?.orderId]);


    useFocusEffect(
        useCallback(() => {
            setInvoiceDetails({ ...invoiceDetails, invoiceId: generateRandomStringBasedType(20, "INVOICE") });
        }, [])
    );


    /** ───────────────────────────────
     * RENDER
     * ───────────────────────────────*/
    return (
        <View style={[globalStyles.appBackground]}>
            <BackHeader screenName={invoiceId ? "Update Invoice" : "Create Invoice"} />

            {/* Modal Preview */}
            <Modal
                isVisible={isOpen.modal}
                onBackdropPress={() => setIsOpen({ ...isOpen, modal: false })}
                onBackButtonPress={() => setIsOpen({ ...isOpen, modal: false })}
            >
                <TemplatePreview
                    html={buildHtml(invoiceDetails?.invoiceId, formatDate(new Date()), invoiceFields, "Invoice")}
                />
            </Modal>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex justify-between items-center flex-row">
                    <View className="flex justify-start items-start" style={{ margin: wp("2%") }}>
                        <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>
                            {invoiceId ? "Update Invoice" : "Create Invoice"}
                        </Text>
                        <View style={[{ width: wp('25%') }, globalStyles.glassBackgroundColor]}>
                            <Divider style={{ height: hp("0.5%") }} width={wp('0%')} />
                        </View>
                    </View>
                </View>

                {/* Stepper */}
                <View style={styles.userOnBoardBody}>
                    <View className="flex flex-row justify-center items-center">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <View key={index} className="flex flex-row items-center">
                                <View
                                    style={[
                                        styles.roundWrapper,
                                        {
                                            backgroundColor:
                                                currStep === index
                                                    ? "#2563EB" // Active step → blue
                                                    : currStep > index
                                                        ? "#22C55E" // Completed step → green
                                                        : "#E5E7EB", // Upcoming step → grey
                                        },
                                    ]}
                                >
                                    <View className="justify-center items-center">
                                        {currStep > index ? (
                                            <Feather name="check" size={wp("5%")} color="white" />
                                        ) : (
                                            <Feather name={stepIcon[index]} size={wp("5%")} color="#fff" />
                                        )}
                                    </View>
                                </View>
                                {index !== 2 && (
                                    <Divider
                                        style={[
                                            styles.divider,
                                            { backgroundColor: currStep > index ? "#38A169" : "#d1d5db" },
                                        ]}
                                    />
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Step Content */}
                {currStep === 0 && (
                    <QuotationDetails
                        orderForm={quotaionForm}
                        orderDetails={orderDetails}
                        isLoading={loadingProvider.intialLoading}
                    />
                )}

                {currStep === 1 && <PaymentComponent paymentForm={paymentForm} errors={errors}/>}

                {currStep === 2 && (
                    <Card style={[globalStyles.cardShadowEffect, { padding: 0 }]}>
                        <View
                            style={{
                                backgroundColor: isDark ? "#164E63" : "#ECFEFF",
                                padding: hp("2%"),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View className="flex flex-row items-center gap-2">
                                    <Feather name="calendar" size={wp("7%")} color={"#06B6D4"} />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Template Builder
                                    </Text>
                                </View>
                                <View className="flex flex-row items-center gap-2">
                                    <TouchableOpacity
                                        onPress={() => setIsOpen({ ...isOpen, modal: true })}
                                    >
                                        <Feather name="eye" size={wp("5%")} color={isDark ? "#fff" : "#000"} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleShareQuotation}>
                                        <Feather name="share-2" size={wp("5%")} color={isDark ? "#fff" : "#000"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>


                        <TemplateBuilderComponent
                            quotationFields={invoiceFields}
                            handleCheckboxChange={(v, m) => {
                                patchState(m.parentKey, m.childKey, v, true, setInvoiceDetails, setErrors)
                            }
                            }
                            templateValueData={invoiceDetails}
                        />
                        <View className="p-1">
                            <Text style={[globalStyles.smallText, { color: '#E11D48' }]}>
                                *Note: Any field without a value won’t be included in the template.
                            </Text>
                        </View>
                    </Card>
                )}
            </ScrollView>

            {/* Footer Buttons */}
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingVertical: hp("2%"),
                    paddingHorizontal: wp("4%"),
                    backgroundColor: isDark ? "#1A2238" : "#F5F7FB",
                }}
                className="flex flex-row gap-2 justify-between items-center"
            >
                {currStep > 0 && (
                    <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        style={[globalStyles.buttonColor, { flex: 1, marginRight: wp("2%") }]}
                        onPress={handlePrev}
                    >
                        <Feather name="arrow-left" size={wp("5%")} color="#fff" />
                        <ButtonText style={globalStyles.buttonText}>Prev</ButtonText>
                    </Button>
                )}

                <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    style={[globalStyles.buttonColor, { flex: 1, marginLeft: wp("2%") }]}
                    isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}
                    onPress={currStep === 2 ? handleCreateInvoice : handleNext}
                >
                    {loadingProvider.saveLoading && (
                        <ButtonSpinner size={wp("4%")} color="#fff" />
                    )}
                    <ButtonText style={globalStyles.buttonText}>
                        {loadingProvider.saveLoading
                            ? invoiceId ? "Updating..." : "Creating..."
                            : currStep === 2
                                ? invoiceId ? "Update Invoice" : "Create Invoice"
                                : "Next"}
                    </ButtonText>
                    {currStep !== 2 && !loadingProvider.saveLoading && (
                        <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                    )}
                </Button>
            </View>
        </View>
    );
};

export default CreateInvoice;
