import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {styles} from "@/assets/styles/home.styles";
import {COLORS} from "@/constants/colors";
import {Transaction} from "@/hooks/useTransactions";
import {formatDate} from "@/lib/utils";
import {useTranslation} from "react-i18next";

// Map categories to their respective icons
const CATEGORY_ICONS: any = {
    "food-drinks": "fast-food",
    shopping: "cart",
    transportation: "car",
    entertainment: "film",
    bills: "receipt",
    income: "cash",
    other: "ellipsis-horizontal",
};

interface TransactionItemProps {
    item: Transaction,
    onDelete: (id: number) => void;
}

export const TransactionItem = ({ item, onDelete }: TransactionItemProps) => {
    const {t} = useTranslation();
    const isIncome = parseFloat(item.amount) > 0;
    const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

    return (
        <View style={styles.transactionCard} key={item.id}>
            <View style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionCategory}>
                        {/* @ts-ignore */}
                        {t(`categories.${item.category}`)}
                    </Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text
                        style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}
                    >
                        {isIncome ? "+" : "-"}${Math.abs(parseFloat(item.amount)).toFixed(2)}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
        </View>
    );
};