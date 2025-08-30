import React, { JSX, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Header from '@/src/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientCard from '@/src/utils/gradient-gard';
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
import { getCountries, getStates } from '@/src/utils/utils';
import { Button,ButtonText } from '@/components/ui/button';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { BasicInfo, BillingInfo,BasicInfoFields } from './types';
import { SelectItem } from '@/components/ui/select';
const styles = StyleSheet.create({

    accordionHeader: {
        backgroundColor: '#EFF6FF',
        height: hp('8%'),
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




const CreateCustomer = () => {
    const globalStyles = useContext(StyleContext);
    const basicInfoFields: BasicInfo = {
        firstName: {
            label: "First Name",
            placeholder: "Enter First Name",
            icon: <Feather name="user" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        lastName: {
            label: "Last Name",
            placeholder: "Enter Last Name",
            icon: <Feather name="camera" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
         mobileNumber: {
            label: "Mobile Number",
            placeholder: "Enter Mobile Number",
            icon: <Feather name="phone" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },
        email: {
            label: "Email",
            placeholder: "Enter Email",
            icon: <Feather name="mail" size={wp('5%')} color="#8B5CF6" />,
            type: "email",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },
        notes: {
            label: "Notes",
            placeholder: "Enter Notes",
            icon: <Feather name="file-text" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            extraStyles: { height: hp('10%'), paddingTop: hp('1%') },
        }
    }

    const billingInfoFields: BillingInfo = {
        street: {
            label: "Street/Landmark",
            placeholder: "Enter Street",
            icon: <Feather name="home" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
        },
        city: {
            label: "City",
            placeholder: "Enter City",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },
        country: {
            label: "Country",
            placeholder: "Enter Country",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            renderItems: () => {
                return getCountries().map((country, index) => (
                    <SelectItem key={index} label={country.name} value={country.isoCode}>
                        {country.name}
                    </SelectItem>
                ));
            }
        },
        state: {
            label: "State",
            placeholder: "Enter State",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            renderItems: () => {
                return getStates("IN").map((state, index) => (
                    <SelectItem key={index} label={state.name} value={state.isoCode} />
                ));
            }
        },
        zipCode: {
            label: "Zip Code",
            placeholder: "Enter Zip Code",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },

    }


    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp("5%") }} // some spacing at bottom
                showsVerticalScrollIndicator={false}
            >

                <View>
                    <View style={{ marginVertical: hp('1%') }} className='flex justify-between items-center flex-row'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text]}>Create Customer</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                        </View>
                        <Button size="lg" variant="solid" action="primary"  style={[globalStyles.purpleBackground,{marginHorizontal:wp('2%')}]}>
                            <Feather name="save" size={wp('5%')} color="#fff" />
                            <ButtonText style={globalStyles.buttonText}>Save</ButtonText>
                        </Button>

                    </View>
                    <View className='flex flex-col'>

                        <Accordion
                            size="md"
                            variant="filled"
                            type="single"
                            isCollapsible={true}
                            isDisabled={false}
                            className="m-5 w-[90%] border border-outline-200"
                        >
                            <AccordionItem value="a">
                                <AccordionHeader style={styles.accordionHeader}>
                                    <AccordionTrigger>
                                        {({ isExpanded }: { isExpanded: boolean }) => {
                                            return (
                                                <>
                                                    <View className='flex flex-row  items-center justify-center'>
                                                        <Feather name="user" size={wp('5%')} color="#8B5CF6" />
                                                        <Text style={[globalStyles.heading3Text, { marginLeft: wp('2%') }]}>Basic Information</Text>

                                                    </View>
                                                    {isExpanded ? (
                                                        <Feather name="chevron-up" size={wp('5%')} color="#000" />
                                                    ) : (
                                                        <Feather name="chevron-down" size={wp('5%')} color="#000" />
                                                    )}
                                                </>
                                            )
                                        }}
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent>
                                    <CustomFieldsComponent infoFields={basicInfoFields} />
                                </AccordionContent>
                            </AccordionItem>
                            <Divider />
                            <AccordionItem value="b">
                                <AccordionHeader style={styles.accordionHeader}>
                                    <AccordionTrigger>
                                        {({ isExpanded }: { isExpanded: boolean }) => {
                                            return (
                                                <>
                                                    <View className='flex flex-row  items-center justify-center'>
                                                        <Feather name="credit-card" size={wp('5%')} color="#8B5CF6" />
                                                        <Text style={[globalStyles.heading3Text, { marginLeft: wp('2%') }]}>Billing Information</Text>

                                                    </View>
                                                    {isExpanded ? (
                                                        <Feather name="chevron-up" size={wp('5%')} color="#000" />
                                                    ) : (
                                                        <Feather name="chevron-down" size={wp('5%')} color="#000" />
                                                    )}
                                                </>
                                            )
                                        }}
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent>
                                    <CustomFieldsComponent infoFields={billingInfoFields} />
                                </AccordionContent>
                                </AccordionItem>
                        </Accordion>


                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateCustomer;