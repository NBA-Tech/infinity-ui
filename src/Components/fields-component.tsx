import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlError,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { JSX, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Switch } from "react-native";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StyleContext } from "../providers/theme/global-style-provider";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import Feather from "react-native-vector-icons/Feather";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FormField } from "../types/common";
import { Chips } from "react-native-material-chips";

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
    onPress: (value: any, isSelected: boolean) => void;
}

// Styles
const styles = StyleSheet.create({
    accordionHeader: {
        backgroundColor: "#EFF6FF",
        height: hp("8%"),
    },
    cardContainer: {
        borderRadius: wp("2%"),
        gap: wp("2%"),
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
            isInvalid={field.isRequired && !!errors?.[field.key] }
        >
            {field.type != "switch" && (
                <FormControlLabel>
                    <FormControlLabelText style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                        {field.label}
                        {field.isRequired && <Text style={{ color: "red" }}>*</Text>}
                    </FormControlLabelText>
                </FormControlLabel>
            )}


            {/* Single Select */}
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
            ) : field.type === "multi-select" ? (
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={{ color: "#808080" }}
                    selectedTextStyle={{ color: "#000", fontSize: 14 }}
                    inputSearchStyle={{ color: "#000", fontSize: 14 }}
                    iconStyle={{ width: 20, height: 20 }}
                    search
                    data={field.dropDownItems || []}
                    value={field.value || []}
                    labelField="label"
                    valueField="value"
                    placeholder={field.placeholder || "Select items"}
                    searchPlaceholder="Search..."
                    onChange={(items) => field.onChange?.(items)}
                    renderLeftIcon={() => field.icon}
                    selectedStyle={{
                        borderRadius: 12,
                        backgroundColor: "#EDE9FE",
                        padding: 4,
                    }}
                />
            ) : field.type === "date" || field.type === "time" ? (
                <TouchableOpacity
                    onPress={() => field.setIsOpen?.(true)}
                    style={[
                        styles.dropdown,
                        { justifyContent: "center" },
                        field.isDisabled && { backgroundColor: "#f5f5f5" },
                    ]}
                >
                    <Text
                        style={[
                            globalStyles.labelText,
                            !field.value && { color: "grey" },
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
                                        ? new Date(field.value + "T00:00:00")
                                        : new Date(`1970-01-01T${field.value}:00`)
                                    : new Date()
                            }
                            mode={field.type}
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                                field.setIsOpen?.(false);

                                if (event.type === "set" && selectedDate) {
                                    if (field.type === "date") {
                                        const onlyDate = selectedDate.toISOString().split("T")[0];
                                        field.onChange?.(onlyDate);
                                    } else if (field.type === "time") {
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
            ) : field.type === "switch" ? (
                <View
                    style={[
                        { flexDirection: "row", alignItems: "center" },
                        field.style === "w-full"
                            ? { justifyContent: "space-between" }
                            : { justifyContent: "flex-start", gap: wp("2%") },
                    ]}
                >
                    <FormControlLabel>
                        <FormControlLabelText style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                            {field.label}
                            {field.isRequired && <Text style={{ color: "red" }}>*</Text>}
                        </FormControlLabelText>
                    </FormControlLabel>

                    <Switch
                        disabled={field.isDisabled}
                        trackColor={{ false: "#d4d4d4", true: "#525252" }}
                        thumbColor="#fafafa"
                        ios_backgroundColor="#d4d4d4"
                        value={!!field.value}
                        onValueChange={(val) => field.onChange?.(val)}
                    />
                </View>
            ) : field.type === "custom" ? (
                <View style={field.extraStyles}>
                    {field.customComponent}
                </View>
            ) : field.type === "chips" ? (
                <Chips
                    type="filter"
                    selectedValues={field.value || []}
                    items={field.dropDownItems || []}
                    itemContainerStyle={{backgroundColor:"transparent",borderColor:"#EDE9FE",borderWidth:wp("0.4%"),borderRadius:wp("4%"),padding:wp("2%")}}
                    valueStyle={{ fontSize: 14 }}
                    labelStyle={{ color: "#000" }}
                    alertRequired={false}
                    setSelectedValues={field.onChange}
                />) : (
                <Input size="lg" isDisabled={field.isDisabled} style={field.extraStyles}>
                    <InputSlot>{field.icon}</InputSlot>
                    <InputField
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        keyboardType={field.type === "number" ? "numeric" : "default"}
                        onChangeText={(value) => field.onChange?.(field.type === "number" ? Number(value) : value)}
                        onBlur={() => field.onBlur?.(field.parentKey || "", field.key)}
                    />
                </Input>
            )}

            {/* Validation */}
            {field.isRequired && !errors?.[field.key] && (
                <FormControlHelper>
                    <FormControlHelperText style={[globalStyles.greyTextColor, globalStyles.smallText]}>
                        This field is required
                    </FormControlHelperText>
                </FormControlHelper>
            )}
            {field.isRequired &&errors?.[field.key] && (
                <FormControlError style={globalStyles.errorContainer}>
                    <Feather name="alert-triangle" size={20} color="#D32F2F" />
                    <FormControlErrorText style={globalStyles.errorText}>
                        {errors[field.key]}
                    </FormControlErrorText>
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
        let field = fieldsArray[i];
        field.isVisible = field.isVisible !== undefined ? field.isVisible : true;
        if (field.isVisible === false) {
            i++;
            continue
        }


        if (field.style === "w-1/2" && i < fieldsArray.length - 1 && fieldsArray[i + 1].style === "w-1/2") {
            rows.push(
                <View key={field.key} style={styles.row}>
                    <RenderField field={field} errors={errors} globalStyles={globalStyles} />
                    <RenderField field={fieldsArray[i + 1]} errors={errors} globalStyles={globalStyles} />
                </View>
            );
            i += 2;
        } else {
            rows.push(<RenderField key={field.key} field={field} errors={errors} globalStyles={globalStyles} />);
            i++;
        }
    }

    return <Card style={[styles.cardContainer, { padding: 0 }, cardStyle]}>{rows}</Card>;
};

// CustomCheckBox Component
export const CustomCheckBox = ({ children, selectedStyle, styles: customStyles, onPress, value, selected }: CustomCheckBoxProps) => {
    const handleSelect = () => {
        onPress(value, !selected);
    };

    return (
        <TouchableOpacity
            style={[
                styles.checkContainer,
                selected && (selectedStyle || { backgroundColor: "#FDF2F8", borderColor: "#8B5CF6" }),
                customStyles,
            ]}
            onPress={handleSelect}
        >
            <View>{children}</View>
        </TouchableOpacity>
    );
};
