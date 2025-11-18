import React, { useState, useMemo, useContext } from "react";
import { View, Text, processColor, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-charts-wrapper";
import { Card } from "@/components/ui/card";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { StyleContext, ThemeToggleContext } from "@/src/providers/theme/global-style-provider";
import { Invoice } from "@/src/types/invoice/invoice-type";
import { InvestmentModel } from "@/src/types/investment/investment-type";
import Tooltip, { Placement } from "react-native-tooltip-2";
import Feather from "react-native-vector-icons/Feather";
import Skeleton from "@/components/ui/skeleton";
import { useUserStore } from "@/src/store/user/user-store";
interface Props {
    invoices: Invoice[];
    investments: InvestmentModel[];
    loading: boolean
}

export default function RevenueTrendLineChart({ invoices = [], investments = [], loading }: Props) {
    const globalStyles = React.useContext(StyleContext);
    const [markerData, setMarkerData] = useState<any | null>(null);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const { isDark } = useContext(ThemeToggleContext);
    const { userDetails } = useUserStore()

    // today (will reflect user's device timezone; system date here is 2025-11-13)
    const today = useMemo(() => new Date(), []);

    const monthsInfo = useMemo(() => {
        const year = today.getFullYear();

        const list: {
            label: string;
            year: number;
            monthIndex: number;
            start: Date;
            end: Date;
        }[] = [];

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const label = new Date(year, monthIndex).toLocaleString(undefined, {
                month: "short",
            });

            const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
            const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

            list.push({ label, year, monthIndex, start, end });
        }

        return list;
    }, [today]);

    // Monthly totals (real numbers) for the monthsInfo range
    const { incomeByMonth, outgoingByMonth, openingBeforeRange } = useMemo(() => {
        const income = Array(monthsInfo.length).fill(0);
        const outgoing = Array(monthsInfo.length).fill(0);

        // compute opening balance BEFORE the first month in the range
        const firstMonthStart = monthsInfo[0].start;
        let openingBefore = 0;

        // invoices -> income
        invoices.forEach((inv: any) => {
            if (!inv?.invoiceDate) return;
            const d = new Date(inv.invoiceDate);
            const amt = Number(inv.amountPaid || 0);
            if (d < firstMonthStart) {
                openingBefore += amt;
            } else {
                // find month index in monthsInfo
                for (let idx = 0; idx < monthsInfo.length; idx++) {
                    if (d >= monthsInfo[idx].start && d <= monthsInfo[idx].end) {
                        income[idx] += amt;
                        break;
                    }
                }
            }
        });

        // investments -> outgoing
        investments.forEach((inv: any) => {
            if (!inv?.investmentDate) return;
            const d = new Date(inv.investmentDate);
            const amt = Number(inv.investedAmount || 0);
            if (d < firstMonthStart) {
                openingBefore -= amt;
            } else {
                for (let idx = 0; idx < monthsInfo.length; idx++) {
                    if (d >= monthsInfo[idx].start && d <= monthsInfo[idx].end) {
                        outgoing[idx] += amt;
                        break;
                    }
                }
            }
        });

        return { incomeByMonth: income, outgoingByMonth: outgoing, openingBeforeRange: openingBefore };
    }, [invoices, investments, monthsInfo]);

    // Build data points: compute opening and ending for each month (real values).
    // For chart plotting we clamp Y >= 0 to avoid negative Y axis values (prevents graph going below 0).
    const dataPoints = useMemo(() => {
        const pts: any[] = [];
        let lastEnding = openingBeforeRange;
        for (let i = 0; i < monthsInfo.length; i++) {
            const opening = lastEnding;
            const inc = incomeByMonth[i];
            const out = outgoingByMonth[i];
            const ending = opening + inc - out;
            lastEnding = ending;
            // Chart value: clamp to 0 so y axis stays non-negative (chart won't display negative below 0)
            const plotValue = Math.max(0, ending);
            pts.push({ x: i, y: plotValue, raw: { month: monthsInfo[i].label, year: monthsInfo[i].year, opening, income: inc, outgoing: out, ending } });
        }
        return pts;
    }, [incomeByMonth, outgoingByMonth, openingBeforeRange, monthsInfo]);

    // footer totals
    const totalIncome = useMemo(() => incomeByMonth.reduce((a, b) => a + b, 0), [incomeByMonth]);
    const totalOutgoing = useMemo(() => outgoingByMonth.reduce((a, b) => a + b, 0), [outgoingByMonth]);
    const closingBalance = useMemo(() => {
        const last = dataPoints[dataPoints.length - 1];
        return last?.raw?.ending ?? openingBeforeRange;
    }, [dataPoints, openingBeforeRange]);

    const cashAsOnToday = useMemo(() => {
        let running = openingBeforeRange;
        for (let i = 0; i < monthsInfo.length; i++) {
            const m = monthsInfo[i];
            if (m.end <= today) {
                running = running + incomeByMonth[i] - outgoingByMonth[i];
            } else if (m.start <= today && today <= m.end) {
                const monthIncomePartial = invoices.reduce((acc: number, inv: any) => {
                    if (!inv?.invoiceDate) return acc;
                    const d = new Date(inv.invoiceDate);
                    if (d >= m.start && d <= today) return acc + (Number(inv.amountPaid || 0));
                    return acc;
                }, 0);
                const monthOutgoingPartial = investments.reduce((acc: number, inv: any) => {
                    if (!inv?.investmentDate) return acc;
                    const d = new Date(inv.investmentDate);
                    if (d >= m.start && d <= today) return acc + (Number(inv.investedAmount || 0));
                    return acc;
                }, 0);
                running = running + monthIncomePartial - monthOutgoingPartial;
                break;
            } else {
                break;
            }
        }
        return running;
    }, [openingBeforeRange, monthsInfo, incomeByMonth, outgoingByMonth, invoices, investments, today]);


    const formatCurrency = (value: number) => {
        if (loading) return "...";
        return `${userDetails?.currencyIcon} ${Number(value).toLocaleString()}`;
    };



    return (
        <Card style={{ padding: wp("4%"), marginVertical: hp("2%") }}>
            <View className="flex flex-row justify-between items-center">
                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Cash Flow ({today.getFullYear()})</Text>
                <View>
                    <Tooltip
                        isVisible={toolTipVisible}
                        content={<Text style={globalStyles.normalText}>This Widget will show you the cash flow in this particular year.</Text>}
                        placement={Placement.BOTTOM}
                        onClose={() => setToolTipVisible(false)}>
                        <TouchableOpacity onPress={() => setToolTipVisible(true)}>
                            <Feather name="info" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                        </TouchableOpacity>

                    </Tooltip>

                </View>
            </View>

            {/* Tooltip */}
            {markerData && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{markerData.month} {markerData.year}</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Opening Bal.</Text>
                        <Text style={styles.value}>₹{Number(markerData.opening).toLocaleString()}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#16A34A" }]}>Income</Text>
                        <Text style={[styles.value, { color: "#16A34A" }]}>₹{Number(markerData.income).toLocaleString()}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#DC2626" }]}>Outgoing</Text>
                        <Text style={[styles.value, { color: "#DC2626" }]}>₹{Number(markerData.outgoing).toLocaleString()}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#2563EB" }]}>Ending Bal.</Text>
                        <Text style={[styles.value, { color: "#2563EB" }]}>₹{Number(markerData.ending).toLocaleString()}</Text>
                    </View>
                </View>
            )}
            {loading ? (
                <Skeleton width={wp("92%")} height={hp("36%")} />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ width: wp("120%"), height: hp("35%") }}>
                        <LineChart
                            style={{ flex: 1 }}
                            data={{
                                dataSets: [
                                    {
                                        values: dataPoints,
                                        label: "Ending Balance",
                                        config: {
                                            mode: "CUBIC_BEZIER",
                                            drawCircles: true,
                                            circleRadius: 5,
                                            circleColor: processColor("#2563EB"),
                                            drawValues: false,
                                            lineWidth: 3,
                                            color: processColor("#2563EB"),
                                            drawFilled: true,
                                            fillGradient: {
                                                colors: [
                                                    processColor("rgba(37, 99, 235, 0.35)"),
                                                    processColor("rgba(255,255,255,0)"),
                                                ],
                                                positions: [0, 1],
                                                angle: 90,
                                                orientation: "TOP_BOTTOM",
                                            },
                                            fillAlpha: 180,
                                        },
                                    },
                                ],
                            }}
                            xAxis={{
                                valueFormatter: monthsInfo.map((m) => m.label),
                                granularityEnabled: true,
                                granularity: 1,
                                textColor: processColor("#6B7280"),
                                fontFamily: "OpenSans-Regular",
                                position: "BOTTOM",
                                drawAxisLine: false,
                                drawGridLines: false,
                                axisMinimum: 0,
                                axisMaximum: monthsInfo.length - 1,
                            }}
                            yAxis={{
                                left: {
                                    drawAxisLine: false,
                                    drawLabels: true,
                                    textColor: processColor("#6B7280"),
                                    gridColor: processColor("#E5E7EB"),
                                    drawGridLines: true,
                                    fontFamily: "OpenSans-Regular",
                                    // Force chart to start at 0 (avoids negative area)
                                    axisMinimum: 0,
                                },
                                right: { enabled: false },
                            }}
                            dragEnabled
                            scaleEnabled={false}
                            pinchZoom={false}
                            doubleTapToZoomEnabled={false}
                            onSelect={(e: any) => {
                                const d = e?.nativeEvent;
                                // the chart returns the clicked entry with .data or .raw depending on lib version; handle both.
                                const raw = d?.data?.raw ?? d?.entry?.data?.raw ?? d?.entry?.raw ?? d?.data;
                                if (raw) setMarkerData(raw);
                            }}
                            marker={{ enabled: false }}
                            animation={{ durationX: 600 }}
                            chartDescription={{ text: "" }}
                            legend={{ enabled: false }}
                        />
                    </View>
                </ScrollView>

            )

            }



            {/* Footer summary */}
            <View style={{ marginTop: hp("4%") }}>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                        Cash as on {today.toLocaleDateString()}
                    </Text>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                        {formatCurrency(cashAsOnToday)}
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, { color: "#16A34A" }]}>
                        + Incoming
                    </Text>
                    <Text style={[globalStyles.heading3Text, { color: "#16A34A" }]}>
                        {formatCurrency(totalIncome)}
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                        - Outgoing
                    </Text>
                    <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                        {formatCurrency(totalOutgoing)}
                    </Text>
                </View>

            </View>

        </Card>
    );
}

const styles = StyleSheet.create({
    tooltip: {
        position: "absolute",
        top: 45,
        left: 10,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        width: wp("70%"),
        zIndex: 99,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    tooltipTitle: {
        fontSize: 14,
        marginBottom: 8,
        fontFamily: "OpenSans-Bold",
        color: "#111827",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 2,
    },
    label: {
        fontSize: 13,
        fontFamily: "OpenSans-Regular",
        color: "#6B7280",
    },
    value: {
        fontSize: 13,
        fontFamily: "OpenSans-Bold",
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
});
