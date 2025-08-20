import GradientCard from '@/src/utils/GradientCard';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { Divider } from '@/components/ui/divider';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { launchImageLibrary } from 'react-native-image-picker';
import { Button, ButtonText } from '@/components/ui/button';
import { FormFields } from '@/src/types/common';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';

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
});

const UserOnBoarding = () => {
    const globalStyles = useContext(StyleContext);
    const [currStep, setCurrStep] = useState(0);
    const [headings, setHeadings] = useState(["Company Profile (Basic Info)", "Business Address & Tax Info", "Preferences & Accounting Setup"]);

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
                label: 'Company Name*',
                type: 'text',
                placeholder: 'Eg : ABC Company',
                icon: "briefcase",
            },
            {
                label: 'Business Type*',
                type: 'select',
                placeholder: 'Select Business Type',
                values: ['IT', 'Automotive', 'Others'],
                icon: "briefcase",
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
                type: 'text',
                placeholder: 'Eg : India',
                icon: 'globe',
            },
            {
                label: 'State',
                type: 'text',
                placeholder: 'Eg : Maharashtra',
                icon: 'map-pin',
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
            },
            {
                label: 'Notification Preference',
                type: 'text',
                placeholder: 'Eg : Email',
                icon: 'bell'
            },
            {
                label: 'Theme',
                type: 'text',
                placeholder: 'Eg : Light',
                icon: 'sun'
            }

        ]
    };

    return (
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
                            <FormControlLabel>
                                <FormControlLabelText
                                    style={[globalStyles.normalTextColor, globalStyles.labelText]}
                                >
                                    {field?.label}
                                </FormControlLabelText>
                            </FormControlLabel>
                            {field?.type == "select" ? (
                                <Select>
                                    <SelectTrigger>
                                        <SelectInput placeholder="Select option" className="flex-1" />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            <SelectItem label="Red" value="red" />
                                            <SelectItem label="Blue" value="blue" />
                                            <SelectItem label="Black" value="black" />
                                            <SelectItem label="Pink" value="pink" isDisabled={true} />
                                            <SelectItem label="Green" value="green" />
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            ) : (
                                <Input size="lg">
                                    <InputSlot style={{ paddingLeft: wp("2%") }}>
                                        <Feather name={field?.icon} size={wp("5%")} color="#000" />
                                    </InputSlot>
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
                                        secureTextEntry={field?.type === "password"}
                                    />
                                </Input>
                            )

                            }

                        </FormControl>
                    ))}
                </ScrollView>
                <View style={styles.fixedButtonContainer}>
                    <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                        <Feather name="arrow-left" size={wp("5%")} color="#000" />
                        <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>Prev</ButtonText>
                    </Button>
                    <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground}>
                        <ButtonText style={globalStyles.buttonText}>Next</ButtonText>
                        <Feather name="arrow-right" size={wp("5%")} color="#fff" />

                    </Button>
                </View>
            </Card>
        </View>
    );
};

export default UserOnBoarding;