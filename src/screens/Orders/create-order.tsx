import BackHeader from '@/src/components/back-header';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
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
import { patchState } from '@/src/utils/utils';
import { EventInfo, OrderBasicInfo, OrderModel } from '@/src/types/order/order-type';
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
    packageContainer: {
        borderRadius: wp("2%"),
        borderWidth: wp("0.4%"),
        borderColor: "#E5E5E5",
        padding: wp("2%"),
        width: wp('50%'),
        height: hp('30%'),
        marginHorizontal: wp("2%"),
    }
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
    const showToast = useToastMessage();
    const { getCustomerMetaInfoList, setCustomerMetaInfoList } = useCustomerStore();
    const [orderDetails, setOrderDetails] = useState<OrderModel>({
        userId: "",
        orderBasicInfo: {} as OrderBasicInfo,
        eventInfo: {} as EventInfo
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currStep, setCurrStep] = useState(2);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState({
        date: false,
        time: false
    })

    const getCustomerNameList = async () => {
        const customerMetaData = getCustomerMetaInfoList();
        console.log(customerMetaData)

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
        const filterData: CustomerOption[] = metaList.map((customer) => ({
            label: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
            value: customer.customerID ?? "",
        }));

        setCustomerMetaInfoList(metaList);
        setCustomerList(filterData);
    };

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
            value: orderDetails?.orderBasicInfo.customerID,
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
            value: orderDetails?.orderBasicInfo?.pointOfContact,
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
            value: orderDetails?.orderBasicInfo?.specialInstructions,
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
            value: orderDetails?.eventInfo?.eventTitle,
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
            value: orderDetails?.eventInfo?.eventDate,
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
            value: orderDetails?.eventInfo?.eventTime,
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
            value: orderDetails?.eventInfo?.numberOfHours,
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
            value: orderDetails?.eventInfo?.eventLocation,
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
    const formOrders = [userInfo, eventInfo, eventTypes]

    const handleNext = () => {
        console.log(orderDetails)
        let isError: boolean = false
        Object.keys(formOrders[currStep]).forEach((key) => {
            if (isError) return
            if (formOrders[currStep][key].isRequired && orderDetails && !orderDetails[formOrders[currStep][key].parentKey][formOrders[currStep][key].key]) {
                isError = true
                showToast({
                    message: `Please enter ${formOrders[currStep][key].label}`,
                    type: "warning",
                    title: "Oops!"
                })
                return
            }
        })
        if (!isError) setCurrStep(currStep + 1);

    }

    const handleEventChange = (value: any, isSelected: boolean) => {
        patchState('eventInfo', 'eventType', value, true, setOrderDetails, setErrors)
    }


    useFocusEffect(
        useCallback(() => {
            getCustomerNameList();

            return () => {
                setCustomerList([]);
            };
        }, [])
    );

    useEffect(() => {
        console.log(orderDetails)
    }, [orderDetails])

    const PackageCard = () => (
        <View style={styles.packageContainer}>
            <View>
                <View className='flex flex-col items-center justify-center'>
                    <GradientCard
                        colors={["#9CA3AF", "#9CA3AF", "#9CA3AF"]}
                        style={{
                            padding: wp("2%"),
                            minWidth: wp("9%"),
                            minHeight: wp("9%"),
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Feather name="star" size={wp("5%")} color="white" />
                    </GradientCard>
                    <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Basic</Text>
                    <Text style={[globalStyles.normalTextColor, globalStyles.smallText, { flexWrap: 'wrap' }]}>Essentails services and their cost are the things you need to know</Text>
                    <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText, { color: 'green' }]}>Rs. 1000</Text>

                </View>
                <View className="flex flex-col items-start justify-start gap-2">
                    <View className="flex flex-row items-center gap-2">
                        <Feather name="check-circle" size={wp("3%")} color="#06B6D4" />
                        <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                            Pre-Wedding PhotoShoot
                        </Text>
                    </View>
                    <View className="flex flex-row items-center gap-2">
                        <Feather name="check-circle" size={wp("3%")} color="#06B6D4" />
                        <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                            Pre-Wedding PhotoShoot
                        </Text>
                    </View>
                </View>
            </View>

        </View>
    )

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
                            <View style={{ marginLeft: wp('5%') }}>

                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Event Type</Text>

                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('3%') }}>
                                    {Object.values(eventTypes).map((eventType, index) => (
                                        <CustomCheckBox key={index} onPress={handleEventChange} value={eventType.value} selected={eventType.selected}>
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
                                            data={[1, 2, 3]}
                                            renderItem={({ item }) => <PackageCard />}
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
                                            PhotoGraphy Services
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginLeft: wp('5%'), paddingVertical: hp('2%') }}>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('2%') }}>
                                        {Object.values(eventTypes).map((eventType, index) => (
                                            <CustomCheckBox
                                                key={index}
                                                selectedStyle={{ backgroundColor: '#ECFDF5', borderColor: '#06B6D4' }}
                                                styles={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                {/* Left side content */}
                                                <View className="flex flex-row items-center gap-2 flex-1">
                                                    <View>
                                                        <GradientCard
                                                            colors={["#F9FAFB", "#D1D5DB", "#9CA3AF"]}
                                                            style={{
                                                                padding: wp("2%"),
                                                                minWidth: wp("9%"),
                                                                minHeight: wp("9%"),
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {eventType.icon}
                                                        </GradientCard>
                                                    </View>

                                                    <View className="flex flex-col gap-0.5">
                                                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                                                            Pre-Wedding Shoot
                                                        </Text>
                                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                                            Romantic couple photoshoot at scenic locations
                                                        </Text>
                                                        <View className="flex flex-row gap-2">
                                                            <View className="flex flex-row items-center gap-1">
                                                                <Feather name="clock" size={wp('3%')} color="#000" />
                                                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>2 hours</Text>
                                                            </View>
                                                            <View className="flex flex-row items-center gap-1">
                                                                <Feather name="file" size={wp('3%')} color="#000" />
                                                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>3 photos</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                                {/* Price aligned to right */}
                                                <Text
                                                    style={[
                                                        globalStyles.normalBoldText,
                                                        { color: "#16A34A", marginLeft: "auto" } // green-600 tailwind shade
                                                    ]}
                                                >
                                                    ₹10,000
                                                </Text>
                                            </CustomCheckBox>

                                        ))

                                        }
                                    </View>
                                </View>
                            </Card>

                        </View>
                    )

                    }
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            padding: wp("2%"),
                            marginBottom: hp("15%"),
                        }}
                    >
                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={globalStyles.purpleBackground}
                            isDisabled={loading || Object.keys(errors).length > 0}
                            onPress={handleNext}
                        >
                            <ButtonText style={globalStyles.buttonText}>
                                Next : Service Details
                            </ButtonText>
                            <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Card style={[globalStyles.cardShadowEffect, styles.bottomCard]}>
                <View style={{ margin: hp("2%") }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <View className='flex flex-row gap-3'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>SubTotal : ₹1000</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Taz : ₹1000</Text>

                            </View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Total Price: ₹1000</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>1 service selected</Text>
                        </View>



                    </View>

                </View>
            </Card>
        </SafeAreaView>

    );
};

export default CreateOrder;