import {styles} from "@/assets/styles/home.styles";
import i18next from "@/app/i18next";
import {Image} from "expo-image";
import {Text, TouchableOpacity} from "react-native";
import {COLORS} from "@/constants/colors";
import {flags} from "@/constants/flags-images";

interface LanguageButtonProps {
    languageCode: string,
    languageLabel: string,
}

const LanguageButton = ({languageLabel, languageCode}: LanguageButtonProps) => {

    return (
        <TouchableOpacity
            style={[styles.languageButton, i18next.language === languageCode && styles.activeLanguageButton]}
            onPress={() => i18next.changeLanguage(languageCode)}
        >
            <Image source={flags[languageCode]}
                   contentFit={'contain'}
                   style={{
                       height: 25, width: 25, resizeMode: 'contain', borderRadius: 15
                   }}
            />

            <Text style={ languageCode === i18next.language ? {color: COLORS.white} : { color: COLORS.primary}}>
                {languageLabel}
            </Text>
        </TouchableOpacity>
    )
}

export default LanguageButton;