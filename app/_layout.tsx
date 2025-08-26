import {ClerkProvider} from "@clerk/clerk-expo";
import SafeScreen from "@/components/safeScreen";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {Slot} from "expo-router";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
    return <ClerkProvider tokenCache={tokenCache}>
        <SafeScreen>
            <Slot/>
        </SafeScreen>
        <StatusBar style='dark'/>
    </ClerkProvider>;
}
