import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BellSchedules from "@/app/BellSchedules";
import Calendar from "@/app/Calendar";
import SettingsPage from "../Settings";
import { useTheme } from "@/app/context/ThemeContext";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
    const { colors } = useTheme();

    return (
        <Drawer.Navigator
            initialRouteName="Bell Schedules"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                drawerStyle: {
                    backgroundColor: colors.background,
                },
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.text,
            }}
        >
            <Drawer.Screen
                name="Bell Schedules"
                component={BellSchedules}
                options={{
                    title: 'Bell Schedules'
                }}
            />
            <Drawer.Screen
                name="Calendar"
                component={Calendar}
                options={{
                    title: 'Calendar'
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsPage}
                options={{
                    title: 'Settings'
                }}
            />
        </Drawer.Navigator>
    );
}