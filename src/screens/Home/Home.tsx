import Header from '@/src/Components/Header';
import React, { useContext } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import GradientCard from '@/src/utils/GradientCard';
import { BarChart } from 'react-native-chart-kit';
import { GeneralStatInfoModel } from './types/HomeType';
import { StatInfo } from './components/StatInfo';
import HomeLineChart from './components/HomeLineChart';
import EventDateKeeper from './components/EventDateKeeper';

const styles = StyleSheet.create({
    scrollContainer: {
        gap: wp('2%')
    }
})


const Home = () => {
    const globalStyles = useContext(StyleContext);
    const generalStatData: GeneralStatInfoModel = {
        customer: {
            label: "Total Customers",
            backgroundColor: "#66D8E6",
            icon: <Feather name="users" size={wp('6%')} color={'#fff'} />,
            gradientColors: ["#3B82F6", "#22D3EE", "#06B6D4"],
        },
        revenue: {
            label: "Total Revenue",
            backgroundColor: "#22C55E",
            icon: <Feather name="dollar-sign" size={wp('6%')} color={'#fff'} />,
            gradientColors: ["#22C55E", "#10B981"],
        },
        upcomingShoots: {
            label: "Upcoming Shoots",
            backgroundColor: "#EF4444",
            icon: <Feather name="calendar" size={wp('6%')} color={'#fff'} />,
            gradientColors: ["#EF4444", "#F87171"],
        },
        completedOrders: {
            label: "Completed Orders",
            backgroundColor: "#F59E0B",
            icon: <Feather name="check-circle" size={wp('6%')} color={'#fff'} />,
            gradientColors: ["#F59E0B", "#FBBF24"],
        },
        pendingOrders: {
            label: "Pending Orders",
            backgroundColor: "#8B5CF6",
            icon: <Feather name="clock" size={wp('6%')} color={'#fff'} />,
            gradientColors: ["#8B5CF6", "#A78BFA"],
        },
        activeQuotation: {
            label: "Active Quotation",
            backgroundColor: "#3B82F6",
            icon: <Feather name="file-text" size={wp('6%')} color={'#fff'} />,
            gradientColors: ["#3B82F6", "#2563EB"],
        },
    };

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ margin: hp('1%') }}>
                    <View>
                        <View>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContainer}
                                data={Object.values(generalStatData)}
                                renderItem={({ item, index }) => <StatInfo item={item} index={index} />}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={0.7}
                            />

                        </View>
                        <View>
                            <HomeLineChart />
                        </View>
                        <View>
                            <EventDateKeeper />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;