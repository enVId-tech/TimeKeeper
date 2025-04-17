import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import DropDownPicker from 'react-native-dropdown-picker';
import {Stack, useRouter} from "expo-router";
import {Button, View, Text, StyleSheet, Animated} from "react-native";

const BellSchedules = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentDay, setCurrentDay] = useState(currentTime.getDay());
    const [selectedValue, setSelectedValue] = useState("");
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Constantly change the date to check if the schedule is correct
        const interval = setInterval(() => {
            setCurrentTime(new Date());
            setCurrentDay(new Date().getDay());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleScheduleSelect = (scheduleType: string) => {
        // If clicking the same schedule, collapse it
        if (scheduleType === selectedValue) {
            Animated.parallel([
                Animated.timing(animatedHeight, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(animatedOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false
                })
            ]).start(() => setSelectedValue(""));
        } else {
            // If different schedule, set it and animate
            setSelectedValue(scheduleType);
            Animated.parallel([
                Animated.timing(animatedHeight, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(animatedOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                })
            ]).start();
        }
    };
    const bellSchedule = {
        "Block (Even, Odd)": [
            { 'period': '1/2', 'start': '8:35 AM', 'end': '9:55 AM' },
            { 'period': '3/4', 'start': '10:00 AM', 'end': '11:25 AM' },
            { 'period': 'Lunch', 'start': '11:50 AM', 'end': '12:20 PM' },
            { 'period': '5/6', 'start': '12:25 PM', 'end': '1:50 PM' },
            { 'period': '7/8', 'start': '1:55 PM', 'end': '3:20 PM' },
            { 'period': '9 (Homeroom)', 'start': '11:30 AM', 'end': '11:50 AM' },
        ],
        "Monday": [
            { 'period': '1', 'start': '9:15 AM', 'end': '9:55 AM' },
            { 'period': '2', 'start': '9:59 AM', 'end': '10:34 AM' },
            { 'period': '3', 'start': '10:39 AM', 'end': '11:14 AM' },
            { 'period': '4', 'start': '11:18 AM', 'end': '11:53 AM' },
            { 'period': 'Connections', 'start': '11:53 AM', 'end': '12:14 PM' },
            { 'period': 'Lunch', 'start': '12:14 AM', 'end': '12:44 AM' },
            { 'period': '5', 'start': '12:48 PM', 'end': '1:23 PM' },
            { 'period': '6', 'start': '1:27 PM', 'end': '2:02 PM' },
            { 'period': '7', 'start': '2:06 PM', 'end': '2:41 PM' },
            { 'period': '8', 'start': '2:45 PM', 'end': '3:20 PM' },
        ],
        "Non-late Start": [
            { 'period': '1', 'start': '8:30 AM', 'end': '9:21 AM' },
            { 'period': '2', 'start': '9:25 AM', 'end': '10:08 AM' },
            { 'period': '3', 'start': '10:12 AM', 'end': '10:55 AM' },
            { 'period': '4', 'start': '10:59 AM', 'end': '11:42 AM' },
            { 'period': 'Lunch', 'start': '11:42 AM', 'end': '12:12 PM' },
            { 'period': '5', 'start': '12:16 PM', 'end': '12:59 PM' },
            { 'period': '6', 'start': '1:03 PM', 'end': '1:46 PM' },
            { 'period': '7', 'start': '1:50 PM', 'end': '2:33 PM' },
            { 'period': '8', 'start': '2:37 PM', 'end': '3:20 PM' },
        ],
        "Assembly / Rally": [
            { 'period': '1/2', 'start': '8:30 AM', 'end': '9:48 AM' },
            { 'period': '3/4', 'start': '9:53 AM', 'end': '11:11 AM' },

            { 'period': 'Rally (Grades 9-12)', 'start': '11:16 AM', 'end': '11:56 AM' },
            { 'period': 'Lunch', 'start': '11:31 AM', 'end': '12:01 PM' },
            { 'period': 'Rally (Grade 7-8)', 'start': '11:54 AM', 'end': '12:34 PM' },
            { 'period': '5/6', 'start': '12:39 PM', 'end': '1:57 PM' },
            { 'period': '7/8', 'start': '2:02 PM', 'end': '3:20 PM' },
        ],
        "Minimum Day": [
            { 'period': '1/2', 'start': '8:30 AM', 'end': '9:35 AM' },
            { 'period': 'Nutrition', 'start': '9:35 AM', 'end': '9:45 AM' },
            { 'period': '3/4', 'start': '9:50 AM', 'end': '10:55 AM' },
            { 'period': '5/6', 'start': '11:00 AM', 'end': '12:05 PM' },
            { 'period': '7/8', 'start': '12:10 PM', 'end': '1:15 PM' },
        ],
        "Finals - Minimum Day": [
            { 'period': '1/2', 'start': '8:30 AM', 'end': '9:15 AM' },
            { 'period': 'Nutrition', 'start': '9:15 AM', 'end': '9:25 AM' },
            { 'period': '3/4', 'start': '9:30 AM', 'end': '10:55 AM' },
            { 'period': '5/6', 'start': '11:00 AM', 'end': '11:45 AM' },
            { 'period': '7/8', 'start': '11:50 PM', 'end': '1:15 PM' },
        ],
    }

    const checkWithinTimeframe = (start: string, end: string) => {
        const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;

        const startTime = new Date();
        const [startHour, startMinute] = start.split(':').map(Number);

        startTime.setHours(startHour, startMinute, 0);

        const endTime = new Date();
        const [endHour, endMinute] = end.split(':').map(Number);

        endTime.setHours(endHour, endMinute, 0);

        return currentTime >= start && currentTime <= end;
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <Stack.Screen options={{ title: 'Bell Schedule' }} />
            <View style={styles.subContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Bell Schedule</Text>
                    <Text style={styles.subTitle}>Oxford Academy</Text>
                    <Text style={styles.version}>Version 1.0</Text>
                </View>

                {Object.entries(bellSchedule).map(([scheduleType, periods]) => (
                    <View key={scheduleType} style={styles.scheduleContainer}>
                        <Text
                            style={[
                                styles.scheduleHeader,
                                scheduleType === selectedValue && styles.activeHeader
                            ]}
                            onPress={() => handleScheduleSelect(scheduleType)}
                        >
                            {scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)}
                        </Text>

                        {scheduleType === selectedValue && (
                            <Animated.View
                                style={[
                                    styles.periodListContainer,
                                    {
                                        maxHeight: animatedHeight.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '1000%']
                                        }),
                                        opacity: animatedOpacity
                                    }
                                ]}
                            >
                                {periods.map((period) => (
                                    <View key={period.period} style={checkWithinTimeframe(period.start, period.end) ? styles.highlighted : styles.visible}>
                                        <Text style={styles.periodName}>{period.period}</Text>
                                        <Text style={styles.periodTime}>{period.start} - {period.end}</Text>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                    </View>
                ))}
                <Text style={styles.currentTime}>
                    Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                </Text>
                <Text style={styles.credits}>
                    Copyright © {new Date().getFullYear()} Erick Tran. All rights reserved.
                </Text>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
    },
    subContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        width: '100%',
    },
    titleContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    subTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 2,
    },
    version: {
        fontSize: 12,
        color: '#888',
        marginBottom: 24,
    },
    scheduleContainer: {
        width: '100%',
        marginBottom: 12,
    },
    scheduleHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a2e',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    activeHeader: {
        backgroundColor: '#3498db',
        color: '#fff',
    },
    periodListContainer: {
        width: '100%',
        marginBottom: 16,
        overflow: 'hidden',
    },
    visible: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        borderRadius: 10,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    periodName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    periodTime: {
        fontSize: 14,
        color: '#666',
    },
    highlighted: {
        backgroundColor: '#98fb98',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        borderRadius: 10,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    credits: {
        fontSize: 12,
        color: '#888',
        marginTop: 16,
    },
    currentTime: {
        fontSize: 16,
        color: '#333',
        marginTop: 16,
        fontWeight: 'bold',
    },
});

export default BellSchedules;