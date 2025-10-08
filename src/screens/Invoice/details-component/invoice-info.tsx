import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useUserStore } from '@/src/store/user/user-store';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { formatDate } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';


type InvoiceInfoProps = {
    invoiceDetails: Invoice
    loading: boolean
}
const InvoiceInfo = (props: InvoiceInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const { userDetails } = useUserStore()
    return (
        <Card style={[globalStyles.cardShadowEffect]}>

            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="file" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Invoice Information</Text>

                    </View>
                    {props?.loading ? (
                        <Skeleton style={{ width: wp('88%'), height: hp('25%') }} />
                    ) : (
                        <View className='flex flex-col gap-3'>
                            <View className='flex flex-row justify-between items-center'>
                                <View>
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Event Name</Text>
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{props?.invoiceDetails?.orderName}</Text>
                                </View>
                                <View>
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Quotation ID</Text>
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>#{props?.invoiceDetails?.orderId}</Text>
                                </View>

                            </View>
                            <View className='flex flex-row justify-between items-center'>
                                <View>
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Invoice ID</Text>
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>#{props?.invoiceDetails?.invoiceId}</Text>
                                </View>
                                <View>
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Invoice Date</Text>
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{formatDate(props?.invoiceDetails?.invoiceDate)}</Text>
                                </View>

                            </View>
                            <View className='flex flex-row justify-between items-center'>

                                <View>
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Payment Method</Text>
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{props?.invoiceDetails?.paymentType}</Text>
                                </View>
                                <View>
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Amount</Text>
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{userDetails?.currencyIcon} {props?.invoiceDetails?.amountPaid}</Text>
                                </View>

                            </View>

                        </View>
                    )

                    }


                </View>

            </View>
        </Card>
    );
};

export default InvoiceInfo;