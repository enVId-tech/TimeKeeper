import React from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {Button, View, Text} from "react-native";

const MainScreen = () => {
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <Stack.Screen options={{ title: 'Main' }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Main Screen</Text>
                <Button
                    title="Go to Details"
                />
            </View>
        </SafeAreaProvider>
    )
}

export default MainScreen;