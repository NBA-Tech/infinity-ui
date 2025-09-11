import React, { useCallback, useContext, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Switch, ScrollView } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import Feather from 'react-native-vector-icons/Feather';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ServiceTab from './service-tab';
import PackageTab from './package-tab';
import { Button, ButtonText } from '@/components/ui/button';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { FormFields } from '@/src/types/common';
import { CustomFieldsComponent } from '@/src/components/fields-component';
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
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleOpenSheet = useCallback(() => {
        if (bottomSheetRef.current) {
            try {
                bottomSheetRef.current.snapToIndex(0);
            } catch (e) {
                console.warn("BottomSheet not ready yet", e);
            }
        }
    }, []);


    const CustomFieldWithSwitch = () => (
        <View>
            <View className='flex flex-col'>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Custom Price</Text>

                    </View>
                    <View className='flex flex-row items-center'>
                        <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Use calculated price</Text>
                        <Switch
                            trackColor={{ false: "#d4d4d4", true: "#525252" }}
                            thumbColor="#fafafa"
                            ios_backgroundColor="#d4d4d4"
                        />
                    </View>

                </View>
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
                        />
                    </Input>

                </View>
            </View>

        </View>
    )
    const packageInfoFields: FormFields = {
        packageName: {
            parentKey: "customerBasicInfo",
            key: "packageName",
            label: "Package Name",
            placeholder: "Enter Package Name",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
        },
        description: {
            parentKey: "customerBasicInfo",
            key: "description",
            label: "Description",
            placeholder: "Enter Description",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: true,
            isDisabled: false,
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
            isRequired: false,
            isDisabled: false,
            dropDownItems: [
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "Website", value: "website" },
            ]
        },
        notifications: {
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
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,

        },
        tags: {
            key: "tags",
            type: "chips",
            label: "Select Tags",
            value: [],
            dropDownItems: [
                { label: "React Native", value: "rn" },
                { label: "Java", value: "java" },
                { label: "AI", value: "ai" },
            ],
            onChange: (chips) => console.log("Selected chips:", chips),
        },
        isActive: {
            key: "isActive",
            label: "Active Status",
            type: "switch",
            style: "w-full",
            value: true,
            onChange: (val) => console.log("Active Status:", val),
        },
    }

    const serviceInfoFields: FormFields = {
        serviceName: {
            parentKey: "serviceBasicInfo",
            key: "serviceName",
            label: "Service Name",
            placeholder: "Enter Service Name",
            icon: <Feather name="edit" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
        },
        description: {
            parentKey: "serviceBasicInfo",
            key: "description",
            label: "Description",
            placeholder: "Enter Description",
            icon: <Feather name="file-text" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            isRequired: false,
            isDisabled: false,
        },
        price: {
            parentKey: "serviceBasicInfo",
            key: "price",
            label: "Price",
            placeholder: "Enter Price",
            icon: <Feather name="dollar-sign" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
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
            dropDownItems: [
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "Website", value: "website" },
            ],
        },
        tags: {
            key: "tags",
            type: "chips",
            label: "Select Tags",
            value: [],
            dropDownItems: [
                { label: "React Native", value: "rn" },
                { label: "Java", value: "java" },
                { label: "AI", value: "ai" },
            ],
            onChange: (chips) => console.log("Selected chips:", chips),
        },
        isActive: {
            key: "isActive",
            label: "Active Status",
            type: "switch",
            style: "w-full",
            value: true,
            onChange: (val) => console.log("Active Status:", val),
        },
    };

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
                        <Text style={[globalStyles.sideHeading]}>Services(5)</Text>
                    </View>
                    <View>
                        <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={handleOpenSheet}>
                            <Feather name="plus" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>Add Services</ButtonText>
                        </Button>
                    </View>

                </View>

                {activeTab === 'services' && <ServiceTab />}
                {activeTab === 'packages' && <PackageTab />}
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                enablePanDownToClose={true}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        pressBehavior="close"
                    />
                )}
                backgroundStyle={{ backgroundColor: globalStyles.themeBackground }}
                handleIndicatorStyle={{
                    backgroundColor: globalStyles.isDark ? "#fff" : "#000",
                }}
            >

                <BottomSheetView
                    style={styles.sheetContent}
                >
                    <View className="flex flex-col items-start">
                        <Text
                            style={[globalStyles.blackTextColor, globalStyles.subHeadingText]}
                        >
                            Create new Package
                        </Text>
                        <Text style={[globalStyles.blackTextColor, globalStyles.normalText]}>
                            Bundle services together into a package
                        </Text>
                    </View>

                    <View style={{ marginVertical: hp('1%') }}>
                        <CustomFieldsComponent infoFields={packageInfoFields} />
                    </View>

                    <View
                        className="flex flex-row justify-end items-center"
                        style={{ marginBottom: hp('3%') }}
                    >
                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={[globalStyles.transparentBackground, { marginHorizontal: wp('2%') }]}
                        >
                            <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>
                                Cancel
                            </ButtonText>
                        </Button>

                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]}
                        >
                            <Feather name="save" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>Save</ButtonText>
                        </Button>
                    </View>
                </BottomSheetView>

            </BottomSheet>
        </SafeAreaView >
    );
};

export default services;