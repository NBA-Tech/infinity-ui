import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../screens/Auth/Authentication';
import Footer from '../Components/Footer';
import { Customer, Home, Invoice, Quotation,Profile, CreateCustomer, CustomerDetails, CreateOrder, Orders } from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <Footer {...props} />} // inject custom footer
        >
            <Tab.Screen name="quotation" component={CreateOrder} />
            <Tab.Screen name="home" component={Home} />
            <Tab.Screen name="customer" component={Customer} />
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
        </Stack.Navigator>
    )
}
const Navigation = () => {
    return (
        <NavigationContainer>
            <AuthStack />

        </NavigationContainer>
    );
}

export default Navigation;