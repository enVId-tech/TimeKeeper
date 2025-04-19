import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert, Switch, ScrollView, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { bellSchedule } from "@/app/misc/times";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useTheme } from '@/app/context/ThemeContext';

// Define types for bellSchedule
interface PeriodData {
    period: string;
    start: string;
    end: string;
    duration: number;
}

interface BellScheduleType {
    [scheduleName: string]: PeriodData[];
}

// Type-assert bellSchedule
const typedBellSchedule = bellSchedule as BellScheduleType;

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

interface AlertSetting {
    period: string;
    minutesBefore: number;
    enabled: boolean;
    identifier?: string;
}

const UserSettings = () => {
    const { theme, setTheme, currentTheme, colors } = useTheme();
    const [scheduleValue, setScheduleValue] = useState<string | null>(null);
    const [scheduleFocus, setScheduleFocus] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [alertsEnabled, setAlertsEnabled] = useState(false);
    const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([]);
    const [defaultMinutes, setDefaultMinutes] = useState("5");

    // Create dropdown data for schedule selection
    const scheduleData = Object.entries(typedBellSchedule).map(([key], index) => ({
        label: key,
        value: key,
    }));

    // Request notification permissions
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            setAlertsEnabled(status === 'granted');
        };
        requestPermissions();
    }, []);

    // Load saved preferences when component mounts
    useEffect(() => {
        const loadSavedPreferences = async () => {
            try {
                const savedSchedule = await AsyncStorage.getItem('@preferred_schedule');
                if (savedSchedule !== null) {
                    setScheduleValue(savedSchedule);
                }

                const savedAlertSettings = await AsyncStorage.getItem('@alert_settings');
                if (savedAlertSettings !== null) {
                    setAlertSettings(JSON.parse(savedAlertSettings));
                }

                const savedDefaultMinutes = await AsyncStorage.getItem('@default_minutes');
                if (savedDefaultMinutes !== null) {
                    setDefaultMinutes(savedDefaultMinutes);
                }
            } catch (error) {
                console.error('Failed to load preferences:', error);
            }
        };

        loadSavedPreferences();
    }, []);

    // Update alert settings when schedule changes
    useEffect(() => {
        if (scheduleValue) {
            updateAlertSettingsForSchedule(scheduleValue);
        }
    }, [scheduleValue]);

    const updateAlertSettingsForSchedule = (scheduleName: string) => {
        const schedule = typedBellSchedule[scheduleName];
        if (!schedule) return;

        // Create alert settings for each period in the schedule if they don't exist
        const newSettings = [...alertSettings];

        schedule.forEach((period: PeriodData) => {
            const existingSetting = alertSettings.find(
                setting => setting.period === `${scheduleName}:${period.period}`
            );

            if (!existingSetting) {
                newSettings.push({
                    period: `${scheduleName}:${period.period}`,
                    minutesBefore: parseInt(defaultMinutes),
                    enabled: false
                });
            }
        });

        setAlertSettings(newSettings);
    };

    const toggleAlertForPeriod = (periodId: string) => {
        const updatedSettings = alertSettings.map(setting => {
            if (setting.period === periodId) {
                return {...setting, enabled: !setting.enabled};
            }
            return setting;
        });
        setAlertSettings(updatedSettings);
    };

    const updateMinutesForPeriod = (periodId: string, minutes: string) => {
        const minutesNum = parseInt(minutes) || 5;

        const updatedSettings = alertSettings.map(setting => {
            if (setting.period === periodId) {
                return {...setting, minutesBefore: minutesNum};
            }
            return setting;
        });
        setAlertSettings(updatedSettings);
    };

    const scheduleNotifications = async () => {
        // Cancel all existing notifications first
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Only proceed if alerts are enabled
        if (!alertsEnabled) return;

        const enabledAlerts = alertSettings.filter(setting => setting.enabled);
        if (enabledAlerts.length === 0) return;

        const scheduleName = scheduleValue as string;
        const schedule = typedBellSchedule[scheduleName];
        if (!schedule) return;

        for (const setting of enabledAlerts) {
            const [scheduleKey, periodName] = setting.period.split(':');
            if (scheduleKey !== scheduleName) continue;

            const periodData = schedule.find(p => p.period === periodName);
            if (!periodData) continue;

            // Parse the start time (assumed format: "HH:MM")
            const [hours, minutes] = periodData.start.split(':').map(Number);

            // Create a Date for each day of the week (Mon-Fri)
            for (let weekday = 1; weekday <= 5; weekday++) {
                const now = new Date();
                const daysToAdd = (weekday - now.getDay() + 7) % 7;

                const scheduleDate = new Date();
                scheduleDate.setDate(now.getDate() + daysToAdd);
                scheduleDate.setHours(hours, minutes - setting.minutesBefore, 0);

                // Only schedule if it's in the future
                if (scheduleDate > now) {
                    const identifier = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `${periodName} starts soon`,
                            body: `Your ${periodName} period starts in ${setting.minutesBefore} minutes`,
                            sound: true,
                        },
                        trigger: {
                            type: "date",
                            date: scheduleDate,
                        }
                    });

                    console.log(`Scheduled notification ${identifier} for ${periodName} at ${scheduleDate}`);
                }
            }
        }
    };

    const savePreferences = async () => {
        if (!scheduleValue) {
            Alert.alert("Missing Selection", "Please select a bell schedule before saving.");
            return;
        }

        setIsSaving(true);

        try {
            // Save schedule preference
            await AsyncStorage.setItem('@preferred_schedule', scheduleValue);

            // Save alert settings
            await AsyncStorage.setItem('@alert_settings', JSON.stringify(alertSettings));

            // Save default minutes
            await AsyncStorage.setItem('@default_minutes', defaultMinutes);

            // Schedule notifications
            await scheduleNotifications();

            Alert.alert("Success", "Your preferences and alerts have been saved.");
        } catch (error) {
            Alert.alert("Error", "Failed to save preferences. Please try again.");
            console.error('Failed to save preferences:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Get periods for the selected schedule
    const getPeriodsForSelectedSchedule = () => {
        if (!scheduleValue) return [];

        const schedule = typedBellSchedule[scheduleValue];
        if (!schedule) return [];

        return schedule.map((period: PeriodData) => ({
            id: `${scheduleValue}:${period.period}`,
            name: period.period,
            start: period.start,
            end: period.end
        }));
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={currentTheme === 'dark' ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <Text style={[styles.header, { color: colors.text }]}>Settings</Text>
                    <Text style={[styles.subHeader, { color: colors.subText }]}>Customize your experience</Text>

                    {/* Appearance Section */}
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
                        <Text style={[styles.sectionDescription, { color: colors.subText }]}>
                            Customize how the app looks
                        </Text>

                        <View style={styles.themeSelector}>
                            <Text style={[styles.themeLabel, { color: colors.text }]}>Theme</Text>

                            <TouchableOpacity
                                style={[
                                    styles.themeOption,
                                    theme === 'light' && styles.selectedThemeOption,
                                    theme === 'light' && { borderColor: colors.primary }
                                ]}
                                onPress={() => setTheme('light')}
                            >
                                <Ionicons
                                    name="sunny"
                                    size={22}
                                    color={theme === 'light' ? colors.primary : colors.subText}
                                />
                                <Text style={[
                                    styles.themeText,
                                    { color: theme === 'light' ? colors.primary : colors.subText }
                                ]}>Light</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.themeOption,
                                    theme === 'dark' && styles.selectedThemeOption,
                                    theme === 'dark' && { borderColor: colors.primary }
                                ]}
                                onPress={() => setTheme('dark')}
                            >
                                <Ionicons
                                    name="moon"
                                    size={22}
                                    color={theme === 'dark' ? colors.primary : colors.subText}
                                />
                                <Text style={[
                                    styles.themeText,
                                    { color: theme === 'dark' ? colors.primary : colors.subText }
                                ]}>Dark</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.themeOption,
                                    theme === 'system' && styles.selectedThemeOption,
                                    theme === 'system' && { borderColor: colors.primary }
                                ]}
                                onPress={() => setTheme('system')}
                            >
                                <Ionicons
                                    name="phone-portrait"
                                    size={22}
                                    color={theme === 'system' ? colors.primary : colors.subText}
                                />
                                <Text style={[
                                    styles.themeText,
                                    { color: theme === 'system' ? colors.primary : colors.subText }
                                ]}>System</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bell Schedule Section */}
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bell Schedule</Text>
                        <Text style={[styles.sectionDescription, { color: colors.subText }]}>
                            Select your preferred bell schedule to view
                        </Text>

                        <Dropdown
                            style={[
                                styles.dropdown,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                scheduleFocus && [styles.dropdownFocused, { borderColor: colors.primary }]
                            ]}
                            placeholderStyle={[styles.placeholderStyle, { color: colors.subText }]}
                            selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
                            inputSearchStyle={[styles.inputSearchStyle, {
                                color: colors.text,
                                backgroundColor: colors.card,
                                borderColor: colors.border
                            }]}
                            iconStyle={styles.iconStyle}
                            data={scheduleData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!scheduleFocus ? 'Select schedule' : '...'}
                            searchPlaceholder="Search schedules..."
                            value={scheduleValue}
                            onFocus={() => setScheduleFocus(true)}
                            onBlur={() => setScheduleFocus(false)}
                            onChange={item => {
                                setScheduleValue(item.value);
                                setScheduleFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                    style={styles.icon}
                                    color={scheduleFocus ? colors.primary : colors.subText}
                                    name="clockcircle"
                                    size={20}
                                />
                            )}
                        />
                    </View>

                    {/* Period Alerts Section */}
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Period Alerts</Text>
                            <Switch
                                trackColor={colors.switchTrackColor}
                                thumbColor={alertsEnabled ? colors.switchThumbColor.true : colors.switchThumbColor.false}
                                onValueChange={() => {
                                    if (!alertsEnabled) {
                                        Notifications.requestPermissionsAsync().then(({ status }) => {
                                            setAlertsEnabled(status === 'granted');
                                        });
                                    } else {
                                        setAlertsEnabled(false);
                                    }
                                }}
                                value={alertsEnabled}
                            />
                        </View>

                        <Text style={[styles.sectionDescription, { color: colors.subText }]}>
                            Get notified before your periods start
                        </Text>

                        <View style={[styles.defaultMinutesContainer, { backgroundColor: colors.background }]}>
                            <Text style={[styles.defaultMinutesLabel, { color: colors.text }]}>Default minutes before:</Text>
                            <TextInput
                                style={[styles.minutesInput, {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    color: colors.text
                                }]}
                                keyboardType="numeric"
                                value={defaultMinutes}
                                onChangeText={text => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setDefaultMinutes(numericValue);
                                }}
                                maxLength={3}
                            />
                        </View>

                        {!scheduleValue ? (
                            <Text style={[styles.emptyStateText, { color: colors.subText }]}>
                                Please select a bell schedule above to configure alerts
                            </Text>
                        ) : !alertsEnabled ? (
                            <Text style={[styles.emptyStateText, { color: colors.subText }]}>
                                Enable alerts to get notified before your periods
                            </Text>
                        ) : (
                            <View style={styles.periodList}>
                                {getPeriodsForSelectedSchedule().map((period) => {
                                    const alertSetting = alertSettings.find(s => s.period === period.id);
                                    const isEnabled = alertSetting?.enabled || false;
                                    const minutesBefore = alertSetting?.minutesBefore.toString() || defaultMinutes;

                                    return (
                                        <View key={period.id} style={[
                                            styles.periodItem,
                                            { borderBottomColor: colors.border }
                                        ]}>
                                            <View style={styles.periodInfo}>
                                                <Text style={[styles.periodName, { color: colors.text }]}>
                                                    {period.name}
                                                </Text>
                                                <Text style={[styles.periodTime, { color: colors.subText }]}>
                                                    {period.start} - {period.end}
                                                </Text>
                                            </View>
                                            <View style={styles.alertControls}>
                                                <TextInput
                                                    style={[
                                                        styles.minutesInput,
                                                        !isEnabled && styles.minutesInputDisabled,
                                                        {
                                                            backgroundColor: isEnabled ? colors.card : colors.background,
                                                            borderColor: colors.border,
                                                            color: isEnabled ? colors.text : colors.subText
                                                        }
                                                    ]}
                                                    keyboardType="numeric"
                                                    value={minutesBefore}
                                                    onChangeText={(text) => {
                                                        const numericValue = text.replace(/[^0-9]/g, '');
                                                        updateMinutesForPeriod(period.id, numericValue);
                                                    }}
                                                    editable={isEnabled}
                                                    maxLength={3}
                                                />
                                                <Text style={[
                                                    styles.minutesLabel,
                                                    !isEnabled && styles.minutesLabelDisabled,
                                                    { color: isEnabled ? colors.subText : colors.subText + '80' }
                                                ]}>
                                                    min
                                                </Text>
                                                <Switch
                                                    trackColor={colors.switchTrackColor}
                                                    thumbColor={isEnabled ? colors.switchThumbColor.true : colors.switchThumbColor.false}
                                                    onValueChange={() => toggleAlertForPeriod(period.id)}
                                                    value={isEnabled}
                                                    style={styles.periodSwitch}
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            { backgroundColor: colors.primary },
                            isSaving && [styles.savingButton, { backgroundColor: colors.secondary }]
                        ]}
                        onPress={savePreferences}
                        disabled={isSaving}
                    >
                        <Text style={styles.saveButtonText}>
                            {isSaving ? "Saving..." : "Save Preferences"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        marginBottom: 30,
    },
    section: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 16,
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    dropdownFocused: {
        borderWidth: 2,
    },
    icon: {
        marginRight: 10,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    saveButton: {
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 30,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    savingButton: {
    },
    periodList: {
        marginTop: 15,
    },
    periodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    periodInfo: {
        flex: 1,
    },
    periodName: {
        fontSize: 16,
        fontWeight: '500',
    },
    periodTime: {
        fontSize: 14,
        marginTop: 2,
    },
    alertControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    minutesInput: {
        height: 36,
        width: 44,
        borderWidth: 1,
        borderRadius: 4,
        textAlign: 'center',
        fontSize: 16,
    },
    minutesInputDisabled: {
    },
    minutesLabel: {
        marginLeft: 4,
        marginRight: 10,
        fontSize: 14,
    },
    minutesLabelDisabled: {
    },
    periodSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    emptyStateText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    defaultMinutesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
    },
    defaultMinutesLabel: {
        fontSize: 15,
        marginRight: 10,
    },
    themeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 16,
        flex: 1,
    },
    themeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        flex: 1,
        marginHorizontal: 4,
    },
    selectedThemeOption: {
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
    },
    themeText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default UserSettings;