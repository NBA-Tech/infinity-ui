import React, { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { StyleContext, ThemeToggleContext } from "@/src/providers/theme/global-style-provider";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "@/src/components/back-header";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FormFields } from "@/src/types/common";
import { checkValidEmail, getCountries, getCurrencySymbol, getStates, patchState } from "@/src/utils/utils";
import { BUSINESSTYPE } from "@/src/constant/constants";
import Feather from "react-native-vector-icons/Feather";
import { UserModel } from "@/src/types/user/user-type";
import { firebaseUploadImage } from "@/src/services/firebase/firebase-service";
import ImagePicker from 'react-native-image-crop-picker';
import { useToastMessage } from "@/src/components/toast/toast-message";
import { Divider } from "@/components/ui/divider";
import { CustomFieldsComponent } from "@/src/components/fields-component";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { useUserStore } from "@/src/store/user/user-store";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { updateBusinessDetailsApi } from "@/src/services/user/user-service";
const styles = StyleSheet.create({
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
        width: wp("20%"),
        height: hp("10%")
    },
})
const BusinessDetails = () => {
    const globalStyles = useContext(StyleContext);
    const [businessDetails, setBusinessDetails] = useState<UserModel>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const showToast = useToastMessage();
    const { getItem } = useDataStore()
    const { userDetails, getUserDetailsUsingID, setUserDetails } = useUserStore();
    const [loading, setLoading] = useState(false)
    const { isDark } = useContext(ThemeToggleContext)

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
            isLoading: loading,
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
            isLoading: loading,
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
            isLoading: loading,
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
            icon: <Feather name="mail" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "email",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loading,
            value: businessDetails?.userBusinessInfo?.businessEmail ?? "",
            onChange: (value: string) => {
                patchState("userBusinessInfo", "businessEmail", value, true, setBusinessDetails, setErrors);
            },
            onBlur: (value: string) => {
                const isValid = checkValidEmail(value);
                if (!isValid) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        businessEmail: "Invalid email address",
                    }));
                }
            }
        },
        websiteURL: {
            parentKey: "userBusinessInfo",
            key: "websiteURL",
            label: "Website",
            placeholder: "Eg : https://abc.com (Optional)",
            icon: <Feather name="globe" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            isLoading: loading,
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
            isLoading: loading,
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
            isLoading: loading,
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
            isLoading: loading,
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
            isLoading: loading,
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
            isLoading: loading,
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
            icon: <Feather name="home" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loading,
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
            icon: <Feather name="hash" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "number",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isLoading: loading,
            value: businessDetails?.userBillingInfo?.zipCode ?? "",
            onChange: (value: string) => {
                patchState("userBillingInfo", "zipCode", value, true, setBusinessDetails, setErrors);
            },
        },
        termsAndConditions: {
            parentKey: "UserBusinessInfo",
            key: "termsAndConditions",
            label: "Terms and Conditions",
            placeholder: "Eg : Terms and Conditions",
            icon: <Feather name="clipboard" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: businessDetails?.userBusinessInfo?.termsAndConditions ?? "",
            isLoading: loading,
            onChange: (value: string) => {
                patchState("userBusinessInfo", "termsAndConditions", value, false, setBusinessDetails, setErrors);
            }
        }
    }), [businessDetails]);

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
        setLoading(true)
        const updateBusinessDetailsResponse = await updateBusinessDetailsApi(businessDetails);
        setLoading(false)
        if (!updateBusinessDetailsResponse.success) {
            return showToast({ type: "error", title: "Error", message: updateBusinessDetailsResponse.message ?? 'Something went wrong' })
        }
        setUserDetails(businessDetails)
        showToast({ type: "success", title: "Success", message: updateBusinessDetailsResponse.message ?? 'Successfully registered' })

    }

    useEffect(() => {
        const userId = getItem("USERID");
        getUserDetailsUsingID(userId, showToast);
    }, [])

useEffect(() => {
    if (userDetails) {
        setBusinessDetails(prev => ({
            ...prev,
            ...userDetails,
            userBusinessInfo: { 
                ...prev.userBusinessInfo, 
                ...userDetails.userBusinessInfo 
            },
            userBillingInfo: { 
                ...prev.userBillingInfo, 
                ...userDetails.userBillingInfo 
            },
        }));
    }
}, [userDetails]);


    useEffect(() => {
        const country = userDetails?.userBillingInfo?.country;

        if (!country) return;

        const newCurrencyIcon = getCurrencySymbol(country);

        // Update only if changed — avoid loop
        setUserDetails(prev => {
            if (prev.currencyIcon === newCurrencyIcon) return prev;

            return {
                ...prev,
                currencyIcon: newCurrencyIcon
            };
        });
    }, [userDetails?.userBillingInfo?.country]);


    return (
        <View style={[globalStyles.appBackground]}>
            <BackHeader screenName="Edit Business Details" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Card style={[globalStyles.cardShadowEffect,globalStyles.formBackGroundColor]}>
                        <View>
                            <View className="flex flex-row items-center gap-3" style={{ marginBottom: hp('1%') }}>
                                <Feather name="briefcase" size={wp("7%")} color={isDark ? "#fff" : "#000"} />
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Business Details</Text>
                            </View>
                            <Divider />
                            <View>
                                <View className="flex justify-center items-center" style={{ marginVertical: hp('2%') }}>
                                    <TouchableOpacity onPress={openGallery}>
                                        {businessDetails?.userBusinessInfo?.companyLogoURL ? (
                                            <Image source={{ uri: businessDetails?.userBusinessInfo?.companyLogoURL }} style={styles.image} />
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
                                <CustomFieldsComponent infoFields={businessInfoFields} errors={errors} />
                            </View>

                        </View>
                    </Card>
                    <Card style={[globalStyles.cardShadowEffect,globalStyles.formBackGroundColor, { marginTop: hp('2%') }]}>
                        <View>
                            <View className="flex flex-row items-center gap-3" style={{ marginBottom: hp('1%') }}>
                                <Feather name="credit-card" size={wp("7%")} color={isDark ? "#fff" : "#000"} />
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Billing Details</Text>
                            </View>
                            <Divider />
                        </View>
                        <View style={{ marginTop: hp('2%') }}>
                            <CustomFieldsComponent infoFields={billingInfoFields} errors={errors} />
                        </View>

                    </Card>
                    <View className="flex-end items-end justify-end" style={{ marginVertical: hp('2%') }}>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.buttonColor, { marginHorizontal: wp('2%') }]} isDisabled={loading || Object.keys(errors).length > 0} onPress={handleSubmit}>
                            {loading && (
                                <ButtonSpinner color={"#fff"} size={wp("4%")} />
                            )
                            }
                            <Feather name="save" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>Update</ButtonText>
                        </Button>


                    </View>
                </View>
            </ScrollView>
        </View>
    )

}

export default BusinessDetails