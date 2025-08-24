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
import { WORKSTATUS } from '@/src/constant/Constants';
import DatePicker from 'react-native-date-picker'
import { getCountries, getStates } from '@/src/utils/Utils';
import { Button,ButtonText } from '@/components/ui/button';

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
    extraStyles?: object;
    renderItems?: () => React.ReactNode;
}
interface BasicInfo {
    customerName: BasicInfoFields;
    eventName: BasicInfoFields;
    eventStatus: BasicInfoFields;
    eventDate: BasicInfoFields;
    package: BasicInfoFields;
    advancePayment: BasicInfoFields;
    balanceAmount: BasicInfoFields;

}

interface BillingInfo {
    street: BasicInfoFields;
    city: BasicInfoFields;
    state: BasicInfoFields;
    zipCode: BasicInfoFields;
    country: BasicInfoFields;
}

interface MoreInfo {
    mobileNumber: BasicInfoFields;
    email: BasicInfoFields;
    status: BasicInfoFields;
    deliveryDate: BasicInfoFields;
    deliverables: BasicInfoFields;
    notes: BasicInfoFields;
}

type Props = {
    infoFields: BasicInfo | BillingInfo | MoreInfo;
}
const CreateCustomer = () => {
    const globalStyles = useContext(StyleContext);
    const basicInfoFields: BasicInfo = {
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
            type: "select",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
            renderItems: () => {
                return WORKSTATUS.map((status, index) => (
                    <SelectItem key={index} label={status} value={status}>
                        {status}
                    </SelectItem>
                ));
            },
        },
        eventDate: {
            label: "Event Date",
            placeholder: "DD/MM/YYYY",
            icon: <Feather name="calendar" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        package: {
            label: "Package",
            placeholder: "Enter Package",
            icon: <MaterialIcons name="currency-rupee" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
        },
        advancePayment: {
            label: "Advance Payment",
            placeholder: "Enter Advance Payment",
            icon: <Feather name="credit-card" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },
        balanceAmount: {
            label: "Balance Amount",
            placeholder: "Enter Balance Amount",
            icon: <Feather name="credit-card" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: true,
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

    const moreInfoFields: MoreInfo = {
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
        status: {
            label: "Status",
            placeholder: "Select Status",
            icon: <Feather name="flag" size={wp('5%')} color="#8B5CF6" />,
            type: "select",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
            renderItems: () => {
                return WORKSTATUS.map((status, index) => (
                    <SelectItem key={index} label={status} value={status}>
                        {status}
                    </SelectItem>
                ));
            },
        },
        deliveryDate: {
            label: "Delivery Date",
            placeholder: "DD/MM/YYYY",
            icon: <Feather name="calendar" size={wp('5%')} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        },
        deliverables: {
            label: "Deliverables",
            placeholder: "Enter Deliverables",
            icon: <Feather name="package" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
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

    const CustomFieldsComponent = ({ infoFields }: Props) => {
        const fieldsArray = Object.values(infoFields);
        const rows: JSX.Element[] = [];

        let i = 0;
        while (i < fieldsArray.length) {
            const field: BasicInfoFields = fieldsArray[i];

            // Case 1: Pair w-1/2 fields together
            if (field.style === "w-1/2" && i < fieldsArray.length - 1) {
                const nextField: BasicInfoFields = fieldsArray[i + 1];
                if (nextField.style === "w-1/2") {
                    rows.push(
                        <View key={i} style={styles.row}>
                            {/* First Half Field */}
                            <FormControl style={{ width: wp("40%"), marginRight: wp("2%") }}>
                                <FormControlLabel className="gap-2">
                                    <FormControlLabelText
                                        style={[globalStyles.normalTextColor, globalStyles.labelText]}
                                    >
                                        {field?.label}
                                        {field?.isRequired && <Text style={{ color: "red" }}>*</Text>}
                                    </FormControlLabelText>
                                </FormControlLabel>
                                {field?.type === "select" ? (
                                    <Select>
                                        <SelectTrigger>
                                            <SelectInput placeholder={field?.placeholder} className="flex-1" />
                                            <SelectIcon as={ChevronDownIcon} />
                                        </SelectTrigger>
                                        <SelectPortal>
                                            <SelectBackdrop />
                                            <SelectContent>
                                                {field?.renderItems && field.renderItems()}
                                            </SelectContent>
                                        </SelectPortal>
                                    </Select>
                                ) :
                                    (
                                        <Input size="lg" isDisabled={field?.isDisabled}>
                                            <InputSlot>{field?.icon}</InputSlot>
                                            <InputField
                                                type={field?.type}
                                                placeholder={field?.placeholder}
                                                keyboardType={field?.type === "number" ? "numeric" : "default"}
                                            />
                                        </Input>
                                    )}
                                {field?.isRequired && (
                                    <FormControlHelper>
                                        <FormControlHelperText
                                            style={[globalStyles.greyTextColor, globalStyles.smallText]}
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
                                        style={[globalStyles.normalTextColor, globalStyles.labelText]}
                                    >
                                        {nextField?.label}
                                        {nextField?.isRequired && (
                                            <Text style={{ color: "red" }}>*</Text>
                                        )}
                                    </FormControlLabelText>
                                </FormControlLabel>
                                {nextField?.type === "select" ? (
                                    <Select>
                                        <SelectTrigger>
                                            <SelectInput placeholder={nextField?.placeholder} />
                                            <SelectIcon as={ChevronDownIcon} />
                                        </SelectTrigger>
                                        <SelectPortal>
                                            <SelectBackdrop />
                                            <SelectContent>
                                                {nextField?.renderItems && nextField.renderItems()}
                                            </SelectContent>
                                        </SelectPortal>
                                    </Select>
                                ) : (
                                    <Input size="lg" isDisabled={nextField?.isDisabled}>
                                        <InputSlot>{nextField?.icon}</InputSlot>
                                        <InputField
                                            type={nextField?.type}
                                            placeholder={nextField?.placeholder}
                                            keyboardType={
                                                nextField?.type === "number" ? "numeric" : "default"
                                            }
                                        />
                                    </Input>
                                )}
                                {nextField?.isRequired && (
                                    <FormControlHelper>
                                        <FormControlHelperText
                                            style={[globalStyles.greyTextColor, globalStyles.smallText]}
                                        >
                                            This field is required
                                        </FormControlHelperText>
                                    </FormControlHelper>
                                )}
                            </FormControl>
                        </View>
                    );
                    i += 2; // Skip the next field since it was already rendered
                    continue;
                }
            }

            // Case 2: Render full-width field
            if (field.style === "w-full") {
                rows.push(
                    <FormControl key={i}>
                        <FormControlLabel className="gap-2">
                            <FormControlLabelText
                                style={[globalStyles.normalTextColor, globalStyles.labelText]}
                            >
                                {field?.label}
                                {field?.isRequired && <Text style={{ color: "red" }}>*</Text>}
                            </FormControlLabelText>
                        </FormControlLabel>
                        {field?.type === "select" ? (
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectInput placeholder={field?.placeholder} />
                                    <SelectIcon as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        {field?.renderItems && field.renderItems()}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        ) : (
                            <Input size="lg" isDisabled={field?.isDisabled} style={field?.extraStyles}>
                                <InputSlot>{field?.icon}</InputSlot>
                                <InputField
                                    type={field?.type}
                                    placeholder={field?.placeholder}
                                    keyboardType={field?.type === "number" ? "numeric" : "default"}
                                />
                            </Input>
                        )}
                        {field?.isRequired && (
                            <FormControlHelper>
                                <FormControlHelperText
                                    style={[globalStyles.greyTextColor, globalStyles.smallText]}
                                >
                                    This field is required
                                </FormControlHelperText>
                            </FormControlHelper>
                        )}
                    </FormControl>
                );
            }

            i++; // Move to next field
        }

        return <Card style={styles.cardContainer}>{rows}</Card>;
    };


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
                                <Divider />
                            </AccordionItem>
                            <AccordionItem value="c">
                                <AccordionHeader style={styles.accordionHeader}>
                                    <AccordionTrigger>
                                        {({ isExpanded }: { isExpanded: boolean }) => {
                                            return (
                                                <>
                                                    <View className='flex flex-row  items-center justify-center'>
                                                        <Feather name="info" size={wp('5%')} color="#8B5CF6" />
                                                        <Text style={[globalStyles.heading3Text, { marginLeft: wp('2%') }]}>More Information</Text>

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
                                    <CustomFieldsComponent infoFields={moreInfoFields} />
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