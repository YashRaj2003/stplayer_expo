import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
} from 'expo-ads-admob';




export default function Home({ navigation }) {

    const [videos, setvideos] = useState([]);
    const [last, setlast] = useState(null);
    const [loading, setloading] = useState(false);
    const [lastpost, setlastpost] = useState(false);
    const interstital = async () => {
        await AdMobInterstitial.setAdUnitID('ca-app-pub-2058503082715827/4056471919');
        try {
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
            await AdMobInterstitial.showAdAsync();
        } catch (error) {
            console.log(e);
        }
    }
    const reward = async () => {
        await AdMobRewarded.setAdUnitID('ca-app-pub-2058503082715827/2934961931')
        try {
            await AdMobRewarded.requestAdAsync();
            await AdMobRewarded.showAdAsync();
        } catch (error) {
            console.log(e);
        }
    }

    useEffect(() => {
        getvideos();
    }, []);

    async function getvideos() {
        setloading(true);

        db
            .collection("video")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get()
            .then((res) => {
                var a = [];
                res.docs.forEach((doc) => {
                    a.push({ ...doc.data(), id: doc.id });
                });
                setvideos(a);
                setlast(res.docs[res.docs.length - 1]);
            })
            .catch((error) => {
                alert(error.message);
            });

        setloading(false);
    }

    const loadMore = () => {

        if (!lastpost) {
            db
                .collection("video")
                .orderBy("createdAt", "desc")
                .startAfter(last)
                .limit(10)
                .get()
                .then((res) => {
                    var a = [];
                    res.docs.forEach((doc) => {
                        a.push({ ...doc.data(), id: doc.id });
                    });
                    setvideos([...videos, ...a]);
                    setlast(res.docs[res.docs.length - 1]);
                    setloading(false);
                    a.length == 0 ? setlastpost(true) : setlastpost(false);
                });
        }
    };






    const Item = ({ title, thumbnail, label, id }) => (
        <View>
            <TouchableOpacity style={{ paddingBottom: 5, backgroundColor: "white", marginTop: 5 }} onPress={() => { interstital(); navigation.push('Videoplayer', { id: id }); }}>
                <Image source={{ uri: thumbnail }} style={{ width: "100%", aspectRatio: 16 / 9 }} />
                <Text numberOfLines={2} style={{ fontFamily: "Roboto_400Regular", paddingHorizontal: 5, fontSize: 18, }}>{title ?? "ST Player latest video new 2022"}</Text>
                <Text style={{ fontFamily: "Roboto_400Regular", paddingHorizontal: 5, fontSize: 14, }}>{label ?? "ST Player"}</Text>
            </TouchableOpacity>
        </View>
    );



    return (
        <SafeAreaView >

            <View style={{ backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 7, height: 50, position: "relative", }}>
                <Image source={require("../assets/logo.png")} style={{ position: "absolute", alignSelf: "center", top: 1 }} />
                {/* <Text style={{ fontSize: 18 }}>Home</Text> */}
                {/* <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={Signout}>
                    <AntDesign name="logout" size={20} color="black" />
                    <Text style={{ fontSize: 16, marginLeft: 8 }}>Logout</Text>
                </TouchableOpacity> */}
            </View>

            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                <AdMobBanner
                    bannerSize="Banner"
                    adUnitID="ca-app-pub-2058503082715827/3172170629"
                    servePersonalizedAds
                />
            </View>
            {loading && <View style={{ alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>}
            <FlatList
                data={videos}
                renderItem={({ item }) => Item(item)}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={.7}
                ListFooterComponent={() => !lastpost ? <ActivityIndicator size="large" color="#0000ff" /> : <View style={{ alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                    <AdMobBanner
                        bannerSize="Banner"
                        adUnitID="ca-app-pub-2058503082715827/3172170629"
                        servePersonalizedAds
                    />
                </View>}
                ListFooterComponentStyle={{ height: 200 }}
            >
            </FlatList>
        </SafeAreaView>
    );
}
