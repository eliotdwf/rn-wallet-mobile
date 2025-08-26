import {useUser} from '@clerk/clerk-expo'
import {router} from 'expo-router'
import {Alert, FlatList, RefreshControl, Text, TouchableOpacity, View} from 'react-native'
import {SignOutButton} from "@/components/SignOutButton";
import {useTransactions} from "@/hooks/useTransactions";
import {useEffect, useState} from "react";
import Loader from "@/components/Loader";
import {styles} from "@/assets/styles/home.styles";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import BalanceCard from "@/components/BalanceCard";
import {TransactionItem} from "@/components/TransactionItem";
import NoTransactionsFound from "@/components/NoTransactionsFound";

export default function Page() {
    const { user } = useUser()
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }

    const {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction
    } = useTransactions(user?.id || "");

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = (id: number) => {
        Alert.alert("Delete", "Are you sure you want to delete the transaction ?", [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", style: "destructive",onPress: () => deleteTransaction(id)}
        ])
    };

    if(isLoading && !refreshing) {
        return <Loader />
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.headerLogo}
                            contentFit={"contain"}
                        />
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Welcome,</Text>
                            <Text style={styles.usernameText}>
                                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/create')}
                        >
                            <Ionicons name={"add"} size={20} color={"#fff"} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>
                <BalanceCard summary={summary} />
                <View style={styles.transactionsHeaderContainer}>
                    <Text style={styles.sectionTitle}>Recent transactions</Text>
                </View>
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                style={styles.transactionsList}
                contentContainerStyle={styles.transactionsListContent}
                data={transactions}
                renderItem={(item) => (
                    <TransactionItem {...item} onDelete={handleDelete} />
                )}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<NoTransactionsFound />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}