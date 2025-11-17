import GradientCard from '@/src/utils/gradient-card';
import React, { use, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
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
import { getCountries, getStates, isValidGST, isValidPAN, patchState, validateValues } from '@/src/utils/utils';
import { Image } from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { Country } from 'country-state-city';
import { firebaseUploadImage } from '@/src/services/firebase/firebase-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { UserModel } from '@/src/types/user/user-type';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { updateBusinessDetailsApi } from '@/src/services/user/user-service';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/types/common';
import { useAuth } from '@/src/context/auth-context/auth-context';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useUserStore } from '@/src/store/user/user-store';
import { sendWelcomeEmailAPI } from '@/src/api/auth/auth-api-service';
const styles = StyleSheet.create({
    userOnBoardBody: {
        margin: hp("1%"),
    },
    roundWrapper: {
        borderRadius: wp("50%"),
        width: wp("13%"),
    },
    divider: {
        width: wp("10%"),
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
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    body: {
        flex: 1,
        justifyContent: "space-between"
    }
});

const UserOnBoarding = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [currStep, setCurrStep] = useState(0);
    const [headings, setHeadings] = useState(["Company Profile (Basic Info)", "Business Address & Tax Info", "Preferences & Accounting Setup"]);
    const showToast = useToastMessage();
    const { getItem } = useDataStore();
    const navigation = useNavigation<NavigationProp>();
    const { login } = useAuth()
    const { userDetails, getUserDetailsUsingID, resetUserDetails } = useUserStore()
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [businessDetails, setBusinessDetails] = useState<UserModel>({});


    const businessInfoFields: FormFields = useMemo(() => ({
        companyName: {
            parentKey: "userBusinessInfo",
            key: "companyName",
            label: "Company Name",
            placeholder: "Eg : ABC Company",
            icon: <Feather name="briefcase" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBusinessInfo?.companyName ?? "",
            onChange: (value: string) => {
                patchState("userBusinessInfo", "companyName", value, true, setBusinessDetails, setErrors);
            },
        },
        businessType: {
            parentKey: "userBusinessInfo",
            key: "businessType",
            label: "Business Type",
            placeholder: "Eg : IT Services",
            icon: <Feather name="layers" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBusinessInfo?.businessType ?? "",
            dropDownItems: BUSINESSTYPE.map((type) => ({
                label: type,
                value: type,
            })),
            onChange: (value: string) => {
                patchState("userBusinessInfo", "businessType", value, true, setBusinessDetails, setErrors);
            },
        },
        businessPhoneNumber: {
            parentKey: "userBusinessInfo",
            key: "businessPhoneNumber",
            label: "Business Phone Number",
            placeholder: "Eg : 1234567890",
            icon: <Feather name="phone" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBusinessInfo?.businessPhoneNumber ?? "",
            onChange: (value: string) => {
                patchState("userBusinessInfo", "businessPhoneNumber", value, true, setBusinessDetails, setErrors);
            },
        },
        businessEmail: {
            parentKey: "userBusinessInfo",
            key: "businessEmail",
            label: "Business Email",
            placeholder: "Eg : YJy0g@example.com",
            icon: <Feather name="mail" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "email",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBusinessInfo?.businessEmail ?? "",
            onChange: (value: string) => {
                patchState("userBusinessInfo", "businessEmail", value, true, setBusinessDetails, setErrors);
            },
        },
        websiteURL: {
            parentKey: "userBusinessInfo",
            key: "websiteURL",
            label: "Website",
            placeholder: "Eg : https://abc.com (Optional)",
            icon: <Feather name="globe" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: businessDetails?.userBusinessInfo?.websiteURL ?? "",
            onChange: (value: string) => {
                patchState("userBusinessInfo", "websiteURL", value, false, setBusinessDetails, setErrors);
            },
        },
    }), [businessDetails]);

    const billingInfoFields: FormFields = useMemo(() => ({
        gstNumber: {
            parentKey: "userBillingInfo",
            key: "gstNumber",
            label: "GST Number",
            placeholder: "Eg : 1234567890",
            icon: <Feather name="file" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.gstNumber ?? "",
            onChange: (value: string) => {
                patchState("userBillingInfo", "gstNumber", value, false, setBusinessDetails, setErrors);
            },
        },
        panNumber: {
            parentKey: "userBillingInfo",
            key: "panNumber",
            label: "PAN Number",
            placeholder: "Eg : 1234567890",
            icon: <Feather name="file-text" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.panNumber ?? "",
            onChange: (value: string) => {
                patchState("userBillingInfo", "panNumber", value, false, setBusinessDetails, setErrors);
            },
        },
        country: {
            parentKey: "userBillingInfo",
            key: "country",
            label: "Country",
            placeholder: "Eg : India",
            icon: <MaterialIcons name="public" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.country ?? "",
            dropDownItems: getCountries().map((country) => ({
                label: country.name,
                value: country.isoCode,
            })),
            onChange: (value: string) => {
                patchState("userBillingInfo", "country", value, true, setBusinessDetails, setErrors);
            },
        },
        state: {
            parentKey: "userBillingInfo",
            key: "state",
            label: "State",
            placeholder: "Eg : Maharashtra",
            icon: <Feather name="map-pin" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.state ?? "",
            dropDownItems: getStates(businessDetails?.userBillingInfo?.country as string).map((state) => ({
                label: state.name,
                value: state.isoCode,
            })),
            onChange: (value: string) => {
                patchState("userBillingInfo", "state", value, true, setBusinessDetails, setErrors);
            },
        },
        city: {
            parentKey: "userBillingInfo",
            key: "city",
            label: "City",
            placeholder: "Eg : Mumbai",
            icon: <MaterialIcons name="location-city" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.city ?? "",
            onChange: (value: string) => {
                patchState("userBillingInfo", "city", value, true, setBusinessDetails, setErrors);
            },
        },
        address: {
            parentKey: "userBillingInfo",
            key: "address",
            label: "Address",
            placeholder: "Eg : 123 Street, Mumbai",
            icon: <Feather name="home" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.address ?? "",
            onChange: (value: string) => {
                patchState("userBillingInfo", "address", value, true, setBusinessDetails, setErrors);
            },
        },
        zipCode: {
            parentKey: "userBillingInfo",
            key: "zipCode",
            label: "Pincode",
            placeholder: "Eg : 400001",
            icon: <Feather name="hash" size={wp("5%")} style={{ paddingRight: wp("3%") }} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: businessDetails?.userBillingInfo?.zipCode ?? "",
            onChange: (value: string) => {
                patchState("userBillingInfo", "zipCode", value, true, setBusinessDetails, setErrors);
            },
        },
    }), [businessDetails]);


    // const [formFields, setFormFields] = useState([businessInfoFields, billingInfoFields, settingInfoFields]);

    const handleNext = () => {
        if (!businessDetails?.userBusinessInfo?.companyLogoURL) {
            showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please upload company logo",
            })
        }
        if (errors && Object.keys(errors).length > 0) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please fix all the errors before proceeding",
            })
        }
        if (validateValues(businessDetails, businessInfoFields).success) {
            setCurrStep(currStep + 1);
        }
        else {
            showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please fill all required fields",
            })
        }

    }

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
                patchState('userBusinessInfo', 'companyLogoURL', uploadImage.url, true, setBusinessDetails, setErrors);
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


    const handleSubmit = async () => {
        const userId = getItem("USERID")
        const validate = validateValues(businessDetails, billingInfoFields);
        if (!validate.success) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: validate.message ?? "Please fill all required fields",
            })
        }
        if (errors && Object.keys(errors).length > 0) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please fix all the errors before proceeding",
            })
        }
        if (!userId) {
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found",
            })
        }
        if (!isValidGST(businessDetails?.userBillingInfo?.gstNumber ?? "")) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please enter valid GST number",
            })
        }
        if (!isValidPAN(businessDetails?.userBillingInfo?.panNumber ?? "")) {
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please enter valid PAN number",
            })
        }
        setLoading(true);
        const updatedDetails = { ...businessDetails, userId };
        setBusinessDetails(updatedDetails);
        const updateBusinessDetails = await updateBusinessDetailsApi(updatedDetails);
        if (!updateBusinessDetails.success) {
            setLoading(false);

            return showToast({
                type: "error",
                title: "Error",
                message: updateBusinessDetails.message ?? "Something went wrong",
            })
        }
        resetUserDetails();
        setLoading(false);
        sendWelcomeEmailAPI(
            userDetails?.userAuthInfo?.email,
            userDetails?.userAuthInfo?.username
        )

        showToast({
            type: "success",
            title: "Success",
            message: updateBusinessDetails.message ?? "Successfully registered",
        })
        navigation.reset({
            index: 0,
            routes: [{ name: "Subscription" }],
        })
    }

    useEffect(() => {
        const userId = getItem("USERID")
        getUserDetailsUsingID(userId, showToast);

    }, [])


    return (
        <View style={[styles.body, globalStyles.formBackGroundColor]}>
            {/* Login Card - Aligned to bottom */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View className="flex-1">
                    <View className="flex justify-center items-center" style={styles.userOnBoardBody}>
                        <View className="flex flex-row align-middle items-center">
                            {[0, 1].map((step, index) => (
                                <View className="flex flex-row align-middle items-center" key={index}>
                                    <View
                                        className="rounded-2xl p-4"
                                        style={[
                                            styles.roundWrapper,
                                            {
                                                backgroundColor:
                                                    currStep === index
                                                        ? "#2563EB" // Active step → blue
                                                        : currStep > index
                                                            ? "#22C55E" // Completed step → green
                                                            : "#E5E7EB", // Upcoming step → grey
                                            },
                                        ]}
                                    >
                                        <View className="justify-center items-center">
                                            {currStep > index ? (
                                                <Feather name="check" size={wp("5%")} color="white" />
                                            ) : (
                                                <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>
                                                    {index + 1}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {index != 1 && <Divider style={[styles.divider, { backgroundColor: currStep > index ? "#38A169" : "#d1d5db" }]} />}
                                </View>
                            ))}
                        </View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText, { marginTop: hp("2%") }]}>Step {currStep + 1} {headings[currStep]}</Text>

                    </View>
                    <Card style={[globalStyles.cardShadowEffect,styles.cardContainer,globalStyles.formBackGroundColor]}>
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
                            <CustomFieldsComponent infoFields={currStep == 0 ? businessInfoFields : billingInfoFields} errors={errors} />

                        </ScrollView>
                        <View style={[styles.fixedButtonContainer, globalStyles.cardShadowEffect]}>
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground} isDisabled={currStep == 0 || loading} onPress={() => setCurrStep(currStep - 1)}>
                                <Feather name="arrow-left" size={wp("5%")} color={isDark ? "#fff" : "#000"} />
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor, globalStyles.themeTextColor]}>Prev</ButtonText>
                            </Button>
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.buttonColor} onPress={currStep == 1 ? handleSubmit : handleNext} isDisabled={loading || Object.keys(errors).length > 0}>
                                {
                                    loading && (
                                        <ButtonSpinner color={"#fff"} size={wp("4%")} />
                                    )
                                }
                                <ButtonText style={globalStyles.buttonText}>{currStep == 1 ? "Submit" : "Next"}</ButtonText>
                                {currStep != 1 && <Feather name="arrow-right" size={wp("5%")} color="#fff" />}
                            </Button>
                        </View>
                    </Card>
                </View>
            </View>
        </View>
    );
};

export default UserOnBoarding;