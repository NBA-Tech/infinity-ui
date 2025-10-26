import BackHeader from '@/src/components/back-header';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-card';
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
import { escapeHtmlForJson, formatDate, generateRandomString, generateRandomStringBasedType, isAllLoadingFalse, patchState, validateValues } from '@/src/utils/utils';
import { EventInfo, OfferingInfo, OrderBasicInfo, OrderModel, OrderStatus, OrderType, StatusHistory } from '@/src/types/order/order-type';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { getOfferingListAPI } from '@/src/api/offering/offering-service';
import { OfferingModel, OFFERINGTYPE, PackageModel, ServiceInfo, ServiceModel } from '@/src/types/offering/offering-type';
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
    const { orderId } = route.params ?? {}
    const stepIcon = ["user", "calendar", "clock", "dollar-sign"]
    const { getItem } = useDataStore()
    const [customerList, setCustomerList] = useState<CustomerOption[]>();
    const showToast = useToastMessage();
    const { loadCustomerMetaInfoList } = useCustomerStore();
    const { serviceData, packageData, loadOfferings } = useOfferingStore()
    const { triggerReloadOrders } = useReloadContext()
    const { userDetails, getUserDetailsUsingID } = useUserStore()
    const [orderDetails, setOrderDetails] = useState<OrderModel>({
        userId: getItem("USERID") as string,
        orderBasicInfo: {} as OrderBasicInfo,
        eventInfo: {} as EventInfo,
        status: OrderStatus.PENDING,
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

    const findServicePrice = (serviceId: string) => {
        const service = serviceData.find((service) => service.id === serviceId)
        return service?.price
    }

    const userInfo: FormFields = useMemo(() => ({
        customerId: {
            parentKey: "orderBasicInfo",
            key: "customerID",
            label: "Customer Name",
            placeholder: "Choose Customer",
            icon: <Feather name="user" size={wp('5%')} style={{ paddingRight: wp('3%') }} color="#8B5CF6" />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            dropDownItems: customerList ?? [],
            value: orderDetails?.orderBasicInfo?.customerID ?? "",
            onChange: (value: string) => {
                patchState('orderBasicInfo', 'customerID', value, true, setOrderDetails, setErrors);
            }
        },
        pointOfContact: {
            parentKey: "orderBasicInfo",
            key: "pointOfContact",
            label: "Point Of Contact",
            placeholder: "Enter Point Of Contact",
            icon: <Feather name="phone" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.orderBasicInfo?.pointOfContact ?? "",
            onChange(value: string) {
                patchState('orderBasicInfo', 'pointOfContact', value, true, setOrderDetails, setErrors)
            },
        },
        specialInstruction: {
            parentKey: "orderBasicInfo",
            key: "specialInstructions",
            label: "Special Instruction",
            placeholder: "Enter Special Instruction",
            icon: <Feather name="info" size={wp('5%')} color="#8B5CF6" />,
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
            placeholder: "Enter Event Title",
            icon: <Feather name="edit-3" size={wp("5%")} color="#8B5CF6" />,
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
            placeholder: "Enter Event Date",
            icon: <Feather name="calendar" size={wp("5%")} color="#8B5CF6" />,
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
            placeholder: "Enter Event Time",
            icon: <Feather name="clock" size={wp("5%")} color="#8B5CF6" />,
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
            placeholder: "Enter No. of Hours",
            icon: <MaterialIcons name="hourglass-empty" size={wp("5%")} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider?.intialLoading,
            value: orderDetails?.eventInfo?.numberOfHours ?? 0,
            onChange(value: string) {
                patchState('eventInfo', 'numberOfHours', value, true, setOrderDetails, setErrors)
            },
        },
        eventLocation: {
            parentKey: "eventInfo",
            key: "eventLocation",
            label: "Event Location",
            placeholder: "Enter Event Location",
            icon: <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />,
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
            icon: <Feather name="heart" size={wp("5%")} color="#8B5CF6" />,
            label: "Wedding",
            selected: orderDetails?.eventInfo?.eventType === "wedding"
        },
        birthday: {
            value: "birthday",
            icon: <Feather name="gift" size={wp("5%")} color="#8B5CF6" />,
            label: "Birthday",
            selected: orderDetails?.eventInfo?.eventType === "birthday"
        },
        corporateEvent: {
            value: "corporateEvent",
            icon: <Feather name="briefcase" size={wp("5%")} color="#8B5CF6" />,
            label: "Corporate Event",
            selected: orderDetails?.eventInfo?.eventType === "corporateEvent"
        },
        portraitSession: {
            value: "portraitSession",
            icon: <Feather name="camera" size={wp("5%")} color="#8B5CF6" />,
            label: "Portrait Session",
            selected: orderDetails?.eventInfo?.eventType === "portraitSession"
        },
        babyShoot: {
            value: "babyShoot",
            icon: <Feather name="smile" size={wp("5%")} color="#8B5CF6" />,
            label: "Baby Shoot",
            selected: orderDetails?.eventInfo?.eventType === "babyShoot"
        },
        customEvent: {
            value: "customEvent",
            icon: <Feather name="star" size={wp("5%")} color="#8B5CF6" />,
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
                packageData,
                findServicePrice
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

        if (!orderDetails?.userId) {
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found. Please Logout and Login again",
            });
        }

        setOrderDetails(orderDetails); // update state for UI if needed
        setloadingProvider({ ...loadingProvider, saveLoading: true });

        let saveNewOrder;
        if (orderId) {
            saveNewOrder = await updateOrderDetailsAPI(orderDetails);
        } else {
            orderDetails.createdDate = new Date();
            saveNewOrder = await saveNewOrderAPI(orderDetails);
        }

        setloadingProvider({ ...loadingProvider, saveLoading: false });

        if (!saveNewOrder?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: saveNewOrder?.message ?? "Something went wrong",
            });
        }
        triggerReloadOrders();
        if (orderId) {
            createNewActivityAPI({
                userId: orderDetails?.userId,
                activityType: ACTIVITY_TYPE.INFO,
                activityTitle: "Order Updated",
                activityMessage: "Order updated successfully for " + orderDetails?.eventInfo?.eventTitle
            })
        }
        else {
            createNewActivityAPI({
                userId: orderDetails?.userId,
                activityType: ACTIVITY_TYPE.SUCCESS,
                activityTitle: "Order Created",
                activityMessage: "Order created successfully for " + orderDetails?.eventInfo?.eventTitle
            })
        }
        showToast({
            type: "success",
            title: "Success",
            message: saveNewOrder?.message ?? "Order created successfully",
        });

        setOrderDetails({
            userId: orderDetails?.userId,
        });
        navigation.navigate("Success", { text: saveNewOrder?.message ?? "Order created successfully" });
        setTimeout(() => {
            setCurrStep(0);
        }, 2000);
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
                try {
                    setloadingProvider(prev => ({ ...prev, intialLoading: true }));
                    setOrderDetails((prev) => {
                        return {
                            ...prev,
                            orderId: generateRandomStringBasedType(20, "ORDER"),
                        }
                    })

                    const userID = await getItem("USERID"); // if async
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
            <BackHeader screenName={orderId ? "Update Order" : "Create Order"} />
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
                        <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>{orderId ? "Update Order" : "Create Order"}</Text>
                        <GradientCard style={{ width: wp('25%') }}>
                            <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                        </GradientCard>
                    </View>
                </View>

                {/* Wrap all main content in a flex container */}
                <View style={{ flex: 1, marginTop: hp("1%") }}>
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

                    {currStep == 0 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="user" size={wp("7%")} color="#06B6D4" />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Customer Informations
                                    </Text>
                                </View>
                            </View>

                            {/* Body */}
                            <CustomFieldsComponent infoFields={userInfo} cardStyle={{ padding: wp("2%") }} errors={errors} />

                        </Card>
                    )}

                    {currStep == 1 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: isDark ? "#701A3D" : "#FDF2F8", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="calendar" size={wp("7%")} color={isDark ? "#FDF2F8" : "#8B5CF6"} />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Event Details
                                    </Text>
                                </View>
                            </View>

                            {/* Body */}
                            <CustomFieldsComponent infoFields={eventInfo} cardStyle={{ padding: wp("2%") }} errors={errors} />
                            <View style={{ marginLeft: wp('3%') }}>

                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Event Type</Text>

                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('3%') }}>
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
                                <View style={{ backgroundColor: isDark ? "#064E3B" : "#ECFDF5", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#0F766E" />
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
                                <View style={{ backgroundColor: isDark ? "#064E3B" : "#ECFDF5", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#0F766E" />
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
                            <TemplateBuilderComponent quotationFields={quotationFields} handleCheckboxChange={handleCheckboxChange} templateValueData={orderDetails} />
                        </Card>
                    )

                    }
                    <View className='flex flex-row gap-2 justify-between items-center' style={{ marginBottom: hp('15%'), marginVertical: hp('2%'), marginHorizontal: wp('2%') }}>
                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={[globalStyles.purpleBackground]}
                            isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}
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
                            style={globalStyles.purpleBackground}
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