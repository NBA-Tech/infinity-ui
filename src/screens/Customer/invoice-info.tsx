import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/gradient-card';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { Button, ButtonText } from '@/components/ui/button';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { formatDate } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import { useNavigation } from '@react-navigation/native';


const styles = StyleSheet.create({
    projectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingHorizontal: wp('3%'),
        paddingTop: hp('2%'),
    },
    cardContainer: {
        marginHorizontal: wp('1%'), // Balanced spacing between cards
        padding: wp('3%'), // Responsive padding
        minHeight: hp('12%'), // Compact card height
        borderRadius: 8, // Smooth card edges
        width: wp('30%'),
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    statusContainer: {
        padding: wp('2%'),
        borderRadius: wp('30%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#065F46',
        gap: wp('1%')

    }
});
type InvoiceInfoProps = {
    invoiceDetails: Invoice[]
    isLoading: boolean
}
const InvoiceInfo = (props: InvoiceInfoProps) => {
    console.log(props.invoiceDetails);
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const navigation = useNavigation();

    const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
        return (
            <Card style={globalStyles.cardShadowEffect}>
                <View className="flex flex-row items-start justify-between w-full">

                    {/* Left side: Icon + Invoice Details */}
                    <View className="flex flex-row items-start gap-3">
                        {/* Gradient Icon */}
                        <GradientCard colors={["#06B6D4", "#3B82F6", "#8B5CF6"]}>
                            <View className="p-2">
                                <Feather name="file-text" size={wp("7%")} color="#fff" />
                            </View>
                        </GradientCard>

                        {/* Invoice Details */}
                        <View className="flex flex-col">
                            {/* Invoice Number */}
                            <Text
                                style={[
                                    globalStyles.normalTextColor,
                                    globalStyles.subHeadingText,
                                ]}
                            >
                                {invoice?.invoiceId}
                            </Text>

                            {/* Date + Items */}
                            <View className="flex flex-row gap-3">
                                {/* Date */}
                                <View className="flex flex-row items-center gap-2 mt-1">
                                    <Feather name="calendar" size={wp("3%")} color={isDark ? '#fff' : '#000'} />
                                    <Text
                                        style={[
                                            globalStyles.normalTextColor,
                                            globalStyles.smallText,
                                        ]}
                                    >
                                        {formatDate(invoice?.invoiceDate)}
                                    </Text>
                                </View>

                                {/* Items */}
                                <View className="flex flex-row items-center gap-2 mt-1">
                                    <Feather name="map" size={wp("3%")} color={isDark ? '#fff' : '#000'} />
                                    <Text
                                        style={[
                                            globalStyles.normalTextColor,
                                            globalStyles.smallText,
                                        ]}
                                    >
                                        {invoice?.orderName}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Right side: Amounts */}
                    <View className="flex flex-col items-end">
                        <Text
                            style={[
                                globalStyles.normalTextColor,
                                globalStyles.subHeadingText,
                            ]}
                        >
                            ₹{invoice?.amountPaid}
                        </Text>
                    </View>

                </View>
                <Divider style={{ marginVertical: hp('2%') }} />
                <View className='flex flex-1 flex-row justify-end items-center gap-3'>
                    <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                        <Feather name="eye" size={wp("5%")} color={isDark ? '#fff' : '#000'} />
                        <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>View Details</ButtonText>
                    </Button>

                    <Button size="sm" variant="solid" action="primary" style={globalStyles.purpleBackground}>
                        <Feather name="send" size={wp("5%")} color="#fff" />
                        <ButtonText style={[globalStyles.buttonText, globalStyles.whiteTextColor]}>Send Reminder</ButtonText>
                    </Button>

                </View>
            </Card>



        )

    }
    return (
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
        >

            <View style={{ margin: hp('1%'), gap: hp('2%') }}>
                {!props?.isLoading && props?.invoiceDetails?.length === 0 && (
                    <EmptyState variant="orders" onAction={() => navigation.navigate('Invoice', { screen: 'CreateInvoice' })} />
                )}
                {props?.isLoading ? (
                    <View>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                style={{
                                    width: wp('90%'),       // width of each item
                                    height: hp('10%'),       // height of each item
                                    marginRight: wp('2%'),  // horizontal spacing
                                    marginBottom: hp('2%'), // vertical spacing
                                }}
                            />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={props?.invoiceDetails}
                        renderItem={({ item }) => <InvoiceCard invoice={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ gap: hp('2%') }}
                    />
                )

                }


            </View>

        </ScrollView>
    );
};

export default InvoiceInfo;