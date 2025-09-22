import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import GradientCard from '../utils/gradient-gard';
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

    const iconsMapping: any = {
        home: {
            active: (
                <View>
                    <Feather name="home" size={hp("3%")} color="#8B5CF6" />
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
                <Feather name="home" size={hp("3.2%")} color="#888" />
            ),
        },
        customer: {
            active: (
                <View>
                    <MaterialCommunityIcons
                        name="account-multiple"
                        size={hp("3%")}
                        color="#8B5CF6"
                    />
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
                    name="account-multiple-outline"
                    size={hp("3.2%")}
                    color="#888"
                />
            ),
        },
        invoice: {
            active: (
                <View>
                    <Ionicons name="receipt" size={hp("3%")} color="#8B5CF6" />
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
                <Ionicons name="receipt-outline" size={hp("3.2%")} color="#888" />
            ),
        },
        orders: {
            active: (
                <View>
                    <MaterialCommunityIcons
                        name="clipboard-text"
                        size={hp("3%")}
                        color="#8B5CF6"
                    />
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
                    name="clipboard-text-outline"
                    size={hp("3.2%")}
                    color="#888"
                />
            ),
        },
        offering: {
            active: (
                <View>
                    <MaterialCommunityIcons
                        name="cube"
                        size={hp("3%")}
                        color="#8B5CF6"
                    />
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
                    name="cube-outline"
                    size={hp("3.2%")}
                    color="#888"
                />
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
