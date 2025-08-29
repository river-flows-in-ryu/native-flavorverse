import React, { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomHeader from "@/components/customHeader";
import DistanceSelector from "../tabs/components/distanceSelector";

import { BASE_URL } from "@/utils/config";
import { getKakaoMapHtml } from "../webviews/kakaoMap";

import { Restaurant, RestaurantsApiResponse } from "@/types/restaurant";

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY;

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

  const webviewRef = useRef(null);

  const test = [
    {
      lat: 37.4325581545104,
      lng: 127.129757740871,
      name: "La일락 성남모란본점",
      status: "GOOD",
    },
    {
      lat: 37.44202657754082,
      lng: 127.1469843284118,
      name: "땡주",
      status: "GOOD",
    },
    {
      lat: 37.4053564197474,
      lng: 127.442747417502,
      name: "당빛",
      status: "BAD",
    },
    {
      lat: 37.3329615377854,
      lng: 127.172264070704,
      name: "황소고집 본점",
      status: "GOOD",
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
        const response = await fetch(
          // `${BASE_URL}/api/restaurants/location?lat=${currentLocation.lat}&lng=${currentLocation.lng}`
          `${BASE_URL}/api/restaurants/location?lat=37.4371&lng=127.1407&distance=${distance}`
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
  }, [currentLocation, distance]);

  if (!currentLocation) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleMarkerClick = (payload) => {
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

  const handlers = {
    markerClick: handleMarkerClick,
    recenter: handleRecenter,
  };

  const onMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      handlers[msg.type]?.(msg.payload ?? {});
    } catch (error) {
      console.error("webview 메시지 처리 오류", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="내 주변" />
      <View className="w-full h-[50%]">
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

      <DistanceSelector distance={distance} setDistance={setDistance} />
      <View className="flex-row justify-between">
        <Text>
          반경 {distance > 500 ? `${distance / 1000}km` : `${distance}m`} 내
        </Text>
        <View className="flex-row gap-4">
          <Text>❤️ : {statusCount?.goodCount || 0}개</Text>
          <Text>❌ : {statusCount?.badCount || 0}개</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity>
          <Text className="px-4 py-2">❤️ 맛집</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="px-4 py-2">❌ 노맛집</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
