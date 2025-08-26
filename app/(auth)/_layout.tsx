import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        console.log('User is signed in, redirecting to /')
        return <Redirect href={'/'} />
    }

    return <Stack screenOptions={{headerShown: false}}/>
}