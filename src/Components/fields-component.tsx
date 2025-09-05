import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
} from "@/components/ui/form-control"
import { JSX, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ThemeToggleContext, StyleContext } from "../providers/theme/global-style-provider";
import { BasicInfo, BasicInfoFields, BillingInfo } from "../screens/customer/types";
import { Dropdown } from "react-native-element-dropdown";


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
    checkContainer: {
        padding: hp('1%'),
        borderRadius: wp('2%'),
        borderColor: '#d1d5db',
        borderWidth: wp('0.4%'),
        minHeight: hp('6%'),
        justifyContent: 'center',
        paddingHorizontal: wp('2%'),
        width: 'auto'
    },
    dropdown: {
        height: hp('4.5%'),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: wp('1%'),
        paddingHorizontal: wp('2%'),
    },
})

type CustomCheckBoxProps = {
    children: JSX.Element[]
    selectedStyle?: Object
    styles?: Object
}

export const CustomFieldsComponent = ({ infoFields }: { infoFields: Record<string, BasicInfoFields> }) => {
    const fieldsArray = Object.values(infoFields);
    const rows: JSX.Element[] = [];
    const globalStyles = useContext(StyleContext);

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
                                <Dropdown
                                    style={styles.dropdown}
                                    data={field?.dropDownItems || []}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={field?.placeholder}
                                    searchPlaceholder="Search..."
                                    onChange={() => { }}
                                    renderItem={(item, isSelected) => {
                                        return (
                                            <Text style={{ padding: 12, backgroundColor: isSelected ? "#eee" : "white" }}>
                                                {item.label}
                                            </Text>
                                        )

                                    }}
                                />
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

export const CustomCheckBox = (props: CustomCheckBoxProps) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        setSelected(!selected);
    };

    return (
        <TouchableOpacity style={[styles.checkContainer, selected && (props.selectedStyle || { backgroundColor: '#FDF2F8', borderColor: '#8B5CF6' }), props.styles]} onPress={handleSelect}>
            <View>
                {props.children}
            </View>

        </TouchableOpacity>
    )

}