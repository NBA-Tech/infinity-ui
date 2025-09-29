import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FormFields, SearchQueryRequest } from '@/src/types/common';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { Divider } from '@/components/ui/divider';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { getOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { CustomerApiResponse } from '@/src/types/customer/customer-type';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { formatDate } from '@/src/utils/utils';

type QuotationDetailsProps = {
    orderForm?: FormFields
    orderDetails?: any
}
const QuotationDetails = (props: QuotationDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);

    const listItems = useMemo(() => {
        return [
            { label: 'Event Title', value: props?.orderDetails?.eventInfo?.eventTitle || "N/A" },
            { label: 'Customer Name', value: props?.orderDetails?.customerInfo ? `${props?.orderDetails?.customerInfo?.firstName} ${props?.orderDetails?.customerInfo?.lastName}` : "N/A" },
            { label: 'Event Created Date', value: formatDate(props?.orderDetails?.eventInfo?.eventDate) || "N/A" },
            { label: 'Event Status', value: props?.orderDetails?.status || "N/A" },
            { label: 'Quotation Amount', value: `$ ${props?.orderDetails?.totalPrice}` || "N/A" },
            { label: 'Event Type', value: props?.orderDetails?.eventInfo?.eventType || "N/A" },
            { label: 'Customer Email', value: props?.orderDetails?.customerInfo?.email || "N/A" },
            { label: 'Customer Phone', value: props?.orderDetails?.customerInfo?.mobileNumber || "N/A" },
        ]
    }, [props?.orderDetails])


    return (
        <View className='gap-3'>
            <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                {/* Header */}
                <View style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Feather name="user" size={wp("7%")} color="#06B6D4" />
                        <Text
                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                        >
                            Quotation Information
                        </Text>
                    </View>
                </View>
                <CustomFieldsComponent infoFields={props.orderForm} cardStyle={{ padding: hp("2%") }} />
            </Card>
            {props?.orderForm?.orderId?.value && (
                <Divider />
            )

            }
            <Card style={globalStyles.cardShadowEffect}>
                <ScrollView
                contentContainerStyle={{ padding: hp("2%"),marginBottom:hp("10%") }}
                    showsVerticalScrollIndicator={false}>
                    <View>
                        <View className='flex flex-row justify-start items-center gap-2'>
                            <Feather name="file-text" size={wp("7%")} color="#06B6D4" />
                            <Text style={[globalStyles.heading3Text, globalStyles.normalTextColor]}>Order Details</Text>
                        </View>
                    </View>

                    <View>
                        {listItems.reduce((rows, item, index) => {
                            if (index % 2 === 0) rows.push([item]);
                            else rows[rows.length - 1].push(item);
                            return rows;
                        }, [] as any[]).map((row, rowIndex) => (
                            <View
                                key={rowIndex}
                                className="flex flex-row justify-between items-center"
                            >
                                {row.map((field, i) => (
                                    <View
                                        key={i}
                                        className="flex flex-col justify-start items-start"
                                        style={{ marginTop: hp("2%"), flex: 1 }}
                                    >
                                        <Text style={[globalStyles.sideHeading, globalStyles.themeTextColor]}>
                                            {field.label}
                                        </Text>
                                        <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>
                                            {field.value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}


                    </View>
                </ScrollView>

            </Card>
        </View>
    );
};

export default QuotationDetails;