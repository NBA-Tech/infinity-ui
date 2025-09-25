import React, { useContext, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import {heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FormFields } from '@/src/types/common';
const QuotationDetails = () => {
    const globalStyles = useContext(StyleContext);
    const [orderInfo, setOrderInfo] = useState<any>(null);
    return (
        <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
            {/* Header */}
            <View style={{ backgroundColor: "#ECFEFF", padding: hp("2%") }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Feather name="user" size={wp("7%")} color="#06B6D4" />
                    <Text
                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                    >
                        Quotation Information
                    </Text>
                </View>
            </View>


        </Card>
    );
};

export default QuotationDetails;