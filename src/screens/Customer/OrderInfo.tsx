import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Progress, ProgressFilledTrack } from "@/components/ui/progress"
import { Divider } from '@/components/ui/divider';
import { Button, ButtonText } from '@/components/ui/button';
import OrderCard from '../Orders/components/OrderCard';

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
                    <OrderCard key={index} />
                ))

                }
            </View>
        </ScrollView>
    );
};

export default ProjectInfo; 