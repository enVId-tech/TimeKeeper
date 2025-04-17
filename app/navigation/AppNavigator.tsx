import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BellSchedules from "@/app/BellSchedules";

const Tab = createBottomTabNavigator();
const Screen = Tab.Screen;
const Navigator = Tab.Navigator;

const AppNavigator = () => {
    return (
            <Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' }
                }}
            >
                <Screen name="BellSchedules" component={BellSchedules} />
            </Navigator>
    );
};

export default AppNavigator;