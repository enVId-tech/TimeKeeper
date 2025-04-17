import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';
import AppNavigator from '@/app/navigation/AppNavigator';
import { SafeAreaProvider } from "react-native-safe-area-context";
import {Link} from "expo-router";
import {Button} from "@react-navigation/elements";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
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
                Animated.timing(logoAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(titleAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(subtitleAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(creditsOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();

        // After animations and delay, transition to main app
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
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
                            opacity: titleOpacity,
                            transform: [{ translateY: titleAnim }]
                        }
                    ]}
                >
                    Bell Schedule
                </Animated.Text>
                <Animated.Text
                    style={[
                        styles.subtitle,
                        {
                            opacity: subtitleOpacity,
                            transform: [{ translateY: subtitleAnim }]
                        }
                    ]}
                >
                    Oxford Academy
                </Animated.Text>

                <Animated.Text
                    style={[
                        styles.credits,
                        { opacity: creditsOpacity }
                    ]}
                >
                    Copyright © {new Date().getFullYear()} <Link style={styles.myname} href={'https://github.com/enVId-tech'} target={"_blank"}>Erick Tran</Link>. All rights reserved.
                </Animated.Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <AnimatedAppNavigator />
        </SafeAreaProvider>
    );
}

// Wrap the AppNavigator component with animations
const AnimatedAppNavigator = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <AppNavigator />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 32,
        color: '#000000',
    },
    credits: {
        fontSize: 18,
        color: '#4f4f4f',
        marginTop: 16,
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
    },
    myname: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    }
});