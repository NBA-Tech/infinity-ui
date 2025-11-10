import { Card } from '@/components/ui/card';
import React, { useContext } from 'react';
import { View,Text } from 'react-native';
import { ThemeToggleContext,StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FormFields } from '@/src/types/common';
import { CustomFieldsComponent } from '@/src/components/fields-component';


type PaymentComponentProps = {
    paymentForm: FormFields
}
const PaymentComponent = (props: PaymentComponentProps) => {
    const { isDark } = useContext(ThemeToggleContext);
    const  globalStyles  = useContext(StyleContext);
    return (
        <View className='gap-3'>
            <Card style={[globalStyles.cardShadowEffect, { padding: 0, paddingBottom: hp('2%') }]}>
                {/* Header */}
                <View style={{ backgroundColor: isDark ? "#164E63" : "#ECFEFF", padding: hp("2%") }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Feather name="file" size={wp("7%")} color="#06B6D4" />
                        <Text
                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                        >
                            Quotation Information
                        </Text>
                    </View>
                </View>
                <CustomFieldsComponent infoFields={props.paymentForm} cardStyle={{ padding: hp("2%") }} />
            </Card>
        </View>

    );
};

export default PaymentComponent;