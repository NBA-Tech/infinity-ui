import GradientCard from '@/src/utils/gradient-card';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { useContext } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useUserStore } from '@/src/store/user/user-store';
import { scaleFont } from '@/src/styles/global';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const HomeHeader = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { userDetails } = useUserStore();

    const gradientColors = isDark
        ? ["#0A2E6F", "#0D4DA8", "#1372F0"] // smoother dark gradient
        : ["#0F6BE7", "#3E8BFF", "#7BB7FF"]; // softer bright gradient


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
                                { fontSize: scaleFont(34), fontWeight: "800" },
                            ]}
                        >
                            $ {userDetails?.userAuthInfo?.totalBalance || "0.00"}
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
                                <Feather name="trending-up" size={wp("6%")} color="#FFFFFF" />
                            </View>

                            <Text
                                style={[
                                    globalStyles.smallText,
                                    { color: "#FFFFFF", fontWeight: "600", fontSize: scaleFont(13) },
                                ]}
                            >
                                +5.00%
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
