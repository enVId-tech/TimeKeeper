import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auhsdCalendar from "../misc/calendar";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

// Define proper types for calendar events
interface CalendarEvent {
    date: string;
    name: string;
    description?: string;
}

// Type-cast auhsdCalendar
const typedCalendar: CalendarEvent[] = auhsdCalendar;

const Calendar = () => {
    const { colors, currentTheme } = useTheme();
    const [currentView, setCurrentView] = useState("list"); // "list" or "calendar"
    const [showPastEvents, setShowPastEvents] = useState(false);
    const [monthsAhead, setMonthsAhead] = useState(0);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get upcoming events for next 180 days
    const upcomingEvents = typedCalendar
        .filter((event: CalendarEvent) => {
            const eventDate = new Date(event.date);
            const timeDiff = eventDate.getTime() - currentDate.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            return dayDiff >= 0 && dayDiff <= 180;
        })
        .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get past events (last 180 days)
    const pastEvents = typedCalendar
        .filter((event: CalendarEvent) => {
            const eventDate = new Date(event.date);
            const timeDiff = currentDate.getTime() - eventDate.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            return dayDiff > 0 && dayDiff <= 180;
        })
        .sort((a: CalendarEvent, b: CalendarEvent) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Generate calendar month view
    const generateCalendarMonth = () => {
        const month = currentDate.getMonth() + monthsAhead % 12;
        const year = currentDate.getFullYear() + Math.floor(monthsAhead / 12);

        // Get first day of month
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Calculate starting day of week (0 = Sunday)
        const startingDayOfWeek = firstDayOfMonth.getDay();

        // Generate calendar days array
        const calendarDays = [];

        // Add empty slots for days before the 1st of month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push({ day: '', empty: true });
        }

        // Add actual days with events
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = typedCalendar.filter((event: CalendarEvent) => event.date === dateStr);
            calendarDays.push({
                day,
                events,
                isToday: day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()
            });
        }

        return calendarDays;
    };

    const renderEventItem = ({ item }: { item: CalendarEvent }) => {
        const eventDate = new Date(item.date);
        const formattedEventDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        return (
            <View style={[styles.eventItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.eventDateContainer}>
                    <Text style={[styles.eventMonth, { color: colors.primary }]}>
                        {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </Text>
                    <Text style={[styles.eventDay, { color: colors.text }]}>
                        {eventDate.getDate()}
                    </Text>
                    <Text style={[styles.eventWeekday, { color: colors.subText }]}>
                        {eventDate.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                </View>
                <View style={styles.eventDetails}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{item.name}</Text>
                    {item.description && (
                        <Text style={[styles.eventDescription, { color: colors.subText }]}>
                            {item.description}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const calendarDays = generateCalendarMonth();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={currentTheme === 'dark' ? "light-content" : "dark-content"} />

            <View style={styles.header}>
                <Text style={[styles.headerText, { color: colors.text }]}>Today</Text>
                <Text style={[styles.dateText, { color: colors.subText }]}>{formattedDate}</Text>
            </View>

            <View style={[styles.viewSelector, { backgroundColor: colors.accent + '33' }]}>
                <TouchableOpacity
                    style={[
                        styles.viewOption,
                        currentView === "list" && [styles.activeViewOption, { backgroundColor: colors.primary }]
                    ]}
                    onPress={() => setCurrentView("list")}
                >
                    <Ionicons
                        name="list"
                        size={18}
                        color={currentView === "list" ? "#fff" : colors.text}
                    />
                    <Text
                        style={[
                            styles.viewOptionText,
                            { color: currentView === "list" ? "#fff" : colors.text }
                        ]}
                    >
                        List
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.viewOption,
                        currentView === "calendar" && [styles.activeViewOption, { backgroundColor: colors.primary }]
                    ]}
                    onPress={() => setCurrentView("calendar")}
                >
                    <Ionicons
                        name="calendar"
                        size={18}
                        color={currentView === "calendar" ? "#fff" : colors.text}
                    />
                    <Text
                        style={[
                            styles.viewOptionText,
                            { color: currentView === "calendar" ? "#fff" : colors.text }
                        ]}
                    >
                        Calendar
                    </Text>
                </TouchableOpacity>
            </View>

            {currentView === "list" ? (
                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {showPastEvents ? "Past Events" : "Upcoming Events"}
                        </Text>
                        <TouchableOpacity onPress={() => setShowPastEvents(!showPastEvents)}>
                            <Text style={[styles.toggleText, { color: colors.primary }]}>
                                Show {showPastEvents ? "upcoming" : "past"} events
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={showPastEvents ? pastEvents : upcomingEvents}
                        renderItem={renderEventItem}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.eventsList}
                    />
                </View>
            ) : (
                <View style={styles.calendarContainer}>
                    <View style={styles.monthNavigation}>
                        <TouchableOpacity
                            style={[styles.monthNavButton, { backgroundColor: colors.card }]}
                            onPress={() => setMonthsAhead(monthsAhead - 1)}
                        >
                            <Text style={[styles.monthNavButtonText, { color: colors.primary }]}>←</Text>
                        </TouchableOpacity>

                        <Text style={[styles.monthTitle, { color: colors.text }]}>
                            {new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsAhead).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </Text>

                        <TouchableOpacity
                            style={[styles.monthNavButton, { backgroundColor: colors.card }]}
                            onPress={() => setMonthsAhead(monthsAhead + 1)}
                        >
                            <Text style={[styles.monthNavButtonText, { color: colors.primary }]}>→</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekdayHeader}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <Text key={day} style={[styles.weekdayText, { color: colors.subText }]}>{day}</Text>
                        ))}
                    </View>

                    <ScrollView style={styles.calendarGrid}>
                        <View style={styles.daysGrid}>
                            {calendarDays.map((dayObj, index) => (
                                <View
                                    key={`day-${index}`}
                                    style={[
                                        styles.calendarDay,
                                        { borderColor: colors.border },
                                        dayObj.empty && [styles.emptyDay, { backgroundColor: colors.card }],
                                        dayObj.isToday && [styles.todayBox, { backgroundColor: colors.primary + '20' }]
                                    ]}
                                >
                                    <Text style={[
                                        styles.calendarDayText,
                                        { color: colors.text },
                                        dayObj.isToday && [styles.todayDayText, { color: colors.primary }]
                                    ]}>
                                        {dayObj.day}
                                    </Text>
                                    {!dayObj.empty && dayObj.events && dayObj.events.length > 0 && (
                                        <View style={[styles.eventDot, { backgroundColor: colors.primary }]}>
                                            <Text style={styles.eventCount}>{dayObj.events.length}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        <View style={[styles.calendarLegend, { backgroundColor: colors.card }]}>
                            <Text style={[styles.legendTitle, { color: colors.text }]}>Event Types:</Text>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#ffcccc'}]} />
                                <Text style={[styles.legendText, { color: colors.text }]}>No School</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#ccffcc'}]} />
                                <Text style={[styles.legendText, { color: colors.text }]}>Quarter End</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#ffddbb'}]} />
                                <Text style={[styles.legendText, { color: colors.text }]}>US Holiday</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#cce5ff'}]} />
                                <Text style={[styles.legendText, { color: colors.text }]}>School Event</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    headerText: {
        fontSize: 28,
        fontWeight: '700',
    },
    dateText: {
        fontSize: 16,
    },
    viewSelector: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        padding: 4,
    },
    viewOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    activeViewOption: {
        // backgroundColor is applied dynamically
    },
    viewOptionText: {
        marginLeft: 6,
        fontWeight: '500',
    },
    listContainer: {
        flex: 1,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    toggleText: {
        fontSize: 14,
    },
    eventsList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    eventItem: {
        flexDirection: 'row',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    eventDateContainer: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    eventMonth: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    eventDay: {
        fontSize: 20,
        fontWeight: '700',
    },
    eventWeekday: {
        fontSize: 12,
    },
    eventDetails: {
        flex: 1,
        padding: 12,
        paddingLeft: 0,
        marginLeft: 8,
        justifyContent: 'center',
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    eventDescription: {
        fontSize: 14,
        marginTop: 4,
    },
    calendarContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    weekdayHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekdayText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
    },
    calendarGrid: {
        flex: 1,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: '14.28%',
        aspectRatio: 1,
        padding: 4,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    emptyDay: {
        // backgroundColor is applied dynamically
    },
    calendarDayText: {
        fontSize: 16,
    },
    todayBox: {
        // backgroundColor is applied dynamically
    },
    todayDayText: {
        fontWeight: 'bold',
    },
    eventDot: {
        position: 'absolute',
        bottom: 5,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventCount: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    calendarLegend: {
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
    },
    monthNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    monthNavButton: {
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    monthNavButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Calendar;