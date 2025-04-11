import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import DropDownPicker from 'react-native-dropdown-picker';
import {Stack, useRouter} from "expo-router";
import {Button, View, Text} from "react-native";

const MainScreen = () => {
    const bellScheduleState = useState(null);
    const currentDate = new Date();

    const bellSchedule = {
        "block (even, odd)": [
            { 'period': '1/2', 'start': '8:35 AM', 'end': '9:55 AM' },
            { 'period': '3/4', 'start': '10:00 AM', 'end': '11:25 AM' },
            { 'period': '5/6', 'start': '12:25 PM', 'end': '1:50 PM' },
            { 'period': '7/8', 'start': '1:55 PM', 'end': '3:20 PM' },
            { 'period': '9 (Homeroom)', 'start': '11:30 AM', 'end': '11:50 AM' },
            { 'period': 'Lunch', 'start': '11:50 AM', 'end': '12:20 PM' },
        ],
        "monday": [
            { 'period': '1', 'start': '9:15 AM', 'end': '9:55 AM' },
            { 'period': '2', 'start': '9:59 AM', 'end': '10:34 AM' },
            { 'period': '3', 'start': '10:39 AM', 'end': '11:14 AM' },
            { 'period': '4', 'start': '11:18 AM', 'end': '11:53 AM' },
            { 'period': '5', 'start': '12:48 PM', 'end': '1:23 PM' },
            { 'period': '6', 'start': '1:27 PM', 'end': '2:02 PM' },
            { 'period': '7', 'start': '2:06 PM', 'end': '2:41 PM' },
            { 'period': '8', 'start': '2:45 PM', 'end': '3:20 PM' },
            { 'period': 'Lunch', 'start': '12:14 AM', 'end': '12:44 AM' },
            { 'period': 'Connections', 'start': '11:53 AM', 'end': '12:14 PM' },
        ],
        "non-late start": [
            { 'period': '1', 'start': '8:30 AM', 'end': '9:21 AM' },
            { 'period': '2', 'start': '9:25 AM', 'end': '10:08 AM' },
            { 'period': '3', 'start': '10:12 AM', 'end': '10:55 AM' },
            { 'period': '4', 'start': '10:59 AM', 'end': '11:42 AM' },
            { 'period': '5', 'start': '12:16 PM', 'end': '12:59 PM' },
            { 'period': '6', 'start': '1:03 PM', 'end': '1:46 PM' },
            { 'period': '7', 'start': '1:50 PM', 'end': '2:33 PM' },
            { 'period': '8', 'start': '2:37 PM', 'end': '3:20 PM' },
            { 'period': 'Lunch', 'start': '11:42 AM', 'end': '12:12 PM' },
        ],
        "assembly/rally": [
            { 'period': '1/2', 'start': '8:30 AM', 'end': '9:48 AM' },
            { 'period': '3/4', 'start': '9:53 AM', 'end': '11:11 AM' },
            { 'period': '5/6', 'start': '12:39 PM', 'end': '1:57 PM' },
            { 'period': '7/8', 'start': '2:02 PM', 'end': '3:20 PM' },
            { 'period': 'Rally (Grades 9-12)', 'start': '11:16 AM', 'end': '11:56 AM' },
            { 'period': 'Rally (Grade 7-8)', 'start': '11:54 AM', 'end': '12:34 PM' },
            { 'period': 'Lunch', 'start': '11:31 AM', 'end': '12:01 PM' },
        ]
    }

    useEffect(() => {
    }, []);

    return (
        <SafeAreaProvider>
            <Stack.Screen options={{ title: 'Main' }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Main Screen</Text>
                <Text>Bell Schedule App</Text>
                <Text>Version 1.0</Text>
                <DropDownPicker
                    items={[
                        {label: 'USA', value: 'usa', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
                        {label: 'UK', value: 'uk', icon: () => <Icon name="flag" size={18} color="#900" />},
                        {label: 'France', value: 'france', icon: () => <Icon name="flag" size={18} color="#900" />},
                    ]}
                    defaultValue={"USA"}
                    containerStyle={{height: 40}}
                    style={{backgroundColor: '#fafafa'}}
                    onChangeItem={item => this.setState({
                        country: item.value
                    })}
                />u
                <Text>Today's schedule</Text>
                <Text>Normal bell schedule</Text>
            </View>
        </SafeAreaProvider>
    )
}

export default MainScreen;