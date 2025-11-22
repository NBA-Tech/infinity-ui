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
import { PackageModel, ServiceModel, SERVICETYPE, SESSIONTYPE } from '@/src/types/offering/offering-type';
import { checkValidNumber, clearState, generateRandomString, patchState, toTitleCase, validateValues } from '@/src/utils/utils';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { addNewServiceAPI, getOfferingListAPI, updateOfferingServiceAPI } from '@/src/api/offering/offering-service';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useOfferingStore } from '@/src/store/offering/offering-store';
import CustomServiceAddComponent from '@/src/components/CustomAddComponent';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import YoutubePlayer from "react-native-youtube-iframe";
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
    const [activeTab, setActiveTab] = useState<"PACKAGE" | SERVICETYPE>(SERVICETYPE.SERVICE);
    const [isOpen, setIsOpen] = useState(false);
    const { getItem } = useDataStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const showToast = useToastMessage();
    const [loadingProvider, setloadingProvider] = useState<"PACKAGE" | SERVICETYPE | null>(null)
    const [servieDetails, setServiceDetails] = useState<ServiceModel>({
        userId: getItem("USERID") as string,
    })
    const [packageDetails, setPackageDetails] = useState<PackageModel>({
        userId: getItem("USERID") as string,
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


    const handleEdit = (id: string) => {
        if (id == "") return;

        if (activeTab != "PACKAGE") {
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
            <View style={{marginBottom:hp('-1%')}}>
                <View className='flex flex-col'>
                    <View className='flex flex-row justify-end items-center'>
                        <View className='flex flex-row items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Use calculated price</Text>
                            <Switch
                                trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
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
            value: packageDetails?.packageName,
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
            value: packageDetails?.description,
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
            customComponent: <CustomServiceAddComponent serviceList={serviceData} onChange={handleServiceChange} value={packageDetails?.serviceList} />
        },
        calculatedPrice: {
            key: "calculatedPrice",
            label: "",
            isRequired: false,
            type: "custom",
            value: packageDetails?.price,
            customComponent: <CustomFieldWithSwitch />
        },
        customPrcice:{
            key: "price",
            label:"Custom Price",
            placeholder: "Eg: 1000",
            icon: <FontAwesome name="money" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            value: packageDetails?.price,
            isRequired: !packageDetails?.calculatedPrice,
            isDisabled: false,
            isVisible:!packageDetails?.calculatedPrice,
            onChange(value: string) {
                patchState("", 'price', value, !packageDetails?.calculatedPrice, setPackageDetails, setErrors)
            }
        },
        additionalNotes: {
            key: "additionalNotes",
            label: "Additional Notes (Optional)",
            placeholder: "Eg: Additional notes",
            icon: <Feather name="package" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            value: packageDetails?.additionalNotes,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'additionalNotes', value, false, setPackageDetails, setErrors)
            }

        },
    }

    const serviceInfoFields: FormFields = {
        serviceName: {
            key: "serviceName",
            label: "Name",
            placeholder: "Eg: Photoshoot",
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            value: servieDetails?.serviceName,
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
            value: servieDetails?.description,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
            onChange(value: string) {
                patchState("", 'description', value, false, setServiceDetails, setErrors)
            }
        },
        sessionType:{
            key: "sessionType",
            label: "Session Type",
            placeholder: "Eg: One Time",
            icon: <Feather name="image" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: activeTab==SERVICETYPE.SERVICE,
            isVisible:activeTab==SERVICETYPE.SERVICE,
            isDisabled: false,
            value: servieDetails?.sessionType,
            dropDownItems: Object.values(SESSIONTYPE).map((item) => { return { label: item, value: item } }),
            onChange(value: string) {
                patchState("", 'sessionType', value, activeTab==SERVICETYPE.SERVICE, setServiceDetails, setErrors)
            }
        },
        quantity:{
            key: "quantity",
            label: "Quantity",
            placeholder: "Eg: 20",
            icon: <Feather name="tag" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            isVisible:activeTab==SERVICETYPE.DELIVERABLE,
            isRequired: activeTab == SERVICETYPE.DELIVERABLE,
            isDisabled: false,
            value: servieDetails?.quantity,
            onChange(value: string) {
                patchState("", 'quantity', value,  activeTab == SERVICETYPE.DELIVERABLE, setServiceDetails, setErrors)
            }
        },
        price: {
            key: "price",
            label: "Price",
            placeholder: "Eg: 1000",
            icon: <FontAwesome name="money" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            value: servieDetails?.price,
            isRequired: true,
            isDisabled: false,
            onChange(value: number) {
                patchState("", 'price', value, true, setServiceDetails, setErrors, servieDetails.price <= 0 ? "Please enter valid price" : "This field is required")
            }
        },

    };

    const handleSaveService = async () => {
        let currDetails = activeTab == SERVICETYPE.PACKAGE ? packageDetails : servieDetails
        const currFields = activeTab == SERVICETYPE.PACKAGE ? packageInfoFields : serviceInfoFields

        if(activeTab==SERVICETYPE.PACKAGE){
            const isServiceListHasNull=packageDetails?.serviceList?.some((item: any) => item?.name == "" || item?.value == "")
            if(isServiceListHasNull){
                return showToast({
                    type: "warning",
                    title: "Oops!!",
                    message: "Please fill all the fields",
                })
            }
            
        }
        const isUpdate = Boolean(currDetails.id)
        let serviceResponse: ApiGeneralRespose;
        let updateServiceResponse: ApiGeneralRespose;

        currDetails = { ...currDetails, type: activeTab };


        const validateInput = validateValues(currDetails, currFields)
        if (!validateInput.success) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validateInput.message ?? "Something went wrong",
            })
        }

        if (currDetails?.userId == "" || currDetails?.userId == null) {
            showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found Please Logout and Login again",
            })
            return
        }
        setloadingProvider(activeTab)

        try {

            if (isUpdate) {
                serviceResponse = await updateOfferingServiceAPI(currDetails)
            }
            else {
                serviceResponse = await addNewServiceAPI(currDetails)
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

            }

        }
        finally {
            setPackageDetails({
                userId: getItem("USERID") as string,
            } as PackageModel)
            setServiceDetails({
                userId: getItem("USERID") as string,
            } as ServiceModel)
            setloadingProvider(null)
        }
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

    const reset=()=>{
        setServiceDetails({
            userId: getItem("USERID") as string,
        })
        setPackageDetails({
            userId: getItem("USERID") as string,
        })
        setIsOpen(false)
    }


    return (
        <SafeAreaView style={globalStyles.appBackground} >
            <BackHeader screenName='Services' />
            <Modal
                isVisible={isOpen}
                onBackdropPress={() => reset()}
                onBackButtonPress={() => reset()}
                style={{ margin: 0, justifyContent: "flex-end" }} // bottom sheet style
            >
                <View
                    className="rounded-t-2xl p-4"
                    style={[{ borderRadius: wp('3%'), maxHeight: hp('85%') }, globalStyles.formBackGroundColor]}
                >
                    {/* ✅ Scrollable Area */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: hp('3%') }}
                    >
                        {/* Header */}
                        <View className="flex flex-col items-start mb-4">
                            <Text style={[globalStyles.themeTextColor, globalStyles.subHeadingText]}>
                                {toTitleCase(activeTab)}
                            </Text>
                            <Text style={[globalStyles.themeTextColor, globalStyles.normalText]}>
                                {`Create ${toTitleCase(activeTab)} Details`}
                            </Text>
                        </View>

                        {/* Form Fields */}
                        <View style={{ marginVertical: hp("1%") }}>
                            <CustomFieldsComponent
                                infoFields={activeTab != "PACKAGE" ? serviceInfoFields : packageInfoFields}
                                errors={errors}
                                cardStyle={{ padding: wp('2%') }}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer Buttons (outside scroll) */}
                    <View className="flex flex-row justify-end items-center mt-2 pt-2 border-t border-gray-500/20">
                        <Button
                            size="md"
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
                            size="md"
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
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp("5%") }}
            >

                <View className="mt-4 rounded-2xl p-4" style={globalStyles.cardShadowEffect}>
                    <View className="flex flex-col items-start mb-3">
                        <Text style={[globalStyles.heading3Text, globalStyles.darkBlueTextColor]}>
                            Watch This Video
                        </Text>
                        <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>
                            To better understand our service packages, please watch the short video below.
                        </Text>
                    </View>

                    {/* YouTube Player */}
                    <View className="rounded-xl overflow-hidden mt-2">
                        <YoutubePlayer
                            height={220}
                            play={false}
                            videoId="LXb3EKWsInQ" // 👈 replace with your actual video ID
                        />
                    </View>
                </View>

                <View>
                    <View style={[{ marginVertical: hp('1%') }, globalStyles.cardShadowEffect]}>

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
                            </Text>

                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.buttonColor, { marginHorizontal: wp('2%') }]} onPress={() => {
                                setIsOpen(true)
                            }}>
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={[globalStyles.buttonText, { color: '#fff' }]}>Add {toTitleCase(activeTab)}</ButtonText>
                            </Button>
                        </View>

                    </View>
                    <Divider />
                    <View>
                        {/* Loading Skeleton */}
                        {loadingProvider != null && <OfferingCardSkeleton />}

                        {/* offering Tab */}
                        {!loadingProvider && activeTab == SERVICETYPE.SERVICE && (
                            serviceData?.filter((item) => item?.type === SERVICETYPE.SERVICE)?.length === 0 ? (
                                <EmptyState variant='services' onAction={() => setIsOpen(true)} />
                            ) : (
                                <ServiceTab
                                    serviceData={serviceData?.filter((item) => item?.type === SERVICETYPE.SERVICE)}
                                    handleEdit={handleEdit}
                                    isLoading={loadingProvider !== null}
                                />
                            )
                        )}

                        {!loadingProvider && activeTab == SERVICETYPE.DELIVERABLE && (
                            serviceData?.filter((item) => item?.type === SERVICETYPE.DELIVERABLE)?.length === 0 ? (
                                <EmptyState variant='deliverables' onAction={() => setIsOpen(true)} />
                            ) : (
                                <ServiceTab
                                    serviceData={serviceData?.filter((item) => item?.type === SERVICETYPE.DELIVERABLE)}
                                    handleEdit={handleEdit}
                                    isLoading={loadingProvider !== null}
                                />
                            )
                        )}

                        {/* Packages Tab */}
                        {!loadingProvider && activeTab == SERVICETYPE.PACKAGE && (
                            packageData?.length === 0 ? (
                                <EmptyState variant='packages' onAction={() => setIsOpen(true)} />
                            ) : (
                                <PackageTab
                                    packageData={packageData}
                                    handleEdit={handleEdit}
                                    isLoading={loadingProvider !== null}
                                />
                            )
                        )}
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView >
    );
};

export default services;