import React, { useState, useRef, useContext, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu"
import { Button } from "@/components/ui/button"
import { useNavigation } from '@react-navigation/native';
import { ThemeToggleContext, StyleContext } from '../providers/theme/GlobalStyleProvider';
import { NotificationIcon } from '../assets/Icons/SvgIcons';
import Logo from '../assets/images/logo.png'
const styles = StyleSheet.create({
    headerContainer:{
        backgroundColor: '#fff',
        borderBottomRightRadius: wp('5%'),
        borderBottomLeftRadius: wp('5%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerBody: {
        margin: wp('1%'),
        flexDirection: 'row',
        alignItems: 'center',
    },

    appLogoContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%'),
    },
    actionContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('3%'),
        flex: 1,
    },
    notificationContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
});

const Header = () => {
    const [notificationData, setNotificationData] = useState([]);
    const { isDark, toggleTheme } = useContext(ThemeToggleContext);
    const globalStyle = useContext(StyleContext);

    const ICONSMAPPING = {
        info: {
            name: "info",
            color: "#2196F3",
        },
        warning: {
            name: "warning",
            color: "#FFC107",
        },
        success: {
            name: "check-circle",
            color: "#4CAF50",
        },
        error: {
            name: "error",
            color: "#F44336",
        }
    };


    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerBody}>
                <View >
                    <View style={styles.appLogoContainer}>
                        <Image style={{ width: wp('20%'), height: hp('10%') }} source={Logo} />
                        <Text style={globalStyle.headingText}>INFINITY</Text>
                    </View>
                </View>

                <View style={[styles.appLogoContainer, styles.actionContainer]}>


                    <NotificationIcon width={wp('10%')} height={hp('10%')} />


                    <TouchableOpacity onPress={() => { toggleTheme() }}>
                        <MaterialIcons
                            name={isDark ? "light-mode" : "dark-mode"}
                            size={wp('7%')}
                            style={{ color: isDark ? '#FFD700' : '#000000' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Header;