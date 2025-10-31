import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/auth-context/auth-context";
import Footer from "../components/footer";

// Screens
import {
  Authentication,
  SplashScreen,
  FeatureSlide,
  OneTimePassword,
  UserOnBoarding,
  Services,
  TemplateEditor,
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
} from "../screens";
import { useSubscription } from "../providers/subscription/subscription-context";
import SubscriptionLockOverlay from "../components/subscription-overlay";
import { View } from "react-native";

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// ===================
// Nested Stack Navigators
// ===================
function OrderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersList" component={Orders} />
      <Stack.Screen name="CreateOrder" component={CreateOrder} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
    </Stack.Navigator>
  );
}

function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerList" component={Customer} />
      <Stack.Screen name="CreateCustomer" component={CreateCustomer} />
      <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileView" component={Profile} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetails} />
    </Stack.Navigator>
  );
}

function InvoiceNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InvoiceList" component={InvoiceList} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
      <Stack.Screen name="InvoiceDetails" component={InvoiceDetails} />
    </Stack.Navigator>
  );
}

// ===================
// Tab Navigator
// ===================
function TabNavigator() {
  const { isSubscribed } = useSubscription();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <Footer {...props} />}
    >
      <Tab.Screen name="Home">
        {() => (
          <View style={{ flex: 1 }}>
            <SubscriptionLockOverlay>
              <Home />
            </SubscriptionLockOverlay>
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Customer">
        {() => (
          <View style={{ flex: 1 }}>
            <SubscriptionLockOverlay>
              <CustomerNavigator />
            </SubscriptionLockOverlay>
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Orders">
        {() => (
          <View style={{ flex: 1 }}>
            <SubscriptionLockOverlay>
              <OrderNavigator />
            </SubscriptionLockOverlay>
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Invoice">
        {() => (
          <View style={{ flex: 1 }}>
            <SubscriptionLockOverlay>
              <InvoiceNavigator />
            </SubscriptionLockOverlay>
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Services">
        {() => (
          <View style={{ flex: 1 }}>
            <SubscriptionLockOverlay>
              <Services />
            </SubscriptionLockOverlay>
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ===================
// Authenticated Stack
// ===================
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
      <Stack.Screen name="Success" component={Success} />
    </Stack.Navigator>
  );
}

// ===================
// Unauthenticated Stack
// ===================
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

// ===================
// Root Navigator (Splash + Auth / Unauth)
// ===================
export default function Navigation() {
  const { isAuthenticated } = useAuth();


  if (isAuthenticated === null) return null; // loading state

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
