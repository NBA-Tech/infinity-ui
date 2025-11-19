import React, { JSX, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Header from '@/src/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientCard from '@/src/utils/gradient-card';
import { Divider } from '@/components/ui/divider';
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionTitleText,
    AccordionContentText,
    AccordionIcon,
    AccordionContent,
} from "@/components/ui/accordion"
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { checkValidEmail, getCountries, getStates, isAllLoadingFalse, navigateToSuccess, patchState, validateValues } from '@/src/utils/utils';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { SelectItem } from '@/components/ui/select';
import { CustomerApiResponse, CustomerBasicInfo, CustomerBillingInfo, CustomerModel, LEADSOURCE, STATUS } from '@/src/types/customer/customer-type';
import { ApiGeneralRespose, FormFields, RootStackParamList } from '@/src/types/common';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { addNewCustomerAPI, getCustomerDetailsAPI, updateCustomerAPI } from '@/src/api/customer/customer-api-service';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { Card } from '@/components/ui/card';
import BackHeader from '@/src/components/back-header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ACTIVITY_TYPE, UserActivity } from '@/src/types/activity/user-activity-type';
import { createNewActivityAPI } from '@/src/services/activity/user-activity-service';
import { useReloadContext } from '@/src/providers/reload/reload-context';
const styles = StyleSheet.create({

    accordionHeader: {
        backgroundColor: '#EFF6FF',
        height: hp('8%'),
        padding: wp('3%'),
    },
    cardContainer: {
        borderRadius: wp('2%'),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp('1%'),
    },
})



type Props = NativeStackScreenProps<RootStackParamList, "CreateCustomer">;
const CreateCustomer = ({ navigation, route }: Props) => {
    const globalStyles = useContext(StyleContext);
    const { customerID, returnTo = { tab: 'Customer', screen: 'CustomerList' } } = route.params || {};

    const { isDark } = useContext(ThemeToggleContext);
    const { triggerReloadCustomer } = useReloadContext()
    const [customerDetails, setCustomerDetails] = useState<CustomerModel>({
        userId: "",
        leadSource: undefined,
        customerBasicInfo: {} as CustomerBasicInfo,
        customerBillingInfo: {} as CustomerBillingInfo

    } as CustomerModel);
    const { getItem } = useDataStore();
    const showToast = useToastMessage();
    const [loadingProvider, setloadingProvider] = useState({ intialLoading: false, saveLoading: false });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { addCustomerDetailsInfo, updateCustomerMetaInfoList, updateCustomerDetailsInfo } = useCustomerStore();


    const basicInfoFields: FormFields = useMemo(() => ({
        name: {
            parentKey: "customerBasicInfo",
            key: "name",
            label: "Full Name",
            placeholder: "Eg: John",
            icon: <Feather name="user" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBasicInfo?.name ?? "",
            onChange: (value: string) => {
                patchState('customerBasicInfo', 'name', value, true, setCustomerDetails, setErrors)
            }
        },
        mobileNumber: {
            parentKey: "customerBasicInfo",
            key: "mobileNumber",
            label: "Mobile Number",
            placeholder: "Eg: 1234567890",
            icon: <Feather name="phone" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBasicInfo?.mobileNumber ?? "",
            onChange: (value: string) => {
                patchState('customerBasicInfo', 'mobileNumber', value, true, setCustomerDetails, setErrors)
            }
        },
        email: {
            parentKey: "customerBasicInfo",
            key: "email",
            label: "Email",
            placeholder: "Eg: D6f5U@example.com",
            icon: <Feather name="mail" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "email",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBasicInfo?.email ?? "",
            onChange: (value: string) => {
                patchState('customerBasicInfo', 'email', value, true, setCustomerDetails, setErrors)
            }
        },
        leadSource: {
            key: "leadSource",
            label: "Lead Source",
            placeholder: "Eg: Referral",
            icon: <Feather name="link" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            dropDownItems: Object.values(LEADSOURCE).map((lead) => ({
                label: lead,
                value: lead as LEADSOURCE,
            })),
            value: customerDetails?.leadSource,
            onChange: (value: LEADSOURCE) => {
                patchState("", 'leadSource', value, false, setCustomerDetails, setErrors)
            }
        },
        notes: {
            parentKey: "customerBasicInfo",
            key: "notes",
            label: "Notes",
            placeholder: "Eg: Special instructions for the customer",
            icon: <Feather name="file-text" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            value: customerDetails?.customerBasicInfo?.notes ?? "",
            onChange: (value: string) => {
                patchState('customerBasicInfo', 'notes', value, false, setCustomerDetails, setErrors)
            }
        },
    }), [customerDetails, loadingProvider]);

    const billingInfoFields: FormFields = useMemo(() => ({
        street: {
            parentKey: "customerBillingInfo",
            key: "home",
            label: "Street/Landmark",
            placeholder: "eg: 123 Main Street",
            icon: <Feather name="home" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBillingInfo?.street ?? "",
            onChange: (value: string) => {
                patchState('customerBillingInfo', 'street', value, false, setCustomerDetails, setErrors)
            }

        },
        city: {
            parentKey: "customerBillingInfo",
            key: "city",
            label: "City",
            placeholder: "Eg: New York",
            icon: <MaterialIcons name="location-city" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBillingInfo?.city ?? "",
            onChange: (value: string) => {
                patchState('customerBillingInfo', 'city', value, false, setCustomerDetails, setErrors)
            }
        },
        country: {
            parentKey: "customerBillingInfo",
            key: "country",
            label: "Country",
            placeholder: "Eg: United States",
            icon: <MaterialIcons name="public" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBillingInfo?.country ?? "",
            dropDownItems: getCountries().map((country, index) => ({
                label: country.name,
                value: country.isoCode
            })),
            onChange: (value: string) => {
                patchState('customerBillingInfo', 'country', value, false, setCustomerDetails, setErrors)
            }
        },
        state: {
            parentKey: "customerBillingInfo",
            key: 'state',
            label: "State *Note : Please select country first",
            placeholder: "Eg: New York",
            icon: <Feather name="map-pin" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBillingInfo?.state ?? "",
            dropDownItems: getStates(customerDetails?.customerBillingInfo?.country).map((state, index) => ({
                label: state.name,
                value: state.isoCode
            })),
            onChange: (value: string) => {
                patchState('customerBillingInfo', 'state', value, false, setCustomerDetails, setErrors)
            }
        },
        zipCode: {
            parentKey: "customerBillingInfo",
            key: "zipCode",
            label: "Zip Code",
            placeholder: "Eg: 12345",
            icon: <Feather name="hash" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBillingInfo?.zipCode ?? "",
            onChange: (value: string) => {
                patchState('customerBillingInfo', 'zipCode', value, false, setCustomerDetails, setErrors)
            }
        },

    }), [customerDetails, loadingProvider]);

    const getCustomerDetails = async (customerID: string) => {
        setloadingProvider({ ...loadingProvider, intialLoading: true });
        const getCustomerDetailsResponse: CustomerApiResponse = await getCustomerDetailsAPI(customerID)
        if (!getCustomerDetailsResponse?.success) {
            showToast({
                type: "error",
                title: "Error",
                message: getCustomerDetailsResponse?.message ?? "Something went wrong",
            })
            return
        }
        setCustomerDetails(getCustomerDetailsResponse?.data as CustomerModel)
        setloadingProvider({ ...loadingProvider, intialLoading: false });
    }

    const handleSubmit = async () => {
        try {
            const basicValidateValues = validateValues(customerDetails, basicInfoFields)
            const billingValidateValues = validateValues(customerDetails, billingInfoFields)
            if (!basicValidateValues?.success || !billingValidateValues?.success) {
                showToast({
                    type: "warning",
                    title: "Oops!!",
                    message: (basicValidateValues?.message ?? billingValidateValues?.message) ?? "Please fill all the required fields",
                })
                return
            }
            const userId = getItem("USERID")
            if (!userId) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: "UserID is not found Please Logout and Login again",
                })
            }
            setloadingProvider({ ...loadingProvider, saveLoading: true });
            customerDetails.userId = userId;
            let addNewCustomerResponse: ApiGeneralRespose;
            if (customerID) {
                addNewCustomerResponse = await updateCustomerAPI(customerDetails)
            }
            else {
                addNewCustomerResponse = await addNewCustomerAPI(customerDetails)

            }
            if (!addNewCustomerResponse?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message: addNewCustomerResponse?.message ?? "Something went wrong",
                })
            }
            else {
                showToast({
                    type: "success",
                    title: "Success",
                    message: addNewCustomerResponse?.message ?? "Successfully created customer",
                })
                triggerReloadCustomer()
                if (customerID) {
                    updateCustomerMetaInfoList(toCustomerMetaModelList([customerDetails]))
                    updateCustomerDetailsInfo(customerDetails)
                    // const activityPayload: UserActivity = {
                    //     userId: userId,
                    //     activityType: ACTIVITY_TYPE.INFO,
                    //     activityTitle: "Updated Cutomer",
                    //     activityMessage: `Updated Details for Customer ${customerDetails.customerBasicInfo?.firstName} ${customerDetails.customerBasicInfo?.lastName}`,
                    // }
                    // createNewActivityAPI(activityPayload)

                }
                else {
                    customerDetails.customerID = addNewCustomerResponse.data
                    addCustomerDetailsInfo(customerDetails)
                    updateCustomerMetaInfoList(toCustomerMetaModelList([customerDetails]))
                    // createNewActivityAPI(({
                    //     userId: userId,
                    //     activityType: ACTIVITY_TYPE.SUCCESS,
                    //     activityTitle: "Created Cutomer",
                    //     activityMessage: `Created New Customer ${customerDetails.customerBasicInfo?.firstName} ${customerDetails.customerBasicInfo?.lastName}`,
                    // }))

                }
                setloadingProvider({ ...loadingProvider, saveLoading: false });
                navigateToSuccess(navigation, returnTo.tab, returnTo.screen, addNewCustomerResponse?.message ?? "Customer Created Successfully")
                setCustomerDetails({
                    userId: "",
                    leadSource: undefined,
                    customerBasicInfo: {} as CustomerBasicInfo,
                    customerBillingInfo: {} as CustomerBillingInfo
                } as CustomerModel)
            }
        }
        finally {
            setloadingProvider({ ...loadingProvider, saveLoading: false });
        }
    }

    useEffect(() => {
        if (customerID) {
            getCustomerDetails(customerID)
        }
    }, [customerID])


    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader screenName={customerID ? "Update Customer" : "Create Customer"}/>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp("5%") }} // some spacing at bottom
                showsVerticalScrollIndicator={false}
            >

                <View>
                    <View style={{ marginVertical: hp('1%') }} className='flex justify-between items-center flex-row'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>{customerID ? "Update Customer" : "Create Customer"}</Text>
                            <View style={[{ width: wp('25%') },globalStyles.glassBackgroundColor]}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </View>
                        </View>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.buttonColor, { marginHorizontal: wp('2%') }]} onPress={handleSubmit} isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}>
                            {loadingProvider.saveLoading && (
                                <ButtonSpinner color={"#fff"} size={wp("4%")} />
                            )
                            }
                            <Feather name="save" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>{loadingProvider.saveLoading ? "Saving..." : "Save"}</ButtonText>
                        </Button>

                    </View>
                    <View >

                        <Card style={[{ padding:0}]}>
                            <View style={[styles.accordionHeader,{ backgroundColor: isDark ? '#273449' : '#D0E2FF' }]}>
                                <View className='flex flex-row  items-start justify-start'>
                                    <Feather name="user" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor, { marginLeft: wp('2%') }]}>Basic Information</Text>

                                </View>
                            </View>
                            <View>
                                <CustomFieldsComponent infoFields={basicInfoFields} errors={errors} cardStyle={{ padding: wp('2%') }} />
                            </View>

                        </Card>
                        <Card style={[{ padding:0,marginTop:hp('4%')}]}>
                            <View style={[styles.accordionHeader, { backgroundColor: isDark ? '#273449' : '#D0E2FF' }]}>
                                <View className='flex flex-row  items-start justify-start'>
                                    <Feather name="credit-card" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor, { marginLeft: wp('2%') }]}>Billing Information</Text>

                                </View>
                            </View>
                            <View>
                                <CustomFieldsComponent infoFields={billingInfoFields} errors={errors} cardStyle={{ padding: wp('2%') }} />
                            </View>

                        </Card>


                    </View>

                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

export default CreateCustomer;