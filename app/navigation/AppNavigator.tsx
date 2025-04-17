import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BellSchedules from "@/app/screens/BellSchedules";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' } // Always hide the tab bar
                }}
            >
                <Tab.Screen
                    name="BellSchedules"
                    component={BellSchedules}
                />
            </Tab.Navigator>
    );
};

export default AppNavigator;