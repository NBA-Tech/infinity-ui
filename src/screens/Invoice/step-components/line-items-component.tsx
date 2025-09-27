import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { OfferingInfo, OrderType } from '@/src/types/order/order-type';
import { InvoiceItem } from '@/src/types/invoice/invoice-type';
import { Button, ButtonText } from '@/components/ui/button';
import { patchState } from '@/src/utils/utils';

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
        height: hp('4.5%'),
        justifyContent: 'center',
        textAlign: 'center',
    },
    inputContainer: {
        width: wp('50%'),
        borderRadius: wp('2%'),
        textAlign: 'center',
    },
});

type LineItemsComponentProps = {
    offeringInfo: OfferingInfo;
    items?: InvoiceItem[];
    setInvoiceDetails?: any;
    setErrors?: any;
};

const LineItemsComponent = (props: LineItemsComponentProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [localItems, setLocalItems] = useState<InvoiceItem[]>(props.items || []);

    const handlePriceChangeCalculation = (id: string, newQuantity: number) => {
        const updatedData = localItems.map((item) => {
            if (item.itemId === id) {
                const updatedTotal = item.unitPrice * newQuantity;
                return {
                    ...item,
                    quantityPaying: newQuantity,
                    amountPaying: updatedTotal,
                };
            }
            return item;
        });
        setLocalItems(updatedData);
        patchState('items', '', updatedData, true, props.setInvoiceDetails, props.setErrors);
    };

    const handleIncrementQuantity = (id: string) => {
        const item = localItems.find((i) => i.itemId === id);
        if (item && item.quantityPaying < item.quantity) {
            handlePriceChangeCalculation(id, item.quantityPaying + 1);
        }
    };

    const handleDecrementQuantity = (id: string) => {
        const item = localItems.find((i) => i.itemId === id);
        if (item && item.quantityPaying > 0) {
            handlePriceChangeCalculation(id, item.quantityPaying - 1);
        }
    };

    const handleAddLineItem = () => {
        const newItems: InvoiceItem[] = [];

        if (props.offeringInfo.orderType === 'SERVICE') {
            props.offeringInfo.services?.forEach((service) => {
                const exists = localItems.some((item) => item.itemId === service.id);
                if (!exists) {
                    newItems.push({
                        itemId: service.id,
                        itemName: service.name,
                        itemType: props.offeringInfo.orderType,
                        quantity: service.value,
                        unitPrice: service.price,
                        total: service.price * service.value,
                        quantityPaying: 0,
                        amountPaying: service.price * service.value,
                    });
                }
            });
        } else if (props.offeringInfo.orderType === 'PACKAGE') {
            const exists = localItems.some((item) => item.itemId === props.offeringInfo.packageId);
            if (!exists && props.offeringInfo.packageId && props.offeringInfo.packagePrice) {
                newItems.push({
                    itemId: props.offeringInfo.packageId,
                    itemName: props.offeringInfo.packageName || 'Package',
                    itemType: props.offeringInfo.orderType,
                    quantity: 1,
                    unitPrice: props.offeringInfo.packagePrice,
                    total: props.offeringInfo.packagePrice,
                    quantityPaying: 1,
                    amountPaying: props.offeringInfo.packagePrice,
                });
            }
        }

        if (newItems.length > 0) {
            const updatedData = [...localItems, ...newItems];
            setLocalItems(updatedData);
            patchState('items', '', updatedData, true, props.setInvoiceDetails, props.setErrors);
        }
    };

    const handleDeleteLineItem = (id: string) => {
        const updatedData = localItems.filter((item) => item.itemId !== id);
        setLocalItems(updatedData);
        patchState('items', '', updatedData, true, props.setInvoiceDetails, props.setErrors);
    };

    return (
        <View className='gap-3'>
            <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                <View style={{ backgroundColor: isDark ? '#164E63' : '#ECFEFF', padding: hp('2%') }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Feather name='user' size={wp('7%')} color='#06B6D4' />
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Quotation Information
                        </Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {localItems.map((item) => (
                        <Card
                            key={item.itemId}
                            style={[globalStyles.cardShadowEffect, { margin: wp('3%'), padding: hp('2%') }]}
                        >
                            <View>
                                <View className='flex flex-row justify-between items-center'>
                                    <View className='flex flex-col'>
                                        <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>
                                            {item.itemName}
                                        </Text>
                                        <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>
                                            Unit Price: ${item.unitPrice}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleDeleteLineItem(item.itemId)}>
                                        <Feather name='trash' size={wp('5%')} color='red' />
                                    </TouchableOpacity>
                                </View>

                                <View className='flex flex-row justify-between items-center' style={{ marginTop: hp('2%') }}>
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalText, globalStyles.themeTextColor]}>Total Quantity</Text>
                                        <Text style={[globalStyles.normalText, globalStyles.themeTextColor]}>{item.quantity}</Text>
                                    </View>
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalText, globalStyles.themeTextColor]}>Already Paid</Text>
                                        <Text style={[globalStyles.normalText, globalStyles.themeTextColor]}>0</Text>
                                    </View>
                                </View>

                                <View>
                                    <Text style={[globalStyles.normalBoldText, globalStyles.themeTextColor, { marginTop: hp('2%') }]}>
                                        Quantity to Invoice Now
                                    </Text>
                                    <View className='flex flex-row justify-start items-center gap-3' style={{ marginTop: hp('1%') }}>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleDecrementQuantity(item.itemId)}
                                        >
                                            <Feather name='minus' size={wp('4%')} color='#fff' />
                                        </TouchableOpacity>

                                        <TextInput
                                            style={[globalStyles.greyInputBox, styles.otp]}
                                            keyboardType='number-pad'
                                            value={item.quantityPaying.toString()}
                                            onChangeText={(text) => {
                                                const val = Math.min(Math.max(Number(text), 0), item.quantity);
                                                handlePriceChangeCalculation(item.itemId, val);
                                            }}
                                        />

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleIncrementQuantity(item.itemId)}
                                        >
                                            <Feather name='plus' size={wp('4%')} color='#fff' />
                                        </TouchableOpacity>

                                        <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>
                                            Max: {item.quantity}
                                        </Text>
                                    </View>
                                </View>

                                <Divider style={{ marginVertical: hp('1.5%') }} />

                                <View className='flex flex-row justify-between items-center'>
                                    <Text style={[globalStyles.normalBoldText, globalStyles.themeTextColor]}>Total</Text>
                                    <Text style={[globalStyles.normalBoldText, globalStyles.themeTextColor]}>${item.amountPaying}</Text>
                                </View>
                            </View>
                        </Card>
                    ))}

                    <Button
                        size='lg'
                        variant='solid'
                        action='primary'
                        style={{ backgroundColor: '#8B5CF6', borderRadius: wp('2%'), marginVertical: hp('2%') }}
                        onPress={handleAddLineItem}
                        isDisabled={
                            props?.offeringInfo?.orderType === 'SERVICE'
                                ? localItems.length === props.offeringInfo.services?.length
                                : localItems.length === 1
                        }
                    >
                        <Feather name='plus' size={wp('5%')} color='#fff' />
                        <ButtonText style={globalStyles.buttonText}>Add Line Item</ButtonText>
                    </Button>
                </ScrollView>
            </Card>
        </View>
    );
};

export default LineItemsComponent;
