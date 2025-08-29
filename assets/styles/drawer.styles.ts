import {StyleSheet} from "react-native";
import {COLORS} from "@/constants/colors";

export const styles = StyleSheet.create({
    logoutButton: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
        borderRadius: 20,
        borderColor: '#ef0000',
        borderWidth: 1,
        backgroundColor: COLORS.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 1,
    },
    logOutButtonText: {
        color: '#ef0000'
    },
    logOutCard: {
        marginTop: 20
    }
})