import React, { JSX, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import Header from '@/src/Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientCard from '@/src/utils/GradientCard';
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
import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
} from "@/components/ui/form-control"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
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

interface BasicInfoFields {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    type: string;
    style: string;
    isRequired: boolean;
    isDisabled: boolean;
}
interface BasicInfo {
    customerName: BasicInfoFields;
    eventName: BasicInfoFields;
    eventStatus: BasicInfoFields;
    eventDate: BasicInfoFields;
    localtion: BasicInfoFields;
    package: BasicInfoFields;
    advancePayment: BasicInfoFields;
    balanceAmount: BasicInfoFields;

}
const CreateCustomer = () => {
    const globalStyle = useContext(StyleContext);
    const basicInfoFields = {
        customerName: {
            label: "Customer Name",
            placeholder: "Enter Customer Name",
            icon: <Feather name="user" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
        },
        eventName: {
            label: "Event Name",
            placeholder: "Enter Event Name",
            icon: <Feather name="camera" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        eventStatus: {
            label: "Work Status",
            placeholder: "Select Status",
            icon: <Feather name="flag" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        eventDate: {
            label: "Event Date",
            placeholder: "DD/MM/YYYY",
            icon: <Feather name="calendar" size={wp('5%')} color="#8B5CF6" />,
            type: "date",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        location: {
            label: "Location",
            placeholder: "Enter Location",
            icon: <Feather name="map-pin" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        package: {
            label: "Package",
            placeholder: "Enter Package",
            icon: <MaterialIcons name="currency-rupee" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: false, 
            isDisabled: false,
        },
        advancePayment: {
            label: "Advance Payment",
            placeholder: "Enter Advance Payment",
            icon: <Feather name="credit-card" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },
        balanceAmount: {
            label: "Balance Amount",
            placeholder: "Enter Balance Amount",
            icon: <Feather name="credit-card" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: false,
            isDisabled: true,
        }
    }

    const BasicInfoComponent = () => {
        const fieldsArray = Object.values(basicInfoFields);
        const rows: JSX.Element[] = [];

        let i = 0;
        while (i < fieldsArray.length) {
            const field = fieldsArray[i];

            // Case 1: Pair w-1/2 fields together
            if (field.style === "w-1/2" && i < fieldsArray.length - 1) {
                const nextField = fieldsArray[i + 1];
                if (nextField.style === "w-1/2") {
                    rows.push(
                        <View key={i} style={styles.row}>
                            {/* First Half Field */}
                            <FormControl style={{ width: wp("40%"), marginRight: wp("2%") }}>
                                <FormControlLabel className="gap-2">
                                    <FormControlLabelText
                                        style={[globalStyle.normalTextColor, globalStyle.labelText]}
                                    >
                                        {field?.label}
                                        {field?.isRequired && <Text style={{ color: "red" }}>*</Text>}
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" isDisabled={field?.isDisabled}>
                                    <InputSlot>{field?.icon}</InputSlot>
                                    <InputField
                                        type={field?.type}
                                        placeholder={field?.placeholder}
                                        keyboardType={field?.type === "date" ? "numeric" : "default"}
                                    />
                                </Input>
                                {field?.isRequired && (
                                    <FormControlHelper>
                                        <FormControlHelperText
                                            style={[globalStyle.greyTextColor, globalStyle.smallText]}
                                        >
                                            This field is required
                                        </FormControlHelperText>
                                    </FormControlHelper>
                                )}
                            </FormControl>

                            {/* Second Half Field */}
                            <FormControl style={{ width: wp("50%") }}>
                                <FormControlLabel className="gap-2">
                                    <FormControlLabelText
                                        style={[globalStyle.normalTextColor, globalStyle.labelText]}
                                    >
                                        {nextField?.label}
                                        {nextField?.isRequired && (
                                            <Text style={{ color: "red" }}>*</Text>
                                        )}
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" isDisabled={nextField?.isDisabled}>
                                    <InputSlot>{nextField?.icon}</InputSlot>
                                    <InputField
                                        type={nextField?.type}
                                        placeholder={nextField?.placeholder}
                                        keyboardType={
                                            nextField?.type === "date" ? "numeric" : "default"
                                        }
                                    />
                                </Input>
                                {nextField?.isRequired && (
                                    <FormControlHelper>
                                        <FormControlHelperText
                                            style={[globalStyle.greyTextColor, globalStyle.smallText]}
                                        >
                                            This field is required
                                        </FormControlHelperText>
                                    </FormControlHelper>
                                )}
                            </FormControl>
                        </View>
                    );
                    i += 2; // ✅ Skip the next field since it was already rendered
                    continue;
                }
            }

            // Case 2: Render full-width field
            if (field.style === "w-full") {
                rows.push(
                    <FormControl key={i}>
                        <FormControlLabel className="gap-2">
                            <FormControlLabelText
                                style={[globalStyle.normalTextColor, globalStyle.labelText]}
                            >
                                {field?.label}
                                {field?.isRequired && <Text style={{ color: "red" }}>*</Text>}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" isDisabled={field?.isDisabled}>
                            <InputSlot>{field?.icon}</InputSlot>
                            <InputField
                                type={field?.type}
                                placeholder={field?.placeholder}
                                keyboardType={field?.type === "date" ? "numeric" : "default"}
                            />
                        </Input>
                        {field?.isRequired && (
                            <FormControlHelper>
                                <FormControlHelperText
                                    style={[globalStyle.greyTextColor, globalStyle.smallText]}
                                >
                                    This field is required
                                </FormControlHelperText>
                            </FormControlHelper>
                        )}
                    </FormControl>
                );
            }

            i++; // move to next field
        }

        return <Card style={styles.cardContainer}>{rows}</Card>;
    };


    return (
        <SafeAreaView style={globalStyle.appBackground}>
            <Header />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp("5%") }} // some spacing at bottom
                showsVerticalScrollIndicator={false}
            >

                <View>
                    <View style={{ marginVertical: hp('1%') }}>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyle.heading2Text]}>Create Customer</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                        </View>

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
                                                        <Text style={[globalStyle.heading3Text, { marginLeft: wp('2%') }]}>Basic Information</Text>

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
                                    <BasicInfoComponent />
                                </AccordionContent>
                            </AccordionItem>
                            <Divider />
                            <AccordionItem value="b">
                                <AccordionHeader>
                                    <AccordionTrigger>
                                        {({ isExpanded }: { isExpanded: boolean }) => {
                                            return (
                                                <>
                                                    <AccordionTitleText>
                                                        What payment methods do you accept?
                                                    </AccordionTitleText>
                                                    {isExpanded ? (
                                                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                                                    ) : (
                                                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                                                    )}
                                                </>
                                            )
                                        }}
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent>
                                    <AccordionContentText>
                                        We accept all major credit cards, including Visa, Mastercard, and
                                        American Express. We also support payments through PayPal.
                                    </AccordionContentText>
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