import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet,Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import GradientCard from '../utils/gradient-card';
import { Divider } from '@/components/ui/divider';
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from 'react-native-vector-icons/Feather';
interface FooterProps {
    state: any;
    descriptors: any;
    navigation: any;
}


const Footer = (props: FooterProps) => {
    const insets = useSafeAreaInsets();
    const { isDark } = useContext(ThemeToggleContext);
    const globalStyle = useContext(StyleContext);

    if (!props?.state || !props?.state.routes) return null;

    /** ACTIVE COLORS FOR BOTH THEMES **/
    const activeIconColorStart = isDark ? "#3B82F6" : "#2563EB";
    const activeIconColorEnd   = isDark ? "#0EA5E9" : "#1372F0";

    /** INACTIVE COLORS **/
    const inactiveIconColor = isDark ? "#CBD5E1" : "#000";
    const inactiveTextColor = isDark ? "#94A3B8" : "#000";

    /** ACTIVE TEXT COLOR **/
    const activeTextColor = isDark ? "#38BDF8" : activeIconColorStart;

    const iconsMapping: any = {
        home: {
            active: (
                <View style={{ alignItems: 'center' }}>
                    <Feather name="home" size={hp("3%")} color={activeIconColorStart} />
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: activeIconColorEnd,
                            height: 2,
                            width: wp("7%"),
                            alignSelf: "center",
                        }}
                    />
                </View>
            ),
            inactive: (
                <Feather name="home" size={hp("3.2%")} color={inactiveIconColor} />
            ),
        },

        customer: {
            active: (
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons
                        name="account-multiple"
                        size={hp("3%")}
                        color={activeIconColorStart}
                    />
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: activeIconColorEnd,
                            height: 2,
                            width: wp("7%"),
                        }}
                    />
                </View>
            ),
            inactive: (
                <MaterialCommunityIcons
                    name="account-multiple-outline"
                    size={hp("3.2%")}
                    color={inactiveIconColor}
                />
            ),
        },

        invoice: {
            active: (
                <View style={{ alignItems: 'center' }}>
                    <Ionicons name="receipt" size={hp("3%")} color={activeIconColorStart} />
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: activeIconColorEnd,
                            height: 2,
                            width: wp("7%"),
                        }}
                    />
                </View>
            ),
            inactive: (
                <Ionicons name="receipt-outline" size={hp("3.2%")} color={inactiveIconColor} />
            ),
        },

        orders: {
            active: (
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons
                        name="clipboard-text"
                        size={hp("3%")}
                        color={activeIconColorStart}
                    />
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: activeIconColorEnd,
                            height: 2,
                            width: wp("7%"),
                        }}
                    />
                </View>
            ),
            inactive: (
                <MaterialCommunityIcons
                    name="clipboard-text-outline"
                    size={hp("3.2%")}
                    color={inactiveIconColor}
                />
            ),
        },

        profile: {
            active: (
                <View style={{ alignItems: 'center' }}>
                    <Feather name="user" size={hp("3%")} color={activeIconColorStart} />
                    <Divider
                        style={{
                            marginTop: hp("0.2%"),
                            backgroundColor: activeIconColorEnd,
                            height: 3,
                            width: wp("8%"),
                        }}
                    />
                </View>
            ),
            inactive: (
                <Feather name="user" size={hp("3%")} color={inactiveIconColor} />
            ),
        },

        quotations: {
            active: (
                <View style={{ alignItems: 'center' }}>
                    <Feather name="file-text" size={hp("3%")} color={activeIconColorStart} />
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: activeIconColorEnd,
                            height: 2,
                            width: wp("7%"),
                        }}
                    />
                </View>
            ),
            inactive: (
                <Feather name="file-text" size={hp("3.2%")} color={inactiveIconColor} />
            ),
        },
    };


    return (
        <View
            style={[
                styles.footerContainer,
                {
                    backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                    borderTopColor: isDark ? "#1E293B" : "#E2E8F0",
                    paddingBottom: insets.bottom,
                    shadowColor: isDark ? "#000" : "#182D53",
                },
            ]}
        >
            {props?.state.routes.map((route: any, index: number) => {
                const isFocused = props?.state.index === index;
                const routeName = route.name.toLowerCase();

                const onPress = () => {
                    const event = props?.navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        props?.navigation.navigate(route.name);
                    }
                };

                const iconSet = iconsMapping[routeName];

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.footerElements}
                    >
                        <View style={{ alignItems: "center" }}>
                            {isFocused ? iconSet.active : iconSet.inactive}

                            {/* Updated Text colors */}
                            <Text
                                style={[
                                    globalStyle.smallText,
                                    {
                                        color: isFocused ? activeTextColor : inactiveTextColor,
                                        marginTop: hp("0.3%"),
                                        fontFamily: "OpenSans-Bold",
                                    },
                                ]}
                            >
                                {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};


const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        elevation: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    footerElements: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('1%'),
    },

    footerText: {
        fontSize: wp('2.8%'),
        color: '#979797',
    },
    activeText: {
        color: '#2a2a2a',
    },
    activeIconWrapper: {
        padding: hp('0.5%'),
    },
});

export default Footer;
