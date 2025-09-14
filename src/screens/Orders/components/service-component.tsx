import { CustomCheckBox } from '@/src/components/fields-component';
import GradientCard from '@/src/utils/gradient-gard';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { Input, InputField } from '@/components/ui/input';

type ServiceComponentProps = {
    eventType: any;
    index: number;
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

const ServiceComponent = ({ eventType, index }: ServiceComponentProps) => {
    const globalStyles = useContext(StyleContext);
    const [quantity, setQuantity] = useState<number>(0);

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

    return (
        <CustomCheckBox
            key={index}
            selectedStyle={{ backgroundColor: '#ECFDF5', borderColor: '#06B6D4' }}
            selected={true}
        >
            <View className="flex-row items-center justify-between">

                {/* Left side: Icon + details */}
                <View className="flex-row items-center flex-1 gap-3">
                    <GradientCard
                        colors={["#F9FAFB", "#D1D5DB", "#9CA3AF"]}
                        style={{
                            padding: wp("2%"),
                            minWidth: wp("10%"),
                            minHeight: wp("10%"),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: wp('2%')
                        }}
                    >
                        <MaterialCommunityIcons
                            name={eventType?.icon ?? "format-text"}
                            size={wp("5%")}
                            color="white"
                        />
                    </GradientCard>

                    <View className="flex-1 flex-col">
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]} numberOfLines={1}>
                            {eventType?.serviceName}
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]} numberOfLines={1}>
                            {eventType?.description}
                        </Text>
                        <View className="flex-row items-center gap-3 mt-1" >
                            <View className='flex flex-row gap-1'>
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

                {/* Right side: Price + quantity */}
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
                            value={String(quantity)} />


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
