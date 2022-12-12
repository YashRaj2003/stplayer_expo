import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db, storage } from "../firebase";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


export default function Profile() {
    const [userdata, setuserdata] = useState({});
    const [data, setdata] = useState({});


    useEffect(() => {
        db.collection("users").doc(auth.currentUser.uid).get().then((res) => {
            setuserdata(res.data());
        })
    }, []);


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
        });



        if (!result.cancelled) {
            setuserdata({ ...userdata, profileimage: result.uri })
            const img = await fetch(result.uri);
            const bytes = await img.blob();

            var storageRef = storage.ref();
            storageRef
                .child(`profile/${userdata.uid}.jpg`)
                .put(bytes)
                .then((snapshot) => {
                    snapshot.ref
                        .getDownloadURL()
                        .then(function (downloadURL) {
                            db
                                .collection("users")
                                .doc(userdata.uid)
                                .update({
                                    profileimage: downloadURL,
                                })

                        })
                        .catch((e) => {
                            alert(e.message);
                        });
                });

        }
    };


    return (
        <SafeAreaView style={{ backgroundColor: "white", height: "100%", }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <View style={{ marginTop: 50, }}>
                    <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 22, textAlign: "center" }}>Edit profile</Text>
                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 20, position: "relative" }} onPress={pickImage}>
                        {userdata?.profileimage ?
                            <Image source={{ uri: userdata?.profileimage }} style={{ width: 100, height: 100, borderColor: "black", borderWidth: 3, borderRadius: 100, alignSelf: "center", justifyContent: "center" }} />
                            :
                            <TouchableOpacity style={{ width: 100, height: 100, backgroundColor: "white", borderColor: "black", borderWidth: 3, borderRadius: 100, alignItems: "center", justifyContent: "center" }} onPress={pickImage} >
                                <Text style={{ fontSize: 26 }}>{userdata?.name?.split(" ")[0].substring(0, 2).toUpperCase()}</Text>
                            </TouchableOpacity>}

                        <View style={{
                            height: 35, width: 35, backgroundColor: "white", position: "absolute", bottom: 0, right: 0, borderRadius: 999, shadowColor: "#000000",
                            shadowOffset: {
                                width: 0,
                                height: 4,

                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 5.62,
                            elevation: 3,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <MaterialIcons name="edit" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={{ marginHorizontal: 25 }}>
                    <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 22, marginTop: 20 }}>Account</Text>
                    <TextInput
                        style={styles.touchable}
                        placeholder="Full Name"
                        textContentType="name"
                        defaultValue={userdata?.name}
                        editable={false} />
                    <TextInput
                        style={styles.touchable}
                        placeholder="Email"
                        textContentType="emailAddress"
                        defaultValue={userdata?.email}
                        editable={false}
                    />
                    <TextInput
                        style={styles.touchable}
                        placeholder="UID"
                        textContentType="emailAddress"
                        defaultValue={userdata?.uid}
                        editable={false}
                    />
                    {/* <TextInput
                        style={styles.touchable}
                        placeholder="DD/MM/YYYY"
                        textContentType="telephoneNumber"
                        keyboardType="numeric"
                        defaultValue={userdata?.dob}
                    /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
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
