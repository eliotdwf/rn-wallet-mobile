import {useUser} from "@clerk/clerk-expo";
import {useState} from "react";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {styles} from "@/assets/styles/create.styles";
import {Ionicons} from "@expo/vector-icons";
import {SignOutButton} from "@/components/SignOutButton";
import {COLORS} from "@/constants/colors";
import {useTranslation} from "react-i18next";


const CATEGORIES = [
    {id: "food-drinks", icon: "fast-food"},
    {id: "shopping", icon: "cart"},
    {id: "transportation", icon: "car"},
    {id: "entertainment", icon: "film"},
    {id: "bills", icon: "receipt"},
    {id: "income", icon: "cash"},
    {id: "other", icon: "ellipsis-horizontal"},
];

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/transactions`;


const CreateScreen = () => {
    const {user} = useUser()

    const {t} = useTranslation();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isExpense, setIsExpense] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const showAlertError = (message: string) => {
        Alert.alert(t('error'), message);
    }

    const handleCreate = async () => {
        // validations
        if (!title.trim()) return showAlertError(t('errors.create.title-missing'));
        if (title.trim().length > 255) return showAlertError(t('errors.create.title-too-long'));
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return showAlertError(t('errors.create.amount-invalid'));
        }
        if (parseFloat(amount) > 1000000) {
            return showAlertError(t('errors.create.amount-above-1000000'));
        }

        if (!selectedCategory) return showAlertError(t('errors.create.category-missing'));

        setIsLoading(true);
        try {

            const formattedAmount = isExpense ?
                -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

            const endpoint = `${API_URL}/`
            const body = {
                user_id: user?.id,
                title: title.trim(),
                amount: formattedAmount,
                category: selectedCategory,
            }
            console.log(body);
            const response = await fetch(endpoint,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('errors.create.generic'));
            }

            Alert.alert(t('create.creation-successful'));
            router.back();

        } catch (e) {
            showAlertError(t('errors.create.generic'));
            console.error("Error creating transaction:", e);
        } finally {
            setIsLoading(false);
        }
    }

    // @ts-ignore
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name={"arrow-back"} size={24} color={COLORS.text}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={2}>{t('create.title')}</Text>
                <TouchableOpacity
                    style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                    onPress={handleCreate}
                    disabled={isLoading}
                >
                    {isLoading ?
                        <ActivityIndicator size={'small'} color={COLORS.primary}/>
                        : <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                            <Text style={styles.saveButton}>
                                {t('create.save-button')}
                            </Text>
                            <Ionicons name={'checkmark'} size={18} color={COLORS.primary} />
                        </View>
                    }
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.typeSelector}>
                    {/* EXPENSE SELECTOR */}
                    <TouchableOpacity
                        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(true)}
                    >
                        <Ionicons
                            name="arrow-down-circle"
                            size={22}
                            color={isExpense ? COLORS.white : COLORS.expense}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
                            {t('create.expense')}
                        </Text>
                    </TouchableOpacity>

                    {/* INCOME SELECTOR */}
                    <TouchableOpacity
                        style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(false)}
                    >
                        <Ionicons
                            name="arrow-up-circle"
                            size={22}
                            color={!isExpense ? COLORS.white : COLORS.income}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
                            {t('create.income')}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* AMOUNT CONTAINER */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* INPUT CONTAINER */}
                <View style={styles.inputContainer}>
                    <Ionicons
                        name="create-outline"
                        size={22}
                        color={COLORS.textLight}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('create.transaction-title-input-placeholder')}
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* TITLE */}
                <Text style={styles.sectionTitle}>
                    <Ionicons name="pricetag-outline" size={16} color={COLORS.text}/> {t('create.category-title')}
                </Text>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category.id && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Ionicons
                                // @ts-ignore
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.id ? COLORS.white : COLORS.text}
                                style={styles.categoryIcon}
                            />
                            <Text
                                style={[
                                    styles.categoryButtonText,
                                    selectedCategory === category.id && styles.categoryButtonTextActive,
                                ]}
                            >
                                {/* @ts-ignore */}
                                {t(`categories.${category.id}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default CreateScreen;