import { Card } from '@/components/ui/card';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Divider } from '@/components/ui/divider';
const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: wp('2%'),
        marginVertical: hp('2%'),
        padding: wp('4%'),
        height: hp('50%'), // fixed height for scroll
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('2%'),
        gap: wp('2%')
    },
    dot: {
        width: wp('3%'),
        height: wp('3%'),
        borderRadius: wp('100%')
    },
    textWrapper: {
        flex: 1,
    },
    timeWrapper: {
        alignItems: 'flex-end',
    },
})
const DeadLines = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <View>
            <Card style={styles.cardContainer}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Upcoming Deadlines
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                            Deliverables due soon
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
                    <View style={{ marginTop: hp('2%') }}>
                        <View style={styles.activityRow}>
                            <View style={[styles.dot,{backgroundColor:"red"}]}>
                            </View>

                            <View style={styles.textWrapper}>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>
                                    Pre-Wedding PhotoShoot
                                </Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                                    Wedding Photography
                                </Text>
                            </View>

                            <View style={styles.timeWrapper}>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                                    1 day ago
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>



            </Card>

        </View>
    );
};

export default DeadLines;