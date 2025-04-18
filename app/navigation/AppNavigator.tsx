import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BellSchedules from "@/app/BellSchedules";
import Calendar from "@/app/Calendar";

const Drawer = createDrawerNavigator();
const Navigator = Drawer.Navigator as any;
const Screen = Drawer.Screen as any;

export default function AppNavigator() {
    return (
            <Navigator initialRouteName="Bell Schedules">
                <Screen
                    name="Bell Schedules"
                    component={BellSchedules}
                    options={{
                        title: 'Bell Schedules'
                    }}
                />
                <Screen
                    name="Calendar"
                    component={Calendar}
                    options={{
                        title: 'Calendar'
                    }}
                />
            </Navigator>
    );
}