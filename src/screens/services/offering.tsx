import React, { act, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Switch, ScrollView } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-card';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import Feather from 'react-native-vector-icons/Feather';
import ServiceTab from './service-tab';
import PackageTab from './package-tab';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Modal from "react-native-modal";
import { ApiGeneralRespose, FormFields } from '@/src/types/common';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { OFFERINGTYPE, PackageModel, SERVICECATEGORY, ServiceModel, SERVICETYPE, STATUS } from '@/src/types/offering/offering-type';
import { clearState, generateRandomString, patchState, toTitleCase, validateValues } from '@/src/utils/utils';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { addNewServiceAPI, getOfferingListAPI, updateOfferingServiceAPI } from '@/src/api/offering/offering-service';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { Dropdown } from 'react-native-element-dropdown';
import CustomServiceAddComponent from '@/src/components/CustomAddComponent';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import Header from '@/src/components/header';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
    },
    tabContainer: {
        width: wp('25%'),
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
    dropdown: {
        height: hp("5%"),
        width: wp("40%"),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: wp("1%"),
        paddingHorizontal: wp("2%"),
    },
    dropdownContainer: {
        paddingHorizontal: wp("2%"),
    },

})

const OfferingCardSkeleton = () => (
    <View className='flex flex-col justify-between'>
        {[...Array(4)].map((_, index) => (
            <View key={index}>
                <Skeleton style={{ width: wp('95%'), height: hp('15%'), marginHorizontal: wp('2%') }} />
            </View>
        ))}
    </View>
);
const services = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { serviceData, packageData, loadOfferings, addService, updateService, addPackage, updatePackage } = useOfferingStore();
    const [filteredOfferingList, setFilteredOfferingList] = useState<ServiceModel[] | PackageModel[]>();
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState<"PACKAGE" | SERVICETYPE>(SERVICETYPE.SERVICE);
    const [isOpen, setIsOpen] = useState(false);
    const { getItem } = useDataStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const showToast = useToastMessage();
    const [loadingProvider, setloadingProvider] = useState<"PACKAGE" | SERVICETYPE | null>(null)
    const [servieDetails, setServiceDetails] = useState<ServiceModel>({
        customerID: getItem("USERID") as string,
        status: STATUS.ACTIVE,
        serviceCategory: null,
        type: OFFERINGTYPE.SERVICE,
        serviceName: "",
        description: "",
        price: 0,
    })
    const [packageDetails, setPackageDetails] = useState<PackageModel>({
        customerID: getItem("USERID") as string,
        status: STATUS.ACTIVE,
        type: OFFERINGTYPE.PACKAGE,
        packageName: "",
        description: "",
        calculatedPrice: false,
        price: 0,
        additionalNotes: "",
        serviceList: [],
    })

    const statInfo = [
        {
            id: SERVICETYPE.SERVICE,
            title: "Services",
            count: serviceData?.length,
            onPress: () => setActiveTab(SERVICETYPE.SERVICE)
        },
        {
            id: SERVICETYPE.DELIVERABLE,
            title: "Deliverables",
            count: serviceData?.filter((item) => item?.serviceType === SERVICETYPE.DELIVERABLE)?.length,
            onPress: () => setActiveTab(SERVICETYPE.DELIVERABLE)
        },
        {
            id: "PACKAGE",
            title: "Packages",
            count: packageData?.length,
            onPress: () => setActiveTab("PACKAGE")
        }
    ]


    const resetActiveDetails = () => {
        if (activeTab === "offering") {
            clearState<ServiceModel>(servieDetails, setServiceDetails, {
                status: STATUS.ACTIVE,
                type: OFFERINGTYPE.SERVICE,
                customerID: getItem("USERID") as string, // preserve userID if needed
            });
        } else {
            clearState<PackageModel>(packageDetails, setPackageDetails, {
                status: STATUS.ACTIVE,
                type: OFFERINGTYPE.PACKAGE,
                customerID: getItem("USERID") as string,
            });
        }
    };

    const handleEdit = (id: string) => {
        if (id == "") return;

        if (activeTab === "offering") {
            const filteredData: ServiceModel = serviceData?.find((item) => item.id === id) as ServiceModel;
            setServiceDetails(filteredData);
        } else {
            const filteredData: PackageModel = packageData?.find((item) => item.id === id) as PackageModel;
            setPackageDetails(filteredData);
        }
        setIsOpen(true);

    }

    const handleServiceChange = (data: any) => {
        setPackageDetails((prev) => ({
            ...prev,
            serviceList: data
        }))
    }

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
                            <Input size="lg" variant='rounded'>
                                <InputSlot>
                                    <Feather name="dollar-sign" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                                </InputSlot>
                                <InputField
                                    type="text"
                                    placeholder="Enter Price"
                                    value={String(packageDetails.price)}
                                    keyboardType="numeric"
                                    onChangeText={(value) => {
                                        // Remove non-numeric characters except '.'
                                        const numericValue = value.replace(/[^0-9.]/g, "");

                                        setPackageDetails((prev) => ({
                                            ...prev,
                                            price: numericValue === "" ? 0 : parseFloat(numericValue),
                                        }));
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
            placeholder: "Eg: King Package",
            icon: <Feather name="package" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
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
            placeholder: "Eg: King Package with all services",
            icon: <Feather name="package" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
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
            label: "Choose Offerings",
            type: "custom",
            isRequired: true,
            customComponent: <CustomServiceAddComponent serviceList={serviceData} onChange={handleServiceChange} value={packageDetails.serviceList} />
        },
        price: {
            key: "price",
            label: "",
            isRequired: false,
            type: "custom",
            customComponent: <CustomFieldWithSwitch />
        },
        additionalNotes: {
            key: "additionalNotes",
            label: "Additional Notes (Optional)",
            placeholder: "Eg: Additional notes",
            icon: <Feather name="package" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
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
    }

    const serviceInfoFields: FormFields = {
        serviceName: {
            key: "serviceName",
            label: "Offering Name",
            placeholder: "Eg: Photoshoot",
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
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
            placeholder: "Eg: Photoshoot with professional photographer",
            icon: <Feather name="file-text" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
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
        serviceCategory: {
            key: "serviceCategory",
            label: "Offering Category",
            placeholder: "Eg: Wedding",
            icon: <Feather name="image" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: servieDetails.serviceCategory,
            dropDownItems: Object.values(SERVICECATEGORY).map((item) => { return { label: item, value: item } }),
            onChange(value: string) {
                patchState("", 'serviceCategory', value, true, setServiceDetails, setErrors)
            }
        },
        price: {
            key: "price",
            label: "Price",
            placeholder: "Eg: 1000",
            icon: <Feather name="dollar-sign" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            value: servieDetails.price,
            isRequired: true,
            isDisabled: false,
            onChange(value: number) {
                patchState("", 'price', value, true, setServiceDetails, setErrors, servieDetails.price <= 0 ? "Please enter valid price" : "This field is required")
            }
        },

    };

    const handleSaveService = async () => {
        console.log("fuck")
        let currDetails = activeTab !== SERVICETYPE.SERVICE ? packageDetails : servieDetails
        const currFields = activeTab !== SERVICETYPE.SERVICE ? packageInfoFields : serviceInfoFields
        const isUpdate = Boolean(currDetails.id)
        let serviceResponse: ApiGeneralRespose;
        let updateServiceResponse: ApiGeneralRespose;
        if (activeTab !== "PACKAGE" && currDetails) {
            currDetails = { ...currDetails, serviceType: activeTab };
        }
        console.log(currDetails);

        const validateInput = validateValues(currDetails, currFields)
        if (!validateInput.success) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validateInput.message ?? "Something went wrong",
            })
        }

        if (currDetails?.customerID == "" || currDetails?.customerID == null) {
            showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found Please Logout and Login again",
            })
            return
        }
        setloadingProvider(activeTab)
        if (isUpdate) {
            serviceResponse = await updateOfferingServiceAPI(activeTab !== "PACKAGE" ? servieDetails : packageDetails)
        }
        else {
            serviceResponse = await addNewServiceAPI(activeTab !== "PACKAGE" ? servieDetails : packageDetails)
        }
        setIsOpen(false)

        if (!serviceResponse?.success) {
            showToast({
                type: "error",
                title: "Error",
                message: serviceResponse?.message ?? "Something went wrong",
            })
        }
        else {
            showToast({
                type: "success",
                title: "Success",
                message: serviceResponse?.message ?? "Successfully created service",
            })
            if (isUpdate) {
                activeTab !== "PACKAGE" ? updateService(currDetails) : updatePackage(currDetails)
            }
            else {
                currDetails.id = serviceResponse?.data
                activeTab !== "PACKAGE" ? addService(currDetails) : addPackage(currDetails)
            }
            resetActiveDetails()
        }
        setloadingProvider(null)
    }

    const handleSearch = (text: string) => {
        setSearchText(text);
        let filteredData = []
        if (activeTab == "PACKAGE") {
            filteredData = serviceData?.filter((item) => item?.serviceName.toLowerCase().includes(text.toLowerCase()));
        }
        else {
            filteredData = packageData?.filter((item) => item?.packageName.toLowerCase().includes(text.toLowerCase()));
        }
        setFilteredOfferingList(filteredData);
    }

    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                setloadingProvider(activeTab);
                const userId = getItem("USERID");
                await loadOfferings(userId, showToast);
            } catch (error) {
                console.error("Error loading offerings:", error);
            } finally {
                setloadingProvider(null);
            }
        };

        fetchOfferings();
    }, []);



    return (
        <SafeAreaView style={globalStyles.appBackground} >
            <GradientCard
                colors={isDark
                    ? ["#0D3B8F", "#1372F0"]  // Dark mode: deep navy → vibrant blue
                    : ["#1372F0", "#6FADFF"]  // Light mode: vibrant blue → soft sky blue
                }
            >
                <View className="flex flex-col p-4 gap-5">
                    {/* Header */}
                    <View className="flex flex-row justify-center items-center mb-2">
                        <Text
                            style={[
                                globalStyles.headingText,
                                globalStyles.whiteTextColor,
                                { letterSpacing: 1, textTransform: 'uppercase' },
                            ]}
                        >
                            Service Info
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View className="flex flex-row justify-between items-start">
                        {/* Total Customers */}
                        {statInfo.map((item, index) => (
                            <View className="flex flex-col gap-2">
                                <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                    {item.title}
                                </Text>
                                <View
                                    className="flex flex-row justify-center items-center rounded-full"
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.15)",
                                        paddingVertical: hp('1%'),
                                        paddingHorizontal: wp('3%'),
                                    }}
                                >
                                    <Feather name="users" size={wp('5%')} color="#fff" />
                                    <Text
                                        style={[globalStyles.headingText, globalStyles.whiteTextColor, { marginLeft: wp('2%') }]}>
                                        {item.count ?? 0}
                                    </Text>
                                </View>
                            </View>
                        ))

                        }



                    </View>
                </View>
            </GradientCard>
            <Modal
                isVisible={isOpen}
                onBackdropPress={() => setIsOpen(false)}
                onBackButtonPress={() => setIsOpen(false)}
            >
                <View className={"rounded-t-2xl p-4"} style={[{ borderRadius: wp('3%') }, globalStyles.formBackGroundColor]}>
                    {/* Header */}
                    <View className="flex flex-col items-start mb-4">
                        <Text style={[globalStyles.themeTextColor, globalStyles.subHeadingText]}>
                            {toTitleCase(activeTab)}
                        </Text>
                        <Text style={[globalStyles.themeTextColor, globalStyles.normalText]}>
                            {`Create ${toTitleCase(activeTab)} Details`}
                        </Text>
                    </View>


                    <View style={{ marginVertical: hp("1%") }}>
                        <CustomFieldsComponent
                            infoFields={activeTab !== "PACKAGE" ? serviceInfoFields : packageInfoFields}
                            errors={errors}
                            cardStyle={{ padding: wp('2%') }}
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
                            <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>
                                Cancel
                            </ButtonText>
                        </Button>

                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={[globalStyles.buttonColor, { marginHorizontal: wp("2%") }]}
                            onPress={handleSaveService}
                            isDisabled={Object.keys(errors).length > 0 || loadingProvider !== null}
                        >
                            {loadingProvider !== null && (
                                <ButtonSpinner color={"#fff"} size={wp("4%")} />
                            )}
                            <Feather name="save" size={wp("5%")} color="#fff" />
                            <ButtonText style={[globalStyles.buttonText, { color: "#fff" }]}>Save</ButtonText>
                        </Button>
                    </View>
                </View>

            </Modal>
            <View>
                <View className={isDark ? "bg-[#000]" : "bg-[#fff]"} style={{ marginVertical: hp('1%') }}>

                    <View className='flex flex-row justify-between items-center' style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                        {statInfo.map((item, index) => (
                            <TouchableOpacity style={[styles.tabContainer, activeTab === item?.id && { borderBottomColor: globalStyles.glassBackgroundColor.backgroundColor }]} onPress={item?.onPress}>
                                <Text style={[globalStyles.normalBoldText, globalStyles.themeTextColor]}>{item?.title}</Text>
                            </TouchableOpacity>
                        ))
                        }
                    </View>
                </View>
                <View className='flex flex-row justify-between items-center' style={{ margin: hp('2%') }}>
                    <View>
                        <Text style={[globalStyles.sideHeading, globalStyles.themeTextColor]}>
                            {toTitleCase(activeTab)}
                            (
                            {activeTab === "offering"
                                ? serviceData.length
                                : packageData.length
                            }
                            )
                        </Text>

                    </View>
                    <View>
                        <Button size="md" variant="solid" action="primary" style={[globalStyles.buttonColor, { marginHorizontal: wp('2%') }]} onPress={() => {
                            resetActiveDetails()
                            setIsOpen(true)
                        }}>
                            <Feather name="plus" size={wp('5%')} color="#fff" />
                            <ButtonText style={[globalStyles.buttonText, { color: '#fff' }]}>Add {toTitleCase(activeTab)}</ButtonText>
                        </Button>
                    </View>

                </View>
                <View>
                    {/* Loading Skeleton */}
                    {loadingProvider != null && <OfferingCardSkeleton />}

                    {/* offering Tab */}
                    {!loadingProvider && activeTab == SERVICETYPE.SERVICE && (
                        serviceData?.length === 0 ? (
                            <EmptyState variant='services' onAction={() => setIsOpen(true)} />
                        ) : (
                            <ServiceTab
                                serviceData={searchText !== '' ? filteredOfferingList : serviceData}
                                handleEdit={handleEdit}
                                isLoading={loadingProvider !== null}
                            />
                        )
                    )}

                    {/* Packages Tab */}
                    {/* {!loadingProvider && activeTab === 'packages' && (
                        packageData?.length === 0 ? (
                            <EmptyState variant='packages' onAction={() => setIsOpen(true)} />
                        ) : (
                            <PackageTab
                                packageData={searchText !== '' ? filteredOfferingList : packageData}
                                handleEdit={handleEdit}
                                isLoading={loadingProvider !== null}
                            />
                        )
                    )} */}
                </View>
            </View>

        </SafeAreaView >
    );
};

export default services;