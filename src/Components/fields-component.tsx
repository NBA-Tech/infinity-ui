import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlError,
    FormControlErrorText,
} from "@/components/ui/form-control"
import { JSX, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ThemeToggleContext, StyleContext } from "../providers/theme/global-style-provider";
import { Dropdown } from "react-native-element-dropdown";
import { FormField } from "../types/common";
import Feather from 'react-native-vector-icons/Feather';

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
        height: hp('5%'),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: wp('1%'),
        paddingHorizontal: wp('2%'),
    },
    dropdownContainer: {
        paddingHorizontal: wp('2%'),
    }
})

type CustomCheckBoxProps = {
    children: JSX.Element[]
    selectedStyle?: Object
    styles?: Object
}

export const CustomFieldsComponent = ({ infoFields, errors, cardStyle }: { infoFields: Record<string, any>, errors?: Record<string, any>, cardStyle?: object }) => {
    const fieldsArray = Object.values(infoFields);
    const rows: JSX.Element[] = [];
    const globalStyles = useContext(StyleContext);

    let i = 0;
    while (i < fieldsArray.length) {
        const field: FormField = fieldsArray[i];

        // Case 1: Pair w-1/2 fields together
        if (field.style === "w-1/2" && i < fieldsArray.length - 1) {
            const nextField: FormField = fieldsArray[i + 1];
            if (nextField.style === "w-1/2") {
                rows.push(
                    <View key={i} style={styles.row}>
                        {/* First Half Field */}
                        <FormControl
                            style={{ width: wp("43%"), marginRight: wp("2%") }}
                            isInvalid={!!errors?.[field.key]}
                        >
                            <FormControlLabel>
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
                                    containerStyle={styles.dropdownContainer}
                                    data={field?.dropDownItems || []}
                                    search
                                    value={field?.value}
                                    placeholderStyle={[globalStyles.labelText, { color: "#808080" }]}
                                    inputSearchStyle={globalStyles.labelText}
                                    itemTextStyle={globalStyles.labelText}
                                    selectedTextStyle={globalStyles.labelText}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={field?.placeholder}
                                    searchPlaceholder="Search..."
                                    onChange={(value) => field?.onChange?.(value?.value)}
                                    renderItem={(item) => (
                                        <Text
                                            style={[
                                                globalStyles.normalTextColor,
                                                globalStyles.labelText,
                                                { paddingVertical: hp("0.5%") },
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    )}
                                />
                            ) : (
                                <Input size="lg" isDisabled={field?.isDisabled}>
                                    <InputSlot>{field?.icon}</InputSlot>
                                    <InputField
                                        type={field?.type}
                                        placeholder={field?.placeholder}
                                        keyboardType={field?.type === "number" ? "numeric" : "default"}
                                        onChangeText={(value) => field?.onChange?.(value)}
                                        onBlur={() =>
                                            field?.onBlur && field?.onBlur(field?.parentKey, field?.key)
                                        }
                                    />
                                </Input>
                            )}

                            {field?.isRequired && !errors?.[field.key] && (
                                <FormControlHelper>
                                    <FormControlHelperText
                                        style={[globalStyles.greyTextColor, globalStyles.smallText]}
                                    >
                                        This field is required
                                    </FormControlHelperText>
                                </FormControlHelper>
                            )}
                            {errors?.[field.key] && (
                                <FormControlError style={globalStyles.errorContainer}>
                                    <Feather name="alert-triangle" size={20} color="#D32F2F" />
                                    <FormControlErrorText style={globalStyles.errorText}>
                                        {errors[field.key]}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Second Half Field */}
                        <FormControl
                            style={{ width: wp("50%") }}
                            isInvalid={!!errors?.[nextField.key]}
                        >
                            <FormControlLabel className="gap-2">
                                <FormControlLabelText
                                    style={[globalStyles.normalTextColor, globalStyles.labelText]}
                                >
                                    {nextField?.label}
                                    {nextField?.isRequired && <Text style={{ color: "red" }}>*</Text>}
                                </FormControlLabelText>
                            </FormControlLabel>

                            {nextField?.type === "select" ? (
                                <Dropdown
                                    style={styles.dropdown}
                                    containerStyle={styles.dropdownContainer}
                                    data={nextField?.dropDownItems || []}
                                    search
                                    value={nextField?.value}
                                    placeholderStyle={[globalStyles.labelText, { color: "#808080" }]}
                                    inputSearchStyle={globalStyles.labelText}
                                    itemTextStyle={globalStyles.labelText}
                                    selectedTextStyle={globalStyles.labelText}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={nextField?.placeholder}
                                    searchPlaceholder="Search..."
                                    onChange={(value) => nextField?.onChange?.(value?.value)}
                                    renderItem={(item) => (
                                        <Text
                                            style={[
                                                globalStyles.normalTextColor,
                                                globalStyles.labelText,
                                                { paddingVertical: hp("0.5%") },
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    )}
                                />
                            ) : (
                                <Input size="lg" isDisabled={nextField?.isDisabled}>
                                    <InputSlot>{nextField?.icon}</InputSlot>
                                    <InputField
                                        type={nextField?.type}
                                        placeholder={nextField?.placeholder}
                                        keyboardType={
                                            nextField?.type === "number" ? "numeric" : "default"
                                        }
                                        onChangeText={(value) => nextField?.onChange?.(value)}
                                        onBlur={() =>
                                            nextField?.onBlur &&
                                            nextField?.onBlur(nextField?.parentKey, nextField?.key)
                                        }
                                    />
                                </Input>
                            )}

                            {nextField?.isRequired && !errors?.[nextField.key] && (
                                <FormControlHelper>
                                    <FormControlHelperText
                                        style={[globalStyles.greyTextColor, globalStyles.smallText]}
                                    >
                                        This field is required
                                    </FormControlHelperText>
                                </FormControlHelper>
                            )}
                            {errors?.[nextField.key] && (
                                <FormControlError style={globalStyles.errorContainer}>
                                    <Feather name="alert-triangle" size={20} color="#D32F2F" />
                                    <FormControlErrorText style={globalStyles.errorText}>
                                        {errors[nextField.key]}
                                    </FormControlErrorText>
                                </FormControlError>
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
                <FormControl key={i} isInvalid={!!errors?.[field.key]}>
                    <FormControlLabel>
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
                            value={field?.value}
                            containerStyle={styles.dropdownContainer}
                            placeholderStyle={[globalStyles.labelText, { color: "#808080" }]}
                            inputSearchStyle={globalStyles.labelText}
                            itemTextStyle={globalStyles.labelText}
                            selectedTextStyle={globalStyles.labelText}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={field?.placeholder}
                            searchPlaceholder="Search..."
                            onChange={(value) => field?.onChange?.(value?.value)}
                            renderItem={(item) => (
                                <Text
                                    style={[
                                        globalStyles.normalTextColor,
                                        globalStyles.labelText,
                                        { paddingVertical: hp("0.5%") },
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            )}
                        />
                    ) : (
                        <Input
                            size="lg"
                            isDisabled={field?.isDisabled}
                            style={field?.extraStyles}
                        >
                            <InputSlot>{field?.icon}</InputSlot>
                            <InputField
                                type={field?.type}
                                placeholder={field?.placeholder}
                                keyboardType={field?.type === "number" ? "numeric" : "default"}
                                onChangeText={(value) => field?.onChange?.(value)}
                                onBlur={() =>
                                    field?.onBlur && field?.onBlur(field?.parentKey, field?.key)
                                }
                            />
                        </Input>
                    )}

                    {field?.isRequired && !errors?.[field.key] && (
                        <FormControlHelper>
                            <FormControlHelperText
                                style={[globalStyles.greyTextColor, globalStyles.smallText]}
                            >
                                This field is required
                            </FormControlHelperText>
                        </FormControlHelper>
                    )}
                    {errors?.[field.key] && (
                        <FormControlError style={globalStyles.errorContainer}>
                            <Feather name="alert-triangle" size={20} color="#D32F2F" />
                            <FormControlErrorText style={globalStyles.errorText}>
                                {errors[field.key]}
                            </FormControlErrorText>
                        </FormControlError>
                    )}
                </FormControl>
            );
        }

        i++; // Move to next field
    }


    return <Card style={[styles.cardContainer, { padding: 0 }, cardStyle]} >{rows}</Card>;
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