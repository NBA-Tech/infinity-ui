import React, { useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card'; // assuming you have a Card component
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
// Temporary revenue data
const revenueData = [
    { month: 'Jan', value: 5000 },
    { month: 'Feb', value: 8000 },
    { month: 'Mar', value: 6500 },
    { month: 'Apr', value: 9000 },
    { month: 'May', value: 7500 },
    { month: 'Jun', value: 11000 },
];

const formatCurrency = (num: number) => `$${num.toLocaleString()}`;

const RevenueTrendChart = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const data = {
        labels: revenueData.map(d => d.month),
        datasets: [
            {
                data: revenueData.map(d => d.value),
                strokeWidth: 2,
            },
        ],
    };

    return (
        <Card style={[{padding:wp('3%'),marginVertical:hp('3%')}]}>
            <View style={{ marginBottom: 8 }}>
                <Text style={[globalStyles.heading3Text,globalStyles.themeTextColor]}>Revenue Trend</Text>
                <Text style={[globalStyles.smallText,globalStyles.themeTextColor]}>Monthly revenue over time</Text>
            </View>
            {/* Add Dropdown component for the year */}

            <LineChart
                data={data}
                width={wp('90%')}
                height={hp('25%')}
                withDots={true}
                withShadow={true}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={true}
                yAxisLabel="$"
                chartConfig={{
                    backgroundGradientFrom: isDark ? "#272932" : "#ffffffcc",
                    backgroundGradientTo: isDark ? "#272932" : "#ffffffcc",
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // line color
                    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: '#3B82F6',
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '', // solid background lines
                        stroke: '#e0e0e0',
                    },
                }}
                style={{
                    borderRadius: 12,
                }}
            />



        </Card>
    );
};

export default RevenueTrendChart;
