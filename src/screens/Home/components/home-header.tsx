import GradientCard from '@/src/utils/gradient-card';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { useContext, useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useUserStore } from '@/src/store/user/user-store';
import { scaleFont } from '@/src/styles/global';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { priceFloatFormat } from '@/src/utils/utils';

interface HomeHeaderProps {
    invoiceDetails: Invoice[]
    loading: boolean
}

const HomeHeader = (props: HomeHeaderProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { userDetails } = useUserStore();
    const [trend, setTrend] = useState(0);
    const [balance, setBalance] = useState(0);

    const gradientColors = isDark
        ? ["#0A2E6F", "#0D4DA8", "#1372F0"] // smoother dark gradient
        : ["#0F6BE7", "#3E8BFF", "#7BB7FF"]; // softer bright gradient



    const calculateMonthTrend = (invoiceDetails: Invoice[] = []): number => {
        if (!invoiceDetails.length) return 0;

        // Group amounts by month
        const monthlyTotals: Record<string, number> = {};

        invoiceDetails.forEach((inv) => {
            const date = new Date(inv.invoiceDate);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            monthlyTotals[key] = (monthlyTotals[key] || 0) + (inv.amountPaid || 0);
        });

        // Convert grouped data to sorted array
        const months = Object.keys(monthlyTotals).sort();

        if (months.length < 2) return 0; // Not enough data

        const lastMonth = months[months.length - 1];
        const previousMonth = months[months.length - 2];

        const lastValue = monthlyTotals[lastMonth];
        const prevValue = monthlyTotals[previousMonth];

        if (prevValue === 0) return 100; // Avoid divide-by-zero case

        // % Change Formula
        const trend = ((lastValue - prevValue) / prevValue) * 100;

        return Number(trend.toFixed(2));
    };


    useEffect(() => {
        setBalance(
            props?.invoiceDetails?.reduce((acc, curr) => {
                return acc + curr.amountPaid
            }, 0)
        )
        const trend = calculateMonthTrend(props?.invoiceDetails)
    }, [props?.invoiceDetails])


    return (
        <GradientCard colors={gradientColors}>
            <View style={{ padding: wp("4%"), paddingVertical: hp("3%"), gap: hp("2%") }}>

                {/* Welcome Text */}
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={[
                            globalStyles.heading2Text,
                            globalStyles.whiteTextColor,
                            { textAlign: "center", fontWeight: "700" },
                        ]}
                    >
                        Welcome {userDetails?.userAuthInfo?.username || "User"}!
                    </Text>
                </View>

                {/* Balance Row */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: hp("0.5%") }}>

                    {/* Left — Total Balance */}
                    <View style={{ flexDirection: "column", gap: hp("1%") }}>
                        <Text
                            style={[
                                globalStyles.subHeadingText,
                                { color: "rgba(255,255,255,0.7)", fontSize: scaleFont(16) },
                            ]}
                        >
                            Total Balance
                        </Text>

                        <Text
                            style={[
                                globalStyles.headingText,
                                globalStyles.whiteTextColor,
                            ]}
                        >
                            {props?.loading ? (
                                "Loading..."
                            ) : (
                                <>
                                    {userDetails?.currencyIcon} {priceFloatFormat(balance) || "0.00"}
                                </>
                            )}
                        </Text>

                    </View>

                    {/* Right — Trend Icon with stats */}
                    <View style={{ flexDirection: "column", alignItems: "flex-end", gap: hp("0.8%") }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: wp("2%"),
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.12)",
                                    padding: wp("2%"),
                                    borderRadius: wp("2%"),
                                }}
                            >
                                <Feather name={trend >= 0 ? "trending-up" : "trending-down"} size={wp("6%")} color="#FFFFFF" />
                            </View>

                            <Text
                                style={[
                                    globalStyles.smallText,
                                    { color: "#FFFFFF", fontWeight: "600", fontSize: scaleFont(13) },
                                ]}
                            >
                                {props?.loading ? (
                                    "Loading..."
                                ) : (
                                    trend > 0 ? `+${trend}%` : trend < 0 ? `-${trend}%` : "0%"
                                )}
                            </Text>
                        </View>

                        <Text
                            style={[
                                globalStyles.smallText,
                                { color: "rgba(255,255,255,0.7)" },
                            ]}
                        >
                            Since last month
                        </Text>
                    </View>
                </View>
            </View>
        </GradientCard>
    );
};

export default HomeHeader;
