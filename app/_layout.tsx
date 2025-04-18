import React from 'react';
import {Stack, Tabs} from 'expo-router';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/app/context/ThemeContext';
import {Platform} from "react-native";
import {Colors} from "@/constants/Colors";
import {HapticTab} from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

// Other imports you might have...

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    );
}

function RootLayoutNav() {
    const { currentTheme, colors } = useTheme();
    const hideTabBar = true;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: {
                    ...Platform.select({
                        ios: {
                            position: 'absolute',
                        },
                        default: {},
                    }),
                    display: hideTabBar ? 'none' : 'flex',

                }
            }}>
            <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        color: colors.text,
                    },
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
            </Stack>
        </Tabs>
    );
}