import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from '../Utils/axios';

export default function AddTask({ initialTask = {} }) {
    const [title, setTitle] = useState(initialTask.title || '');
    const [description, setDescription] = useState(initialTask.description || '');
    const [priority, setPriority] = useState(initialTask.priority || 'Low');
    const [expiry, setExpiry] = useState(initialTask.expiry ? new Date(initialTask.expiry) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation()

    const handleSubmit = async () => {

        if (!title || !expiry) {
            return Alert.alert("All fields are required")
        }

        try {
            const { data, status } = await axios.post("/tasks/", {
                title,
                description,
                priority,
                expiry,
                status: 'Pending',
            })

            if (status === 201) {
                Alert.alert("Task added Successfully")
                navigation.goBack();
            }

        } catch (err) {
            Alert.alert(err.response.data.error || "Something went wrong")
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || expiry;
        setShowDatePicker(false);
        setExpiry(currentDate);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: 20, flex: 1 }}>
                <ScrollView style={styles.container}>
                    <Text style={styles.label}>Task form</Text>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter task title"
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter task description"
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Priority</Text>
                    <View style={styles.priorityContainer}>
                        {['Low', 'Medium', 'High'].map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.priorityButton,
                                    priority === p && styles.selectedPriority,
                                ]}
                                onPress={() => setPriority(p)}
                            >
                                <Text style={[
                                    styles.priorityText,
                                    priority === p && styles.selectedPriorityText,
                                ]}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Expiry Date</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                        <Text>{expiry.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={expiry}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton2} onPress={() => navigation.goBack()}>
                        <Text style={{ ...styles.submitButtonText, color: "#007AFF" }}>Back</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priorityButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    selectedPriority: {
        backgroundColor: '#007AFF',
    },
    priorityText: {
        color: '#007AFF',
    },
    selectedPriorityText: {
        color: 'white',
    },
    dateButton: {
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButton2: {
        borderColor: '#007AFF',
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});