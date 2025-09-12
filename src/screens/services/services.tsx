import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Switch, ScrollView } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import Feather from 'react-native-vector-icons/Feather';
import ServiceTab from './service-tab';
import PackageTab from './package-tab';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Modal from "react-native-modal";
import { ApiGeneralRespose, FormFields } from '@/src/types/common';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { OFFERINGTYPE, PackageModel, ServiceModel, STATUS } from '@/src/types/offering/offering-type';
import { patchState, validateValues } from '@/src/utils/utils';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { addNewServiceAPI } from '@/src/api/offering/offering-service';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
    tabContainer: {
        width: wp('45%'),
        paddingVertical: hp('1.5%'),  // vertical padding for touch
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,        // only bottom border
        borderBottomColor: 'transparent', // default (inactive tab)
    },
    activeTab: {
        borderBottomColor: '#7C3AED', // purple color for active tab
    },
    sheetContent: {
        flex: 1,
        padding: wp("4%"),
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("8%"),
        borderTopRightRadius: wp("8%"),
    },

})
const services = () => {
    const globalStyles = useContext(StyleContext);
    const [activeTab, setActiveTab] = useState('services');
    const [isOpen, setIsOpen] = useState(false);
    const { getItem } = useDataStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const showToast = useToastMessage();
    const [loadingProvider, setloadingProvider] = useState<"service" | "package" | null>(null)
    const [servieDetails, setServiceDetails] = useState<ServiceModel>({
        customerID: getItem("USERID") as string,
        status: STATUS.ACTIVE,
        type: OFFERINGTYPE.SERVICE,
        serviceName: "",
        description: "",
        price: 0,
        icon: "",
        tags: [],
    })
    const [packageDetails, setPackageDetails] = useState<PackageModel>({
        customerID: getItem("USERID") as string,
        status: STATUS.ACTIVE,
        type: OFFERINGTYPE.OFFERING,
        packageName: "",
        description: "",
        calculatedPrice: false,
        price: 0,
        additionalNotes: "",
        serviceList: [],
        icon: "",
        tags: [],
    })

    const CustomFieldWithSwitch = () => {

        return (
            <View>
                <View className='flex flex-col'>
                    <View className='flex flex-row justify-between items-center'>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Custom Price</Text>

                        </View>
                        <View className='flex flex-row items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Use calculated price</Text>
                            <Switch
                                trackColor={{ false: "#d4d4d4", true: "#8B5CF6" }}
                                thumbColor="#fafafa"
                                value={packageDetails.calculatedPrice}
                                ios_backgroundColor="#d4d4d4"
                                onValueChange={(value) =>
                                    setPackageDetails((prev) => ({
                                        ...prev,
                                        calculatedPrice: value,
                                    }))
                                }
                            />
                        </View>

                    </View>
                    {!packageDetails.calculatedPrice && (
                        <View>
                            <Input size="lg">
                                <InputSlot>
                                    <Feather name="dollar-sign" size={wp('5%')} color="#8B5CF6" />
                                </InputSlot>
                                <InputField
                                    type="text"
                                    placeholder={"Enter Price"}
                                    value={"0"}
                                    keyboardType="numeric"
                                    onChangeText={(value) => {
                                        setPackageDetails((prev) => ({
                                            ...prev,
                                            price: parseFloat(value),
                                        }))
                                    }}
                                />
                            </Input>

                        </View>
                    )

                    }

                </View>

            </View>
        )
    }
    const packageInfoFields: FormFields = {
        packageName: {
            key: "packageName",
            label: "Package Name",
            placeholder: "Enter Package Name",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            value: packageDetails.packageName,
            isRequired: true,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'packageName', value, true, setPackageDetails, setErrors)
            },
        },
        description: {
            key: "description",
            label: "Description",
            placeholder: "Enter Description",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            value: packageDetails.description,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: true,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'description', value, true, setPackageDetails, setErrors)
            }
        },
        serviceList: {
            key: "serviceList",
            label: "Choose Services",
            type: "multi-select", // 👈 New type
            placeholder: "Select Services",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            dropDownItems: [
                { label: "Reading", value: "reading" },
                { label: "Traveling", value: "traveling" },
                { label: "Gaming", value: "gaming" },
                { label: "Music", value: "music" },
            ],
            value: packageDetails.serviceList,
            isRequired: true,
            isDisabled: false,
            onChange: (val) => console.log("Selected:", val),
        },
        packageIcon: {
            key: "packageIcon",
            label: "Package Icon",
            placeholder: "Enter Package Icon",
            icon: <Feather name="gender-male" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-full",
            value: packageDetails.icon,
            isRequired: false,
            isDisabled: false,
            dropDownItems: [
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "Website", value: "website" },
            ],
            onChange(value: string) {
                patchState("", 'icon', value, true, setPackageDetails, setErrors)
            }
        },
        price: {
            key: "price",
            label: "",
            isRequired: true,
            type: "custom",
            customComponent: <CustomFieldWithSwitch />
        },
        additionalNotes: {
            key: "additionalNotes",
            label: "Additional Notes (Optional)",
            placeholder: "Enter Additional Notes",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            value: packageDetails.additionalNotes,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'additionalNotes', value, true, setPackageDetails, setErrors)
            }

        },
        tags: {
            key: "tags",
            type: "chips",
            label: "Select Tags",
            value: packageDetails.tags,
            dropDownItems: [
                { label: "React Native", value: "rn" },
                { label: "Java", value: "java" },
                { label: "AI", value: "ai" },
            ],
            onChange(value: string[]) {
                patchState("", 'tags', value, true, setPackageDetails, setErrors)
            },
        },
        status: {
            key: "status",
            label: "Active Status",
            type: "switch",
            style: "w-full",
            value: packageDetails.status === STATUS.ACTIVE,
            onChange(value: boolean) {
                patchState("", 'status', value ? STATUS.ACTIVE : STATUS.INACTIVE, false, setPackageDetails, setErrors)
            },
        },
    }

    const serviceInfoFields: FormFields = {
        serviceName: {
            key: "serviceName",
            label: "Service Name",
            placeholder: "Enter Service Name",
            icon: <Feather name="edit" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            value: servieDetails.serviceName,
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'serviceName', value, true, setServiceDetails, setErrors)
            },
        },
        description: {
            key: "description",
            label: "Description",
            placeholder: "Enter Description",
            icon: <Feather name="file-text" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            value: servieDetails.description,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'description', value, true, setServiceDetails, setErrors)
            }
        },
        price: {
            key: "price",
            label: "Price",
            placeholder: "Enter Price",
            icon: <Feather name="dollar-sign" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            value: servieDetails.price,
            isRequired: true,
            isDisabled: false,
            onChange(value: number) {
                patchState("", 'price', value, true, setServiceDetails, setErrors, servieDetails.price <= 0 ? "Please enter valid price" : "This field is required")
            }
        },
        serviceIcon: {
            key: "serviceIcon",
            label: "Service Icon",
            placeholder: "Select Icon",
            icon: <Feather name="image" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: servieDetails.icon,
            dropDownItems: [
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "Website", value: "website" },
            ],
            onChange(value: string) {
                patchState("", 'icon', value, true, setServiceDetails, setErrors)
            }
        },
        tags: {
            key: "tags",
            type: "chips",
            label: "Select Tags",
            value: servieDetails.tags,
            dropDownItems: [
                { label: "React Native", value: "rn" },
                { label: "Java", value: "java" },
                { label: "AI", value: "ai" },
            ],
            onChange(value: string[]) {
                patchState("", 'tags', value, true, setServiceDetails, setErrors)
            },
        },
        status: {
            key: "status",
            label: "Active Status",
            type: "switch",
            style: "w-full",
            value: servieDetails.status === STATUS.ACTIVE,
            onChange(value: boolean) {
                patchState("", 'status', value ? STATUS.ACTIVE : STATUS.INACTIVE, false, setServiceDetails, setErrors)
            },
        },
    };

    const handleSaveService = async () => {
        const currDetails = activeTab === "services" ? servieDetails : packageDetails
        const currFields = activeTab === "services" ? serviceInfoFields : packageInfoFields
        let addNewServiceResponse: ApiGeneralRespose;

        console.log(currDetails, currFields)
        return;

        const validateInput = validateValues(currDetails, currFields)
        if (!validateInput.success) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validateInput.message ?? "Something went wrong",
            })
        }
        if (!currDetails?.customerID) {
            showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found Please Logout and Login again",
            })
            return
        }
        setloadingProvider(activeTab)
        if (activeTab == "services") {
            addNewServiceResponse = await addNewServiceAPI(servieDetails)
        }
        else {
            addNewServiceResponse = await addNewServiceAPI(packageDetails)
        }

        if (!addNewServiceResponse?.success) {
            showToast({
                type: "error",
                title: "Error",
                message: addNewServiceResponse?.message ?? "Something went wrong",
            })
        }
        else {
            showToast({
                type: "success",
                title: "Success",
                message: addNewServiceResponse?.message ?? "Successfully created service",
            })
        }
        setloadingProvider(null)
        console.log(servieDetails)
    }

    return (
        <SafeAreaView style={globalStyles.appBackground} >
            <BackHeader screenName='Services' />
            <View>
                <View className='bg-[#fff]' style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text]}>Services & Package</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                        </View>
                    </View>

                    <View
                        className="flex flex-row items-center gap-3"
                        style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Services/Packages"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />

                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>

                    <View className='flex flex-row justify-between items-center' style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                        <TouchableOpacity style={[styles.tabContainer, activeTab === 'services' && styles.activeTab]} onPress={() => setActiveTab('services')}>
                            <Text style={[globalStyles.normalBoldText]}>Services</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.tabContainer, activeTab === 'packages' && styles.activeTab]} onPress={() => setActiveTab('packages')}>
                            <Text style={[globalStyles.normalBoldText]}>Packages</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='flex flex-row justify-between items-center' style={{ margin: hp('2%') }}>
                    <View>
                        <Text style={[globalStyles.sideHeading]}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}(5)</Text>
                    </View>
                    <View>
                        <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={() => setIsOpen(true)}>
                            <Feather name="plus" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</ButtonText>
                        </Button>
                    </View>

                </View>

                {activeTab === 'services' && <ServiceTab />}
                {activeTab === 'packages' && <PackageTab />}
            </View>
            <Modal
                isVisible={isOpen}
                onBackdropPress={() => setIsOpen(false)}
                onBackButtonPress={() => setIsOpen(false)}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp("2%") }}
                >
                    <View className="rounded-t-2xl bg-white max-h-[85%] p-4">
                        {/* Header */}
                        <View className="flex flex-col items-start mb-4">
                            <Text style={[globalStyles.blackTextColor, globalStyles.subHeadingText]}>
                                {activeTab === "services" ? "Add Services" : "Add Package"}
                            </Text>
                            <Text style={[globalStyles.blackTextColor, globalStyles.normalText]}>
                                {activeTab === "services"
                                    ? "Create Services Details"
                                    : "Create Package Details"}
                            </Text>
                        </View>


                        <View style={{ marginVertical: hp("1%") }}>
                            <CustomFieldsComponent
                                infoFields={activeTab === "services" ? serviceInfoFields : packageInfoFields}
                                errors={errors}
                            />
                        </View>

                        {/* Footer */}
                        <View className="flex flex-row justify-end items-center mt-4">
                            <Button
                                size="lg"
                                variant="solid"
                                action="primary"
                                style={[globalStyles.transparentBackground, { marginHorizontal: wp("2%") }]}
                                onPress={() => setIsOpen(false)}
                            >
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>
                                    Cancel
                                </ButtonText>
                            </Button>

                            <Button
                                size="lg"
                                variant="solid"
                                action="primary"
                                style={[globalStyles.purpleBackground, { marginHorizontal: wp("2%") }]}
                                onPress={handleSaveService}
                                isDisabled={Object.keys(errors).length > 0 || loadingProvider !== null}
                            >
                                {loadingProvider !== null && (
                                    <ButtonSpinner color={"#fff"} size={wp("4%")} />
                                )}
                                <Feather name="save" size={wp("5%")} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Save</ButtonText>
                            </Button>
                        </View>
                    </View>
                </ScrollView>

            </Modal>
        </SafeAreaView >
    );
};

export default services;