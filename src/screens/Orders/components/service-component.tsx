import { CustomCheckBox } from '@/src/components/fields-component';
import GradientCard from '@/src/utils/gradient-card';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { OfferingInfo, OrderType, ServiceInfo } from '@/src/types/order/order-type';
import { Input, InputField } from '@/components/ui/input';
import { useUserStore } from '@/src/store/user/user-store';

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
  const { userDetails, getUserDetailsUsingID } = useUserStore()

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(eventType?.price ?? 0);


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
            colors={selected ? ["#2C426A", "#3B82F6"] : ["#CBD5E1", "#94A3B8"]}
            style={{
              padding: wp("2%"),
              minWidth: wp("12%"),
              minHeight: wp("12%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: wp("5%"),
                fontFamily: "OpenSans-Bold",
                textTransform: "uppercase",
              }}
            >
              {eventType?.serviceName?.[0] ?? "?"}
            </Text>
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
              {eventType?.type}
            </Text>

            <View className="flex-row items-center gap-3 mt-1 flex-wrap">

              {!isEditingPrice ? (
                <>
                  {/* Normal Price Display */}
                  <Text
                    style={[
                      globalStyles.normalText,
                      selected ? globalStyles.blueTextColor : globalStyles.themeTextColor,
                      { fontWeight: '600' },
                    ]}
                  >
                    {userDetails?.currencyIcon} {selectedElement?.price || eventType?.price}
                  </Text>

                  {/* Edit Icon */}
                  {selected && (
                    <TouchableOpacity onPress={() => {
                      setTempPrice(eventType?.price);  // preload
                      setIsEditingPrice(true);
                    }}>
                      <Feather name="edit" size={wp('4%')} color={'#3B82F6'} />
                    </TouchableOpacity>
                  )

                  }

                </>
              ) : (
                /* Editable Input */
                <View className="flex-row items-center gap-2">
                  <Input
                    size="lg"
                    variant="rounded"
                    style={{ width: wp("25%"), height: hp("5%") }}
                  >
                    <InputField
                      type="number"
                      value={String(tempPrice)}
                      keyboardType="numeric"
                      onChangeText={(v) => setTempPrice(Number(v))}
                    />
                  </Input>

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={() => {

                      // Update price inside offeringInfo.services[]
                      const updatedServices = (offeringInfo.services || []).map((service) =>
                        service.id === eventType.id
                          ? { ...service, price: tempPrice }
                          : service
                      );

                      const updatedOffer: OfferingInfo = {
                        ...offeringInfo,
                        orderType: OrderType.SERVICE,
                        services: updatedServices,
                        packageId: undefined,
                        packageName: undefined,
                      };
                      console.log(updatedOffer)

                      handleCheckboxChange(updatedOffer, { parentKey: "offeringInfo", childKey: "" });
                      handleTotalPriceCharges(updatedOffer);

                      setIsEditingPrice(false);
                    }}
                  >
                    <Feather name="check" size={wp("5%")} color="#16A34A" />
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity onPress={() => setIsEditingPrice(false)}>
                    <Feather name="x" size={wp("5%")} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
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
