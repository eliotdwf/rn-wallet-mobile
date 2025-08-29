import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {styles} from "@/assets/styles/auth.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";
import {Image} from "expo-image";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        setError('');
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            switch ((err as any).errors?.[0]?.code) {
                case 'form_identifier_not_found':
                case 'form_password_incorrect':
                    setError("Invalid credentials. Please try again.")
                    break;
                case 'form_identifier_exists':
                    setError("User already exists. Please sign in instead.")
                    break;
                default:
                    setError("An error occurred. Please try again.")
            }
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            //console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/revenue-i2.png')}
                    style={styles.illustration}
                    contentFit="contain"
                />
                <Text style={styles.title}>Welcome back</Text>
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor={"#9A8478"}
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    placeholderTextColor={"#9A8478"}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={onSignInPress} style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don't have an account yet?</Text>
                    <Link href={"/sign-up"} asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </Link>

                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}