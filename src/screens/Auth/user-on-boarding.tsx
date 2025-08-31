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
import { launchImageLibrary } from 'react-native-image-picker';
import { Button, ButtonText } from '@/components/ui/button';
import { FormFields } from '@/src/types/common';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon } from "@/components/ui/icon"
import { BUSINESSTYPE } from '@/src/constant/constants';
import { getCountries, getStates } from '@/src/utils/utils';
import { Image } from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { Country } from 'country-state-city';

const styles = StyleSheet.create({
    userOnBoardBody: {
        margin: hp("2%"),
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
    const [currStep, setCurrStep] = useState(1);
    const [headings, setHeadings] = useState(["Company Profile (Basic Info)", "Business Address & Tax Info", "Preferences & Accounting Setup"]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const businessDetailsRefs=useRef<Record<any,any>>({
        companyName: null,
        businessType: null,
        businessPhoneNumber: null,
        businessEmail: null,
        website: null,
        gstNumber: null,
        panNumber: null,
        address: null,
        city: null,
        state: null,
        country: null,
        pinCode: null
    });

    const openGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (!response.didCancel && !response.errorCode) {
                console.log(response?.assets[0].uri || '');
            }
        });
    };

    const formFields: FormFields = {
        0: [
            {
                key: 'companyName',
                label: 'Company Name*',
                type: 'text',
                placeholder: 'Eg : ABC Company',
                icon: "briefcase",
            },
            {
                key: 'businessType',
                label: 'Business Type*',
                type: 'select',
                placeholder: 'Select Business Type',
                icon: "briefcase",
                renderItems: () => (
                    BUSINESSTYPE.map((type, index) => (
                        <SelectItem key={index} label={type} value={type} />
                    ))
                ),
            },
            {
                label: 'Business Phone Number*',
                type: 'number',
                placeholder: 'Eg : 1234567890',
                icon: "phone",
            },
            {
                label: 'Business Email*',
                type: 'email',
                placeholder: 'Eg : YJy0g@example.com',
                icon: "mail",
            },
            {
                label: 'Website',
                type: 'email',
                placeholder: 'Eg : https://abc.com (Optional)',
                icon: "globe",
            },
        ],
        1: [
            {
                label: 'GST Number',
                type: 'text',
                placeholder: 'Eg : 1234567890',
                icon: 'file-text',
            },
            {
                label: 'PAN Number',
                type: 'text',
                placeholder: 'Eg : 1234567890',
                icon: 'file-text',
            },
            {
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
                }
            },
            {
                label: 'State',
                type: 'select',
                icon: 'map-pin',
                renderItems: () => (
                    getStates(selectedCountry || "IN").map((state, index) => (
                        <SelectItem key={index} label={state.name} value={state.isoCode} />
                    ))
                ),
            },
            {
                label: 'City',
                type: 'text',
                placeholder: 'Eg : Mumbai',
                icon: 'map-pin',
            },
            {
                label: 'Address',
                type: 'text',
                placeholder: 'Eg : Mumbai',
                icon: 'map',
            },
            {
                label: 'Pincode',
                type: 'text',
                placeholder: 'Eg : 400001',
                icon: 'hash',
            },
        ],
        2: [
            {
                label: 'Default Currency',
                type: 'text',
                placeholder: 'Eg : INR',
                icon: 'dollar-sign',
                value: Country.getCountryByCode(selectedCountry || "IN")?.currency || "INR",
                isDisabled: true
            },
            {
                label: 'Notification Preference',
                type: 'select',
                icon: 'bell',
                renderItems: () => (
                    ["Email", "Push Notification"].map((method, index) => (
                        <SelectItem key={index} label={method} value={method} />
                    ))
                ),
            },
            {
                label: 'Theme',
                type: 'select',
                icon: 'sun',
                renderItems: () => (
                    ["Light", "Dark", "System Default"].map((theme, index) => (
                        <SelectItem key={index} label={theme} value={theme} />
                    ))
                )
            }

        ]
    };

    const handlePrev=()=>{
        if(currStep>0){
            setCurrStep(currStep-1);
        }
    }

    const handleNext=()=>{
        if(currStep<2){
            setCurrStep(currStep+1);
        }
    }

    const handleSubmit=()=>{
        console.log(businessDetailsRefs);
    }

    return (
        <View style={styles.body}>
            {/* Header */}
            <View style={styles.headingContainer}>
                <View className="justify-center items-center">
                    <Card size='xs' variant='ghost'>
                        <View className='flex justify-center items-center'>
                            <Image size='lg' source={Logo} />
                        </View>
                    </Card>
                    <Text style={[globalStyles.purpleTextColor, globalStyles.headingText, styles.headingContainer]}>
                        INFINITY COLORLAB
                    </Text>
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
                                        <TouchableOpacity style={styles.imageUploadContainer} onPress={openGallery}>
                                            <Feather name="upload" size={wp("10%")} color="#d1d5db" />
                                            <Text style={[globalStyles.greyTextColor, globalStyles.labelText]}>
                                                Upload
                                            </Text>
                                            <Text style={[globalStyles.greyTextColor, globalStyles.labelText]}>
                                                Size less than 5MB
                                            </Text>
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
                                        <Select onValueChange={(value) => businessDetailsRefs.current[field?.key] = value} selectedValue={businessDetailsRefs.current[field?.key]}>
                                            <SelectTrigger>
                                                <SelectInput placeholder="Select option" className="flex-1"/>
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
                                                onChangeText={text => businessDetailsRefs.current[field?.key] = text}
                                                readOnly={field?.isDisabled || false}
                                                secureTextEntry={field?.type === "password"}
                                                value={businessDetailsRefs.current[field?.key] || undefined}
                                            />
                                        </Input>
                                    )

                                    }

                                </FormControl>
                            ))}
                        </ScrollView>
                        <View style={styles.fixedButtonContainer}>
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground} isDisabled={currStep == 0} onPress={() => setCurrStep(currStep - 1)}>
                                <Feather name="arrow-left" size={wp("5%")} color="#000" />
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>Prev</ButtonText>
                            </Button>
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground} onPress={currStep == 2 ? handleSubmit : () => setCurrStep(currStep + 1)}>
                                <ButtonText style={globalStyles.buttonText}>{currStep == 2 ? "Submit" : "Next"}</ButtonText>
                                {currStep!=2 && <Feather name="arrow-right" size={wp("5%")} color="#fff" />}
                            </Button>
                        </View>
                    </Card>
                </View>
            </View>
        </View>
    );
};

export default UserOnBoarding;