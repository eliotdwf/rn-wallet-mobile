import { Stack } from 'expo-router/stack'
import {useAuth} from "@clerk/clerk-expo";
import {Redirect} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import DrawerContent from "@/components/DrawerContent";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";

export default function Layout() {
    const { isSignedIn, isLoaded } = useAuth()

    if(!isLoaded) return null;

    if (!isSignedIn) {
        console.log('redirecting to /sign-in')
        return <Redirect href={'/sign-in'} />
    }
    //return <Stack screenOptions={{headerShown: false}} />
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={DrawerContent}
                screenOptions={{headerShown: false, drawerActiveTintColor: COLORS.primary}}
            >
                <Drawer.Screen
                    name={'index'}
                    options={{
                        drawerLabel: 'Home',
                        title: 'My app',
                        drawerIcon: ({ color, size }) =>
                            <Ionicons name={'home'} size={size} color={color}/>
                    }}
                />
                <Drawer.Screen
                    name={'create'}
                    options={{
                        drawerLabel: 'Add Transaction',
                        title: 'Add Transaction',
                        drawerIcon: ({ color, size }) =>
                            <Ionicons name={'add-circle-outline'} size={size} color={color}/>
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    )
}