import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from "../firebase";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function Signup({ navigation }) {
    const [email, setemail] = useState('');
    const [fullname, setfullname] = useState('');
    const [password, setpassword] = useState('');
    const [cpassword, setcpassword] = useState('');
    const [token, settoken] = useState("");
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    async function handlesignup() {

        var details = {
            email: email,
            name: fullname,
            profileimage: null,
            coins: 0,
            notification_token: token,
            notification_push: false,
            email_push: false,
            promo_push: false
        }
        if (password != cpassword) {
            return alert("password didn't matched");
        }
        auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
            var user = userCredential.user;
            db.collection("users").doc(user.uid).set({ ...details, uid: user.uid })
        }).catch(error => {
            alert(error.message)
        })
    }

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            settoken(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
                <View style={{ padding: 20, marginTop: 20 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 40, fontFamily: 'Roboto_400Regular' }}>Sign up</Text>
                    </View>
                    <View style={{}} >
                        <Text style={{ fontSize: 30, fontFamily: 'Roboto_300Light', marginTop: 10 }}>We can start something new</Text>
                    </View>
                </View>

                <View >
                    <View style={{ margin: 20, }}>
                        <TextInput
                            style={{ height: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
                            placeholder="Full Name"
                            textContentType="name"
                            value={fullname}
                            onChangeText={text => setfullname(text)}
                        />
                        <TextInput
                            style={{ height: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
                            placeholder="Email"
                            value={email}
                            textContentType="emailAddress"
                            onChangeText={text => setemail(text)}

                        />
                        <TextInput
                            style={{ height: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
                            placeholder="Password"
                            textContentType="password"
                            value={password}
                            secureTextEntry
                            onChangeText={text => setpassword(text)}
                        />
                        <TextInput
                            style={{ height: 50, marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
                            placeholder="Confirm password"
                            textContentType="password"
                            value={cpassword}
                            secureTextEntry
                            onChangeText={text => setcpassword(text)}
                        />
                    </View>
                    <View style={{ margin: 20, paddingBottom: 20, borderBottomColor: "#A5A6A8", borderBottomWidth: 1 }}>
                        <TouchableOpacity style={{ height: 55, borderRadius: 5, alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#5BC0BE" }} onPress={handlesignup}>
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white" }}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ marginHorizontal: 20, paddingBottom: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                        <TouchableOpacity style={{ height: 50, borderRadius: 5, alignItems: "center", justifyContent: "center", backgroundColor: "white", width: "47%", flexDirection: "row", alignItems: "center", justifyContent: "center", }} onPress={() => handlesignupwithgoogle()}>
                            <Image source={require('../assets/icons/google.png')} />
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "black", paddingLeft: 10, }}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 50, borderRadius: 5, alignItems: "center", justifyContent: "center", backgroundColor: "#1877F2", width: "47%", flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                            <Image source={require('../assets/icons/facebook.png')} />
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18, color: "white", paddingLeft: 10 }}>Facebook</Text>
                        </TouchableOpacity>
                    </View> */}
                    <TouchableOpacity style={{ paddingBottom: 30, alignItems: "center", justifyContent: "center", flexDirection: "row", }} onPress={() => navigation.navigate('Login')}>
                        <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 18 }}>Already have an account ?</Text>
                        <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 18, color: "#4611ea" }}> Sign in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
