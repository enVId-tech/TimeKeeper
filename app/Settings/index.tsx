import React from 'react';
import {View, Text, StyleSheet} from "react-native";


const Settings = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#000000',
        },
        subtitle: {
            fontSize: 18,
            color: '#4f4f4f',
        },
    }
)

export default Settings;