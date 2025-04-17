import React, { useEffect, useState, useRef } from 'react';
import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet, Animated, ScrollView } from "react-native";
import { bellSchedule } from "@/app/misc/times";

const BellSchedules = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedValue, setSelectedValue] = useState("");
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    // Animation references
    const titleAnim = useRef(new Animated.Value(-50)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;

    // Create an object to hold animated values
    const animatedValues = useRef<{
        scheduleAnims: { [key: string]: Animated.Value };
        scheduleOpacities: { [key: string]: Animated.Value };
    }>({
        scheduleAnims: {},
        scheduleOpacities: {}
    }).current;

    // Initialize animation values for each schedule
    useEffect(() => {
        Object.keys(bellSchedule).forEach((key) => {
            animatedValues.scheduleAnims[key] = new Animated.Value(-50);
            animatedValues.scheduleOpacities[key] = new Animated.Value(0);
        });
    }, []);

    // Setup entrance animations
    useEffect(() => {
        const animations = [
            Animated.parallel([
                Animated.timing(titleAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ];

        // Add animations for each schedule item with staggered effect
        Object.keys(bellSchedule).forEach((key) => {
            if (animatedValues.scheduleAnims[key] && animatedValues.scheduleOpacities[key]) {
                animations.push(
                    Animated.parallel([
                        Animated.timing(animatedValues.scheduleAnims[key], {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animatedValues.scheduleOpacities[key], {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ])
                );
            }
        });

        Animated.stagger(100, animations).start();

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleScheduleSelect = (scheduleType: string) => {
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

    const checkWithinTimeframe = (start: string, end: string): boolean => {
        let startTimeHours = parseInt(start.split(':')[0]);
        let startTimeMinutes = parseInt(start.split(':')[1].split(' ')[0]);

        let endTimeHours = parseInt(end.split(':')[0]);
        let endTimeMinutes = parseInt(end.split(':')[1].split(' ')[0]);

        startTimeHours = start.includes('PM') && startTimeHours !== 12 ? startTimeHours + 12 : startTimeHours;
        endTimeHours = end.includes('PM') && endTimeHours !== 12 ? endTimeHours + 12 : endTimeHours;

        startTimeMinutes = start.includes('PM') && startTimeMinutes === 12 ? 0 : startTimeMinutes;
        endTimeMinutes = end.includes('PM') && endTimeMinutes === 12 ? 0 : endTimeMinutes;

        const startTime = new Date();
        startTime.setHours(startTimeHours, startTimeMinutes, 0);

        const endTime = new Date();
        endTime.setHours(endTimeHours, endTimeMinutes, 0);

        const currentDate = new Date();
        currentDate.setHours(new Date().getHours(), new Date().getMinutes(), 0);

        return currentDate >= startTime && currentDate <= endTime;
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            bounces={true}
        >
            <Stack.Screen options={{ title: 'Bell Schedule' }} />
            <View style={styles.subContainer}>
                <Animated.View
                    style={[
                        styles.titleContainer,
                        {
                            opacity: titleOpacity,
                            transform: [{ translateY: titleAnim }],
                            backgroundColor: 'transparent'
                        }
                    ]}
                >
                    <Text style={styles.mainTitle}>Bell Schedule</Text>
                    <Text style={styles.subTitle}>Oxford Academy</Text>
                </Animated.View>

                {Object.entries(bellSchedule).map(([scheduleType, periods]) => {
                    const animation = animatedValues.scheduleAnims[scheduleType];
                    const opacity = animatedValues.scheduleOpacities[scheduleType];

                    if (!animation || !opacity) return null;

                    return (
                        <Animated.View
                            key={scheduleType}
                            style={[
                                styles.scheduleContainer,
                                {
                                    opacity: opacity,
                                    transform: [{ translateY: animation }]
                                }
                            ]}
                        >
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
                                                outputRange: ['0%', '100%']
                                            }),
                                            opacity: animatedOpacity
                                        }
                                    ]}
                                >
                                    {periods.map((period) => (
                                        <View
                                            key={period.period}
                                            style={checkWithinTimeframe(period.start, period.end)
                                                ? styles.highlighted
                                                : styles.visible
                                            }
                                        >
                                            <Text style={styles.periodName}>{period.period}</Text>
                                            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <Text style={styles.periodDuration}>{period.duration} minutes</Text>
                                                <Text style={styles.periodTime}>{period.start} - {period.end}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </Animated.View>
                            )}
                        </Animated.View>
                    );
                })}
                <Text style={styles.currentTime}>
                    Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                </Text>
                <Text style={styles.feedback}>
                    <Link href={"https://forms.gle/jZDuX385VBztGXqs7"} target="_blank" style={{ color: '#007AFF' }}>Want to leave feedback? Tap on this text!</Link>
                </Text>
                <Text style={styles.credits}>
                    Copyright © {new Date().getFullYear()} <Link style={styles.myname} href={'https://github.com/enVId-tech'} target={"_blank"}>Erick Tran</Link>. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        height: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    subContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 100,
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
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
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
        textAlign: "center",
        padding: 10
    },
    currentTime: {
        fontSize: 16,
        color: '#333',
        marginTop: 16,
        fontWeight: 'bold',
    },
    feedback: {
        fontSize: 14,
        color: '#333',
        marginTop: 16,
        textDecorationLine: 'underline',
    },
    myname: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    periodDuration: {
        fontSize: 14,
        color: '#666',
    }
});

export default BellSchedules;