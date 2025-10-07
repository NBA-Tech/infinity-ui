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
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import { NotificationIcon } from '../assets/Icons/SvgIcons';
import Logo from '../assets/images/logo.png'
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
const styles = StyleSheet.create({
    headerContainer: {
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
    const globalStyles = useContext(StyleContext);

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
        <View style={[styles.headerContainer, { backgroundColor: isDark ? "#12121A" : "#fff" }]}>
            <View style={styles.headerBody}>
                <View >
                    <View style={styles.appLogoContainer}>
                        <Image style={{ width: wp('15%'), height: hp('7%') }} source={Logo} />
                        <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor]}>INFINITY</Text>
                    </View>
                </View>

                <View style={[styles.appLogoContainer, styles.actionContainer]}>

                    <TouchableOpacity onPress={() => { toggleTheme() }}>
                        <MaterialIcons
                            name={isDark ? "light-mode" : "dark-mode"}
                            size={wp('8%')}
                            style={{ color: isDark ? '#FFD700' : '#000000' }}
                        />
                    </TouchableOpacity>

                    <Menu
                        placement="bottom left"
                        offset={-15}
                        trigger={({ ...triggerProps }) => (
                           <Button {...triggerProps} variant="ghost" style={{ backgroundColor: 'transparent' }}>
                                <Avatar size="md">
                                    <AvatarImage
                                        source={{
                                            uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                                        }}
                                    />
                                    <AvatarBadge />
                                </Avatar>
                            </Button>
                        )}
                    >
                        <MenuItem key="view">
                            <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>
                                View
                            </MenuItemLabel>
                        </MenuItem>

                        <MenuItem key="edit">
                            <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>
                                Edit
                            </MenuItemLabel>
                        </MenuItem>

                        <MenuItem key="delete">
                            <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>
                                Delete
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>


                </View>
            </View>
        </View>
    );
};

export default Header;