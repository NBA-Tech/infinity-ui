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
import { getCountries, getStates, isAllLoadingFalse, patchState } from '@/src/utils/utils';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { SelectItem } from '@/components/ui/select';
import { CustomerApiResponse, CustomerBasicInfo, CustomerBillingInfo, CustomerModel, GENDER, LEADSOURCE, STATUS } from '@/src/types/customer/customer-type';
import { ApiGeneralRespose, FormFields, RootStackParamList } from '@/src/types/common';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { addNewCustomerAPI, getCustomerDetailsAPI, updateCustomerAPI } from '@/src/api/customer/customer-api-service';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { Card } from '@/components/ui/card';
import BackHeader from '@/src/components/back-header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
    const { customerID } = route.params || {};
    const { isDark } = useContext(ThemeToggleContext);
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
        firstName: {
            parentKey: "customerBasicInfo",
            key: "firstName",
            label: "First Name",
            placeholder: "Enter First Name",
            icon: <Feather name="user" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBasicInfo?.firstName ?? "",
            onChange: (value: string) => {
                patchState('customerBasicInfo', 'firstName', value, true, setCustomerDetails, setErrors)
            }
        },
        lastName: {
            key: "lastName",
            label: "Last Name",
            placeholder: "Enter Last Name",
            icon: <Feather name="camera" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            value: customerDetails?.customerBasicInfo?.lastName ?? "",
            onChange: (value: string) => {
                patchState('customerBasicInfo', 'lastName', value, true, setCustomerDetails, setErrors)
            }
        },
        mobileNumber: {
            key: "mobileNumber",
            label: "Mobile Number",
            placeholder: "Enter Mobile Number",
            icon: <Feather name="phone" size={wp('5%')} color="#8B5CF6" />,
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
            key: "email",
            label: "Email",
            placeholder: "Enter Email",
            icon: <Feather name="mail" size={wp('5%')} color="#8B5CF6" />,
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
        gender: {
            key: "gender",
            label: "Gender",
            placeholder: "Enter Gender",
            icon: <Feather name="gender-male" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            isLoading: loadingProvider.intialLoading,
            dropDownItems: Object.values(GENDER).map((gender) => ({
                label: gender,
                value: gender as GENDER,
            })),
            value: customerDetails?.customerBasicInfo?.gender,
            onChange: (value: GENDER) => {
                patchState('customerBasicInfo', 'gender', value, false, setCustomerDetails, setErrors)
            }
        },
        leadSource: {
            key: "leadSource",
            label: "LeadSource",
            placeholder: "Enter leadSource",
            icon: <Feather name="gender-male" size={wp('5%')} color="#8B5CF6" />,
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
            key: "notes",
            label: "Notes",
            placeholder: "Enter Notes",
            icon: <Feather name="file-text" size={wp('5%')} color="#8B5CF6" />,
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
    }), [customerDetails]);

    const billingInfoFields: FormFields = {
        street: {
            key: "street",
            label: "Street/Landmark",
            placeholder: "Enter Street",
            icon: <Feather name="home" size={wp('5%')} color="#8B5CF6" />,
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
            key: "city",
            label: "City",
            placeholder: "Enter City",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
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
            key: "country",
            label: "Country",
            placeholder: "Enter Country",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
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
            key: 'state',
            label: "State",
            placeholder: "Enter State",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
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
            key: "zipCode",
            label: "Zip Code",
            placeholder: "Enter Zip Code",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
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

    }

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
        setloadingProvider({ ...loadingProvider, saveLoading: true });
        const userId = getItem("USERID")
        if (!userId) {
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found Please Logout and Login again",
            })
        }
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
            if (customerID) {
                updateCustomerMetaInfoList(toCustomerMetaModelList([customerDetails]))
                updateCustomerDetailsInfo(customerDetails)
            }
            else {
                customerDetails.customerID = addNewCustomerResponse.data
                addCustomerDetailsInfo(customerDetails)
                updateCustomerMetaInfoList(toCustomerMetaModelList([customerDetails]))

            }
            setloadingProvider({ ...loadingProvider, saveLoading: false });
            navigation.navigate("Success", { text: addNewCustomerResponse?.message ?? "Customer Created Successfully" })
            setCustomerDetails({
                userId: "",
                leadSource: undefined,
                customerBasicInfo: {} as CustomerBasicInfo,
                customerBillingInfo: {} as CustomerBillingInfo
            } as CustomerModel)
        }
    }

    useEffect(() => {
        console.log(customerID)
        if (customerID) {
            getCustomerDetails(customerID)
        }
    }, [customerID])


    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader screenName="Create Customer" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp("5%") }} // some spacing at bottom
                showsVerticalScrollIndicator={false}
            >

                <View>
                    <View style={{ marginVertical: hp('1%') }} className='flex justify-between items-center flex-row'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>Create Customer</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                        </View>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={handleSubmit} isDisabled={!isAllLoadingFalse(loadingProvider) || Object.keys(errors).length > 0}>
                            {loadingProvider.saveLoading && (
                                <ButtonSpinner color={"#fff"} size={wp("4%")} />
                            )
                            }
                            <Feather name="save" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>{loadingProvider.saveLoading ? "Saving..." : "Save"}</ButtonText>
                        </Button>

                    </View>
                    <View className='flex flex-col'>

                        <Card style={[globalStyles.cardShadowEffect, { padding: 0 }]}>
                            <View style={[styles.accordionHeader, { backgroundColor: isDark ? '#273449' : '#EFF6FF' }]}>
                                <View className='flex flex-row  items-start justify-start'>
                                    <Feather name="user" size={wp('5%')} color="#8B5CF6" />
                                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor, { marginLeft: wp('2%') }]}>Basic Information</Text>

                                </View>
                            </View>
                            <View>
                                <CustomFieldsComponent infoFields={basicInfoFields} errors={errors} cardStyle={{ padding: wp('2%') }} />
                            </View>

                        </Card>
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0, marginTop: hp('2%') }]}>
                            <View style={[styles.accordionHeader, { backgroundColor: isDark ? '#273449' : '#EFF6FF' }]}>
                                <View className='flex flex-row  items-start justify-start'>
                                    <Feather name="credit-card" size={wp('5%')} color="#8B5CF6" />
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