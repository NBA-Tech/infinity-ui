import BackHeader from '@/src/components/back-header';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { BasicInfoFields } from '../customer/types-deprecated';
import { CustomCheckBox, CustomFieldsComponent } from '@/src/components/fields-component';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FormFields, SearchQueryRequest } from '@/src/types/common';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { getCustomerDetails } from '@/src/api/customer/customer-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { CustomerApiResponse, CustomerMetaModel, CustomerModel } from '@/src/types/customer/customer-type';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { useFocusEffect } from '@react-navigation/native';
import { generateRandomString, patchState, validateValues } from '@/src/utils/utils';
import { EventInfo, OfferingInfo, OrderBasicInfo, OrderModel, OrderStatus, OrderType } from '@/src/types/order/order-type';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { getOfferingListAPI } from '@/src/api/offering/offering-service';
import { OfferingModel, OFFERINGTYPE, PackageModel, ServiceInfo, ServiceModel } from '@/src/types/offering/offering-type';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PackageComponent } from './components/package-component';
import ServiceComponent from './components/service-component';
import TemplateBuilderComponent from './components/template-builder-component';
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

const CreateOrder = () => {
    const globalStyles = useContext(StyleContext);
    const stepIcon = ["user", "calendar", "clock", "dollar-sign"]
    const { getItem } = useDataStore()
    const [customerList, setCustomerList] = useState<CustomerOption[]>();
    const [offeringData, setOfferingData] = useState<ServiceModel[] | PackageModel[]>([])
    const [packageData, setPackageData] = useState<PackageModel[]>([])
    const [serviceData, setServiceData] = useState<ServiceModel[]>([])
    const showToast = useToastMessage();
    const [totalCharges, setTotalCharges] = useState<number>(0)
    const { getCustomerMetaInfoList, setCustomerMetaInfoList } = useCustomerStore();
    const { offeringList, getOfferingList, setOfferingList } = useOfferingStore()
    const [orderDetails, setOrderDetails] = useState<OrderModel>({
        userId: "",
        orderBasicInfo: {} as OrderBasicInfo,
        eventInfo: {} as EventInfo,
        status: OrderStatus.NEW,
        offeringInfo: {} as OfferingInfo
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currStep, setCurrStep] = useState(3);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState({
        date: false,
        time: false
    })

    const getCustomerNameList = async () => {
        const customerMetaData = getCustomerMetaInfoList();

        if (customerMetaData?.length > 0) {
            const filterData: CustomerOption[] = customerMetaData.map((customer) => ({
                label: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
                value: customer.customerID ?? "",
            }));
            setCustomerList(filterData);
            return;
        }

        const userId = getItem("USERID");
        const payload: SearchQueryRequest = {
            filters: { userId },
            getAll: true,
            requiredFields: ["customerBasicInfo.firstName", "customerBasicInfo.lastName", "_id"],
        };
        const uuid = generateRandomString(30);

        const customerListResponse: CustomerApiResponse = await getCustomerDetails(payload, { "Idempotency-Key": uuid });

        if (!customerListResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: customerListResponse?.message ?? "Something went wrong",
            });
        }

        if (customerListResponse?.customerList?.length === 0) return;

        const metaList = toCustomerMetaModelList(customerListResponse.customerList);
        const filterData: CustomerOption[] = metaList.map((customer) => ({
            label: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
            value: customer.customerID ?? "",
        }));

        setCustomerMetaInfoList(metaList);
        setCustomerList(filterData);
    };


    const getOfferingDetails = async () => {
        let offeringListData = getOfferingList()
        console.log(offeringListData)
        const userID = getItem("USERID")
        if (!userID) {
            showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found Please Logout and Login again",
            })
        }
        if (offeringListData.length <= 0) {
            const offeringData = await getOfferingListAPI(userID)
            if (!offeringData?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message: offeringData?.message ?? "Something went wrong",
                })
            }
            else {
                const { packages, services } = offeringData.data
                offeringListData = [...(packages ?? []), ...(services ?? [])]
                setPackageData(packages ?? [])
                setServiceData(services ?? [])
            }
        }
        setOfferingData(offeringListData as ServiceModel[] | PackageModel[])

    }

    const userInfo: FormFields = useMemo(() => ({
        customerId: {
            parentKey: "orderBasicInfo",
            key: "customerID",
            label: "Customer Name",
            placeholder: "Choose Customer",
            icon: <Feather name="gender-male" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            dropDownItems: customerList ?? [],
            value: orderDetails?.orderBasicInfo.customerID ?? "",
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
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
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
            icon: <Feather name="phone" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
            value: orderDetails?.orderBasicInfo?.specialInstructions ?? "",
            onChange(value: string) {
                patchState('orderBasicInfo', 'specialInstructions', value, false, setOrderDetails, setErrors)
            },
        }
    }), [customerList, orderDetails]);


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
            isRequired: true,
            isDisabled: false,
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

    const quotationFields = {
        headerSection: {
            label: "Header Section",
            icon: <Feather name="layout" size={wp("5%")} color="#8B5CF6" />,
            fields: [
                {
                    key: "logo",
                    heading: "Logo",
                    description: "The logo of the photography studio",
                    icon: <Feather name="image" size={wp("5%")} color="#8B5CF6" />,
                },
                {
                    key: "companyName",
                    heading: "Studio/Photographer Name",
                    description: "The name of the photography studio or photographer",
                    icon: <Feather name="user" size={wp("5%")} color="#8B5CF6" />,
                },
                {
                    key: "address",
                    heading: "Studio Address",
                    description: "The official address of the studio/photographer",
                    icon: <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />,
                },
                {
                    key: "contact",
                    heading: "Contact Details",
                    description: "Phone number, email, and website",
                    icon: <Feather name="phone" size={wp("5%")} color="#8B5CF6" />,
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
                    description: "Full name of the client",
                    icon: <Feather name="user-check" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "eventType",
                    heading: "Event Type",
                    description: "Type of photography (wedding, birthday, corporate, etc.)",
                    icon: <Feather name="camera" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "eventDate",
                    heading: "Event Date & Time",
                    description: "Scheduled date and time of the shoot",
                    icon: <Feather name="calendar" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "eventLocation",
                    heading: "Event Location",
                    description: "Venue or location of the event",
                    icon: <Feather name="map" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "packageDetails",
                    heading: "Package Details",
                    description: "Photography package name/details",
                    icon: <Feather name="package" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "servicesIncluded",
                    heading: "Services Included",
                    description: "List of deliverables (albums, edited photos, videos, etc.)",
                    icon: <Feather name="check-circle" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "shootDuration",
                    heading: "Coverage Duration",
                    description: "Number of hours/days covered",
                    icon: <Feather name="clock" size={wp("5%")} color="#10B981" />,
                },
                {
                    key: "pricing",
                    heading: "Pricing",
                    description: "Breakdown of costs (shoot, editing, travel, etc.)",
                    icon: <Feather name="dollar-sign" size={wp("5%")} color="#10B981" />,
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
                },
                {
                    key: "paymentDetails",
                    heading: "Payment Details",
                    description: "Bank account, UPI, or payment method",
                    icon: <Feather name="credit-card" size={wp("5%")} color="#F59E0B" />,
                },
                {
                    key: "signature",
                    heading: "Authorized Signature",
                    description: "Signature of the photographer/studio",
                    icon: <Feather name="edit-3" size={wp("5%")} color="#F59E0B" />,
                },
            ],
        },
    };


    const formOrders = [userInfo, eventInfo, eventTypes]

    const handleNext = () => {
        let validateInput
        if (currStep! - 2) {
            validateInput = validateValues(orderDetails, formOrders[currStep])
        }
        if (!validateInput?.success && !orderDetails?.eventInfo?.eventType) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validateInput?.message ?? "Please fill all the required fields",
            })
        }
        setCurrStep(currStep + 1)

    }


    const handleCheckboxChange = (value: any, stateKeyMap: Record<string, string>) => {
        console.log(value, stateKeyMap)
        patchState(stateKeyMap.parentKey, stateKeyMap.childKey, value, true, setOrderDetails, setErrors)
    }

    const handleCalculatePrice = (serviceInfo: ServiceInfo[]) => {
        const totalPrice = serviceInfo.reduce((sum, sel) => {
            const service = serviceData.find((s) => s.id === sel.id);
            if (service) {
                return sum + service.price * sel.value;
            }
            return sum;
        }, 0);
        return totalPrice
    }

    const handleTotalPriceCharges = (offerInfo: OfferingInfo) => {
        if (!offerInfo?.orderType) {
            setTotalCharges(0)
            return
        }
        const offeringIDs = offerInfo?.orderType === OrderType.PACKAGE ? offerInfo?.packageId : offerInfo?.services
        console.log(orderDetails)
        if (offerInfo?.orderType === OrderType.PACKAGE) {
            const filteredPackage = packageData.find((p) => p.id === offerInfo?.packageId);
            setTotalCharges((filteredPackage?.calculatedPrice ? handleCalculatePrice(filteredPackage?.serviceList) : filteredPackage?.price) || 0);
        }
        else if (offerInfo?.orderType === OrderType.SERVICE) {
            const serviceCharge = handleCalculatePrice(offerInfo?.services as ServiceInfo[])
            setTotalCharges(serviceCharge)
        }
    }


    useFocusEffect(
        useCallback(() => {
            getCustomerNameList();
            getOfferingDetails();

            return () => {
                setCustomerList([]);
                setOfferingList([]);
            };
        }, [])
    );

    useEffect(() => {
        // console.log(orderDetails)
    }, [orderDetails])



    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <BackHeader screenName="Create Order" />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className='flex justify-between items-center flex-row'>
                    <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                        <Text style={[globalStyles.heading2Text]}>Create Order</Text>
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
                                        {index != 3 && <Divider style={styles.divider} />}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {currStep == 0 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: "#ECFEFF", padding: hp("2%") }}>
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
                            <CustomFieldsComponent infoFields={userInfo} cardStyle={{ padding: wp("2%") }} />

                        </Card>
                    )}

                    {currStep == 1 && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: "#FDF2F8", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Event Details
                                    </Text>
                                </View>
                            </View>

                            {/* Body */}
                            <CustomFieldsComponent infoFields={eventInfo} cardStyle={{ padding: wp("2%") }} />
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
                                <View style={{ backgroundColor: "#ECFDF5", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                        <Text
                                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                        >
                                            Choose Package
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <View className='flex flex-row justify-between items-center p-4'>
                                        <FlatList
                                            horizontal
                                            data={packageData}
                                            renderItem={({ item }) => <PackageComponent pkg={item} isSelected={item?.id == orderDetails?.offeringInfo?.packageId || false} handleCalculatePrice={handleCalculatePrice} handleCheckboxChange={handleCheckboxChange} handleTotalPriceCharges={handleTotalPriceCharges} />}
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
                                <View style={{ backgroundColor: "#ECFDF5", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                        <Text
                                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                        >
                                            Services
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginHorizontal: wp('2%'), paddingVertical: hp('2%') }}>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('1%') }}>
                                        <FlatList
                                            data={serviceData}
                                            renderItem={({ item, index }) => <ServiceComponent eventType={item} index={index} offeringInfo={orderDetails?.offeringInfo} isSelected={orderDetails?.offeringInfo?.services?.some((s) => s.id == item.id) || false} handleTotalPriceCharges={handleTotalPriceCharges} handleCheckboxChange={handleCheckboxChange} />}
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
                            <View style={{ backgroundColor: "#FDF2F8", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Template Builder
                                    </Text>
                                </View>
                            </View>
                            <TemplateBuilderComponent quotationFields={quotationFields} />
                        </Card>
                    )

                    }
                    <View className='flex flex-row gap-2 justify-between items-center' style={{ marginBottom: hp('15%'), marginVertical: hp('2%') }}>
                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={[globalStyles.purpleBackground]}
                            isDisabled={loading || Object.keys(errors).length > 0}
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
                            isDisabled={loading || Object.keys(errors).length > 0}
                            onPress={handleNext}
                        >
                            <ButtonText style={globalStyles.buttonText}>
                                Next
                            </ButtonText>
                            <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Card style={[globalStyles.cardShadowEffect, styles.bottomCard]}>
                <View style={{ margin: hp("1%") }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Total Price: ₹ {totalCharges}</Text>
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