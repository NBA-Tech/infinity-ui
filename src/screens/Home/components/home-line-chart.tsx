import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Skeleton from '@/components/ui/skeleton';
import Tooltip, { Placement } from 'react-native-tooltip-2';
import Feather from 'react-native-vector-icons/Feather';
import { EmptyState } from '@/src/components/empty-state-data';
import { BarChart } from 'react-native-gifted-charts';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { InvestmentModel } from '@/src/types/investment/investment-type';


const styles = StyleSheet.create({
    roundDotContainer: {
        width: wp('3%'),
        height: wp('3%'),
        borderRadius: wp('100%'),
        backgroundColor: 'gray'
    }
})
type RevenueTrendChartProps = {
    isLoading: boolean;
    invoiceDetails: Invoice[];
    investmentDetails: InvestmentModel[]
};

const RevenueTrendChart = (props: RevenueTrendChartProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [barData, setBarData] = useState<any[]>([]);
    console.log(props)

    const getMonthlyTotals = (
        data: any[],
        amountField: string,
        dateField: string
    ) => {
        const totals = new Array(12).fill(0);
        data?.forEach((item) => {
            if (item[dateField]) {
                const month = new Date(item[dateField]).getMonth();
                totals[month] += Number(item[amountField]) || 0;
            }
        });
        console.log("totals", totals)
        return totals;
    };

    useEffect(() => {
        if (props.isLoading) return;

        const { invoiceDetails, investmentDetails } = props;

        // ✅ Step 1: Compute totals per month
        const profitByMonth = getMonthlyTotals(invoiceDetails, "amountPaid", "invoiceDate");
        const expenseByMonth = getMonthlyTotals(investmentDetails, "investedAmount", "investmentDate");

        // ✅ Step 2: Build bar chart data (Jan → Dec)
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedData = monthLabels.flatMap((label, index) => [
            {
                value: profitByMonth[index],
                label,
                spacing: 2,
                labelWidth: 30,
                labelTextStyle: { color: "gray" },
                frontColor: "#22C55E",
                topLabelComponent: () => (
                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>{profitByMonth[index]}</Text>
                ),
            },
            {
                value: expenseByMonth[index],
                frontColor: "#EF4444",
                topLabelComponent: () => (
                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>{expenseByMonth[index]}</Text>
                ),
            },
        ]);

        setBarData(formattedData);
    }, [props.invoiceDetails, props.investmentDetails]);

    const maxValue = Math.max(...barData.map((d) => d.value || 0), 5000);


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
                        <View style={[styles.roundDotContainer, { backgroundColor: '#22C55E' }]}></View>
                        <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>Profit</Text>

                    </View>
                    <View className='flex flex-row justify-center items-center gap-3'>
                        <View style={[styles.roundDotContainer, { backgroundColor: '#EF4444' }]}></View>
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
                        hideRules
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: 'gray' }}
                        noOfSections={5}
                        maxValue={maxValue+1000}
                    />
                ) : (
                    <EmptyState title={'No data available'} noAction={true} />
                )
            )}
        </Card>
    );
};

export default RevenueTrendChart;
