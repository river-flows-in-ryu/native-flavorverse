import React, { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from "react-native";

import CustomHeader from "@/components/customHeader";
import DistanceSelector from "../tabs/components/distanceSelector";

import { BASE_URL } from "@/utils/config";
import { getKakaoMapHtml } from "../webviews/kakaoMap";

import { Restaurant, RestaurantsApiResponse } from "@/types/restaurant";

import Feather from "@expo/vector-icons/Feather";
import RestaurantItem from "../tabs/components/restaurantItem";

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY;

type HandlerMap = {
  markerClick: (payload: any) => void;
  recenter: () => void | Promise<void>;
};

type Message =
  | { type: "markerClick"; payload: any }
  | { type: "recenter"; payload?: undefined };

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const [statusCount, setStatusCount] = useState<{
    goodCount: number;
    badCount: number;
  }>({
    goodCount: 0,
    badCount: 0,
  });

  const [distance, setDistance] = useState<number>(500);

  const [goodFlag, setGoodFlag] = useState(true);
  const [badFlag, setBadFlag] = useState(true);

  const webviewRef = useRef<WebView>(null);

  const test = [
    {
      lat: 37.4325581545104,
      lng: 127.129757740871,
      name: "La일락 성남모란본점",
      status: "GOOD",
      category: {
        name: "양식",
      },
      region: {
        name: "경기",
      },
      subregion: {
        name: "성남",
      },
      memo: "새우로제파스타 존맛집",
    },
    {
      lat: 37.44202657754082,
      lng: 127.1469843284118,
      name: "땡주",
      status: "GOOD",
      category: {
        name: "한식",
      },
      region: {
        name: "경기",
      },
      subregion: {
        name: "성남",
      },
      memo: "감자채전이 존맛 닭볶음탕보다는 고추장찌개가 맛있음",
    },
    {
      lat: 37.4053564197474,
      lng: 127.442747417502,
      name: "당빛",
      status: "BAD",
      category: {
        name: "양식",
      },
      region: {
        name: "경기",
      },
      subregion: {
        name: "여주",
      },
      memo: "브런치 돈 아깝,돈까스 소스 이상",
    },
    {
      lat: 37.3329615377854,
      lng: 127.172264070704,
      name: "황소고집 본점",
      status: "GOOD",
      category: {
        name: "고기",
      },
      region: {
        name: "경기",
      },
      subregion: {
        name: "용인",
      },
      memo: "존맛탱 여기가 갈매기살 최고임  마늘먹고 다들 사람행",
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "위치 권한 필요",
          "위치 권한을 허용해야 지도를 사용할 수 있습니다."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (!currentLocation) return;

    const fetchRestaurants = async () => {
      try {
        const statusFilters: string[] = [];
        if (goodFlag) statusFilters.push("good");
        if (badFlag) statusFilters.push("bad");

        const response = await fetch(
          // `${BASE_URL}/api/restaurants/location?lat=${currentLocation.lat}&lng=${currentLocation.lng}`
          `${BASE_URL}/api/restaurants/location?lat=37.4371&lng=127.1407&distance=${distance}&filter=${statusFilters.join(",")}`
        );
        const data = (await response.json()) as RestaurantsApiResponse;
        console.log(data);
        setRestaurant(data?.restaurants as Restaurant[]);
        setStatusCount({
          goodCount: data?.goodCount,
          badCount: data?.badCount,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, [currentLocation, distance, goodFlag, badFlag]);

  console.log(restaurant);

  if (!currentLocation) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleMarkerClick = (payload: any) => {
    Alert.alert("마커 클릭", payload.name);
  };

  const handleRecenter = async () => {
    // 현재 위치 갱신 함수 호출
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "위치 권한 필요",
          "위치 권한을 허용해야 지도를 사용할 수 있습니다."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setCurrentLocation({ lat: latitude, lng: longitude });

      const message = {
        type: "panTo",
        lat: latitude,
        lng: longitude,
      };
      webviewRef.current?.postMessage(JSON.stringify(message));
    } catch (error) {
      console.error("현재 위치 가져오기 실패", error);
    }
  };

  const handlers: HandlerMap = {
    markerClick: handleMarkerClick,
    recenter: handleRecenter,
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const msg: Message = JSON.parse(event.nativeEvent.data);
      handlers[msg.type]?.(msg.payload ?? {});
    } catch (error) {
      console.error("webview 메시지 처리 오류", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="내 주변" />
      <View className="w-full h-[300px]">
        <WebView
          ref={webviewRef}
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{
            html: getKakaoMapHtml(
              currentLocation.lat,
              currentLocation.lng,
              test,
              KAKAO_JS_KEY
            ),
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="always"
          onMessage={onMessage}
        />
      </View>

      <ScrollView className="">
        <View className="p-4 border-b border-gray-200">
          <DistanceSelector distance={distance} setDistance={setDistance} />
          <View className="flex-row justify-between mt-4">
            <Text>
              반경 {distance > 500 ? `${distance / 1000}km` : `${distance}m`} 내
            </Text>
            <View className="flex-row gap-4">
              <Text>❤️ : {statusCount?.goodCount || 0}개</Text>
              <Text>❌ : {statusCount?.badCount || 0}개</Text>
            </View>
          </View>

          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={() => setGoodFlag((prev) => !prev)}
              className={`cursor-pointer border rounded-xl ${goodFlag ? "bg-green-100  border-green-200" : "bg-gray-100 border-gray-200 "}`}
            >
              <Text
                className={`px-4 py-2 text-sm ${goodFlag ? "text-green-700" : "ext-gray-500"}`}
              >
                ❤️ 맛집
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBadFlag((prev) => !prev)}
              className={`cursor-pointer border rounded-xl ${badFlag ? "bg-red-100  border-red-200" : "bg-gray-100 border-gray-200 "}`}
            >
              <Text
                className={`px-4 py-2 text-sm ${badFlag ? "text-red-700" : "ext-gray-500"}`}
              >
                ❌ 노맛집
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {test?.length !== 0 ? (
          <View className="flex-1 p-4 ">
            <Text className="text-lg font-bold text-black">
              가까운 맛집 / 노맛집
            </Text>
            <FlatList
              data={test}
              scrollEnabled={false}
              renderItem={(
                { item } //
              ) => (
                <RestaurantItem
                  item={item}
                  webviewRef={webviewRef}
                  setCurrentLocation={setCurrentLocation}
                />
              )}
            />
          </View>
        ) : (
          <View className="p-4">
            <Text className="text-lg font-bold text-black mb-3">
              가까운 맛집
            </Text>
            <View className="py-8 flex-col justify-center items-center">
              <Feather name="map-pin" size={48} color="gray" />
              <Text className="mt-2 text-gray-500 text-center">
                주변에 등록된 맛집이 없습니다
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                반경을 늘려보거나 새로운 맛집을 추가해보세요
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
