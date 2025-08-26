import {ActivityIndicator, View} from "react-native";
import {COLORS} from "@/constants/colors";
import {styles} from "@/assets/styles/home.styles";

const Loader = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
    )
}

export default Loader;