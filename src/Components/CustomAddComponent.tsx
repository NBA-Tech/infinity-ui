import React, { useState, useMemo, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Feather from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleContext } from "../providers/theme/global-style-provider";

interface Service {
  id: string;
  serviceName: string;
  type: string;
}

export interface SelectedService {
  id: string;
  name: string;
  value: number;
}

interface Props {
  serviceList?: Service[] | null; // allow null/undefined
  value?: SelectedService[];      // ✅ accept prefilled values
  onChange?: (selected: SelectedService[]) => void;
}

const CustomServiceAddComponent: React.FC<Props> = ({ serviceList = [], value = [], onChange }) => {
  const [rows, setRows] = useState<SelectedService[]>(value);
  const globalStyles = useContext(StyleContext);

  // keep local state in sync if parent updates `value`
  useEffect(() => {
    setRows(value || []);
  }, [value]);

  // Filter dropdown options (exclude already selected services)
  const availableServices = useMemo(() => {
    if (!Array.isArray(serviceList)) return [];
    const selectedIds = new Set(rows.map((r) => r.id));
    return serviceList
      .filter((s) => s?.type === "SERVICE" && !selectedIds.has(s.id))
      .map((s) => ({ label: s.serviceName, value: s.id }));
  }, [serviceList, rows]);

  const handleAddRow = () => {
    if (!availableServices.length) return;
    const firstOption = availableServices[0];
    const newRows = [...rows, { id: firstOption.value, name: firstOption.label, value: 1 }];
    setRows(newRows);
    onChange?.(newRows);
  };

  const handleUpdateRow = (index: number, field: "id" | "value", newValue: any) => {
    const updated = [...rows];
    if (field === "id") {
      const service = serviceList?.find((s) => s.id === newValue);
      if (service) {
        updated[index] = {
          id: service.id,
          name: service.serviceName,
          value: updated[index].value,
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

  if (!Array.isArray(serviceList) || serviceList.length === 0) {
    return (
      <View>
        <Text style={{ color: "gray", padding: 8 }}>No services available</Text>
      </View>
    );
  }

  return (
    <View>
      {rows.map((row, index) => {
        const options =
          serviceList
            ?.filter(
              (s) =>
                s?.type === "SERVICE" &&
                (s.id === row.id || !rows.find((r) => r.id === s.id))
            )
            .map((s) => ({ label: s.serviceName, value: s.id })) || [];

        return (
          <View
            key={`${row.id}-${index}`}
            className="flex flex-row justify-between items-center"
            style={{ marginVertical: hp("1%") }}
          >
            {/* Dropdown */}
            <View style={{ flex: 1 }}>
              <Dropdown
                style={{ borderWidth: 1, borderRadius: 6, padding: 8 }}
                data={options}
                value={row.id}
                labelField="label"
                valueField="value"
                placeholder="Select Service"
                onChange={(item) => handleUpdateRow(index, "id", item.value)}
                renderItem={(item) => (
                  <Text style={{ padding: 8 }}>{item.label}</Text>
                )}
              />
            </View>

            {/* Quantity input */}
            <View style={{ width: wp("25%"), marginHorizontal: wp("2%") }}>
              <Input size="lg">
                <InputField
                  type="number"
                  value={String(row.value ?? "")}
                  placeholder="Qty"
                  keyboardType="numeric"
                  onChangeText={(val) => handleUpdateRow(index, "value", parseInt(val))}
                />
              </Input>
            </View>

            {/* Delete button */}
            <TouchableOpacity onPress={() => handleDeleteRow(index)}>
              <Feather name="trash" size={hp("2.5%")} color="red" />
            </TouchableOpacity>
          </View>
        );
      })}

      <Button
        size="md"
        variant="solid"
        action="primary"
        style={[globalStyles.purpleBackground, { marginHorizontal: wp("2%") }]}
        onPress={handleAddRow}
        isDisabled={!availableServices.length}
      >
        <Feather name="plus" size={wp("5%")} color="#fff" />
        <ButtonText style={globalStyles.buttonText}>Add Service</ButtonText>
      </Button>
    </View>
  );
};

export default CustomServiceAddComponent;
