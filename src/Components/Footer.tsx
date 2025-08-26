import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '../providers/theme/GlobalStyleProvider';
import GradientCard from '../utils/GradientCard';
import { Divider } from '@/components/ui/divider';
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

interface FooterProps {
    state: any;
    descriptors: any;
    navigation: any;
}


const Footer = (props: FooterProps) => {
    return null;
    const insets = useSafeAreaInsets();
    const { isDark } = useContext(ThemeToggleContext);
    const globalStyle = useContext(StyleContext);

    if (!props?.state || !props?.state.routes) return null;

    const iconsMapping: any = {
        home: {
            active: (
                <View>
                    <GradientCard style={styles.activeIconWrapper}>
                        <MaterialCommunityIcons
                            name="view-dashboard"
                            size={hp("3%")}
                            color="#fff"
                        />
                    </GradientCard>
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: "#8B5CF6",
                            height: 2,
                            width: wp("7%"),
                            alignSelf: "center",
                        }}
                    />
                </View>
            ),
            inactive: (
                <MaterialCommunityIcons
                    name="view-dashboard-outline"
                    size={hp("3.2%")}
                    color="#888"
                />
            ),
        },
        customer: {
            active: (
                <View>
                    <GradientCard style={styles.activeIconWrapper}>
                        <FontAwesome5 name="address-book" size={hp("3%")} color="#fff" />
                    </GradientCard>
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: "#8B5CF6",
                            height: 2,
                            width: wp("7%"),
                            alignSelf: "center",
                        }}
                    />
                </View>
            ),
            inactive: (
                <FontAwesome5 name="address-book" size={hp("3%")} color="#888" />
            ),
        },
        invoice: {
            active: (
                <View>
                    <GradientCard style={styles.activeIconWrapper}>
                        <Ionicons name="receipt" size={hp("3%")} color="#fff" />
                    </GradientCard>
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: "#8B5CF6",
                            height: 2,
                            width: wp("7%"),
                            alignSelf: "center",
                        }}
                    />
                </View>
            ),
            inactive: (
                <Ionicons name="receipt-outline" size={hp("3%")} color="#888" />
            ),
        },
        quotation: {
            active: (
                <View>
                    <GradientCard style={styles.activeIconWrapper}>
                        <MaterialCommunityIcons
                            name="file-document"
                            size={hp("3%")}
                            color="#fff"
                        />
                    </GradientCard>
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: "#8B5CF6",
                            height: 2,
                            width: wp("7%"),
                            alignSelf: "center",
                        }}
                    />
                </View>
            ),
            inactive: (
                <MaterialCommunityIcons
                    name="file-document-outline"
                    size={hp("3%")}
                    color="#888"
                />
            ),
        },
        profile: {
            active: (
                <View>
                    <GradientCard style={styles.activeIconWrapper}>
                        <FontAwesome5 name="user-circle" size={hp("3%")} color="#fff" />
                    </GradientCard>
                    <Divider
                        style={{
                            marginTop: hp("0.1%"),
                            backgroundColor: "#8B5CF6",
                            height: 2,
                            width: wp("7%"),
                            alignSelf: "center",
                        }}
                    />
                </View>
            ),
            inactive: (
                <FontAwesome5 name="user-circle" size={hp("3%")} color="#888" />
            ),
        },
    };

    return (
        <View
            style={[
                styles.footerContainer,
                {
                    backgroundColor: isDark ? '#121212' : '#ffffff',
                    borderTopColor: isDark ? '#333' : '#ccc',
                    shadowColor: isDark ? '#000' : '#000',
                    paddingBottom: insets.bottom,
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
                        <View style={isFocused ? styles.activeIconWrapper : null}>
                            {iconSet ? (isFocused ? iconSet.active : iconSet.inactive) : null}
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
        paddingVertical: hp('1%'),
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
