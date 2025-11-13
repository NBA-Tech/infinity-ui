import React, { useState } from "react";
import { View, Text, processColor, ScrollView, StyleSheet } from "react-native";
import { LineChart } from "react-native-charts-wrapper";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StyleContext } from "@/src/providers/theme/global-style-provider";

export default function RevenueTrendLineChart() {
    const globalStyles = React.useContext(StyleContext);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const income = [0, 0, 5000, 20000, 45000, 65000, 90000, 120000, 150000, 170000, 200000, 230000];
    const outgoing = [0, 0, 0, 1000, 2000, 3000, 3000, 2000, 1000, 1000, 2000, 3000];

    // For custom tooltip
    const [markerData, setMarkerData] = useState(null);

    const dataPoints = months.map((m, i) => {
        const opening = i === 0 ? 0 : income[i - 1] - outgoing[i - 1];
        const ending = income[i] - outgoing[i];

        return {
            x: i,
            y: ending,
            raw: { month: m, opening, income: income[i], outgoing: outgoing[i], ending }
        };
    });

    return (
        <Card style={{ padding: wp("4%"), marginVertical: hp("2%") }}>

            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                Cash Flow
            </Text>

            {/* CUSTOM MARKER */}
            {markerData && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{markerData.month} 2025</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Opening Bal.</Text>
                        <Text style={styles.value}>₹{markerData.opening.toLocaleString()}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#16A34A" }]}>Income</Text>
                        <Text style={[styles.value, { color: "#16A34A" }]}>
                            ₹{markerData.income.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#DC2626" }]}>Outgoing</Text>
                        <Text style={[styles.value, { color: "#DC2626" }]}>
                            ₹{markerData.outgoing.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: "#2563EB" }]}>Ending Bal.</Text>
                        <Text style={[styles.value, { color: "#2563EB" }]}>
                            ₹{markerData.ending.toLocaleString()}
                        </Text>
                    </View>
                </View>
            )}

            {/* HORIZONTAL SCROLL */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                <View style={{ width: wp("120%"), height: hp("32%") }}>
                    {/* WIDE CHART → scroll works */}
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
                                            colors: [processColor("rgba(37, 99, 235, 0.35)"), processColor("rgba(255,255,255,0)")],
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
                            valueFormatter: months,
                            granularityEnabled: true,
                            granularity: 1,
                            textColor: processColor("#6B7280"),
                            position: "BOTTOM",
                            drawAxisLine: false,
                            drawGridLines: false,
                            axisMinimum: 0,
                            axisMaximum: months.length - 1,
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

                        dragEnabled={true}
                        scaleEnabled={false}
                        pinchZoom={false}
                        doubleTapToZoomEnabled={false}

                        // capture highlight event for custom tooltip
                        onSelect={(event: any) => {
                            const d = event.nativeEvent;
                            if (d && d.data) {
                                setMarkerData(d.data.raw);
                            }
                        }}

                        marker={{ enabled: false }} // disable built-in marker

                        animation={{ durationX: 1000 }}
                        chartDescription={{ text: "" }}
                        legend={{ enabled: false }}
                    />
                </View>

            </ScrollView>

            {/* FOOTER SUMMARY */}
            <View style={{ marginTop: hp("2%") }}>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                        Cash as on 01/04/2025
                    </Text>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
                        ₹0.00
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, { color: "#16A34A" }]}>
                        + Incoming
                    </Text>
                    <Text style={[globalStyles.heading3Text, { color: "#16A34A" }]}>
                        ₹2,99,409.36
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                        - Outgoing
                    </Text>
                    <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                        ₹7,000.00
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[globalStyles.heading3Text, { color: "#2563EB" }]}>
                        = Cash as on 31/03/2026
                    </Text>
                    <Text style={[globalStyles.heading3Text, { color: "#2563EB" }]}>
                        ₹2,92,409.36
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
        fontWeight: "700",
        marginBottom: 8,
        color: "#111827",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 2,
    },
    label: {
        fontSize: 13,
        color: "#6B7280",
    },
    value: {
        fontSize: 13,
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    }
});
