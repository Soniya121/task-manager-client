import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from '../Utils/axios';

export default function Task({ onSubmit, initialTask = {} }) {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);

    useFocusEffect(useCallback(() => {
        fetchData()
    }, [refetch]))

    const fetchData = async () => {
        try {
            const { data, status } = await axios.get("/tasks")

            if (status === 201) {
                setData(data)
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: 20, flex: 1, position: "relative" }}>
                {/* <ScrollView style={styles.container}> */}
                <FlatList
                    data={data}
                    keyExtractor={(Item) => `${Item._id}`}
                    renderItem={({ item }) => <Item item={item} setRefetch={setRefetch} refetch={refetch} />}
                    style={{ marginTop: 50 }}
                />
                {/* </ScrollView> */}
                <TouchableOpacity onPress={() => navigation.navigate("addTask")} style={{ position: "absolute", bottom: 30, right: 30, width: 60, height: 60, backgroundColor: "pink", borderRadius: 40, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ textAlign: "center", color: "#fff" }}>Add</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const Item = ({ item, setRefetch, refetch }) => {
    const priorityColor = {
        Low: '#4CAF50',
        Medium: '#FFC107',
        High: '#F44336',
    }[item.priority];

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id) => {
        try {
            setIsDeleting(true)
            const { data, status } = await axios.delete(`/tasks/${id}`);

            if (status === 201) {
                setIsDeleting(false);
                setRefetch(!refetch);
                Alert.alert("Task deleted successfully")
            }

        } catch (err) {
            Alert.alert(err.response.data.error || "Something went wrong")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <TouchableOpacity style={stylesCard.card}>
            <View style={stylesCard.header}>
                <Text style={stylesCard.title} numberOfLines={1}>{item?.title}</Text>
                <TouchableOpacity onPress={() => handleDelete(item._id)} disabled={isDeleting} style={[stylesCard.statusBadge, { backgroundColor: "red" }]}>
                    <Text style={stylesCard.statusText}>
                        {
                            isDeleting ? "Deleting..." : "Delete"
                        }
                    </Text>
                </TouchableOpacity>
            </View>
            {item.description && (
                <Text style={stylesCard.description} numberOfLines={2}>{item?.description}</Text>
            )}
            <View style={stylesCard.footer}>
                <Text style={stylesCard.date}>Due: {new Date(item?.expiry).toLocaleDateString()}</Text>
                <View style={[stylesCard.priorityBadge, { backgroundColor: priorityColor }]}>
                    <Text style={stylesCard.priorityText}>{item?.priority}</Text>
                </View>
                <View style={[stylesCard.statusBadge, { backgroundColor: item.status === 'Pending' ? '#2196F3' : '#757575' }]}>
                    <Text style={stylesCard.statusText}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const stylesCard = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    priorityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

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
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});