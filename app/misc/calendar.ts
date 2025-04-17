export interface CalendarEvent {
    date: string;       // Format: YYYY-MM-DD
    name: string;       // Event name
    type: EventType;    // Type of event
}

enum EventType {
    SCHOOL_EVENT = "SCHOOL_EVENT",
    HOLIDAY = "HOLIDAY",
    NO_SCHOOL = "NO_SCHOOL",
    TEACHER_DAY = "TEACHER_DAY",
    STAFF_DEVELOPMENT = "STAFF_DEVELOPMENT",
    QUARTER_END = "QUARTER_END",
    MINIMUM_DAY = "MINIMUM_DAY",
    US_HOLIDAY = "US_HOLIDAY"
}

const auhsdCalendar: CalendarEvent[] = [
    // July 2024
    { date: "2024-07-04", name: "Independence Day", type: EventType.US_HOLIDAY },

    // August 2024
    { date: "2024-08-05", name: "Staff Development Day", type: EventType.STAFF_DEVELOPMENT },
    { date: "2024-08-06", name: "Teacher Day", type: EventType.TEACHER_DAY },
    { date: "2024-08-07", name: "School Begins", type: EventType.SCHOOL_EVENT },

    // September 2024
    { date: "2024-09-02", name: "Labor Day", type: EventType.NO_SCHOOL },
    { date: "2024-09-13", name: "Progress Reports Due", type: EventType.SCHOOL_EVENT },

    // October 2024
    { date: "2024-10-04", name: "End of Quarter 1", type: EventType.QUARTER_END },
    { date: "2024-10-07", name: "Staff Development Day", type: EventType.STAFF_DEVELOPMENT },
    { date: "2024-10-11", name: "Grades Due", type: EventType.SCHOOL_EVENT },
    { date: "2024-10-14", name: "Columbus Day/Indigenous Peoples' Day", type: EventType.US_HOLIDAY },

    // November 2024
    { date: "2024-11-08", name: "Progress Reports Due", type: EventType.SCHOOL_EVENT },
    { date: "2024-11-11", name: "Veterans Day", type: EventType.NO_SCHOOL },
    { date: "2024-11-25", name: "Thanksgiving Break", type: EventType.NO_SCHOOL },
    { date: "2024-11-26", name: "Thanksgiving Break", type: EventType.NO_SCHOOL },
    { date: "2024-11-27", name: "Thanksgiving Break", type: EventType.NO_SCHOOL },
    { date: "2024-11-28", name: "Thanksgiving Day", type: EventType.NO_SCHOOL },
    { date: "2024-11-29", name: "Thanksgiving Break", type: EventType.NO_SCHOOL },

    // December 2024
    { date: "2024-12-19", name: "End of Quarter 2", type: EventType.QUARTER_END },
    { date: "2024-12-20", name: "Winter Break Begins", type: EventType.NO_SCHOOL },
    { date: "2024-12-23", name: "Winter Break", type: EventType.NO_SCHOOL },
    { date: "2024-12-24", name: "Christmas Eve", type: EventType.NO_SCHOOL },
    { date: "2024-12-25", name: "Christmas Day", type: EventType.NO_SCHOOL },
    { date: "2024-12-26", name: "Winter Break", type: EventType.NO_SCHOOL },
    { date: "2024-12-27", name: "Winter Break", type: EventType.NO_SCHOOL },
    { date: "2024-12-30", name: "Winter Break", type: EventType.NO_SCHOOL },
    { date: "2024-12-31", name: "New Year's Eve", type: EventType.NO_SCHOOL },

    // January 2025
    { date: "2025-01-01", name: "New Year's Day", type: EventType.NO_SCHOOL },
    { date: "2025-01-02", name: "Winter Break", type: EventType.NO_SCHOOL },
    { date: "2025-01-03", name: "Winter Break", type: EventType.NO_SCHOOL },
    { date: "2025-01-10", name: "Grades Due", type: EventType.SCHOOL_EVENT },
    { date: "2025-01-20", name: "Martin Luther King Jr. Day", type: EventType.NO_SCHOOL },

    // February 2025
    { date: "2025-02-07", name: "Progress Reports Due", type: EventType.SCHOOL_EVENT },
    { date: "2025-02-10", name: "Lincoln's Birthday", type: EventType.NO_SCHOOL },
    { date: "2025-02-14", name: "Valentine's Day", type: EventType.US_HOLIDAY },
    { date: "2025-02-17", name: "Presidents' Day", type: EventType.NO_SCHOOL },

    // March 2025
    { date: "2025-03-14", name: "End of Quarter 3", type: EventType.QUARTER_END },
    { date: "2025-03-17", name: "Start of Quarter 4", type: EventType.SCHOOL_EVENT },
    { date: "2025-03-21", name: "Grades Due", type: EventType.SCHOOL_EVENT },
    { date: "2025-03-24", name: "Spring Break", type: EventType.NO_SCHOOL },
    { date: "2025-03-25", name: "Spring Break", type: EventType.NO_SCHOOL },
    { date: "2025-03-26", name: "Spring Break", type: EventType.NO_SCHOOL },
    { date: "2025-03-27", name: "Spring Break", type: EventType.NO_SCHOOL },
    { date: "2025-03-28", name: "Spring Break", type: EventType.NO_SCHOOL },
    { date: "2025-03-31", name: "Cesar Chavez Day", type: EventType.US_HOLIDAY },

    // April 2025
    { date: "2025-04-18", name: "Progress Reports Due", type: EventType.SCHOOL_EVENT },

    // May 2025
    { date: "2025-05-22", name: "End of Quarter 4", type: EventType.QUARTER_END },
    { date: "2025-05-23", name: "Last Day of School", type: EventType.SCHOOL_EVENT },
    { date: "2025-05-23", name: "Grades Due", type: EventType.SCHOOL_EVENT },
    { date: "2025-05-26", name: "Memorial Day", type: EventType.NO_SCHOOL },
    { date: "2025-05-27", name: "Underlined Day", type: EventType.SCHOOL_EVENT },
    { date: "2025-05-28", name: "Underlined Day", type: EventType.SCHOOL_EVENT },
    { date: "2025-05-29", name: "Underlined Day", type: EventType.SCHOOL_EVENT },
    { date: "2025-05-30", name: "Underlined Day", type: EventType.SCHOOL_EVENT },

    // June 2025
    { date: "2025-06-02", name: "Underlined Day", type: EventType.SCHOOL_EVENT },
    { date: "2025-06-19", name: "Juneteenth", type: EventType.US_HOLIDAY }
];

export default auhsdCalendar;