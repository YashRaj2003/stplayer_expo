import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, Image } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from "../firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
export default function Login({ navigation }) {

    const [provider, setprovider] = useState(null);
    const [getotp, setgetotp] = useState(false);
    const [OTP, setOTP] = useState('');
    const [phoneno, setphoneno] = useState('')
    const [countrycode, setcountrycode] = useState('91')



    const sendotp = () => {
        const phonenumber = "+" + countrycode + phoneno;
        console.log(phonenumber)

        if (phonenumber.length >= 12) {
            setgetotp(true);
            window.recaptchaVerifier = new auth.RecaptchaVerifier('sign-in-button', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    onSignInSubmit();
                }
            });
            let appVerifier = window.recaptchaVerifier;
            auth().signInWithPhoneNumber(phonenumber, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    window.confirmationResult = confirmationResult;
                    // ...
                }).catch((error) => {
                    // Error; SMS not sent
                    // ...
                    alert(error.message)
                });
        }
    }

    const verifyOTP = () => {
        if (OTP.length === 6) {
            let confirmationResult = window.confirmationResult;
            confirmationResult.confirm(OTP).then(async (result) => {
                // User signed in successfully.
                const user = result.user;
                console.log(result);
                if (user) {
                    let results;
                    console.log(user);


                    // console.log("inside auth results", results);

                    // console.log("inside auth navigating to home");

                    // console.log("wokring login ");
                } else {
                    alert("bad request");
                }
            }).catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
            });

        }

    }


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#48B1BF', '#48B1BF', '#48B1BF', '#FFFFFF']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: "100%",
                    }}
                    start={{ x: 0.77, y: 0 }} />
                <View style={{ padding: 20, marginTop: 20 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 48, fontFamily: 'Roboto_400Regular', color: "white" }}>Sign in</Text>
                    </View>
                    <View style={{}} >
                        <Text style={{ fontSize: 30, fontFamily: 'Roboto_300Light', marginTop: 10, color: "white" }}>Millions of content waiting for you</Text>
                    </View>
                </View>
                <View id="sign-in-button"></View>

                <View >

                    {provider === null ? <View style={{ margin: 20, paddingBottom: 20, borderBottomColor: "#A5A6A8", borderBottomWidth: 1 }}>
                        <TouchableOpacity style={{ height: 55, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#5BC0BE", }} onPress={() => setprovider('phone')}>
                            <AntDesign name="phone" size={24} color="white" style={{ rotation: 90 }} />
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Continue using Phone </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 55, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#5BC0BE", }} onPress={() => setprovider('google')} >
                            <AntDesign name="google" size={24} color="white" />
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Continue using Google </Text>
                        </TouchableOpacity>
                    </View> : null}
                    {provider === "phone" ? <View style={{ margin: 20, paddingBottom: 20, borderBottomColor: "#A5A6A8", borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput
                                style={{ height: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5, color: "#121212", borderColor: "#121212", width: "20%" }} placeholderTextColor="#121212"
                                keyboardType="phone-pad"
                                value={countrycode}
                                onChangeText={text => setcountrycode(text)}
                            />
                            <TextInput
                                style={{ height: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5, color: "#121212", borderColor: "#121212", width: "75%" }} placeholderTextColor="#121212"
                                placeholder="enter phone number"
                                value={phoneno}
                                onChangeText={text => setphoneno(text)}
                            />

                        </View>
                        {getotp === true ?
                            <View style={{ marginTop: 50 }}>
                                <Text>Enter OTP</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                    <TextInput
                                        style={{ height: 50, width: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5, color: "#121212", borderColor: "#121212", width: "100%" }} placeholderTextColor="#121212"
                                        keyboardType="phone-pad"
                                        maxLength={6}
                                        value={OTP}
                                        onChangeText={text => setOTP(text)} />

                                </View>
                            </View>
                            : null}
                        {getotp === false ?
                            <TouchableOpacity style={{ height: 55, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30, backgroundColor: "#5BC0BE", }} onPress={() => sendotp()} >
                                <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Get OTP</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{ height: 55, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30, backgroundColor: "#5BC0BE", }} onPress={() => verifyOTP()}>
                                <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Login</Text>
                            </TouchableOpacity>
                        }
                        {/* <TouchableOpacity style={{ height: 55, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#5BC0BE", }} onPress={() => setprovider('google')} >
                            <AntDesign name="google" size={24} color="white" />
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Continue using Google </Text>
                        </TouchableOpacity> */}
                    </View> : null}
                    {provider === "google" ? <View style={{ margin: 20, paddingBottom: 20, borderBottomColor: "#A5A6A8", borderBottomWidth: 1 }}>
                        <TouchableOpacity style={{ height: 55, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#5BC0BE", }} onPress={() => setprovider('google')} >
                            <AntDesign name="google" size={24} color="white" />
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Continue using Google </Text>
                        </TouchableOpacity>
                    </View> : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
