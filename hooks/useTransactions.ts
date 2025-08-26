import {useCallback, useState} from "react";
import {Alert} from "react-native";

export interface TransactionsSummary {
    balance: string;
    income: string;
    expenses: string;
}

export interface Transaction {
    id: number
    user_id: string;
    amount: string;
    title: string,
    category: string;
    created_at: string
}

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/transactions`;

export const useTransactions = (userId: string) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionsSummary>({
        balance: '0',
        income: '0',
        expenses: '0'
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // use useCallback to memoize the function (performance optimization)
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/${userId}`)

            if(!response.ok) {
                throw new Error(`Failed to fetch transactions for user ${userId}`);
            }

            const data = await response.json();
            setTransactions(data);
        } catch (e) {
            console.error("Error fetching transactions:", e);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/summary/${userId}`)
            if(!response.ok) {
                throw new Error(`Failed to fetch summary for user ${userId}`);
            }
            const data = await response.json();
            setSummary(data);
        } catch (e) {
            console.error("Error fetching summary:", e);
        }
    }, [userId])

    const loadData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (e) {
            console.error("Error loading data:", e);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async (transactionId: number) => {
        try {
            const endpoint = `${API_URL}/${transactionId}`;
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });
            if(!response.ok) {
                throw new Error(`Failed to delete transaction ${transactionId}`);
            }
            // Refresh data after deletion
            await loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (e) {
            console.error("Error deleting transaction:", e);
            Alert.alert("Error", (e as any).message ?? "Failed to delete transaction");
        }
    }

    return { transactions, summary, isLoading, loadData, deleteTransaction}

}