import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../screens/auth/authentication';
import Footer from '../components/footer';
import { Customer, Home, InvoiceList, Quotation, Profile, CreateCustomer, CustomerDetails, CreateOrder, Orders, UserOnBoarding, OneTimePassword, TemplateEditor, Services, OrderDetails, CreateInvoice, SplashScreen } from '../screens';
import { useAuth } from '../context/auth-context/auth-context';
import { RootStackParamList } from '../types/common';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function OrderNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OrdersList" component={Orders} />
            <Stack.Screen name="CreateOrder" component={CreateOrder} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />

        </Stack.Navigator>
    )
}


function OfferingNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Services" component={Services} />
        </Stack.Navigator>
    )
}

function CustomerNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CustomerList" component={Customer} />
            <Stack.Screen name="CreateCustomer" component={CreateCustomer} />
        </Stack.Navigator>
    )
}

function ProfileNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileView" component={Profile} />
            <Stack.Screen name="Offering" component={OfferingNavigator} />
        </Stack.Navigator>
    )
}
function InvoiceNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InvoiceList" component={InvoiceList} />
            <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
        </Stack.Navigator>
    )
}
function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <Footer {...props} />} // inject custom footer
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Customer" component={CustomerNavigator} />
            <Tab.Screen name="Orders" component={OrderNavigator} />
            <Tab.Screen name="Invoice" component={InvoiceNavigator} />
            <Tab.Screen name="profile" component={ProfileNavigator} />
        </Tab.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="main" component={TabNavigator} />
        </Stack.Navigator>
    )
}

function UnauthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" component={SplashScreen} />
            <Stack.Screen name="authentication" component={Authentication} />
            <Stack.Screen name='onetimepassword' component={OneTimePassword} />
            <Stack.Screen name="useronboarding" component={UserOnBoarding} />
            <Stack.Screen name="services" component={Services} />
            <Stack.Screen name="templateeditor" component={TemplateEditor} />


        </Stack.Navigator>
    )
}
const Navigation = () => {
    const { isAuthenticated, login, logout } = useAuth()

    if (isAuthenticated === null) {
        return null; // Or `return null;`
    }

    return (
        <NavigationContainer>
            {false ? (
                <AuthStack />
            ) : (
                <UnauthStack />
            )
            }

        </NavigationContainer>
    );
}

export default Navigation;