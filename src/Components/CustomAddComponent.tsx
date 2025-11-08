import React, { useState, useMemo, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Feather from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleContext, ThemeToggleContext } from "../providers/theme/global-style-provider";
import { ServiceModel } from "../types/offering/offering-type";

const styles = StyleSheet.create({
  dropdown: {
    height: hp("5.5%"),
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
  },
  dropdownContainer: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
});

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

  // sync external value (prefill)
  useEffect(() => {
    if (Array.isArray(value)) {
      setRows(value);
    }
  }, [value]);

  // filter remaining services
  const availableServices = useMemo(() => {
    const selectedIds = new Set(rows.map((r) => r.id));
    return serviceList.filter((s) => !selectedIds.has(s.id));
  }, [serviceList, rows]);

  // ✅ Add ALL available services, but not beyond total
  const handleAddRow = () => {
    if (!availableServices.length) return;

    const newEntries = availableServices.map((s) => ({
      id: s.id,
      name: s.serviceName,
      value: 1,
      price: s.price,
      serviceType: s.serviceType,
    }));

    const combined = [...rows, ...newEntries];
    setRows(combined);
    onChange?.(combined);
  };

  const handleUpdateRow = (index: number, field: "id" | "value", newValue: any) => {
    const updated = [...rows];
    if (field === "id") {
      const service = serviceList.find((s) => s.id === newValue);
      if (service) {
        updated[index] = {
          ...updated[index],
          id: service.id,
          name: service.serviceName,
          price: service.price,
          serviceType: service.serviceType,
        };
      }
    } else if (field === "value") {
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
        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>No services available</Text>
      </View>
    );
  }

  return (
    <View>
      {rows.map((row, index) => {
        const options =
          serviceList
            ?.filter((s) => s.id === row.id || !rows.find((r) => r.id === s.id))
            .map((s) => ({ label: s.serviceName, value: s.id })) || [];

        return (
          <View
            key={`${index}-${row.id}`}
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
                  styles.dropdown,
                  {
                    backgroundColor: isDark ? "#131A2A" : "#fff",
                    borderColor: isDark ? "#2E3A57" : "#D1D5DB",
                  },
                ]}
                containerStyle={[
                  styles.dropdownContainer,
                  {
                    backgroundColor: isDark ? "#0E1628" : "#fff",
                    borderColor: isDark ? "#2E3A57" : "#D1D5DB",
                  },
                ]}
                placeholderStyle={[
                  globalStyles.labelText,
                  { color: isDark ? "#A1A1AA" : "#808080" },
                ]}
                inputSearchStyle={[
                  globalStyles.labelText,
                  { color: isDark ? "#F9FAFB" : "#111827" },
                ]}
                itemTextStyle={[
                  globalStyles.labelText,
                  { color: isDark ? "#E5E7EB" : "#111827" },
                ]}
                selectedTextStyle={[
                  globalStyles.labelText,
                  { color: isDark ? "#E0E7FF" : "#1E3A8A", fontWeight: "500" },
                ]}
                data={options}
                value={row.id || null}
                labelField="label"
                valueField="value"
                placeholder="Select Service"
                onChange={(item) => handleUpdateRow(index, "id", item.value)}
              />
            </View>

            {/* Quantity input */}
            <View style={{ width: wp("22%"), marginHorizontal: wp("2%") }}>
              <Input size="lg">
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

            {/* Delete */}
            <TouchableOpacity onPress={() => handleDeleteRow(index)}>
              <Feather name="trash" size={hp("2.5%")} color={isDark ? "#F87171" : "#EF4444"} />
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Add Button */}
      <Button
        size="md"
        variant="solid"
        action="primary"
        style={[
          globalStyles.buttonColor,
          {
            backgroundColor: "#1372F0",
            borderRadius: 12,
            marginTop: hp("1.5%"),
            opacity: availableServices.length ? 1 : 0.6,
          },
        ]}
        onPress={handleAddRow}
        isDisabled={!availableServices.length} // ✅ Prevent overflow
      >
        <Feather name="plus" size={wp("5%")} color="#fff" />
        <ButtonText
          style={[globalStyles.buttonText, { color: "#fff", fontWeight: "600" }]}
        >
          {availableServices.length
            ? "Add Services"
            : "All Services Added"}
        </ButtonText>
      </Button>
    </View>
  );
};

export default CustomServiceAddComponent;
