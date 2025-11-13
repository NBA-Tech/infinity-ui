import React, { useContext, useEffect, useState } from "react";
import { View, Text, processColor, ScrollView, StyleSheet } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import { Card } from "@/components/ui/card";
import { StyleContext, ThemeToggleContext } from "@/src/providers/theme/global-style-provider";
import { Divider } from "@/components/ui/divider";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Skeleton from "@/components/ui/skeleton";
import Feather from "react-native-vector-icons/Feather";
import Tooltip, { Placement } from "react-native-tooltip-2";
import { EmptyState } from "@/src/components/empty-state-data";
import { useUserStore } from "@/src/store/user/user-store";

type RevenueTrendChartProps = {
    isLoading: boolean;
    invoiceDetails: any[];
    investmentDetails: any[];
};

export default function RevenueTrendChart(props: RevenueTrendChartProps) {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { userDetails } = useUserStore();

    const [tooltipData, setTooltipData] = useState<any | null>(null);
    const [barData, setBarData] = useState<any[]>([]);
    const [toolTipVisible, setToolTipVisible] = useState(false);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // ---------- UTIL: Month totals ----------
    const getMonthlyTotals = (data: any[], field: string, dateField: string) => {
        const totals = new Array(12).fill(0);
        data?.forEach((item) => {
            if (item[dateField]) {
                const m = new Date(item[dateField]).getMonth();
                totals[m] += Number(item[field]) || 0;
            }
        });
        return totals;
    };

    // ---------- PREPARE CHART DATA ----------
    useEffect(() => {
        if (props.isLoading) return;

        const revenue = getMonthlyTotals(props.invoiceDetails, "amountPaid", "invoiceDate");
        const expenses = getMonthlyTotals(props.investmentDetails, "investedAmount", "investmentDate");

        const chartData = months.map((m, i) => ({
            x: i,
            y1: revenue[i],    // Revenue
            y2: expenses[i],   // Expense
            month: m,
            revenue: revenue[i],
            expenses: expenses[i],
            net: revenue[i] - expenses[i],
        }));

        setBarData(chartData);
    }, [props.invoiceDetails, props.investmentDetails]);

    const maxValue = Math.max(...barData.map((d) => Math.max(d.y1, d.y2)), 2000);

    return (
        <Card style={{ padding: wp("3%"), marginVertical: hp("2%") }}>

            {/* HEADER */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <View>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                        Investment vs Profit
                    </Text>
                    <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>
                        Monthly comparison for this year
                    </Text>
                </View>

                <Tooltip
                    isVisible={toolTipVisible}
                    content={<Text>This chart compares monthly revenue and expenses.</Text>}
                    placement={Placement.BOTTOM}
                    onClose={() => setToolTipVisible(false)}
                >
                    <Feather
                        name="info"
                        size={wp("5%")}
                        color={isDark ? "#fff" : "#000"}
                        onPress={() => setToolTipVisible(true)}
                    />
                </Tooltip>
            </View>

            {/* TOOLTIP BOX */}
            {tooltipData && (
                <View style={styles.tooltipBox}>
                    <Text style={styles.tooltipTitle}>{tooltipData.month} 2025</Text>

                    <View style={styles.tooltipRow}>
                        <Text style={styles.tooltipLabel}>Revenue</Text>
                        <Text style={[styles.tooltipValue, { color: "#22C55E" }]}>
                            ₹{tooltipData.revenue.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.tooltipRow}>
                        <Text style={styles.tooltipLabel}>Expenses</Text>
                        <Text style={[styles.tooltipValue, { color: "#EF4444" }]}>
                            ₹{tooltipData.expenses.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.tooltipRow}>
                        <Text style={[styles.tooltipLabel, { color: "#2563EB" }]}>Net</Text>
                        <Text style={[styles.tooltipValue, { color: "#2563EB" }]}>
                            ₹{tooltipData.net.toLocaleString()}
                        </Text>
                    </View>
                </View>
            )}

            {/* CHART */}
            {props.isLoading ? (
                <Skeleton height={hp("32%")} width={wp("90%")} />
            ) : barData.length > 0 ? (

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ width: wp("140%"), height: hp("32%") }}>
                        <BarChart
                            style={{ flex: 1 }}
                            data={{
                                dataSets: [
                                    {
                                        values: barData.map((v) => ({ x: v.x, y: v.y1 })),
                                        label: "Revenue",
                                        config: {
                                            color: processColor("#22C55E"),
                                            drawValues: false,
                                        },
                                    },
                                    {
                                        values: barData.map((v) => ({ x: v.x, y: v.y2 })),
                                        label: "Expenses",
                                        config: {
                                            color: processColor("#EF4444"),
                                            drawValues: false,
                                        },
                                    },
                                ],
                                config: {
                                    barWidth: 0.25,
                                    group: {
                                        fromX: 0,
                                        groupSpace: 0.2,
                                        barSpace: 0.1,
                                    },
                                },
                            }}
                            xAxis={{
                                valueFormatter: months,
                                granularityEnabled: true,
                                granularity: 1,
                                textColor: processColor("#6B7280"),
                                position: "BOTTOM",
                                drawAxisLine: false,
                                drawGridLines: false,
                            }}
                            yAxis={{
                                left: {
                                    drawAxisLine: false,
                                    drawLabels: true,
                                    textColor: processColor("#6B7280"),
                                    gridColor: processColor("#E5E7EB"),
                                    drawGridLines: true,
                                },
                                right: { enabled: false },
                            }}
                            legend={{ enabled: false }}
                            chartDescription={{ text: "" }}
                            dragEnabled={true}
                            scaleEnabled={false}
                            doubleTapToZoomEnabled={false}
                            animation={{ durationX: 800 }}
                            highlightPerTapEnabled={true}
                            onSelect={(event) => {
                                const d = event.nativeEvent;
                                const monthIndex = d.x;
                                setTooltipData(barData[monthIndex]);
                            }}
                        />
                    </View>
                </ScrollView>

            ) : (
                <EmptyState title="No data available" noAction />
            )}

            <Divider style={{ marginVertical: hp("2%") }} />

            {/* FOOTER SUMMARY */}
            <View
                style={{
                    marginTop: hp("2%"),
                    paddingHorizontal: wp("2%"),
                }}
            >
                {/* Header Row */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: hp("0.7%"),
                    }}
                >
                    <Text
                        style={[
                            globalStyles.heading3Text,
                            globalStyles.themeTextColor,
                        ]}
                    >
                        Revenue
                    </Text>

                    <Text
                        style={[
                            globalStyles.heading3Text,
                            globalStyles.themeTextColor,
                        ]}
                    >
                        Expenses
                    </Text>
                </View>

                {/* Value Row */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {/* Revenue Value */}
                    <Text
                        style={[
                            globalStyles.heading3Text,
                            { color: "#22C55E", fontWeight: "700" },
                        ]}
                    >
                        ₹{props?.invoiceDetails
                            ?.reduce((t, i) => t + i.amountPaid, 0)
                            .toLocaleString()}
                    </Text>

                    {/* Expenses Value */}
                    <Text
                        style={[
                            globalStyles.heading3Text,
                            { color: "#EF4444", fontWeight: "700" },
                        ]}
                    >
                        ₹{props?.investmentDetails
                            ?.reduce((t, i) => t + i.investedAmount, 0)
                            .toLocaleString()}
                    </Text>
                </View>
            </View>



        </Card>
    );
}

const styles = StyleSheet.create({
    tooltipBox: {
        position: "absolute",
        top: 50,
        left: 10,
        width: wp("60%"),
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        zIndex: 999,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    tooltipTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    tooltipRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 3,
    },
    tooltipLabel: {
        fontSize: 13,
        color: "#6B7280",
    },
    tooltipValue: {
        fontSize: 13,
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
});
