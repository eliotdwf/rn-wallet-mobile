import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {SignOutButton} from "@/components/SignOutButton";
import {View, Text} from "react-native";
import {Image} from "expo-image";
import {styles} from "@/assets/styles/home.styles";
import {useUser} from "@clerk/clerk-expo";
import {useTranslation} from "react-i18next";

const DrawerContent = (props: DrawerContentComponentProps) => {
    const { user } = useUser();
    const { t } = useTranslation();
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
            <Image source={require('../assets/images/logo.png')} style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
                marginVertical: 20
            }}/>
            <View style={{gap: 4, marginBottom: 20}}>
                <Text style={styles.welcomeText}>{t('welcome')},</Text>
                <Text style={styles.usernameText}>
                    {user?.emailAddresses[0]?.emailAddress}
                </Text>
            </View>

            <DrawerItemList {...props} />
            <View style={{
                flex: 1,
                justifyContent: 'flex-end',
            }}>
                <SignOutButton/>
            </View>
        </DrawerContentScrollView>
    )
}

export default DrawerContent;