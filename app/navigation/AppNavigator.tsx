import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import BellSchedules from "@/app/BellSchedules";
import Calendar from "@/app/Calendar";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
    return (
            <Drawer.Navigator initialRouteName="Bell Schedules">
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
            </Drawer.Navigator>
    );
}