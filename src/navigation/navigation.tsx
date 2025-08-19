import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../screens/Auth/Authentication';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack(){
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="authentication" component={Authentication} />
        </Stack.Navigator>
    )
}
const  Navigation = ()=>{
    return (
        <NavigationContainer>
            <AuthStack/>

        </NavigationContainer>
    );
}

export default Navigation;