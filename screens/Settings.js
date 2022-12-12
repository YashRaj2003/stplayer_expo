import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Switch, } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { Entypo } from '@expo/vector-icons';
import ToggleSwitch from 'toggle-switch-react-native'
export default function Settings({ navigation }) {
    const [userdata, setuserdata] = useState({});

    const [notipush, setnotipush] = useState(false);
    const [emailpush, setemailpush] = useState(false);
    const [promopush, setpromopush] = useState(false);
    const [logout, setlogout] = useState(false);

    useEffect(() => {
        db.collection("users").doc(auth.currentUser.uid).get().then((res) => {
            setuserdata(res.data());
            if (res.data().notification_push === true) {
                setnotipush(true);
            }
            if (res.data().promo_push === true) {
                setpromopush(true);
            }
            if (res.data().email_push === true) {
                setemailpush(true);
            }

        })
    }, []);
    function notificationpushfunction(value) {
        setnotipush(value);
        db.collection("users").doc(auth.currentUser.uid).update({ notification_push: value }).then(() => { }).catch((error) => alert(error.message));
    }
    function promopushfunction(value) {
        setpromopush(value);
        db.collection("users").doc(auth.currentUser.uid).update({ promo_push: value }).then(() => { }).catch((error) => alert(error.message));
    }
    function emailpushfunction(value) {
        setemailpush(value);
        db.collection("users").doc(auth.currentUser.uid).update({ email_push: value }).then(() => { }).catch((error) => alert(error.message));
    }
    const Signout = (value) => {
        setlogout(value);
        auth.signOut().then(() => {
            navigation.replace("Login")
        })
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50, marginHorizontal: 25 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Feather name="settings" size={30} color="black" />
                        <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 22, marginLeft: 20 }}>Settings</Text>
                    </View>
                    {userdata?.profileimage ? <Image source={{ uri: userdata?.profileimage }} style={{ width: 80, height: 80, borderColor: "black", borderWidth: 3, borderRadius: 100, }} />
                        : <TouchableOpacity style={{ width: 80, height: 80, backgroundColor: "white", borderColor: "black", borderWidth: 3, borderRadius: 100, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 26 }}>{userdata?.name?.split(" ")[0].substring(0, 2).toUpperCase()}</Text>
                        </TouchableOpacity>}
                </View>
                <View style={{ marginHorizontal: 25 }}>
                    <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 22, marginTop: 20 }}>Account</Text>
                    <TouchableOpacity style={styles.touchable} onPress={() => navigation.push('Profile', { uid: auth.currentUser.uid })}>
                        <Text style={styles.font}>Edit profile</Text>
                        <Entypo name="chevron-thin-right" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable}>
                        <Text style={styles.font}>Change your password</Text>
                        <Entypo name="chevron-thin-right" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable}>
                        <Text style={styles.font}>Security & privacy</Text>
                        <Entypo name="chevron-thin-right" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 25, marginTop: 30 }}>
                    <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 22, marginTop: 20 }}>Notifications</Text>
                    <View style={styles.touchable}>
                        <Text style={styles.font}>Push notifications</Text>

                        <ToggleSwitch
                            isOn={notipush}
                            onColor="#000000"
                            offColor="#F4EFFE"
                            labelStyle={{ color: "black", fontWeight: "900", }}
                            size="medium"
                            onToggle={isOn => notificationpushfunction(isOn)}
                        />
                    </View>
                    <View style={styles.touchable}>
                        <Text style={styles.font}>Email Notifications</Text>
                        <ToggleSwitch
                            isOn={emailpush}
                            onColor="#000000"
                            offColor="#F4EFFE"
                            labelStyle={{ color: "black", fontWeight: "900", }}
                            size="medium"
                            onToggle={isOn => emailpushfunction(isOn)}
                        />
                    </View>
                    <View style={styles.touchable}>
                        <Text style={styles.font}>Promotions & offers</Text>
                        <ToggleSwitch
                            isOn={promopush}
                            onColor="#000000"
                            offColor="#F4EFFE"
                            labelStyle={{ color: "black", fontWeight: "900", }}
                            size="medium"
                            onToggle={isOn => promopushfunction(isOn)}
                        />
                    </View>
                </View>
                <View style={{ marginHorizontal: 25, marginTop: 20, paddingBottom: 50 }}>
                    <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 22, marginTop: 20 }}>Logout</Text>
                    <View style={styles.touchable}>
                        <Text style={styles.font}>Logout</Text>

                        <ToggleSwitch
                            isOn={logout}
                            onColor="#000000"
                            offColor="#F4EFFE"
                            labelStyle={{ color: "black", fontWeight: "900", }}
                            size="medium"
                            onToggle={isOn => Signout(isOn)}
                        />
                    </View>

                </View>

            </ScrollView>

        </SafeAreaView >
    );
}



const styles = StyleSheet.create({
    touchable: {
        width: "100%", height: 50, backgroundColor: "white", marginTop: 15, borderRadius: 10, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,

        },
        shadowOpacity: 0.2,
        shadowRadius: 5.62,
        elevation: 3,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    font: {
        fontSize: 17,
        fontFamily: "Roboto_500Medium",
        color: "#A9A9A9"

    }
});
