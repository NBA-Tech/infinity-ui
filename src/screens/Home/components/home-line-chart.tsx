import React, { useContext, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity,StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Skeleton from '@/components/ui/skeleton';
import Tooltip, { Placement } from 'react-native-tooltip-2';
import Feather from 'react-native-vector-icons/Feather';
import { EmptyState } from '@/src/components/empty-state-data';
import { BarChart } from 'react-native-gifted-charts';
import { Invoice } from '@/src/types/invoice/invoice-type';


const styles=StyleSheet.create({
    roundDotContainer:{
        width:wp('3%'),
        height:wp('3%'),
        borderRadius:wp('100%'),
        backgroundColor:'gray'
    }
})
type RevenueTrendChartProps = {
    isLoading: boolean;
    invoiceDetails: Invoice[];
};

const RevenueTrendChart = (props: RevenueTrendChartProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    console.log(props?.invoiceDetails)

    const barData = [
        // Jan
        { value: 4000, label: 'Jan', spacing: 2, labelWidth: 30, labelTextStyle: { color: 'gray' }, frontColor: '#7C3AED' },
        { value: 2500, frontColor: '#C4B5FD' },
        // Feb
        { value: 3000, label: 'Feb', spacing: 2, labelWidth: 30, labelTextStyle: { color: 'gray' }, frontColor: '#7C3AED' },
        { value: 2000, frontColor: '#C4B5FD' },
        // Mar
        { value: 2000, label: 'Mar', spacing: 2, labelWidth: 30, labelTextStyle: { color: 'gray' }, frontColor: '#7C3AED' },
        { value: 3200, frontColor: '#C4B5FD' },
        // Apr
        { value: 3500, label: 'Apr', spacing: 2, labelWidth: 30, labelTextStyle: { color: 'gray' }, frontColor: '#7C3AED' },
        { value: 2700, frontColor: '#C4B5FD' },
        // May
        { value: 3800, label: 'May', spacing: 2, labelWidth: 30, labelTextStyle: { color: 'gray' }, frontColor: '#7C3AED' },
        { value: 2900, frontColor: '#C4B5FD' },
        // Jun
        { value: 4200, label: 'Jun', spacing: 2, labelWidth: 30, labelTextStyle: { color: 'gray' }, frontColor: '#7C3AED' },
        { value: 3100, frontColor: '#C4B5FD' },
    ];


    return (
        <Card style={[{ padding: wp('3%'), marginVertical: hp('3%') }]}>
            {/* Header */}
            <View className='flex flex-row justify-between items-center mb-3'>
                <View>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Investment vs Profit</Text>
                    <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>Monthly comparison for this year</Text>
                </View>
                <View className='flex flex-col gap-1 justify-center items-center'>
                    <Tooltip
                        isVisible={toolTipVisible}
                        content={<Text>This chart shows the monthly investment and profit trends side by side.</Text>}
                        placement={Placement.BOTTOM}
                        onClose={() => setToolTipVisible(false)}>
                        <TouchableOpacity onPress={() => setToolTipVisible(true)}>
                            <Feather name="info" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </Tooltip>
                    <View className='flex flex-row justify-center items-center gap-3'>
                        <View style={[styles.roundDotContainer,{backgroundColor:'#22C55E'}]}></View>
                        <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>Profit</Text>

                    </View>
                    <View className='flex flex-row justify-center items-center gap-3'>
                        <View style={[styles.roundDotContainer,{backgroundColor:'#EF4444'}]}></View>
                        <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>Expenses</Text>

                    </View>
                </View>
            </View>

            {/* Chart */}
            {props?.isLoading ? (
                <Skeleton height={hp('30%')} width={wp('90%')} />
            ) : (
                barData?.length > 0 ? (
                    <BarChart
                        data={barData}
                        barWidth={16}
                        spacing={16}
                        roundedTop
                        roundedBottom
                        hideRules
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: 'gray' }}
                        noOfSections={5}
                        maxValue={5000}
                    />
                ) : (
                    <EmptyState title={'No data available'} noAction={true} />
                )
            )}
        </Card>
    );
};

export default RevenueTrendChart;
