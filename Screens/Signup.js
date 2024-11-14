import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import axios from '../Utils/axios';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        // Here you would typically call an authentication service
        // For this example, we'll just show an alert
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return Alert.alert("Invalid email")
        }

        if (!email || !password) {
            return Alert.alert('All fields are required');
        }

        try {
            const { status, data } = await axios.post("/auth/register", {
                email,
                password
            })

            if (status === 201) {
                Alert.alert("Registration successfully")
                navigation.navigate("login")
            }
        } catch (err) {
            console.log(err.response.data)
            return Alert.alert(err.response.data.error || "Something went wrong")
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Signup</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Signup" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
                <Text style={{ textAlign: "center", marginTop: 10 }}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
});