import React from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

import { useAuth } from "../context/auth-context/auth-context";

// Screens
import {
  Authentication,
  SplashScreen,
  FeatureSlide,
  OneTimePassword,
  UserOnBoarding,
  Services,
  Success,
  Home,
  Customer,
  CreateCustomer,
  CustomerDetails,
  Orders,
  CreateOrder,
  OrderDetails,
  InvoiceList,
  CreateInvoice,
  InvoiceDetails,
  Profile,
  BusinessDetails,
  Subscription,
  PaymentGateway,
  Quotation,
  CreateQuotaion,
  TransactionHistory,
} from "../screens";

import Footer from "../components/footer";
import SubscriptionLockOverlay from "../components/subscription-overlay";
import Tutorial from "../screens/profile/tutorial";
import SubscriptionExpiration from "../components/subscription-expiration";

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------------------------------
   NESTED STACK NAVIGATORS (NO CREATE SCREENS)
---------------------------------- */

function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerList" component={Customer} />
      <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
    </Stack.Navigator>
  );
}

function OrderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersList" component={Orders} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
    </Stack.Navigator>
  );
}

function InvoiceNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InvoiceList" component={InvoiceList} />
      <Stack.Screen name="InvoiceDetails" component={InvoiceDetails} />
    </Stack.Navigator>
  );
}

function QuotationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuotationList" component={Quotation} />
    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileView" component={Profile} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetails} />
      <Stack.Screen name="Tutorial" component={Tutorial} />
    </Stack.Navigator>
  );
}

/* ---------------------------------
   WRAPPERS WITH SUBSCRIPTION OVERLAY
---------------------------------- */

const HomeWrapper = () => (
  <View style={{ flex: 1 }}>
    <SubscriptionExpiration />
    <SubscriptionLockOverlay>
      <Home />
    </SubscriptionLockOverlay>
  </View>
);

const CustomerNavigatorWrapper = () => (
  <View style={{ flex: 1 }}>
    <SubscriptionExpiration />
    <SubscriptionLockOverlay>
      <CustomerNavigator />
    </SubscriptionLockOverlay>
  </View>
);

const OrdersNavigatorWrapper = () => (
  <View style={{ flex: 1 }}>
    <SubscriptionExpiration />
    <SubscriptionLockOverlay>
      <OrderNavigator />
    </SubscriptionLockOverlay>
  </View>
);

const InvoiceNavigatorWrapper = () => (
  <View style={{ flex: 1 }}>
    <SubscriptionExpiration />
    <SubscriptionLockOverlay>
      <InvoiceNavigator />
    </SubscriptionLockOverlay>
  </View>
);

const QuotationNavigatorWrapper = () => (
  <View style={{ flex: 1 }}>
    <SubscriptionExpiration />
    <SubscriptionLockOverlay>
      <QuotationNavigator />
    </SubscriptionLockOverlay>
  </View>
);

const ProfileNavigatorWrapper = () => (
  <View style={{ flex: 1 }}>
    <SubscriptionExpiration />
    <ProfileNavigator />
  </View>
);

/* ---------------------------------
   MAIN TAB NAVIGATION (CLEAN)
---------------------------------- */

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <Footer {...props} />}
    >
      <Tab.Screen name="Home" component={HomeWrapper} />
      <Tab.Screen name="Customer" component={CustomerNavigatorWrapper} />
      <Tab.Screen name="Orders" component={OrdersNavigatorWrapper} />
      <Tab.Screen name="Quotations" component={QuotationNavigatorWrapper} />
      <Tab.Screen name="Invoice" component={InvoiceNavigatorWrapper} />
      <Tab.Screen name="Profile" component={ProfileNavigatorWrapper} />
    </Tab.Navigator>
  );
}

/* ---------------------------------
   AUTH STACK (GLOBAL CREATE SCREENS)
---------------------------------- */

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main tab UI */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* GLOBAL CREATE / EDIT SCREENS */}
      <Stack.Screen name="CreateCustomer" component={CreateCustomer} />
      <Stack.Screen name="CreateOrder" component={CreateOrder} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
      <Stack.Screen name="CreateQuotation" component={CreateQuotaion} />
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="Success" component={Success} />
    </Stack.Navigator>
  );
}

/* ---------------------------------
   UNAUTH STACK
---------------------------------- */

function UnauthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeatureSlide" component={FeatureSlide} />
      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="OneTimePassword" component={OneTimePassword} />
      <Stack.Screen name="UserOnBoarding" component={UserOnBoarding} />
    </Stack.Navigator>
  );
}

/* ---------------------------------
   ROOT NAVIGATION
---------------------------------- */

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return null;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="AuthStack" component={AuthStack} />
        <RootStack.Screen name="UnauthStack" component={UnauthStack} />
        <RootStack.Screen name="Subscription" component={Subscription} />
        <RootStack.Screen name="PaymentGateway" component={PaymentGateway} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
