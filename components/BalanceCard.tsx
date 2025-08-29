import { View, Text } from "react-native";
import {styles} from "@/assets/styles/home.styles";
import {COLORS} from "@/constants/colors";
import {TransactionsSummary} from "@/hooks/useTransactions";
import {useTranslation} from "react-i18next";


const BalanceCard = ({summary}: {summary: TransactionsSummary}) => {
    const {t} = useTranslation();
    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>{t('home.total-balance')}</Text>
            <Text style={styles.balanceAmount}>${parseFloat(summary.balance).toFixed(2)}</Text>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>{t('income')}</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                        +${parseFloat(summary.income).toFixed(2)}
                    </Text>
                </View>
                <View style={[styles.balanceStatItem, styles.statDivider]} />
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>{t('expenses')}</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
                        -${Math.abs(parseFloat(summary.expenses)).toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default BalanceCard;