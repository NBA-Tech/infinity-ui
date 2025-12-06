import React, { useState, useMemo, useContext } from "react";
import { View, Text, processColor, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
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
import { formatCurrency, getPastYears } from "@/src/utils/utils";
import { Dropdown } from "react-native-element-dropdown";
import { Divider } from "@/components/ui/divider";
import { scaleFont } from "@/src/styles/global";
interface Props {
    invoices: Invoice[];
    investments: InvestmentModel[];
    loading: boolean
    getInvestmentDetails: (changeKey?: string, startTime?: Date, endTime?: Date) => void
    getInvoiceDetails: (changeKey?: string, startTime?: Date, endTime?: Date) => void
}

export default function RevenueTrendLineChart({ invoices = [], investments = [], loading, getInvestmentDetails, getInvoiceDetails }: Props) {
    const currentYear = new Date().getFullYear();
    const globalStyles = React.useContext(StyleContext);
    const [markerData, setMarkerData] = useState<any | null>(null);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
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

    const handleYearChange = (year: string) => {
        const y = parseInt(year);

        const start = new Date(y, 0, 1, 0, 0, 0);        // Jan 1, 00:00:00
        const end = new Date(y, 11, 31, 23, 59, 59);     // Dec 31, 23:59:59

        setSelectedYear(year);

        getInvestmentDetails("revenueTrendLineChart", start, end);
        getInvoiceDetails("revenueTrendLineChart", start, end);
    };



    return (
        <TouchableWithoutFeedback onPress={() => setMarkerData(null)}>

            <Card style={{ padding: wp("4%"), marginVertical: hp("2%") }}>
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center" style={{ gap: wp("2%") }}>
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                            Cash Flow
                        </Text>
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

                {/* Tooltip */}
                {markerData && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipTitle}>{markerData.month} {markerData.year}</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Opening Bal.</Text>
                            <Text style={styles.value}>{formatCurrency(markerData.opening)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.label, { color: "#16A34A" }]}>Income</Text>

                            <Text style={[styles.value, { color: "#16A34A" }]}>{formatCurrency(markerData.income)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.label, { color: "#DC2626" }]}>Outgoing</Text>
                            <Text style={[styles.value, { color: "#DC2626" }]}>{formatCurrency(markerData.outgoing)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.label, { color: "#2563EB" }]}>Ending Bal.</Text>
                            <Text style={[styles.value, { color: "#2563EB" }]}>{formatCurrency(markerData.ending)}</Text>
                        </View>
                    </View>
                )}
                {loading ? (
                    <Skeleton width={wp("92%")} height={hp("36%")} />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                        <View style={{ width: wp("95%"), height: hp("35%") }}>
                            <LineChart
                                style={{ flex: 1 }}
                                data={{
                                    dataSets: [
                                        {
                                            values: dataPoints,
                                            label: "Ending Balance",
                                            config: {
                                                fitScreen: true,
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
                                    granularity: 1,
                                    textColor: processColor("#6B7280"),
                                    fontFamily: "OpenSans-Regular",
                                    position: "BOTTOM",
                                    drawAxisLine: false,
                                    drawGridLines: false,
                                    granularityEnabled: false,
                                    axisMinimum: -0.5,
                                    axisMaximum: monthsInfo.length - 0.5,
                                    labelCount: monthsInfo.length,
                                    spaceBetweenLabels: 0,

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
                                        valueFormatter: dataPoints.some((d) => parseInt(d.y) > 0) && "largeValue"

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

                    {selectedYear == currentYear.toString() && (
                        <View style={styles.footerRow}>
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                                Cash as on {today.toLocaleDateString()}
                            </Text>
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                                {loading ? "Loading..." : formatCurrency(cashAsOnToday)}
                            </Text>
                        </View>
                    )

                    }


                    <View style={styles.footerRow}>
                        <Text style={[globalStyles.heading3Text, { color: "#16A34A" }]}>
                            + Incoming
                        </Text>
                        <Text style={[globalStyles.heading3Text, { color: "#16A34A" }]}>
                            {loading ? "Loading..." : formatCurrency(totalIncome)}
                        </Text>
                    </View>

                    <View style={styles.footerRow}>
                        <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                            - Outgoing
                        </Text>
                        <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                            {loading ? "Loading..." : formatCurrency(totalOutgoing)}
                        </Text>
                    </View>

                </View>

            </Card>
        </TouchableWithoutFeedback>
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
