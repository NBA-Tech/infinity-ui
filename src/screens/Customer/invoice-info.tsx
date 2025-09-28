import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/gradient-card';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { Button, ButtonText } from '@/components/ui/button';



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
const InvoiceInfo = () => {
    const globalStyles = useContext(StyleContext);

    const invoiceInfo = {
        completed: {
            title: "Paid",
            value: "100",
            color: "#22C55E", // green-500
        },
        pending: {
            title: "Unpaid",
            value: "50",
            color: "#F59E0B", // amber-500
        },
        cancelled: {
            title: "Overdue",
            value: "0",
            color: "#EF4444", // red-500
        },

    };

    const InvoiceCard = () => {
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
                                INV-2024-001
                            </Text>

                            {/* Date + Items */}
                            <View className="flex flex-row gap-3">
                                {/* Date */}
                                <View className="flex flex-row items-center gap-2 mt-1">
                                    <Feather name="calendar" size={wp("3%")} color="#000" />
                                    <Text
                                        style={[
                                            globalStyles.normalTextColor,
                                            globalStyles.smallText,
                                        ]}
                                    >
                                        24/6/2000
                                    </Text>
                                </View>

                                {/* Items */}
                                <View className="flex flex-row items-center gap-2 mt-1">
                                    <Feather name="map" size={wp("3%")} color="#000" />
                                    <Text
                                        style={[
                                            globalStyles.normalTextColor,
                                            globalStyles.smallText,
                                        ]}
                                    >
                                        3 items
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
                            ₹10,00,000
                        </Text>
                        <View style={styles.statusContainer}>
                            <Feather name="check-circle" size={wp('3%')} color="#fff" />
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>Completed</Text>
                        </View>
                    </View>

                </View>
                <Divider style={{ marginVertical: hp('2%') }} />
                <View className='flex flex-1 flex-row justify-end items-center gap-3'>
                    <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                        <Feather name="eye" size={wp("5%")} color="#000" />
                        <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>View Details</ButtonText>
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
            <View className='flex flex-col'>
                <View style={styles.projectContainer}>
                    {Object.values(invoiceInfo).map((stat, index) => (
                        <Card
                            style={[
                                styles.cardContainer,
                                { backgroundColor: `${stat.color}20` }, // Subtle background
                            ]}
                            key={index}
                        >
                            <View style={styles.textContainer}>
                                <Text
                                    style={[
                                        globalStyles.normalTextColor,
                                        globalStyles.labelText,
                                        {
                                            color: stat.color,
                                        },
                                    ]}
                                >
                                    {stat.title}
                                </Text>
                                <View className="flex-row items-center gap-1 mt-1">
                                    <Text
                                        style={[
                                            globalStyles.normalTextColor,
                                            globalStyles.labelText,
                                            {
                                                color: stat.color,
                                            },
                                        ]}
                                    >
                                        {stat.value}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>


            </View>

            <View style={{ margin: hp('1%'), gap: hp('2%') }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <InvoiceCard key={index} />
                ))

                }
            </View>

        </ScrollView>
    );
};

export default InvoiceInfo;