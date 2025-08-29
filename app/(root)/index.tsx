import {useUser} from '@clerk/clerk-expo'
import {router} from 'expo-router'
import {Alert, FlatList, RefreshControl, Text, TouchableOpacity, View} from 'react-native'
import {SignOutButton} from "@/components/SignOutButton";
import {useTransactions} from "@/hooks/useTransactions";
import {useEffect, useState} from "react";
import Loader from "@/components/Loader";
import {dropdownStyles, styles} from "@/assets/styles/home.styles";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import BalanceCard from "@/components/BalanceCard";
import {TransactionItem} from "@/components/TransactionItem";
import NoTransactionsFound from "@/components/NoTransactionsFound";
import {useTranslation} from "react-i18next";
import {flags} from "@/constants/flags-images";
import LanguageButton from "@/components/LanguageButton";
import DropDownPicker from 'react-native-dropdown-picker';
import i18next from "i18next";

export default function Page() {
    const { t } = useTranslation();
    const { user } = useUser()
    const [refreshing, setRefreshing] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(i18next.language);
    const [items, setItems] = useState([
        {
            label: '',
            value: 'en',
            icon: () => <Image source={require('../../assets/images/flag-EN.png')} style={{
                height: 25, width: 25, resizeMode: 'contain', borderRadius: 10
            }}/>
        },
        {
            label: '',
            value: 'fr',
            icon: () => <Image source={require('../../assets/images/flag-FR.png')} style={{
                height: 25, width: 25, resizeMode: 'contain', borderRadius: 10
            }}/>
        }
    ]);

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
        Alert.alert(t('home.delete'), t('home.delete-message'), [
            {text: t('home.delete-cancel'), style: "cancel"},
            {text: t('home.delete'), style: "destructive", onPress: () => deleteTransaction(id)}
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
                            <Text style={styles.welcomeText}>{t('welcome')},</Text>
                            <Text style={styles.usernameText}>
                                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={() => {
                            i18next.language === 'en'
                                ? i18next.changeLanguage('fr')
                                : i18next.changeLanguage('en')
                        }}>
                            <Image source={flags[i18next.language]}
                                   contentFit={'contain'}
                                   style={{
                                       height: 40, width: 40, resizeMode: 'contain', borderRadius: 15
                                   }}
                            />
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>

                {/*<View style={{justifyContent: 'center', gap: 10, paddingBottom: 25, flexDirection: 'row'}}>
                    <LanguageButton
                        languageCode={'en'}
                        languageLabel={'English'} />
                    <LanguageButton
                        languageCode={'fr'}
                        languageLabel={'Français'} />
                </View>*/}

                <BalanceCard summary={summary} />
                <View style={styles.transactionsHeaderContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitleText}>
                            {t('home.recent-transactions')}
                        </Text>
                        {transactions.length > 0 &&
                            <Text style={styles.sectionTitleCount}>({transactions.length})</Text>
                        }
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/create')}
                    >
                        <Ionicons name={"add"} size={20} color={"#fff"} />
                       {/* <Text style={styles.addButtonText}>{t('header.add-button')}</Text>*/}
                    </TouchableOpacity>
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