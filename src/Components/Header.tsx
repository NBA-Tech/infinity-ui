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
import { CommonActions, useNavigation } from '@react-navigation/native';
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import Logo from '../assets/images/logo.png'
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '../store/user/user-store';
import { useDataStore } from '../providers/data-store/data-store-provider';
import { useToastMessage } from './toast/toast-message';
import { useAuth } from '../context/auth-context/auth-context';
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
    const { userDetails, getUserDetailsUsingID } = useUserStore();
    const { getItem } = useDataStore()
    const globalStyles = useContext(StyleContext);
    const showToast = useToastMessage()
    const navigation = useNavigation()
    const { logout } = useAuth()

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

    useEffect(() => {
        const userId = getItem("USERID")
        console.log("userId", userId)
        getUserDetailsUsingID(userId, showToast);

    }, [])


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
                        style={globalStyles.appBackground}
                        trigger={({ ...triggerProps }) => (
                            <Button {...triggerProps} variant="ghost" style={{ backgroundColor: 'transparent' }}>
                                <Avatar size="md">
                                    <AvatarImage
                                        source={{
                                            uri: userDetails?.userBusinessInfo?.companyLogoURL,
                                        }}
                                    />
                                    <AvatarBadge />
                                    {!userDetails?.userBusinessInfo?.companyLogoURL &&
                                        <AvatarFallbackText>{userDetails?.userAuthInfo?.username?.charAt(0).toUpperCase()}</AvatarFallbackText>
                                    }
                                </Avatar>
                            </Button>
                        )}
                    >
                        <MenuItem key="profile" onPress={() => navigation.navigate("Profile")}>
                            <Feather name="user" size={wp('5%')} style={{ paddingRight: wp('2%') }} color="#3B82F6" />
                            <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>
                                Profile
                            </MenuItemLabel>
                        </MenuItem>

                        <MenuItem key="logout" onPress={async () => {
                            await logout()
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'UnauthStack', params: { screen: 'Authentication' } }],
                                })
                            )
                        }}>
                            <Feather name="log-out" size={wp('5%')} style={{ paddingRight: wp('2%') }} color="#EF4444" />
                            <MenuItemLabel style={[globalStyles.labelText, globalStyles.themeTextColor]}>
                                Logout
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>


                </View>
            </View>
        </View>
    );
};

export default Header;