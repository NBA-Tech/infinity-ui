import { CustomCheckBox } from '@/src/components/fields-component';
import GradientCard from '@/src/utils/gradient-card';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { OfferingInfo, OrderType, ServiceInfo } from '@/src/types/order/order-type';
import { toTitleCase } from '@/src/utils/utils';

type ServiceComponentProps = {
  eventType: any;
  index: number;
  selectedElement: any;
  offeringInfo: OfferingInfo;
  handleCheckboxChange: (value: any, stateKeyMap: Record<string, string>) => void;
  handleTotalPriceCharges: (offerInfo: OfferingInfo) => void;
};

const styles = StyleSheet.create({
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
  handleTotalPriceCharges,
}: ServiceComponentProps) => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  const [quantity, setQuantity] = useState<number>(1);
  const [selected, setSelected] = useState<boolean>(selectedElement?.id === eventType?.id);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const updateOfferingInfo = (checked: boolean, qty: number = quantity) => {
    let updatedServices: ServiceInfo[] = [];

    if (checked) {
      // add/replace service
      updatedServices = [
        ...(offeringInfo?.orderType != OrderType.PACKAGE && offeringInfo.services || []).filter(
          (s) => s.id !== eventType.id
        ),
        {
          id: eventType.id,
          name: eventType.serviceName,
          value: qty,
          price: eventType.price,
          isCompleted: false,
          serviceType: eventType?.type,
        },
      ];
    } else {
      // remove service
      updatedServices = (offeringInfo.services || []).filter((s) => s.id !== eventType.id);
    }

    const updateValue: OfferingInfo = {
      ...offeringInfo,
      orderType: updatedServices.length > 0 ? OrderType.SERVICE : null,
      packageId: undefined,
      packageName: undefined,
      packagePrice: undefined,
      services: updatedServices,
    };

    handleCheckboxChange(updateValue, { parentKey: 'offeringInfo', childKey: '' });
    handleTotalPriceCharges(updateValue);
  };

  const handleChange = (checked: boolean) => {
    setSelected(checked);
    updateOfferingInfo(checked);
  };

  useEffect(() => {
    setQuantity(selectedElement?.value || 1);
  }, []);

  useEffect(() => {
    if (selected) updateOfferingInfo(true, quantity);
  }, [quantity]);

  useEffect(() => {
    setSelected(selectedElement?.id === eventType?.id);
  }, [selectedElement]);

  return (
    <CustomCheckBox
      key={index}
      selectedStyle={{
        backgroundColor: isDark ? '#131A2A' : '#F5F7FB',
        borderColor: selected ? '#3B82F6' : isDark ? '#2E3A57' : '#E5E7EB',
        borderWidth: selected ? 1.5 : 1,
        borderRadius: wp('3%'),
      }}
      selected={selected}
      onPress={() => handleChange(!selected)}
      styles={{
        marginVertical: hp('1.5%'),
        borderRadius: wp('3%'),
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('3%'),
      }}
    >
      {/* Outer Row: Left (Details) + Right (Qty Controls) */}
      <View className="flex-row justify-between items-center" style={{ width: '100%' }}>
        {/* LEFT SIDE - Icon + Details */}
        <View className="flex-row flex-1 items-center gap-3">
          {/* Gradient Icon */}
          <GradientCard
            colors={
              selected
                ? isDark
                  ? ['#1E293B', '#3B82F6']
                  : ['#3B82F6', '#60A5FA']
                : isDark
                  ? ['#0E1628', '#1A2238', '#2E3A57']
                  : ['#F9FAFB', '#E5E7EB', '#D1D5DB']
            }
            style={{
              padding: wp('2.5%'),
              width: wp('11%'),
              height: wp('11%'),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: wp('2%'),
            }}
          >
            <MaterialCommunityIcons
              name={eventType?.icon ?? 'format-text'}
              size={wp('5%')}
              color={selected ? '#FFFFFF' : isDark ? '#E2E8F0' : '#182D53'}
            />
          </GradientCard>
  
          {/* Text Section */}
          <View className="flex-1">
            <Text
              style={[
                globalStyles.heading3Text,
                globalStyles.themeTextColor,
                { flexShrink: 1 },
              ]}
              numberOfLines={1}
            >
              {eventType?.serviceName}
            </Text>
  
            <Text
              style={[
                globalStyles.labelText,
                globalStyles.greyTextColor,
                { flexShrink: 1 },
              ]}
              numberOfLines={1}
            >
              {eventType?.description}
            </Text>
  
            <View className="flex-row items-center gap-3 mt-1 flex-wrap">
              <View className="flex-row gap-1 items-center">
                <Feather
                  name="clock"
                  size={wp('3%')}
                  color={isDark ? '#E2E8F0' : '#475569'}
                />
                <Text
                  style={[
                    globalStyles.smallText,
                    globalStyles.greyTextColor,
                    { flexShrink: 1 },
                  ]}
                >
                  {eventType?.serviceCategory}
                </Text>
              </View>
  
              <Text
                style={[
                  globalStyles.smallText,
                  selected
                    ? globalStyles.blueTextColor
                    : globalStyles.themeTextColor,
                  { fontWeight: '600' },
                ]}
              >
                ₹{eventType?.price}
              </Text>
            </View>
          </View>
        </View>
  
        {/* RIGHT SIDE - Quantity Controls */}
        <View className="flex-row items-center gap-2 ml-3">
          {/* Decrement */}
          <TouchableOpacity
            onPress={decrement}
            activeOpacity={0.8}
            style={{
              backgroundColor: isDark ? '#2C426A' : '#3B82F6',
              width: wp('8%'),
              height: wp('8%'),
              borderRadius: wp('2%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="minus" size={wp('4%')} color="#fff" />
          </TouchableOpacity>
  
          {/* Quantity Input */}
          <TextInput
            style={{
              width: wp('10%'),
              height: hp('5%'),
              textAlign: 'center',
              color: isDark ? '#E2E8F0' : '#1E3A8A',
              backgroundColor: isDark ? '#1E293B' : '#F5F7FB',
              borderWidth: 1,
              borderColor: selected ? '#3B82F6' : '#E5E7EB',
              borderRadius: wp('1.5%'),
              fontSize: wp('3%'),
              fontWeight: '600',
            }}
            keyboardType="number-pad"
            value={String(quantity)}
            onChangeText={(val) =>
              setQuantity(val === '' ? 1 : Math.max(1, parseInt(val) || 1))
            }
          />
  
          {/* Increment */}
          <TouchableOpacity
            onPress={increment}
            activeOpacity={0.8}
            style={{
              backgroundColor: isDark ? '#2C426A' : '#3B82F6',
              width: wp('8%'),
              height: wp('8%'),
              borderRadius: wp('2%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="plus" size={wp('4%')} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </CustomCheckBox>
  );
  
};

export default ServiceComponent;
