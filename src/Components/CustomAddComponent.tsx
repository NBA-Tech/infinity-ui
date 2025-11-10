import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Feather from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleContext, ThemeToggleContext } from "../providers/theme/global-style-provider";
import { ServiceModel } from "../types/offering/offering-type";

interface Props {
  serviceList?: ServiceModel[];
  value?: ServiceModel[];
  onChange?: (selected: ServiceModel[]) => void;
}

const CustomServiceAddComponent: React.FC<Props> = ({
  serviceList = [],
  value = [],
  onChange,
}) => {
  const [rows, setRows] = useState<ServiceModel[]>(value);
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  useEffect(() => {
    if (Array.isArray(value)) {
      setRows(value);
    }
  }, [value]);

  // ✅ Add one new empty row
  const handleAddRow = () => {
    if (rows.length >= serviceList.length) return; // don't exceed total services
    setRows([...rows, { id: "", name: "", value: 0 } as ServiceModel]);
  };

  const handleUpdateRow = (index: number, field: "id" | "value", newValue: any) => {
    const updated = [...rows];
    if (field === "id") {
      const selectedService = serviceList.find((s) => s.id === newValue);
      updated[index] = {
        ...updated[index],
        id: selectedService?.id || "",
        name: selectedService?.serviceName || "",
        price: selectedService?.price || 0,
      };
    } else {
      updated[index] = { ...updated[index], value: Number(newValue) || 0 };
    }
    setRows(updated);
    onChange?.(updated);
  };

  const handleDeleteRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onChange?.(newRows);
  };

  if (!serviceList.length) {
    return (
      <View style={{ padding: hp("1.5%") }}>
        <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>
          No services available
        </Text>
      </View>
    );
  }

  return (
    <View>
      {rows.map((row, index) => (
        <View
          key={`row-${index}`}
          className="flex flex-row justify-between items-center"
          style={{
            marginVertical: hp("1%"),
            backgroundColor: isDark ? "#0E1628" : "#F5F7FB",
            borderRadius: 12,
            padding: wp("2%"),
            borderWidth: 1,
            borderColor: isDark ? "#2E3A57" : "#D1D5DB",
          }}
        >
          {/* Dropdown */}
          <View style={{ flex: 1 }}>
            <Dropdown
              style={[
                {
                  height: hp("5.5%"),
                  borderWidth: 1,
                  borderRadius: wp("2%"),
                  paddingHorizontal: wp("3%"),
                  borderColor: isDark ? "#2E3A57" : "#D1D5DB", // subtle border tone
                  backgroundColor: isDark
                    ? globalStyles.formBackGroundColor.backgroundColor // dark: #1A2238
                    : "#FFFFFF", // light: clean white
                },
              ]}
              containerStyle={[
                {
                  borderRadius: wp("2%"),
                  backgroundColor: isDark
                    ? globalStyles.formBackGroundColor.backgroundColor // dark dropdown list bg
                    : "#FFFFFF",
                  borderColor: isDark ? "#2E3A57" : "#E5E7EB",
                  borderWidth: 1,
                  shadowColor: isDark ? "#000" : "#182D53",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
              placeholderStyle={[
                globalStyles.labelText,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
              selectedTextStyle={[
                globalStyles.labelText,
                {
                  color: isDark ? "#E2E8F0" : "#182D53",
                  fontWeight: "500",
                },
              ]}
              itemContainerStyle={{
                backgroundColor: isDark ? "#1A2238" : "#FFFFFF",
                borderBottomColor: isDark ? "#2E3A57" : "#E5E7EB",
                borderBottomWidth: 1,
              }}
              itemTextStyle={[
                globalStyles.labelText,
                { color: isDark ? "#E5E7EB" : "#111827" },
              ]}
              activeColor={isDark ? "#2C426A" : "#EEF3FF"} // ✅ highlight color when selecting
              data={serviceList.map((s) => ({
                label: s.serviceName,
                value: s.id,
              }))}
              value={row.id || null}
              labelField="label"
              valueField="value"
              placeholder="Select Service"
              onChange={(item) => handleUpdateRow(index, "id", item.value)}
            />

          </View>

          {/* Quantity Input */}
          <View style={{ width: wp("18%"), marginHorizontal: wp("2%") }}>
            <Input size="lg" variant="rounded">
              <InputField
                type="number"
                value={String(row.value ?? "")}
                placeholder="Qty"
                keyboardType="numeric"
                onChangeText={(val) =>
                  handleUpdateRow(index, "value", parseInt(val))
                }
              />
            </Input>
          </View>

          {/* Delete Button */}
          <TouchableOpacity onPress={() => handleDeleteRow(index)}>
            <Feather
              name="trash"
              size={hp("2.5%")}
              color={isDark ? "#F87171" : "#EF4444"}
            />
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Service Button */}
      <Button
        size="md"
        variant="solid"
        action="primary"
        style={[
          globalStyles.buttonColor,
          {
            borderRadius: 12,
            marginTop: hp("1.5%"),
            opacity: rows.length < serviceList.length ? 1 : 0.6,
          },
        ]}
        onPress={handleAddRow}
        isDisabled={rows.length >= serviceList.length}
      >
        <Feather name="plus" size={wp("5%")} color="#fff" />
        <ButtonText
          style={[globalStyles.buttonText, { color: "#fff", fontWeight: "600" }]}
        >
          Add Service
        </ButtonText>
      </Button>
    </View>
  );
};

export default CustomServiceAddComponent;
