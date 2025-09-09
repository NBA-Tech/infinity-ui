import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlError,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { JSX, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ThemeToggleContext, StyleContext } from "../providers/theme/global-style-provider";
import { Dropdown } from "react-native-element-dropdown";
import Feather from "react-native-vector-icons/Feather";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FormField } from "../types/common";

// Define interfaces for type safety
interface CustomFieldsProps {
    infoFields: Record<string, FormField>;
    errors?: Record<string, string>;
    cardStyle?: object;
}

interface CustomCheckBoxProps {
    children: JSX.Element[];
    selectedStyle?: object;
    styles?: object;
    value: any;
    selected: boolean;
    onPress: (value: any,isSelected: boolean) => void;
}
// Styles (unchanged)
const styles = StyleSheet.create({
    accordionHeader: {
        backgroundColor: "#EFF6FF",
        height: hp("8%"),
    },
    cardContainer: {
        borderRadius: wp("2%"),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: hp("1%"),
    },
    checkContainer: {
        padding: hp("1%"),
        borderRadius: wp("2%"),
        borderColor: "#d1d5db",
        borderWidth: wp("0.4%"),
        minHeight: hp("6%"),
        justifyContent: "center",
        paddingHorizontal: wp("2%"),
        width: "auto",
    },
    dropdown: {
        height: hp("5%"),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: wp("1%"),
        paddingHorizontal: wp("2%"),
    },
    dropdownContainer: {
        paddingHorizontal: wp("2%"),
    },
});

// Reusable Field Component
const RenderField = ({ field, errors, globalStyles }: { field: FormField; errors?: Record<string, string>; globalStyles: any }) => {
    return (
        <FormControl
            style={field.style === "w-1/2" ? { width: wp("43%"), marginRight: wp("2%") } : undefined}
            isInvalid={!!errors?.[field.key]}
        >
            <FormControlLabel>
                <FormControlLabelText style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                    {field.label}
                    {field.isRequired && <Text style={{ color: "red" }}>*</Text>}
                </FormControlLabelText>
            </FormControlLabel>

            {field.type === "select" ? (
                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    data={field.dropDownItems || []}
                    search
                    value={field.value}
                    placeholderStyle={[globalStyles.labelText, { color: "#808080" }]}
                    inputSearchStyle={globalStyles.labelText}
                    itemTextStyle={globalStyles.labelText}
                    selectedTextStyle={globalStyles.labelText}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={field.placeholder}
                    searchPlaceholder="Search..."
                    onChange={(item) => field.onChange?.(item.value)}
                    renderItem={(item) => (
                        <Text
                            style={[globalStyles.normalTextColor, globalStyles.labelText, { paddingVertical: hp("0.5%") }]}
                        >
                            {item.label}
                        </Text>
                    )}
                />
            ) : field.type === "date" || field.type === "time" ? (
                <TouchableOpacity
                    onPress={() => field.setIsOpen?.(true)}
                    style={[styles.dropdown, { justifyContent: "center" }, field.isDisabled && { backgroundColor: "#f5f5f5" }]}
                >
                    <Text
                        style={[
                            globalStyles.labelText,
                            !field.value && { color: "grey" }
                        ]}
                    >
                        {field.value
                            ? field.type === "date"
                                ? new Date(field.value + "T00:00:00").toLocaleDateString()
                                : new Date(`1970-01-01T${field.value}:00`).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                            : field.placeholder || `Select ${field.type}`}

                    </Text>

                    {field.isOpen && (
                        <DateTimePicker
                            value={
                                field.value
                                    ? field.type === "date"
                                        ? new Date(field.value + "T00:00:00") // date only
                                        : new Date(`1970-01-01T${field.value}:00`) // time only
                                    : new Date()
                            }
                            mode={field.type}
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                                field.setIsOpen?.(false);

                                if (event.type === "set" && selectedDate) {
                                    if (field.type === "date") {
                                        // YYYY-MM-DD (local date part)
                                        const onlyDate = selectedDate.toISOString().split("T")[0];
                                        field.onChange?.(onlyDate);
                                    } else if (field.type === "time") {
                                        // HH:mm (local time part)
                                        const hours = String(selectedDate.getHours()).padStart(2, "0");
                                        const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
                                        const onlyTime = `${hours}:${minutes}`;
                                        field.onChange?.(onlyTime);
                                    }
                                }
                            }}
                        />

                    )}

                </TouchableOpacity>
            ) : (
                <Input size="lg" isDisabled={field.isDisabled} style={field.extraStyles}>
                    <InputSlot>{field.icon}</InputSlot>
                    <InputField
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        keyboardType={field.type === "number" ? "numeric" : "default"}
                        onChangeText={(value) => field.onChange?.(value)}
                        onBlur={() => field.onBlur?.(field.parentKey || "", field.key)}
                    />
                </Input>
            )}

            {field.isRequired && !errors?.[field.key] && (
                <FormControlHelper>
                    <FormControlHelperText style={[globalStyles.greyTextColor, globalStyles.smallText]}>
                        This field is required
                    </FormControlHelperText>
                </FormControlHelper>
            )}
            {errors?.[field.key] && (
                <FormControlError style={globalStyles.errorContainer}>
                    <Feather name="alert-triangle" size={20} color="#D32F2F" />
                    <FormControlErrorText style={globalStyles.errorText}>{errors[field.key]}</FormControlErrorText>
                </FormControlError>
            )}
        </FormControl>
    );
};

// Main CustomFieldsComponent
export const CustomFieldsComponent = ({ infoFields, errors, cardStyle }: CustomFieldsProps) => {
    const globalStyles = useContext(StyleContext);
    const fieldsArray = Object.values(infoFields) as FormField[];

    // Group fields into rows
    const rows: JSX.Element[] = [];
    let i = 0;
    while (i < fieldsArray.length) {
        const field = fieldsArray[i];

        if (field.style === "w-1/2" && i < fieldsArray.length - 1 && fieldsArray[i + 1].style === "w-1/2") {
            // Pair two w-1/2 fields in a row
            rows.push(
                <View key={field.key} style={styles.row}>
                    <RenderField field={field} errors={errors} globalStyles={globalStyles} />
                    <RenderField field={fieldsArray[i + 1]} errors={errors} globalStyles={globalStyles} />
                </View>
            );
            i += 2; // Skip the next field
        } else {
            // Render full-width field
            rows.push(<RenderField key={field.key} field={field} errors={errors} globalStyles={globalStyles} />);
            i++;
        }
    }

    return <Card style={[styles.cardContainer, { padding: 0 }, cardStyle]}>{rows}</Card>;
};

// CustomCheckBox Component (unchanged)
export const CustomCheckBox = ({ children, selectedStyle, styles: customStyles, onPress, value,selected }: CustomCheckBoxProps) => {
    const handleSelect = () => {
        onPress(value,!selected);
    };

    return (
        <TouchableOpacity
            style={[styles.checkContainer, selected && (selectedStyle || { backgroundColor: "#FDF2F8", borderColor: "#8B5CF6" }), customStyles]}
            onPress={handleSelect}
        >
            <View>{children}</View>
        </TouchableOpacity>
    );
};