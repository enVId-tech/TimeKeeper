import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from '@/app/context/ThemeContext';
import AppNavigator from "@/app/navigation/AppNavigator";

// Separate loading screen component that can access theme context
const LoadingScreen = () => {
    const { colors, currentTheme } = useTheme();
    const logoAnim = useRef(new Animated.Value(50)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(50)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleAnim = useRef(new Animated.Value(50)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const creditsOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in and move up animations for splash screen elements
        Animated.stagger(200, [
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(logoAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(titleAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(creditsOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <StatusBar
                barStyle={currentTheme === 'dark' ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            <Animated.Image
                source={require('../assets/images/OxfordLogo.png')}
                style={[
                    styles.logo,
                    {
                        opacity: logoOpacity,
                        transform: [{ translateY: logoAnim }]
                    }
                ]}
            />

            <Animated.Text
                style={[
                    styles.title,
                    {
                        color: colors.text,
                        opacity: titleOpacity,
                        transform: [{ translateY: titleAnim }]
                    }
                ]}
            >
                Oxford Academy
            </Animated.Text>

            <Animated.Text
                style={[
                    styles.subtitle,
                    {
                        color: colors.subText,
                        opacity: subtitleOpacity,
                        transform: [{ translateY: subtitleAnim }]
                    }
                ]}
            >
                Bell Schedule App
            </Animated.Text>

            <Animated.Text
                style={[
                    styles.credits,
                    { color: colors.subText, opacity: creditsOpacity }
                ]}
            >
                by Erick Tran
            </Animated.Text>
        </View>
    );
};

// Main App component that includes AppNavigator
const MainApp = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // After animations and delay, transition to main app
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 3 seconds for splash screen

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaProvider>
            {/* Import your AppNavigator here with proper routing */}
            <AppNavigator />
        </SafeAreaProvider>
    );
};

// Root component that wraps everything with ThemeProvider
export default function App() {
    return (
        <ThemeProvider>
            <MainApp />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
        textAlign: 'center',
    },
    credits: {
        position: 'absolute',
        bottom: 40,
        fontSize: 14,
    }
});