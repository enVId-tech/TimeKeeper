import React, { useEffect, useState, useRef } from 'react';
import { Stack } from "expo-router";
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Linking } from "react-native";
import { bellSchedule } from "@/app/misc/times";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const BellSchedules = () => {
    const { colors, currentTheme } = useTheme();
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
            style={[styles.container, { backgroundColor: colors.background }]}
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
                    <Text style={[styles.mainTitle, { color: colors.text }]}>Bell Schedule</Text>
                    <Text style={[styles.subTitle, { color: colors.subText }]}>Oxford Academy</Text>
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
                            <TouchableOpacity
                                onPress={() => handleScheduleSelect(scheduleType)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.scheduleHeader,
                                        {
                                            backgroundColor: colors.card,
                                            color: scheduleType === selectedValue ? colors.primary : colors.text,
                                            borderColor: colors.border
                                        },
                                        scheduleType === selectedValue && [
                                            styles.activeHeader,
                                            { backgroundColor: colors.primary }
                                        ]
                                    ]}
                                >
                                    {scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)}
                                </Text>
                            </TouchableOpacity>

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
                                            style={[
                                                checkWithinTimeframe(period.start, period.end)
                                                    ? [styles.highlighted, { backgroundColor: colors.highlight }]
                                                    : [styles.visible, { backgroundColor: colors.card }],
                                                { borderColor: colors.border }
                                            ]}
                                        >
                                            <Text style={[styles.periodName, { color: colors.text }]}>
                                                {period.period}
                                            </Text>
                                            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <Text style={[styles.periodDuration, { color: colors.subText }]}>
                                                    {period.duration} minutes
                                                </Text>
                                                <Text style={[styles.periodTime, { color: colors.subText }]}>
                                                    {period.start} - {period.end}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </Animated.View>
                            )}
                        </Animated.View>
                    );
                })}

                <Text style={[styles.currentTime, { color: colors.text }]}>
                    Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                </Text>

                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => Linking.openURL("https://forms.gle/jZDuX385VBztGXqs7")}
                    >
                        <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
                        <Text style={[styles.actionButtonText, { color: colors.text }]}>
                            Leave Feedback
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => Linking.openURL("https://github.com/enVId-tech")}
                    >
                        <Ionicons name="logo-github" size={18} color={colors.primary} />
                        <Text style={[styles.actionButtonText, { color: colors.text }]}>
                            Developer
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.credits, { color: colors.subText }]}>
                    Copyright © {new Date().getFullYear()} Erick Tran. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: 4,
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 2,
    },
    scheduleContainer: {
        width: '100%',
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    scheduleHeader: {
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    activeHeader: {
        color: '#fff',
    },
    periodListContainer: {
        width: '100%',
        marginBottom: 16,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    visible: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    periodName: {
        fontSize: 16,
        fontWeight: '500',
    },
    periodTime: {
        fontSize: 14,
    },
    periodDuration: {
        fontSize: 14,
    },
    highlighted: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    currentTime: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: 'bold',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        flex: 1,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    actionButtonText: {
        marginLeft: 8,
        fontWeight: '500',
        fontSize: 14,
    },
    credits: {
        fontSize: 12,
        marginTop: 16,
        textAlign: "center",
        padding: 10
    }
});

export default BellSchedules;