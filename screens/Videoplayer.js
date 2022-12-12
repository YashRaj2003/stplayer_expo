import { View, Text, Image, Share, TouchableOpacity, FlatList, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment"
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { AdMobBanner } from "expo-ads-admob";
import * as ScreenOrientation from 'expo-screen-orientation';
import { auth } from "../firebase";
import VideoPlayer from 'react-native-video-controls';


export default function Videoplayer({ route, navigation }) {

    const [show, setshow] = useState(false);
    const [liked, setliked] = useState(false);
    const [disliked, setdisliked] = useState(false);
    const { id } = route.params;
    const [video, setvideo] = useState({});
    const [videos, setvideos] = useState([]);
    const [like, setlike] = useState({});

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
        interstital();
    }, []);
    useEffect(() => {
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
            })
            .catch((error) => {
                alert(error.message);
            });
        db
            .collection("video")
            .doc(id)
            .get()
            .then((res) => {
                setvideo(res.data());
                // console.log(res.data())
            })
            .catch((e) => {
                new AWN().alert(e.message);
            });


        db
            .collection("video")
            .doc(id)
            .collection("likes")
            .doc(auth.currentUser.uid)
            .get()
            .then((res) => {
                if (res.data().liked === true) {
                    setliked(true);
                    setdisliked(false);
                }
                else {
                    setliked(false)
                }
                // console.log(res.data())
            })
            .catch((e) => {
                new AWN().alert(e.message);
            });
        db
            .collection("video")
            .doc(id)
            .collection("disliked")
            .doc(auth.currentUser.uid)
            .get()
            .then((res) => {
                if (res.data().disliked === true) {
                    setdisliked(true);
                    setliked(false);
                }
                else {
                    setdisliked(false)
                }
                // console.log(res.data())
            })
            .catch((e) => {
                new AWN().alert(e.message);
            });
    }, [id]);





    setTimeout(() => {
        updateviews();
    }, 40000);

    async function updateviews() {
        if (video?.views) {
            var videoref = db.collection("video").doc(id);
            await videoref.update({
                views: video?.views + 1
            })
                .then(() => {
                    // console.log("Views had been successfully updated!");
                })
                .catch((error) => {
                    alert(error.message)
                });
        }
        else {
            var videoref = db.collection("video").doc(id);
            await videoref.update({
                views: 1
            })
                .then(() => {
                    console.log("Views had been successfully updated!");
                })
                .catch((error) => {
                    alert(error.message)
                });
        }

    }


    async function likeadd() {
        if (liked === true) {
            setliked(false);
            setdisliked(false);
            db.collection("video").doc(id).collection("likes").doc(auth.currentUser?.uid).delete().then((res) => { }).catch((error) => alert(error.message))
        }
        if (liked === false) {
            setliked(true);
            setdisliked(false);
            db.collection("video").doc(id).collection("likes").doc(auth.currentUser?.uid).set({ uid: auth.currentUser?.uid, liked: true }).then((res) => { }).catch((error) => alert(error.message))
            db.collection("video").doc(id).collection("disliked").doc(auth.currentUser?.uid).delete().then((res) => { }).catch((error) => alert(error.message))
        }


    }

    async function dislikeadd() {
        if (disliked === true) {
            setdisliked(false);
            setliked(false);
            db.collection("video").doc(id).collection("disliked").doc(auth.currentUser?.uid).delete().then((res) => { }).catch((error) => alert(error.message))
        }
        if (disliked === false) {
            setdisliked(true);
            setliked(false);
            db.collection("video").doc(id).collection("disliked").doc(auth.currentUser?.uid).set({ uid: auth.currentUser?.uid, disliked: true }).then((res) => { }).catch((error) => alert(error.message))
            db.collection("video").doc(id).collection("likes").doc(auth.currentUser?.uid).delete().then((res) => { }).catch((error) => alert(error.message))
        }
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Watch this awesome video : ${video?.title} at https://st-player.in/video/${id} on ST Player`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            alert(error.message);
        }
    };
    function setOrientation() {
        if (Dimensions.get('window').height > Dimensions.get('window').width) {
            //Device is in portrait mode, rotate to landscape mode.
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
        else {
            //Device is in landscape mode, rotate to portrait mode.
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    }

    const Item = ({ title, thumbnail, label, id }) => (
        <View>
            <TouchableOpacity style={{ paddingBottom: 5, backgroundColor: "white", marginTop: 5 }} onPress={() => { reward(); navigation.replace('Videoplayer', { id: id }); }}>
                <Image source={{ uri: thumbnail }} style={{ width: "100%", aspectRatio: 16 / 9 }} />
                <Text numberOfLines={2} style={{ fontFamily: "Roboto_400Regular", paddingHorizontal: 5, fontSize: 18, }}>{title ?? "ST Player latest video new 2022"}</Text>
                <Text style={{ fontFamily: "Roboto_400Regular", paddingHorizontal: 5, fontSize: 14, }}>{label ?? "ST Player"}</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <SafeAreaView>
            <View style={{ backgroundColor: "white", }} >

                <Video
                    source={{ uri: 'https://storage.googleapis.com/st_player/bfa0c279113a5caa097891afeed3d322/index.m3u8' }}
                    style={{ width: "100%", aspectRatio: 16 / 9 }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    shouldPlay
                    onFullscreenUpdate={setOrientation}
                />
                {/* <Image source={{ uri: video?.thumbnail }} style={{ width: "100%", aspectRatio: 16 / 9 }} /> */}
                <TouchableOpacity onPress={() => setshow(!show)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8, paddingVertical: 10, }}>
                    <View style={{ width: "90%" }}>
                        {/* <Text>{id}</Text> */}
                        <Text numberOfLines={3} style={{ fontFamily: "Roboto_500Medium", fontSize: 17, marginTop: 3 }}>{video?.title ?? "ST Player latest video new 2022"}</Text>
                        <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 14, }}>{video?.views ? `${video?.views} views` : `No views`} , {moment(video?.createdAt).format("DD MMM YY")}</Text>
                    </View>
                    <View style={show ? { rotation: 180, width: "10%" } : null}>
                        <Text>
                            <Entypo name="chevron-thin-down" size={24} color="black" />
                        </Text>
                    </View>
                </TouchableOpacity >
                {show ? <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: "#f1f1f1", borderBottomColor: "#f1f1f1", paddingVertical: 12, paddingHorizontal: 8, }}>
                    <Text>
                        Published on : {moment(video?.createdAt).format("DD-MM-YYYY")}
                    </Text>
                    <Text style={{ paddingTop: 5 }}>
                        {video?.description}
                    </Text>

                </View> : null}
                <View style={{ paddingVertical: 20, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <TouchableOpacity style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                        onPress={() => likeadd()}>
                        <Text>
                            {liked ? <AntDesign name="like1" size={24} color="black" />
                                :
                                <AntDesign name="like2" size={24} color="black" />}
                        </Text>
                        <Text style={{ fontFamily: "Roboto_400Regular", letterSpacing: 0.5 }}>
                            Like
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                        onPress={() => {
                            dislikeadd();
                        }
                        }

                    >
                        <Text>
                            {disliked ?
                                <AntDesign name="dislike1" size={24} color="black" />
                                : <AntDesign name="dislike2" size={24} color="black" />}
                        </Text>
                        <Text style={{ fontFamily: "Roboto_400Regular", letterSpacing: 0.5 }}>
                            Dislike
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }} onPress={() => onShare()}>
                        <Text>
                            <MaterialCommunityIcons name="share-all-outline" size={24} color="black" />
                        </Text>
                        <Text style={{ fontFamily: "Roboto_400Regular", letterSpacing: 0.5 }}>
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                <AdMobBanner
                    bannerSize="Banner"
                    adUnitID="ca-app-pub-2058503082715827/3172170629" // Test ID, Replace with your-admob-unit-id
                    servePersonalizedAds // true or false
                />
            </View>
            <View style={{ paddingVertical: 10, borderBottomColor: "#f1f1f1", borderBottomWidth: 1, backgroundColor: "white", marginTop: 10 }}>
                <Text style={{ paddingHorizontal: 8, fontFamily: "Roboto_400Regular" }}>Recommended</Text>
            </View>
            <FlatList
                data={videos}
                renderItem={({ item }) => Item(item)}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            ></FlatList>
            {/* <ScrollView contentContainerStyle={{}}>
                {videos.map((v, index) => (
                    <TouchableOpacity style={{ marginTop: 12, backgroundColor: "white", paddingBottom: 8 }} key={index} onPress={() => { navigation.replace('Videoplayer', { id: v.id }); }}>
                        <Image source={{ uri: v?.thumbnail }} style={{ width: "100%", aspectRatio: 16 / 9 }} />
                        <View style={{ paddingHorizontal: 5 }}>
                            <Text numberOfLines={2} style={{ fontFamily: "Roboto_400Regular", fontSize: 17, marginTop: 3 }}>{v?.title ?? "ST Player latest video new 2022"}</Text>
                            <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 14, }}>{v?.label ?? "ST Player"}</Text>
                        </View>

                    </TouchableOpacity>
                ))}


            </ScrollView> */}

        </SafeAreaView>


    );
}
