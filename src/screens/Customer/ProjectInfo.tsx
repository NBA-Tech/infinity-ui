import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Progress, ProgressFilledTrack } from "@/components/ui/progress"
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
        padding: wp('3%'),
        borderRadius: wp('30%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#065F46',
        gap: wp('1%')

    }
});

const ProjectInfo = () => {
    const globalStyles = useContext(StyleContext);

    const statInfo = {
        completed: {
            title: "Completed",
            value: "100",
            color: "#3B82F6", // blue-500
        },
        pending: {
            title: "Pending",
            value: "50",
            color: "#F59E0B", // amber-500
        },
        cancelled: {
            title: "Cancelled",
            value: "0",
            color: "#EF4444", // red-500
        },

    };

    const ProjectCards = () => (
        <Card style={globalStyles.cardShadowEffect}>
            <View>
                <View>
                    <View className='flex flex-1 flex-row justify-between items-center'>
                        <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>Pre-Wedding PhotoShoot</Text>
                        <View style={styles.statusContainer}>
                            <Feather name="check-circle" size={wp('3%')} color="#fff" />
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>Completed</Text>
                        </View>
                    </View>
                    <View className='flex flex-1 flex-row justify-start items-center gap-3'>
                        <View className='flex flex-row gap-3'>
                            <Feather name="calendar" size={wp('3%')} color="#000" />
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>24/6/2000</Text>

                        </View>
                        <View className='flex flex-row gap-3'>
                            <Feather name="map" size={wp('3%')} color="#000" />
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Tamil Nadu, Coimbatore</Text>

                        </View>

                    </View>
                    <View>
                        <View className='flex flex-1 flex-row justify-between items-center' style={{ marginTop: hp('2%'), marginHorizontal: wp('5%') }}>
                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Budget</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>₹10,00,000</Text>

                            </View>

                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Progress</Text>
                                <Progress value={55} style={{ width: wp('30%') }}>
                                    <ProgressFilledTrack style={{ backgroundColor: '#4F46E5' }} />
                                </Progress>

                            </View>
                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Team</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>2 Members</Text>

                            </View>

                        </View>

                    </View>
                    <Divider style={{ marginVertical: hp('2%') }} />

                    <View className='flex flex-1 flex-row justify-between items-center'>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Type : Wedding</Text>
                        </View>
                        <View>
                            <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                <Feather name="eye" size={wp("5%")} color="#000" />
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>View Details</ButtonText>
                            </Button>
                        </View>
                    </View>

                </View>
            </View>

        </Card>
    )

    return (
        <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
        >
            <View className='flex flex-col'>
                <View style={styles.projectContainer}>
                    {Object.values(statInfo).map((stat, index) => (
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
            <View style={{ margin: hp('2%'),gap:hp('2%') }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <ProjectCards key={index} />
                ))

                }
            </View>
        </ScrollView>
    );
};

export default ProjectInfo;