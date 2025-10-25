import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/src/components/header';
import Background from '../../assets/images/Background.png';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/src/context/auth-context/auth-context';
import { NavigationProp, SearchQueryRequest } from '@/src/types/common';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { useUserStore } from '@/src/store/user/user-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { getOrderDataListAPI } from '@/src/api/order/order-api-service';
import BackHeader from '@/src/components/back-header';
import { updateNotificationStatusAPI } from '@/src/services/user/user-service';
import { UserModel } from '@/src/types/user/user-type';
const styles = StyleSheet.create({
    amountContainer: {
        padding: wp('5%'),
        marginTop: hp('5%'),
        marginBottom: hp('2%')
    },
    logoContainer: {
        position: 'absolute',
        bottom: -hp('6%'),
        left: '50%',
        transform: [{ translateX: -wp('12.5%') }],

    },
    logo: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('12.5%'),
        borderWidth: 3,
        borderColor: '#fff',
    }
})
const Profile = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { logout } = useAuth()
    const { userDetails, getUserDetailsUsingID,setUserDetails } = useUserStore()
    const { getItem } = useDataStore()
    const navigation = useNavigation<NavigationProp>();
    const showToast = useToastMessage();
    const [totalPaid, setTotalPaid] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [loading, setLoading] = useState(true)

    const handleNotificationToggle = async (userId: string,value: boolean) => {
        console.log(userDetails)
        if(!userId){
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found please login again",
            })
        }
        const updateNotificationStatusResponse = await updateNotificationStatusAPI(userId,value)
        if (!updateNotificationStatusResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: updateNotificationStatusResponse?.message ?? "Something went wrong",
            })
        }
        const updatedUserDetails={...userDetails,userAuthInfo:{...userDetails?.userAuthInfo,notificationStatus:value}}
        setUserDetails(updatedUserDetails);
          
    }

    const options = useMemo(() => [
        {
            label: "Business Information",
            icon: <Feather name="briefcase" size={wp('6%')} color="#6B7280" />,
            onPress: () => navigation.navigate('BusinessDetails'),
        },
        {
            label: "Terms & Conditions",
            icon: <Feather name="file-text" size={wp('6%')} color="#8B5CF6" />,
            onPress: () => { }, // Add navigation or modal logic here if needed
        },
        {
            label: "Notifications",
            icon: <Feather name="bell" size={wp('6%')} color={isDark ? '#fff' : '#000'} />,
            rightElement: (
                <Switch
                    trackColor={{ false: "#d4d4d4", true: "#8B5CF6" }}
                    thumbColor="#fafafa"
                    ios_backgroundColor="#d4d4d4"
                    value={userDetails?.userAuthInfo?.notificationStatus ?? false}
                    onValueChange={async (value:boolean)=>{
                        await handleNotificationToggle(userDetails?.userId ?? '',value)
                    }}
                />
            ),
        },
        {
            label: "Logout",
            icon: <Feather name="log-out" size={wp('6%')} color="#EF4444" />,
            onPress: async () => {
                await logout();
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'UnauthStack', params: { screen: 'Authentication' } }],
                    })
                );
            },
        },
    ], [userDetails]); // ✅ dependencies here

    const getInvoiceList = async (userId: string) => {
        if (!userId) {
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found please login again",
            })
        }
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["invoiceId", "amountPaid"]
        }
        const invoiceListResponse = await getInvoiceListBasedOnFiltersAPI(payload)
        if (!invoiceListResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: invoiceListResponse.message ?? "Something went wrong",
            })
        }
        const totalPaid = invoiceListResponse.data.reduce((total, invoice) => total + invoice.amountPaid, 0)
        setTotalPaid(totalPaid)
    }

    const getOrderList = async (userId: string) => {
        if (!userId) {
            return showToast({
                type: "error",
                title: "Error",
                message: "UserID is not found please login again",
            })
        }
        const payload: SearchQueryRequest = {
            filters: {
                userId: userId
            },
            getAll: true,
            requiredFields: ["orderId", "totalPrice"]
        }
        const orderListResponse = await getOrderDataListAPI(payload)
        if (!orderListResponse?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: orderListResponse.message ?? "Something went wrong",
            })
        }
        const totalAmount = orderListResponse?.data?.reduce((total, order) => total + order.totalPrice, 0)
        setTotalAmount(totalAmount)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading

                const userId = getItem("USERID");
                await getUserDetailsUsingID(userId, showToast);
                await getInvoiceList(userId);
                await getOrderList(userId);

            } catch (error) {
                console.error("Error fetching data:", error);
                showToast({ type: "error", title: "Error", message: "Failed to fetch data" });
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, []);



    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader screenName="Profile" />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className="flex flex-col">
                    <ImageBackground
                        source={Background}
                        resizeMode="cover"
                        style={{
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {/* Total Amount stays where it is */}
                        <View style={styles.amountContainer}>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>
                                Total Amount
                            </Text>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>
                                {loading ? "Loading..." : `${userDetails?.currencyIcon} ${totalPaid || 0}`}
                            </Text>
                        </View>

                        {/* Profile image bottom-center & overflowing */}
                        <View
                            style={styles.logoContainer}
                        >
                            <Image
                                source={{ uri: userDetails?.userBusinessInfo?.companyLogoURL }}
                                style={styles.logo}
                            />
                        </View>
                    </ImageBackground>
                    <View>
                        <View className='flex flex-col justify-center items-center' style={{ marginTop: hp('6%'), marginVertical: hp('2%') }}>
                            <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>Hello {loading ? "Loading..." : userDetails?.userAuthInfo?.username || "N/A"}</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText, { marginHorizontal: wp('5%') }]}>Manage your profile, update contact details, and keep your information current</Text>

                            <Card style={[globalStyles.cardShadowEffect, { marginTop: hp('1%'), width: wp('80%') }]} >
                                <View className='flex flex-row justify-between items-center' style={{ padding: wp('2%') }}>
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Income</Text>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}> {loading ? "Loading..." : `${userDetails?.currencyIcon} ${totalPaid || 0}`}</Text>
                                    </View>
                                    <Divider orientation='vertical' style={{ height: hp('4%'), marginHorizontal: wp('5%') }} />
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Quoted</Text>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>{loading ? "Loading..." : `${userDetails?.currencyIcon} ${totalAmount || 0}`}</Text>
                                    </View>
                                    <Divider orientation='vertical' style={{ height: hp('4%'), marginHorizontal: wp('5%') }} />
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Balance</Text>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>  {loading ? "Loading..." : `${userDetails?.currencyIcon} ${(totalAmount - totalPaid) < 0 ? 0 : (totalAmount - totalPaid)}`}</Text>
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View className='flex flex-col'>
                            {options.map((option, index) => (
                                <TouchableOpacity onPress={option?.onPress}>
                                    <Card style={[globalStyles.cardShadowEffect, { width: wp('98%'), marginVertical: hp('0.5%') }]} className='self-center' key={index}>
                                        <View className='flex flex-row justify-between items-center p-3'>
                                            <View className='flex flex-row justify-start items-center gap-2'>
                                                {option.icon}
                                                <Text style={[globalStyles.normalTextColor, globalStyles.sideHeading]}>{option.label}</Text>
                                            </View>
                                            {option?.rightElement ? (
                                                option?.rightElement
                                            ) : (
                                                <Feather name="chevron-right" size={wp('6%')} color={isDark ? "#fff" : "#000"} />
                                            )}

                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            ))

                            }

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
