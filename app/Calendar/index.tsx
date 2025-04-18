import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auhsdCalendar from "../misc/calendar";
import {Button} from "@react-navigation/elements";

const Calendar = () => {
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
    const upcomingEvents = auhsdCalendar
        .filter((event: { date: string | number | Date; }) => {
            const eventDate = new Date(event.date);
            const timeDiff = eventDate.getTime() - currentDate.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            return dayDiff >= 0 && dayDiff <= 180;
        })
        .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get past events (last 180 days)
    const pastEvents = auhsdCalendar
        .filter((event: { date: string | number | Date; }) => {
            const eventDate = new Date(event.date);
            const timeDiff = currentDate.getTime() - eventDate.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            return dayDiff > 0 && dayDiff <= 180;
        })
        .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Reverse chronological

    // Generate calendar month view
    const generateCalendarMonth = () => {
        const month = currentDate.getMonth() + monthsAhead % 12; // Adjust for months ahead
        const year = currentDate.getFullYear() + Math.floor(monthsAhead / 12); // Adjust for year if month exceeds 12

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
            const events = auhsdCalendar.filter((event: { date: string; }) => event.date === dateStr);
            calendarDays.push({
                day,
                events,
                isToday: day === currentDate.getDate() && month === currentDate.getMonth()
            });
        }

        return calendarDays;
    };

    const renderEventItem = ({ item }: any) => {
        const eventDate = new Date(item.date);
        const formattedEventDate = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        });

        let bgColor;
        switch(item.type) {
            case 'NO_SCHOOL': bgColor = '#ffcccc'; break;
            case 'QUARTER_END': bgColor = '#ccffcc'; break;
            case 'US_HOLIDAY': bgColor = '#ffddbb'; break;
            case 'SCHOOL_EVENT': bgColor = '#cce5ff'; break;
            default: bgColor = '#ffffff';
        }

        return (
            <View style={[styles.eventItem, { backgroundColor: bgColor }]}>
                <Text style={styles.eventDate}>{formattedEventDate}</Text>
                <Text style={styles.eventName}>{item.name}</Text>
                <Text style={styles.eventType}>{item.type}</Text>
            </View>
        );
    };

    const calendarDays = generateCalendarMonth();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerDate}>{formattedDate}</Text>

            <View style={styles.viewSelector}>
                <TouchableOpacity
                    style={[styles.selectorButton, currentView === "list" && styles.activeSelector]}
                    onPress={() => setCurrentView("list")}>
                    <Text style={[styles.selectorText, currentView === "list" && styles.activeSelectorText]}>
                        Events List
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.selectorButton, currentView === "calendar" && styles.activeSelector]}
                    onPress={() => setCurrentView("calendar")}>
                    <Text style={[styles.selectorText, currentView === "calendar" && styles.activeSelectorText]}>
                        Calendar View
                    </Text>
                </TouchableOpacity>
            </View>

            {currentView === "list" ? (
                <ScrollView style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>Upcoming Events (in the next 6 months)</Text>
                    {upcomingEvents.length === 0 ? (
                        <Text style={styles.noEvents}>No upcoming events in the next 6 months</Text>
                    ) : (
                        <FlatList
                            scrollEnabled={false}
                            data={upcomingEvents}
                            renderItem={renderEventItem}
                            keyExtractor={(item, index) => `upcoming-${item.date}-${index}`}
                            contentContainerStyle={styles.eventsList}
                        />
                    )}

                    {/* Past Events Collapsible Section */}
                    <TouchableOpacity
                        style={styles.pastEventsHeader}
                        onPress={() => setShowPastEvents(!showPastEvents)}
                    >
                        <Text style={styles.pastEventsTitle}>Past Events (Last 6 Months)</Text>
                        <Text style={styles.expandCollapseIcon}>{showPastEvents ? '▼' : '►'}</Text>
                    </TouchableOpacity>

                    {showPastEvents && (
                        pastEvents.length === 0 ? (
                            <Text style={styles.noEvents}>No past events in the last 6 months</Text>
                        ) : (
                            <FlatList
                                scrollEnabled={false}
                                data={pastEvents}
                                renderItem={renderEventItem}
                                keyExtractor={(item, index) => `past-${item.date}-${index}`}
                                contentContainerStyle={styles.eventsList}
                            />
                        )
                    )}
                </ScrollView>
            ) : (
                <View style={styles.calendarContainer}>
                        <View style={styles.monthNavigation}>
                            <TouchableOpacity
                                style={styles.monthNavButton}
                                onPress={() => setMonthsAhead(monthsAhead - 1)}
                            >
                                <Text style={styles.monthNavButtonText}>←</Text>
                            </TouchableOpacity>

                            <Text style={styles.monthTitle}>
                                {new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsAhead).toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </Text>

                            <TouchableOpacity
                                style={styles.monthNavButton}
                                onPress={() => setMonthsAhead(monthsAhead + 1)}
                            >
                                <Text style={styles.monthNavButtonText}>→</Text>
                            </TouchableOpacity>
                    </View>

                    <View style={styles.weekdayHeader}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <Text key={day} style={styles.weekdayText}>{day}</Text>
                        ))}
                    </View>

                    <ScrollView style={styles.calendarGrid}>
                        <View style={styles.daysGrid}>
                            {calendarDays.map((dayObj, index) => (
                                <View
                                    key={`day-${index}`}
                                    style={[
                                        styles.calendarDay,
                                        dayObj.empty && styles.emptyDay,
                                        dayObj.isToday && styles.todayBox
                                    ]}
                                >
                                    <Text style={[
                                        styles.calendarDayText,
                                        dayObj.isToday && styles.todayText
                                    ]}>
                                        {dayObj.day}
                                    </Text>
                                    {!dayObj.empty && dayObj.events && dayObj.events.length > 0 && (
                                        <View style={styles.eventDot}>
                                            <Text style={styles.eventCount}>{dayObj.events.length}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        <View style={styles.calendarLegend}>
                            <Text style={styles.legendTitle}>Event Types:</Text>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#ffcccc'}]} />
                                <Text style={styles.legendText}>No School</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#ccffcc'}]} />
                                <Text style={styles.legendText}>Quarter End</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#ffddbb'}]} />
                                <Text style={styles.legendText}>US Holiday</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#cce5ff'}]} />
                                <Text style={styles.legendText}>School Event</Text>
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
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    headerDate: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    viewSelector: {
        flexDirection: 'row',
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        marginBottom: 20,
        padding: 4,
    },
    selectorButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeSelector: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    selectorText: {
        fontWeight: '500',
        color: '#6c757d',
    },
    activeSelectorText: {
        color: '#007bff',
    },
    listContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#212529',
    },
    eventsList: {
        paddingBottom: 12,
    },
    eventItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    eventDate: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 4,
    },
    eventName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    eventType: {
        fontSize: 14,
        color: '#6c757d',
        fontStyle: 'italic',
    },
    noEvents: {
        textAlign: 'center',
        color: '#6c757d',
        marginTop: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    pastEventsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        marginBottom: 12,
    },
    pastEventsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
    },
    expandCollapseIcon: {
        fontSize: 14,
        color: '#495057',
    },
    calendarContainer: {
        flex: 1,
    },
    monthTitle: {
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#6c757d',
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
        borderColor: '#dee2e6',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    emptyDay: {
        backgroundColor: '#f8f9fa',
    },
    calendarDayText: {
        fontSize: 16,
        color: '#212529',
    },
    todayBox: {
        backgroundColor: '#e6f2ff',
    },
    todayText: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    eventDot: {
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#dc3545',
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
        backgroundColor: '#fff',
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
        color: '#212529',
    },
    monthNavigation: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    monthNavButton: {
        backgroundColor: '#f0f0f0',
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
        color: '#3498db',
    },
});

export default Calendar;