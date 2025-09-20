import { CustomCheckBox } from '@/src/components/fields-component';
import GradientCard from '@/src/utils/gradient-gard';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { OfferingInfo, OrderType } from '@/src/types/order/order-type';
import { ServiceInfo } from '@/src/types/offering/offering-type';

type ServiceComponentProps = {
  eventType: any;
  index: number;
  selectedElement: any;
  offeringInfo: OfferingInfo;
  handleCheckboxChange: (value: any, stateKeyMap: Record<string, string>) => void;
  handleTotalPriceCharges: (offerInfo: OfferingInfo) => void
};

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: '#8B5CF6',
    padding: wp('2%'),
    borderRadius: wp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otp: {
    width: wp('10%'),
    height: hp('4.4%'),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

const ServiceComponent = ({
  eventType,
  index,
  selectedElement,
  offeringInfo,
  handleCheckboxChange,
  handleTotalPriceCharges
}: ServiceComponentProps) => {
  const globalStyles = useContext(StyleContext);
  const [quantity, setQuantity] = useState<number>(1);
  const [selected, setSelected] = useState<boolean>(selectedElement?.id === eventType?.id);
  console.log(selectedElement)

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const updateOfferingInfo = (checked: boolean, qty: number = quantity) => {
    let updatedServices: ServiceInfo[] = [];

    if (checked) {
      // add/replace service
      updatedServices = [
        ...(offeringInfo.services || []).filter((s) => s.id !== eventType.id),
        { id: eventType.id, name: eventType.serviceName, value: qty },
      ];
    } else {
      // remove service
      updatedServices = (offeringInfo.services || []).filter((s) => s.id !== eventType.id);
    }

    const updateValue: OfferingInfo = {
      ...offeringInfo,
      orderType: OrderType.SERVICE,
      packageId: undefined,
      services: updatedServices,
    };
    console.log(updateValue);

    handleCheckboxChange(updateValue, { parentKey: 'offeringInfo', childKey: '' });
    handleTotalPriceCharges(updateValue);
  };

  const handleChange = (checked: boolean) => {
    setSelected(checked);
    updateOfferingInfo(checked);
  };

  useEffect(() => {
    setQuantity(selectedElement?.value || 1)
  }, [])

  // If quantity changes while selected, update service value
  useEffect(() => {
    if (selected) {
      updateOfferingInfo(true, quantity);
    }
  }, [quantity]);

  // Sync prop isSelected -> local state
  useEffect(() => {
    setSelected(selectedElement?.id === eventType?.id);
  }, [selectedElement]);



  return (
    <CustomCheckBox
      key={index}
      selectedStyle={{ backgroundColor: '#ECFDF5', borderColor: '#06B6D4' }}
      selected={selected}
      onPress={() => handleChange(!selected)}
      styles={{ margin: 0, marginVertical: hp('2%') }}
    >
      <View className="flex-row items-center justify-between">
        {/* Left side: Icon + details */}
        <View className="flex-row items-center flex-1 gap-3">
          <GradientCard
            colors={['#F9FAFB', '#D1D5DB', '#9CA3AF']}
            style={{
              padding: wp('2%'),
              minWidth: wp('10%'),
              minHeight: wp('10%'),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: wp('2%'),
            }}
          >
            <MaterialCommunityIcons
              name={eventType?.icon ?? 'format-text'}
              size={wp('5%')}
              color="white"
            />
          </GradientCard>

          <View className="flex-1 flex-col">
            <Text
              style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
              numberOfLines={1}
            >
              {eventType?.serviceName}
            </Text>
            <Text
              style={[globalStyles.normalTextColor, globalStyles.labelText]}
              numberOfLines={1}
            >
              {eventType?.description}
            </Text>
            <View className="flex-row items-center gap-3 mt-1">
              <View className="flex flex-row gap-1">
                <Feather name="clock" size={wp('3%')} color="#000" />
                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                  {eventType?.serviceCategory}
                </Text>
              </View>
              <View>
                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                  ₹{eventType?.price}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right side: Quantity controls */}
        <View className="flex flex-col items-end gap-2">
          <View className="flex-row items-center gap-2">
            {/* Decrement */}
            <TouchableOpacity onPress={decrement} style={styles.actionButton}>
              <Feather name="minus" size={wp('4%')} color="#fff" />
            </TouchableOpacity>

            {/* Quantity */}
            <TextInput
              style={[globalStyles.greyInputBox, styles.otp]}
              keyboardType="number-pad"
              value={String(quantity)}
              onChangeText={(val) => {
                setQuantity(val === '' ? 1 : Math.max(1, parseInt(val) || 1))
              }
              }
            />

            {/* Increment */}
            <TouchableOpacity onPress={increment} style={styles.actionButton}>
              <Feather name="plus" size={wp('4%')} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomCheckBox>
  );
};

export default ServiceComponent;
