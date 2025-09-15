import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../screens/auth/authentication';
import Footer from '../components/footer';
import { Customer, Home, Invoice, Quotation, Profile, CreateCustomer, CustomerDetails, CreateOrder, Orders, InvoiceGenerator, UserOnBoarding, OneTimePassword, TemplateEditor, Services } from '../screens';
import { useAuth } from '../context/auth-context/auth-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <Footer {...props} />} // inject custom footer
        >
            <Tab.Screen name="home" component={Home} />
            <Tab.Screen name="quotation" component={CreateOrder} />
            <Tab.Screen name="customer" component={Services} />
            <Tab.Screen name="invoice" component={Orders} />
            <Tab.Screen name="profile" component={Profile} />
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
            {true ? (
                <AuthStack />
            ) : (
                <UnauthStack />
            )
            }

        </NavigationContainer>
    );
}

export default Navigation;