import BackHeader from '@/src/components/back-header';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { BasicInfoFields } from '../customer/types-deprecated';
import { CustomCheckBox, CustomFieldsComponent } from '@/src/components/fields-component';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ApiGeneralRespose, FormFields, NavigationProp, RootStackParamList, SearchQueryRequest } from '@/src/types/common';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { CustomerApiResponse, CustomerMetaModel, CustomerModel } from '@/src/types/customer/customer-type';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { escapeHtmlForJson, formatDate, generateRandomString, generateRandomStringBasedType, isAllLoadingFalse, patchState, toTitleCase, validateValues } from '@/src/utils/utils';
import { ApprovalStatus, EventInfo, OfferingInfo, OrderBasicInfo, OrderModel, OrderStatus, OrderType } from '@/src/types/order/order-type';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { getOfferingListAPI } from '@/src/api/offering/offering-service';
import { OfferingModel, PackageModel, ServiceInfo, ServiceModel } from '@/src/types/offering/offering-type';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PackageComponent } from './components/package-component';
import ServiceComponent from './components/service-component';
import TemplateBuilderComponent from './components/template-builder-component';
import TemplatePreview from './components/template-preview';
import Modal from "react-native-modal";
import { useUserStore } from '@/src/store/user/user-store';
import { getUserDetailsApi } from '@/src/services/user/user-service';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { buildHtml } from './utils/html-builder';
import { getOrderDetailsAPI, saveNewOrderAPI, updateOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { EmptyState } from '@/src/components/empty-state-data';
import { useNavigation } from '@react-navigation/native';
import { getQuotationFields } from '@/src/utils/order/quotation-utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNewActivityAPI } from '@/src/services/activity/user-activity-service';
import { ACTIVITY_TYPE } from '@/src/types/activity/user-activity-type';
import { createNewNotificationAPI } from '@/src/services/activity/notification-service';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import { EventModel } from '@/src/types/event/event-type';
import { createNewEventAPI } from '@/src/api/event/event-api-service';

const styles = StyleSheet.create({
    userOnBoardBody: {
        margin: hp("2%"),
    },
    roundWrapper: {
        width: wp("12%"),
        height: wp("12%"), // ✅ Add height equal to width for perfect circle
        borderRadius: wp("6%"), // ✅ Half of width for circle
        justifyContent: "center",
        alignItems: "center",
    },
    divider: {
        width: wp("5%"),
        height: hp("0.5%"),
    },
    bottomCard: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
});
interface CustomerOption {
    label: string;
    value: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "CreateOrder">;

const CreateOrder = ({ navigation, route }: Props) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { orderId } = route.params ?? {};
    const stepIcon = ["user", "calendar", "credit-card", "file"]
    const { getItem } = useDataStore()
    const [customerList, setCustomerList] = useState<CustomerOption[]>();
    const showToast = useToastMessage();
    const { loadCustomerMetaInfoList } = useCustomerStore();
    const { serviceData, packageData, loadOfferings } = useOfferingStore()
    const { triggerReloadOrders } = useReloadContext()
    const { userDetails, getUserDetailsUsingID } = useUserStore()
    const [orderDetails, setOrderDetails] = useState<OrderModel>({
        userId: getItem("USERID") as string,
        orderId: generateRandomStringBasedType(20, "ORDER"),
        orderBasicInfo: {} as OrderBasicInfo,
        status: OrderStatus.IN_PROGRESS,
        eventInfo: {} as EventInfo,
        totalPrice: 0,
        offeringInfo: {} as OfferingInfo,
        quotationHtmlInfo: []
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currStep, setCurrStep] = useState(0);
    const [loadingProvider, setloadingProvider] = useState({
        saveLoading: false,
        intialLoading: false
    })
    const [isOpen, setIsOpen] = useState({
        date: false,
        time: false,
        modal: false
    })

    const getCustomerNameList = async (userID: string) => {
        const metaData = await loadCustomerMetaInfoList(userID, {}, {}, showToast)
        setCustomerList(metaData);
    };

    const userInfo: FormFields = useMemo(() => ({
        customerId: {
            parentKey: "orderBasicInfo",
            key: "customerID",
            label: "Customer Name",
            placeholder: "Eg: John Doe",
            icon: <Feather name="user" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            dropDownItems: customerList ?? [],
            value: orderDetails?.orderBasicInfo?.customerID ?? "",
            rightIcon: <Feather name="plus" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            onRightIconPress: () => {
                navigation.navigate("CreateCustomer");

            },
            onChange: (value: string) => {
                patchState('orderBasicInfo', 'customerID', value, true, setOrderDetails, setErrors);
            }
        },
        specialInstruction: {
            parentKey: "orderBasicInfo",
            key: "specialInstructions",
            label: "Special Instruction",
            placeholder: "Eg: Special Instruction",
            icon: <Feather name="info" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.orderBasicInfo?.specialInstructions ?? "",
            onChange(value: string) {
                patchState('orderBasicInfo', 'specialInstructions', value, false, setOrderDetails, setErrors)
            },
        }
    }), [customerList, orderDetails, loadingProvider]);


    const eventInfo: FormFields = useMemo(() => ({
        eventTitle: {
            parentKey: 'eventInfo',
            key: 'eventTitle',
            label: "Event Title",
            placeholder: "Eg: Wedding",
            icon: <Feather name="edit-3" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.eventInfo?.eventTitle ?? "",
            onChange(value: string) {
                patchState('eventInfo', 'eventTitle', value, true, setOrderDetails, setErrors)
            },
        },
        eventDate: {
            parentKey: "eventInfo",
            key: "eventDate",
            label: "Event Date",
            placeholder: "Eg: 01/01/2023",
            icon: <Feather name="calendar" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "date",
            style: "w-1/2",
            dateType: "date",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.eventInfo?.eventDate ?? "",
            isOpen: isOpen.date,
            setIsOpen: (value: boolean) => {
                setIsOpen({ ...isOpen, date: value });
            },
            onChange(value: string) {
                patchState('eventInfo', 'eventDate', value, true, setOrderDetails, setErrors)
            },
        },
        eventTime: {
            parentKey: "eventInfo",
            key: "eventTime",
            label: "Event Time",
            placeholder: "Eg: 10:00 AM",
            icon: <Feather name="clock" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "time",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.eventInfo?.eventTime ?? "",
            isOpen: isOpen.time,
            setIsOpen: (value: boolean) => {
                setIsOpen({ ...isOpen, time: value });
            },
            onChange(value: string) {
                patchState('eventInfo', 'eventTime', value, true, setOrderDetails, setErrors)
            },
        },
        noOfHours: {
            parentKey: "eventInfo",
            key: "numberOfHours",
            label: "No. of Hours",
            placeholder: "Eg: 2",
            icon: <MaterialIcons name="hourglass-empty" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.eventInfo?.numberOfHours ?? 0,
            onChange(value: string) {
                patchState('eventInfo', 'numberOfHours', value, false, setOrderDetails, setErrors)
            },
        },
        eventLocation: {
            parentKey: "eventInfo",
            key: "eventLocation",
            label: "Event Location",
            placeholder: "Eg: New York",
            icon: <Feather name="map-pin" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.eventInfo?.eventLocation ?? "",
            onChange(value: string) {
                patchState('eventInfo', 'eventLocation', value, true, setOrderDetails, setErrors)
            }
        },
    }), [isOpen, orderDetails]);

    const eventTypes = useMemo(() => ({
        wedding: {
            value: "wedding",
            icon: <Feather name="heart" size={wp("5%")} color={isDark ? "#6FADFF" : "#1372F0"} />,
            label: "Wedding",
            selected: orderDetails?.eventInfo?.eventType === "wedding"
        },
        birthday: {
            value: "birthday",
            icon: <Feather name="gift" size={wp("5%")} color={isDark ? "#6FADFF" : "#1372F0"} />,
            label: "Birthday",
            selected: orderDetails?.eventInfo?.eventType === "birthday"
        },
        corporateEvent: {
            value: "corporateEvent",
            icon: <Feather name="briefcase" size={wp("5%")} color={isDark ? "#6FADFF" : "#1372F0"} />,
            label: "Corporate Event",
            selected: orderDetails?.eventInfo?.eventType === "corporateEvent"
        },
        portraitSession: {
            value: "portraitSession",
            icon: <Feather name="camera" size={wp("5%")} color={isDark ? "#6FADFF" : "#1372F0"} />,
            label: "Portrait Session",
            selected: orderDetails?.eventInfo?.eventType === "portraitSession"
        },
        babyShoot: {
            value: "babyShoot",
            icon: <Feather name="smile" size={wp("5%")} color={isDark ? "#6FADFF" : "#1372F0"} />,
            label: "Baby Shoot",
            selected: orderDetails?.eventInfo?.eventType === "babyShoot"
        },
        customEvent: {
            value: "customEvent",
            icon: <Feather name="star" size={wp("5%")} color={isDark ? "#6FADFF" : "#1372F0"} />,
            label: "Custom Event",
            selected: orderDetails?.eventInfo?.eventType === "customEvent"
        },
    }), [orderDetails]);

    const quotationFields = useMemo(
        () =>
            getQuotationFields(
                userDetails,
                orderDetails,
                customerList,
            ),
        [orderDetails]
    );

    const formOrders = [userInfo, eventInfo, eventTypes]

    const handleNext = () => {
        let validateInput
        if (currStep! - 2) {
            validateInput = validateValues(orderDetails, formOrders[currStep])
            if (!validateInput?.success) {
                return showToast({
                    type: "warning",
                    title: "Oops!!",
                    message: validateInput?.message ?? "Please fill all the required fields",
                })
            }
        }
        else if (!orderDetails?.offeringInfo?.orderType) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please fill all the required fields",
            })
        }
        setCurrStep(currStep + 1)

    }
    const handleCheckboxChange = (value: any, stateKeyMap: Record<string, string>) => {
        patchState(stateKeyMap.parentKey, stateKeyMap.childKey, value, true, setOrderDetails, setErrors)
    }

    const handleCalculatePrice = (serviceInfo: ServiceInfo[]) => {
        const totalPrice = serviceInfo.reduce((total, service) => total + service?.price * service?.value, 0);
        return totalPrice
    }

    const handleTotalPriceCharges = (offerInfo: OfferingInfo) => {
        if (!offerInfo?.orderType) {
            setOrderDetails((prev) => ({ ...prev, totalPrice: 0 }))
            return
        }
        const offeringIDs = offerInfo?.orderType === OrderType.PACKAGE ? offerInfo?.packageId : offerInfo?.services
        if (offerInfo?.orderType === OrderType.PACKAGE) {
            const filteredPackage = packageData.find((p) => p.id === offerInfo?.packageId);
            setOrderDetails((prev) => ({ ...prev, totalPrice: filteredPackage?.calculatedPrice ? handleCalculatePrice(filteredPackage?.serviceList) : filteredPackage?.price }))
        }
        else if (offerInfo?.orderType === OrderType.SERVICE) {
            const serviceCharge = handleCalculatePrice(offerInfo?.services as ServiceInfo[])
            setOrderDetails((prev) => ({ ...prev, totalPrice: serviceCharge }))
        }
    }

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
                html: buildHtml(orderDetails?.orderId, formatDate(new Date()), quotationFields),
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

    const handleCreateOrder = async () => {
        try {
            if (!orderDetails?.userId) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: "UserID is not found. Please Logout and Login again",
                });
            }

            setloadingProvider({ ...loadingProvider, saveLoading: true });

            const orderPayload: OrderModel = {
                ...orderDetails,
                approvalStatus: ApprovalStatus.ACCEPTED,
            };

            const eventPayload: EventModel = {
                eventTitle: orderDetails?.eventInfo?.eventTitle,
                eventDate: orderDetails?.eventInfo?.eventDate,
                eventDateString: new Date(orderDetails?.eventInfo?.eventDate)
                    .toISOString()
                    .split("T")[0],
                eventDescription: `Order ${orderDetails?.eventInfo?.eventTitle} added to event timeline.`,
                eventPriority: "HIGH",
                userId: orderDetails?.userId
            };


            const [saveNewOrder, createEventResponse] = await Promise.all([
                orderId
                    ? updateOrderDetailsAPI(orderPayload)
                    : saveNewOrderAPI(orderPayload),
                createNewEventAPI(eventPayload),
            ]);

            if (!saveNewOrder?.success) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: saveNewOrder?.message ?? "Order save failed",
                });
            }

            if (!createEventResponse?.success) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: createEventResponse?.message ?? "Event creation failed",
                });
            }

            triggerReloadOrders();

            showToast({
                type: "success",
                title: "Success",
                message: saveNewOrder?.message ?? "Order created successfully",
            });

            setOrderDetails({
                userId: orderDetails?.userId,
            });

            navigation.navigate("Success", {
                text: saveNewOrder?.message ?? "Order created successfully",
            });

            setTimeout(() => setCurrStep(0), 2000);

        } catch (err) {
            showToast({
                type: "error",
                title: "Error",
                message: "Something went wrong",
            });
        } finally {
            setloadingProvider({ ...loadingProvider, saveLoading: false });
        }
    };



    const getOrderDetails = async (orderId: string) => {
        setloadingProvider({ ...loadingProvider, intialLoading: true });
        const orderDetails: ApiGeneralRespose = await getOrderDetailsAPI(orderId)
        if (!orderDetails?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: orderDetails?.message ?? "Something went wrong ",
            })
        }
        setOrderDetails(orderDetails.data)
        setloadingProvider({ ...loadingProvider, intialLoading: false });
    }



    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const userID = getItem("USERID");
                if (!userID) return
                try {
                    setloadingProvider(prev => ({ ...prev, intialLoading: true }));
                    setOrderDetails((prev) => {
                        return {
                            ...prev,
                            orderId: generateRandomStringBasedType(20, "ORDER"),
                        }
                    })


                    await loadOfferings(userID, showToast);
                    await getUserDetailsUsingID(userID, showToast);
                    await getCustomerNameList(userID);
                } catch (error) {
                    console.log("Error fetching data", error);
                } finally {
                    setloadingProvider(prev => ({ ...prev, intialLoading: false }));
                }
            };

            fetchData();

            return () => {
                setCustomerList([]); // cleanup
            };
        }, [])
    );

    useEffect(() => {
        if (orderId) {
            getOrderDetails(orderId)
        }
    }, [])

    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <BackHeader screenName={orderId ? `Update Order` : `Create Order`} />
            <Modal
                isVisible={isOpen?.modal}
                onBackdropPress={() => setIsOpen({ ...isOpen, modal: false })}
                onBackButtonPress={() => setIsOpen({ ...isOpen, modal: false })}
            >
                <TemplatePreview html={buildHtml(orderDetails?.orderId, formatDate(new Date()), quotationFields)} />

            </Modal>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className='flex justify-between items-center flex-row'>
                    <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                        <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>{orderId ? `Update Order` : `Create Order`}</Text>
                        <View style={[{ width: wp('25%') }, globalStyles.glassBackgroundColor]}>
                            <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                        </View>
                    </View>
                </View>

                {/* Wrap all main content in a flex container */}
                <View style={{ flex: 1 }}>
                    <View className="flex justify-center items-center" style={styles.userOnBoardBody}>
                        <View className="flex flex-wrap flex-row align-middle items-center">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <View className="flex flex-row align-middle items-center" key={index}>
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

                                    {index != 3 && <Divider style={[styles.divider, { backgroundColor: currStep > index ? "#38A169" : "#d1d5db" }]} />}
                                </View>
                            ))}
                        </View>
                    </View>

                    {currStep == 0 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, marginBottom: hp('2%') }]}>
                            {/* Header */}
                            <View className='flex flex-row justify-between items-center' style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="user" size={wp("7%")} color="#06B6D4" />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Customer Information
                                    </Text>
                                </View>
                            </View>

                            {/* Body */}
                            <CustomFieldsComponent infoFields={userInfo} cardStyle={{ padding: wp("2%") }} errors={errors} />

                        </Card>
                    )}

                    {currStep == 1 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, marginBottom: hp('2%') }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="calendar" size={wp("7%")} color={"#06B6D4"} />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Event Details
                                    </Text>
                                </View>
                            </View>

                            {/* Body */}
                            <CustomFieldsComponent infoFields={eventInfo} cardStyle={{ padding: wp("2%") }} errors={errors} />
                            <View style={[{ marginLeft: wp('3%') }, globalStyles.formBackGroundColor]}>

                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText, { marginBottom: hp('1%') }]}>Event Type</Text>

                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('3%'),marginBottom:hp('2%') }}>
                                    {Object.values(eventTypes).map((eventType, index) => (
                                        <CustomCheckBox key={index} onPress={() => { handleCheckboxChange(eventType.value, { parentKey: 'eventInfo', childKey: 'eventType' }) }} value={eventType.value} selected={eventType.value == orderDetails?.eventInfo?.eventType}>
                                            <View className='flex flex-row items-center gap-2'>
                                                {eventType.icon}
                                                <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{eventType.label}</Text>
                                            </View>
                                        </CustomCheckBox>
                                    ))

                                    }
                                </View>
                            </View>

                        </Card>
                    )
                    }

                    {currStep == 2 && (
                        <View>
                            <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                                <View style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#06B6D4" />
                                        <Text
                                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                        >
                                            Choose Package
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <View className='flex flex-row justify-between items-center p-4'>
                                        {isAllLoadingFalse(loadingProvider) && packageData?.length == 0 && (
                                            <EmptyState variant='packages' onAction={() => navigation.navigate('Services')} />
                                        )
                                        }
                                        <FlatList
                                            horizontal
                                            data={packageData}
                                            renderItem={({ item }) => <PackageComponent pkg={item} serviceData={serviceData} isSelected={item?.id == orderDetails?.offeringInfo?.packageId || false} handleCalculatePrice={handleCalculatePrice} handleCheckboxChange={handleCheckboxChange} handleTotalPriceCharges={handleTotalPriceCharges} />}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingBottom: hp('2%') }}
                                            style={{
                                                maxHeight: hp('30%'),
                                                marginVertical: hp('2%'),
                                            }}
                                        />


                                    </View>
                                </View>

                            </Card>
                            <View className='flex flex-row items-center' style={{ marginVertical: hp('2%') }}>
                                <Divider style={{ width: wp('45%') }} />
                                <Text style={globalStyles.normalTextColor}>OR</Text>
                                <Divider />
                            </View>

                            <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                                {/* Header */}
                                <View style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#06B6D4" />
                                        <Text
                                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                        >
                                            Services
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginHorizontal: wp('2%'), paddingVertical: hp('2%') }}>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('1%') }}>
                                        {isAllLoadingFalse(loadingProvider) && serviceData?.length == 0 && (
                                            <EmptyState variant='services' onAction={() => navigation.navigate('Services')} />
                                        )

                                        }
                                        <FlatList
                                            data={serviceData}
                                            renderItem={({ item, index }) => <ServiceComponent eventType={item} index={index} offeringInfo={orderDetails?.offeringInfo} selectedElement={orderDetails?.offeringInfo?.orderType == OrderType.SERVICE && orderDetails?.offeringInfo?.services?.find((s) => s.id === item.id)} handleTotalPriceCharges={handleTotalPriceCharges} handleCheckboxChange={handleCheckboxChange} />}
                                        />
                                    </View>
                                </View>
                            </Card>

                        </View>
                    )

                    }
                    {currStep == 3 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                            {/* Header */}
                            <View
                                style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {/* Left Section */}
                                    <View className="flex flex-row items-center gap-2">
                                        <Feather name="calendar" size={wp("7%")} color={"#06B6D4"} />
                                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                                            Template Builder
                                        </Text>
                                    </View>

                                    {/* Right Section */}
                                    <View className="flex flex-row items-center gap-3">
                                        <TouchableOpacity onPress={() => setIsOpen({ ...isOpen, modal: true })}>
                                            <Feather name="eye" size={wp("5%")} color={isDark ? "#C7D2FE" : "#3B82F6"} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={handleShareQuotation}>
                                            <Feather name="share-2" size={wp("5%")} color={isDark ? "#C7D2FE" : "#3B82F6"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TemplateBuilderComponent quotationFields={quotationFields} handleCheckboxChange={handleCheckboxChange} templateValueData={orderDetails} />
                            <View className="p-1">
                                <Text style={[globalStyles.smallText, { color: '#E11D48' }]}>
                                    *Note: Any field without a value won’t be included in the template.
                                </Text>
                            </View>
                        </Card>
                    )

                    }
                    <View className='flex flex-row gap-2 justify-between items-center' style={{ marginBottom: hp('15%'), marginVertical: hp('2%'), marginHorizontal: wp('2%') }}>
                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={[globalStyles.buttonColor]}
                            isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0 || currStep == 0}
                            onPress={() => setCurrStep(currStep - 1)}
                        >
                            <Feather name="arrow-left" size={wp("5%")} color="#fff" />

                            <ButtonText style={globalStyles.buttonText}>
                                Prev
                            </ButtonText>
                        </Button>
                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={globalStyles.buttonColor}
                            isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}
                            onPress={currStep == 3 ? handleCreateOrder : handleNext}
                        >
                            {loadingProvider.saveLoading && (
                                <ButtonSpinner size={wp("4%")} color="#fff" />
                            )
                            }
                            <ButtonText style={globalStyles.buttonText}>
                                {!isAllLoadingFalse(loadingProvider) ? (orderId ? 'Updating...' : 'Creating...') : currStep == 3 ? (orderId ? 'Update Order' : 'Create Order') : 'Next'}
                            </ButtonText>
                            {currStep != 3 && isAllLoadingFalse(loadingProvider) &&
                                <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                            }
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Card style={[globalStyles.cardShadowEffect, styles.bottomCard]}>
                <View style={{ margin: hp("1%") }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Total Price: ₹ {orderDetails?.totalPrice}</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>{orderDetails?.offeringInfo?.orderType == OrderType?.PACKAGE ? 1 : orderDetails?.offeringInfo?.services?.length} {orderDetails?.offeringInfo?.orderType == OrderType?.PACKAGE ? 'Package' : 'Service'} is selected</Text>
                        </View>
                    </View>

                </View>
            </Card>
        </SafeAreaView>

    );
};

export default CreateOrder;