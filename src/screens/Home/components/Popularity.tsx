import React, { useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: wp('2%'),
        marginVertical: hp('2%'),
        padding: wp('4%'),
        height: hp('40%'), // fixed height for scroll
    },
})
const Popularity = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <View>
            <Card style={styles.cardContainer}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Service Popularity
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                            Distribution of bookings
                        </Text>
                    </View>
                    <Feather name="info" size={wp('5%')} color="#000" />
                </View>
                <Divider style={{ marginVertical: hp('1.5%') }} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp('2%') }}
                    nestedScrollEnabled={true}
                >
                    {Array.from({ length: 5 }).map((_, index) => (
                        <View style={{ marginTop: hp('2%') }}>
                            <View className='flex flex-row justify-between items-center gap-3'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                    Wedding Photography
                                </Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                    40%
                                </Text>
                            </View>
                            <View style={{ marginTop: hp('1%') }}>
                                <Progress value={55} style={{ width: wp('40%') }}>
                                    <ProgressFilledTrack style={{ backgroundColor: '#4F46E5' }} />
                                </Progress>
                            </View>

                        </View>
                    ))

                    }
                </ScrollView>



            </Card>

        </View>
    );
};

export default Popularity;