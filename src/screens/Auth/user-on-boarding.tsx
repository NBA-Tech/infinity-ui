import GradientCard from '@/src/utils/gradient-gard';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { Divider } from '@/components/ui/divider';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormFields } from '@/src/types/common';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon } from "@/components/ui/icon"
import { BUSINESSTYPE } from '@/src/constant/constants';
import { getCountries, getStates } from '@/src/utils/utils';
import { Image } from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { Country } from 'country-state-city';
import { firebaseUploadImage } from '@/src/services/firebase/firebase-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { UserModel } from '@/src/types/user/user-type';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { updateBusinessDetailsApi } from '@/src/services/user/user-service';
const styles = StyleSheet.create({
    userOnBoardBody: {
        margin: hp("1%"),
    },
    roundWrapper: {
        borderRadius: wp("50%"),
        width: wp("13%"),
    },
    divider: {
        width: wp("15%"),
        height: hp("0.5%"),
        marginHorizontal: wp("2%"),
    },
    imageUploadContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: wp("5%"),
        height: hp("15%"),
        borderRadius: wp("50%"),
        borderStyle: "dotted",
        borderWidth: wp("0.5%"),
        borderColor: "#d1d5db",
    },
    image: {
        width: 400,
        height: 400
    },
    cardContainer: {
        flex: 1,
    },
    scrollableContent: {
        paddingBottom: hp("5%"),
    },
    fixedButtonContainer: {
        padding: hp("2%"),
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headingContainer: {
        marginVertical: hp("0.1%")
    },
    body: {
        flex: 1,
        justifyContent: "space-between"
    }
});

const UserOnBoarding = () => {
    const globalStyles = useContext(StyleContext);
    const [currStep, setCurrStep] = useState(0);
    const [headings, setHeadings] = useState(["Company Profile (Basic Info)", "Business Address & Tax Info", "Preferences & Accounting Setup"]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const showToast = useToastMessage();
    const { getItem } = useDataStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [businessDetails, setBusinessDetails] = useState<UserModel>({
        userId: "",
        userBusinessInfo: {
            companyName: "",
            companyLogoURL: "",
            businessType: "",
            businessPhoneNumber: "",
            businessEmail: "",
            websiteURL: "",
        },
        userBillingInfo: {
            gstNumber: "",
            panNumber: "",
            country: "",
            state: "",
            city: "",
            zipCode: "",
            address: "",
        },
        userSettingInfo: {
            currency: "",
            notificationPreference: "",
        },
    });

    const patchState = (
        section: keyof UserModel,
        key: string,
        value: string
    ) => {
        setBusinessDetails((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const openGallery = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true, // ✨ enables editing/cropping
                cropperCircleOverlay: false, // set true if you want circular crop
            });
            const uploadImage = await firebaseUploadImage(image.path, 'companyLogo');
            if (uploadImage.url) {
                showToast({
                    message: "Image uploaded successfully",
                    type: "success",
                    title: "Success"
                })
                patchState('userBusinessInfo', 'companyLogoURL', uploadImage.url);
            }
            else {
                showToast({
                    message: "Something went wrong",
                    type: "error",
                    title: "Error"
                })
            }
            return;


        } catch (error) {
            showToast({
                message: "Couldn't upload image",
                type: "error",
                title: "Error"
            })
        }
    };

    const formFields: FormFields = {
        0: [
            {
                parentKey: 'userBusinessInfo',
                key: 'companyName',
                label: 'Company Name*',
                type: 'text',
                placeholder: 'Eg : ABC Company',
                icon: "briefcase",
                onChange: (value: string) => {
                    patchState('userBusinessInfo', 'companyName', value)
                }
            },
            {
                parentKey: 'userBusinessInfo',
                key: 'businessType',
                label: 'Business Type*',
                type: 'select',
                placeholder: 'Select Business Type',
                icon: "briefcase",
                onChange: (value: string) => {
                    patchState('userBusinessInfo', 'businessType', value)
                },
                renderItems: () => (
                    BUSINESSTYPE.map((type, index) => (
                        <SelectItem key={index} label={type} value={type} />
                    ))
                ),
            },
            {
                parentKey: 'userBusinessInfo',
                key: 'businessPhoneNumber',
                label: 'Business Phone Number*',
                type: 'number',
                placeholder: 'Eg : 1234567890',
                icon: "phone",
                onChange: (value: string) => {
                    patchState('userBusinessInfo', 'businessPhoneNumber', value)
                }
            },
            {
                parentKey: 'userBusinessInfo',
                key: 'businessEmail',
                label: 'Business Email*',
                type: 'email',
                placeholder: 'Eg : YJy0g@example.com',
                icon: "mail",
                onChange: (value: string) => {
                    patchState('userBusinessInfo', 'businessEmail', value)
                }
            },
            {
                parentKey: 'userBusinessInfo',
                key: 'websiteURL',
                label: 'Website',
                type: 'email',
                placeholder: 'Eg : https://abc.com (Optional)',
                icon: "globe",
                onChange: (value: string) => {
                    patchState('userBusinessInfo', 'websiteURL', value)
                }
            },
        ],
        1: [
            {
                parentKey: 'userBillingInfo',
                key: 'gstNumber',
                label: 'GST Number',
                type: 'text',
                placeholder: 'Eg : 1234567890',
                icon: 'file-text',
                onChange: (value: string) => {
                    patchState('userBillingInfo', 'gstNumber', value)
                }
            },
            {
                parentKey: 'userBillingInfo',
                key: 'panNumber',
                label: 'PAN Number',
                type: 'text',
                placeholder: 'Eg : 1234567890',
                icon: 'file-text',
                onChange: (value: string) => {
                    patchState('userBillingInfo', 'panNumber', value)
                }
            },
            {
                parentKey: 'userBillingInfo',
                key: 'country',
                label: 'Country',
                type: 'select',
                icon: 'globe',
                renderItems: () => (
                    getCountries().map((country, index) => (
                        <SelectItem key={index} label={country.name} value={country.isoCode} />
                    ))
                ),
                onChange: (value: string) => {
                    setSelectedCountry(value);
                    patchState('userBillingInfo', 'country', value)
                }
            },
            {
                parentKey: 'userBillingInfo',
                key: 'state',
                label: 'State',
                type: 'select',
                icon: 'map-pin',
                renderItems: () => (
                    getStates(selectedCountry || "IN").map((state, index) => (
                        <SelectItem key={index} label={state.name} value={state.isoCode} />
                    ))
                ),
                onChange: (value: string) => {
                    patchState('userBillingInfo', 'state', value)
                }
            },
            {
                parentKey: 'userBillingInfo',
                key: 'city',
                label: 'City',
                type: 'text',
                placeholder: 'Eg : Mumbai',
                icon: 'map-pin',
                onChange: (value: string) => {
                    patchState('userBillingInfo', 'city', value)
                }
            },
            {
                parentKey: 'userBillingInfo',
                key: 'address',
                label: 'Address',
                type: 'text',
                placeholder: 'Eg : Mumbai',
                icon: 'map',
                onChange: (value: string) => {
                    patchState('userBillingInfo', 'address', value)
                }
            },
            {
                parentKey: 'userBillingInfo',
                key: 'zipCode',
                label: 'Pincode',
                type: 'number',
                placeholder: 'Eg : 400001',
                icon: 'hash',
                onChange: (value: string) => {
                    patchState('userBillingInfo', 'zipCode', value)
                }
            },
        ],
        2: [
            {
                parentKey: 'userSettingInfo',
                key: 'currency',
                label: 'Default Currency',
                type: 'text',
                placeholder: 'Eg : INR',
                icon: 'dollar-sign',
                value: Country.getCountryByCode(selectedCountry || "IN")?.currency || "INR",
                isDisabled: true,
                onChange: (value: string) => {
                    patchState('userSettingInfo', 'currency', value)
                }
            },
            {
                parentKey: 'userSettingInfo',
                key: 'notificationPreference',
                label: 'Notification Preference',
                type: 'select',
                icon: 'bell',
                renderItems: () => (
                    ["Email", "Push Notification"].map((method, index) => (
                        <SelectItem key={index} label={method} value={method} />
                    ))
                ),
                onChange: (value: string) => {
                    patchState('userSettingInfo', 'notificationPreference', value)
                }
            },

        ]
    };

    const handleSubmit = async () => {
        const userId = getItem("userId")
        if (false) {
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found",
            })
        }
        setLoading(true);
        setBusinessDetails((prev) => ({ ...prev, userId: userId }));
        const updateBusinessDetails = await updateBusinessDetailsApi(businessDetails);
        if (!updateBusinessDetails.success) {
            setLoading(false);

            return showToast({
                type: "error",
                title: "Error",
                message: updateBusinessDetails.message ?? "Something went wrong",
            })
        }
        setLoading(false);

        showToast({
            type: "success",
            title: "Success",
            message: updateBusinessDetails.message ?? "Successfully registered",
        })
        console.log(businessDetails);
    }


    return (
        <View style={styles.body}>
            {/* Header */}
            <View style={styles.headingContainer}>
                <View className="justify-center items-center">
                    <Card size='xs' variant='ghost'>
                        <View className='flex justify-center items-center'>
                            <Image size='lg' source={Logo} alt="Infinity ColorLab Logo" />
                        </View>
                    </Card>
                    <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>
                        Create your account !
                    </Text>
                </View>
            </View>

            {/* Login Card - Aligned to bottom */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View className="flex-1">
                    <View className="flex justify-center items-center" style={styles.userOnBoardBody}>
                        <View className="flex flex-row align-middle items-center">
                            {[0, 1, 2].map((step, index) => (
                                <View className="flex flex-row align-middle items-center">
                                    <GradientCard
                                        className='rounded-2xl p-4 mb-4'
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
                                                <Text style={[globalStyles.whiteTextColor, globalStyles.labelText]}>
                                                    {index + 1}
                                                </Text>
                                            )

                                            }
                                        </View>
                                    </GradientCard>
                                    {index != 2 && <Divider style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText, { marginTop: hp("2%") }]}>Step {currStep + 1} {headings[currStep]}</Text>

                    </View>
                    <Card style={[styles.userOnBoardBody, styles.cardContainer]}>
                        <ScrollView
                            contentContainerStyle={styles.scrollableContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {currStep == 0 && (
                                <View>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Company Logo*
                                    </Text>
                                    <View className="flex justify-center items-center">
                                        <TouchableOpacity onPress={openGallery}>
                                            {businessDetails.userBusinessInfo?.companyLogoURL ? (
                                                <Image source={{ uri: businessDetails.userBusinessInfo?.companyLogoURL }} style={styles.image} />
                                            ) : (
                                                <View style={styles.imageUploadContainer}>
                                                    <Feather name="upload" size={wp("10%")} color="#d1d5db" />
                                                    <Text style={[globalStyles.greyTextColor, globalStyles.labelText]}>
                                                        Upload
                                                    </Text>
                                                    <Text style={[globalStyles.greyTextColor, globalStyles.labelText]}>
                                                        Size less than 5MB
                                                    </Text>

                                                </View>
                                            )

                                            }

                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )

                            }


                            {formFields[currStep].map((field, index) => (
                                <FormControl style={{ marginVertical: hp("1%") }} key={index}>
                                    <FormControlLabel className='gap-2'>
                                        <Feather name={field?.icon} size={wp("5%")} color="#000" />

                                        <FormControlLabelText
                                            style={[globalStyles.normalTextColor, globalStyles.labelText]}
                                        >
                                            {field?.label}
                                        </FormControlLabelText>

                                    </FormControlLabel>
                                    {field?.type == "select" ? (
                                        <Select onValueChange={(value) => field?.onChange?.(value)}
                                            selectedValue={businessDetails[field?.parentKey]?.[field?.key] || ""}>
                                            <SelectTrigger>
                                                <SelectInput placeholder="Select option" className="flex-1" />
                                                <SelectIcon as={ChevronDownIcon}>
                                                </SelectIcon>
                                            </SelectTrigger>
                                            <SelectPortal preventScroll={false}>
                                                <SelectBackdrop />
                                                <SelectContent>
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator />
                                                    </SelectDragIndicatorWrapper>
                                                    <ScrollView showsVerticalScrollIndicator={false} className='justify-items-start'>
                                                        {field?.renderItems?.()}
                                                    </ScrollView>

                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    ) : (
                                        <Input size="lg">
                                            <InputField
                                                type={field?.type}
                                                placeholder={field?.placeholder}
                                                keyboardType={
                                                    field?.type === "number"
                                                        ? "numeric"
                                                        : field?.type === "email"
                                                            ? "email-address"
                                                            : "default"
                                                }
                                                onChangeText={(text) => field?.onChange?.(text)}
                                                readOnly={field?.isDisabled || false}
                                                secureTextEntry={field?.type === "password"}
                                                value={
                                                    businessDetails[field.parentKey]?.[field.key] || ""
                                                }
                                            />
                                        </Input>
                                    )

                                    }

                                </FormControl>
                            ))}
                        </ScrollView>
                        <View style={styles.fixedButtonContainer}>
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground} isDisabled={currStep == 0 || loading} onPress={() => setCurrStep(currStep - 1)}>
                                <Feather name="arrow-left" size={wp("5%")} color="#000" />
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>Prev</ButtonText>
                            </Button>
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground} onPress={currStep == 2 ? handleSubmit : () => setCurrStep(currStep + 1)} isDisabled={loading}>
                                {
                                    loading && (
                                        <ButtonSpinner color={"#fff"} size={wp("4%")} />
                                    )
                                }
                                <ButtonText style={globalStyles.buttonText}>{currStep == 2 ? "Submit" : "Next"}</ButtonText>
                                {currStep != 2 && <Feather name="arrow-right" size={wp("5%")} color="#fff" />}
                            </Button>
                        </View>
                    </Card>
                </View>
            </View>
        </View>
    );
};

export default UserOnBoarding;