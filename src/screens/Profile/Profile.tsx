import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import { StyleContext, ThemeToggleContext } from "@/src/providers/theme/global-style-provider";
import { useAuth } from "@/src/context/auth-context/auth-context";
import { useUserStore } from "@/src/store/user/user-store";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { useToastMessage } from "@/src/components/toast/toast-message";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NavigationProp, SearchQueryRequest } from "@/src/types/common";
import { getInvoiceListBasedOnFiltersAPI } from "@/src/api/invoice/invoice-api-service";
import { getOrderDataListAPI } from "@/src/api/order/order-api-service";
import { updateNotificationStatusAPI } from "@/src/services/user/user-service";
import GradientCard from "@/src/utils/gradient-card";
import { NotificationContext } from "@/src/providers/notification/notification-provider";
import { ApprovalStatus } from "@/src/types/order/order-type";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useReloadContext } from "@/src/providers/reload/reload-context";

const Profile = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark, toggleTheme } = useContext(ThemeToggleContext);
  const { logout } = useAuth();
  const { userDetails, getUserDetailsUsingID, setUserDetails } = useUserStore();
  const { getItem } = useDataStore();
  const showToast = useToastMessage();
  const navigation = useNavigation<NavigationProp>();
  const { requestNotificationPermission } = useContext(NotificationContext)
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { reloadOrders, reloadInvoices } = useReloadContext()

  const handleNotificationToggle = async (userId: string, value: boolean) => {
    if (!userId)
      return showToast({
        type: "error",
        title: "Error",
        message: "UserID not found. Please login again.",
      });

    const res = await updateNotificationStatusAPI(userId, value);
    if (!res?.success)
      return showToast({
        type: "error",
        title: "Error",
        message: res?.message ?? "Something went wrong",
      });


  };

  const getInvoiceList = async (userId: string) => {
    const payload: SearchQueryRequest = {
      filters: { userId },
      getAll: true,
      requiredFields: ["invoiceId", "amountPaid"],
    };
    const res = await getInvoiceListBasedOnFiltersAPI(payload);
    if (res?.success) {
      const paid = res.data.reduce((sum, i) => sum + i.amountPaid, 0);
      setTotalPaid(paid);
    }
  };

  const getOrderList = async (userId: string) => {
    const payload: SearchQueryRequest = {
      filters: { userId },
      getAll: true,
      requiredFields: ["orderId", "totalPrice", "approvalStatus"],
    };
    const res = await getOrderDataListAPI(payload);
    if (res?.success) {
      const approvedOrders = res.data.filter((order: any) => order.approvalStatus == ApprovalStatus.ACCEPTED);
      const total = approvedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      setTotalAmount(total);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = getItem("USERID");
        await getUserDetailsUsingID(userId, showToast);
        await getInvoiceList(userId);
        await getOrderList(userId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadOrders,reloadInvoices]);

  const options = useMemo(
    () => [
      {
        label: "Business Information",
        icon: <Feather name="briefcase" size={wp("6%")} color="#6B7280" />,
        onPress: () => navigation.navigate("BusinessDetails"),
      },
      {
        label: "Services & Packages",
        icon: <Feather name="package" size={wp("6%")} color="#3B82F6" />,
        onPress: () => navigation.navigate("Services"),
      },
      {
        label: "Tutorial",
        icon: <Feather name="video" size={wp("6%")} color="#0EA5E9" />,
        onPress: () => navigation.navigate("Tutorial"),
      },
      {
        label: "Notifications",
        icon: <Feather name="bell" size={wp("6%")} color={"#F59E0B"} />,
        rightElement: (
          <Switch
            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
            thumbColor="#fafafa"
            ios_backgroundColor="#d4d4d4"
            value={userDetails?.userAuthInfo?.notificationStatus ?? false}
            onValueChange={(value: boolean) => {
              requestNotificationPermission(value)
            }
            }
          />
        ),
      },
      {
        label: "Subscription",
        icon: <FontAwesome name="credit-card" size={wp("6%")} color="#10B981" />,
        onPress: () => navigation.navigate("Subscription"),
      },
      {
        label: "Transaction History",
        icon: <FontAwesome name="money" size={wp("6%")} color="#14B8A6" />,
        onPress: () => navigation.navigate("TransactionHistory"),
      },
      {
        label: "Theme",
        icon: <Feather name="moon" size={wp("6%")} color={"#8B5CF6"} />,
        rightElement: (
          <Switch
            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
            thumbColor="#fafafa"
            ios_backgroundColor="#d4d4d4"
            value={isDark}
            onValueChange={() => toggleTheme()}
          />
        ),
      },
      {
        label: "Logout",
        icon: <Feather name="log-out" size={wp("6%")} color="#EF4444" />,
        onPress: async () => {
          await logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "UnauthStack", params: { screen: "Authentication" } }],
            })
          );
        },
      },
    ],
    [userDetails, isDark]
  );

  return (
    <SafeAreaView style={globalStyles.appBackground}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* 🌈 Gradient Profile Header */}
        <GradientCard
          colors={
            isDark
              ? ["#0D3B8F", "#1372F0"]
              : ["#1372F0", "#6FADFF"]
          }
        >
          <View className="flex flex-col items-center justify-center p-4 mt-4">
            <View
              style={{
                width: wp("26%"),
                height: wp("26%"),
                borderRadius: wp("13%"),
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.4)",
                backgroundColor: "rgba(255,255,255,0.15)",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                marginBottom: hp("1%"),
              }}
            >
              {userDetails?.userBusinessInfo?.companyLogoURL ? (
                <Image
                  source={{ uri: userDetails.userBusinessInfo.companyLogoURL }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Feather name="user" size={wp("10%")} color="#FFFFFF" />
              )}
            </View>

            <Text
              style={[
                globalStyles.whiteTextColor,
                globalStyles.heading2Text,
                { textAlign: "center" },
              ]}
            >
              {loading ? "Loading..." : userDetails?.userAuthInfo?.username || "N/A"}
            </Text>

            <Text
              style={[
                globalStyles.whiteTextColor,
                globalStyles.smallText,
                { textAlign: "center", opacity: 0.8, marginVertical: hp('1%') },
              ]}
            >
              Manage your account, preferences, and profile details.
            </Text>

            {/* Quick Stats */}
            <View className="flex flex-row justify-between w-full mt-4">
              {[
                { title: "Income", value: totalPaid },
                { title: "Quoted", value: totalAmount },
                {
                  title: "Balance",
                  value: (totalAmount - totalPaid) < 0 ? 0 : totalAmount - totalPaid,
                },
              ].map((item, i) => (
                <View key={i} className="flex-1 items-center">
                  <Text
                    style={[
                      globalStyles.whiteTextColor,
                      globalStyles.normalBoldText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      globalStyles.whiteTextColor,
                      globalStyles.labelText,
                    ]}
                  >
                    {loading
                      ? "..."
                      : `${userDetails?.currencyIcon} ${item.value}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </GradientCard>

        {/* ⚙️ Options List */}
        <View className="mt-4">
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={option?.onPress}>
              <Card
                style={[
                  globalStyles.cardShadowEffect,
                  { marginVertical: hp("0.6%"), width: wp("94%"), alignSelf: "center" },
                ]}
              >
                <View className="flex flex-row justify-between items-center p-3">
                  <View className="flex flex-row justify-start items-center gap-2">
                    {option.icon}
                    <Text
                      style={[
                        globalStyles.themeTextColor,
                        globalStyles.sideHeading,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {option?.rightElement || (
                    <Feather
                      name="chevron-right"
                      size={wp("6%")}
                      color={isDark ? "#E2E8F0" : "#000"}
                    />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
