import Header from '@/src/components/header';
import React, { useContext } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import Feather from 'react-native-vector-icons/Feather';
import GradientCard from '@/src/utils/gradient-gard';
import { BarChart } from 'react-native-chart-kit';
import { GeneralStatInfoModel } from './types/home-type';
import { StatInfo } from './components/stat-info';
import HomeLineChart from './components/home-line-chart';
import EventDateKeeper from './components/event-date-keeper';
import Activity from './components/activity';
import Popularity from './components/popularity';
import DeadLines from './components/dead-lines';
import HeatmapYear from './components/heat-map-year';
import TopClient from './components/top-client';

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
                        
                        <View>
                            <Popularity />
                        </View>
                        <View>
                            <DeadLines />

                        </View>
                        <View>
                            <TopClient />
                        </View>
                        <View>
                            <Activity />
                        </View>
                        <View>
                            <HeatmapYear />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;