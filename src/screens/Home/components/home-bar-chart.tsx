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
import { formatCurrency, getPastYears } from "@/src/utils/utils";
import { Dropdown } from "react-native-element-dropdown";
import { scaleFont } from "@/src/styles/global";

type RevenueTrendChartProps = {
    loading: boolean;
    invoiceDetails: any[];
    investmentDetails: any[];
    getInvestmentDetails: (changeKey?: string, startTime?: Date, endTime?: Date) => void
    getInvoiceDetails: (changeKey?: string, startTime?: Date, endTime?: Date) => void
};

export default function RevenueTrendChart(props: RevenueTrendChartProps) {
    const currentYear = new Date().getFullYear();
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { userDetails } = useUserStore();
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
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
        if (props.loading) return;

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


    const handleYearChange = (year: string) => {
        const y = parseInt(year);

        const start = new Date(y, 0, 1, 0, 0, 0);        // Jan 1, 00:00:00
        const end = new Date(y, 11, 31, 23, 59, 59);     // Dec 31, 23:59:59

        setSelectedYear(year);

        props?.getInvestmentDetails("revenueBarChart", start, end);
        props?.getInvoiceDetails("revenueBarChart", start, end);
    };

    return (
        <Card style={{ padding: wp("3%"), marginVertical: hp("2%") }}>

            {/* HEADER */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <View className="flex flex-row gap-2 items-center">
                    <View>
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                            Expenses vs Profit
                        </Text>
                    </View>
                    <Tooltip
                        isVisible={toolTipVisible}
                        content={<Text style={globalStyles.normalText}>This chart compares monthly revenue and expenses.</Text>}
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
                <View>
                    <Dropdown
                        style={{
                            width: wp("26%"),
                            height: hp("4.8%"),
                            borderRadius: 10,
                            paddingHorizontal: wp("2.5%"),
                            borderWidth: 1.5,
                            borderColor: isDark ? "#475569" : "#CBD5E1",
                            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                            justifyContent: "center",
                        }}
                        data={getPastYears(6)}
                        labelField="label"
                        valueField="value"
                        value={selectedYear}   // <-- ensure this is NOT empty
                        placeholder={selectedYear.toString()} // only visible when value = empty
                        placeholderStyle={{     // << FIXED STYLE
                            color: isDark ? "#F8FAFC" : "#0F172A",
                            fontSize: scaleFont(15),
                            fontFamily: "OpenSans-Bold",
                        }}
                        selectedTextStyle={{    // << SELECTED STYLE MATCHES
                            color: isDark ? "#F8FAFC" : "#0F172A",
                            fontSize: 15,
                            fontFamily: "OpenSans-Bold",
                        }}
                        itemTextStyle={{
                            color: isDark ? "#F8FAFC" : "#1E293B",
                            fontSize: 15,
                            fontFamily: "OpenSans-Bold",
                        }}
                        containerStyle={{
                            borderRadius: 10,
                            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                            borderWidth: 1.5,
                            borderColor: isDark ? "#475569" : "#CBD5E1",
                        }}
                        onChange={(item) => handleYearChange(item.value)}
                    />


                </View>


            </View>
            <Divider style={{ marginVertical: hp('1.5%') }} />

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
            {props?.loading ? (
                <Skeleton height={hp("32%")} width={wp("93%")} />
            ) : barData.length > 0 ? (

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ width: wp("95%"), height: hp("32%") }}>
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
                                fontFamily: "OpenSans-Regular",
                                drawAxisLine: false,
                                drawGridLines: false,
                            }}
                            yAxis={{
                                fontFamily: "OpenSans-Regular",
                                left: {
                                    drawAxisLine: false,
                                    drawLabels: true,
                                    textColor: processColor("#6B7280"),
                                    gridColor: processColor("#E5E7EB"),
                                    drawGridLines: true,
                                    valueFormatter: barData.some((d) => parseInt(d.net) > 0 || parseInt(d.revenue) > 0) && "largeValue"
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
                            { color: "#22C55E" },
                        ]}
                    >
                        {props?.loading ? (
                            "..."
                        ) : (
                            <>
                                {formatCurrency(props?.invoiceDetails
                                    ?.reduce((t, i) => t + i.amountPaid, 0))

                                }
                            </>
                        )
                        }

                    </Text>

                    {/* Expenses Value */}
                    <Text
                        style={[
                            globalStyles.heading3Text,
                            { color: "#EF4444" },
                        ]}
                    >
                        {props?.loading ? (
                            "..."
                        ) : (
                            <>
                                {formatCurrency(props?.investmentDetails
                                    ?.reduce((t, i) => t + i.investedAmount, 0))
                                }
                            </>
                        )
                        }

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
        fontFamily: "OpenSans-Bold",
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
        fontFamily: "OpenSans-Regular",
        color: "#6B7280",
    },
    tooltipValue: {
        fontSize: 13,
        fontFamily: "OpenSans-Bold",
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
});
