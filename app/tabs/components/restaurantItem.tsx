import React, { MutableRefObject } from "react";

import { Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

import { Restaurant } from "@/types/restaurant";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

interface Props {
  item: Restaurant;
  setCurrentLocation: (location: { lat: number; lng: number }) => void;
  webviewRef: MutableRefObject<WebView | null>;
}

export default function RestaurantItem({
  item,
  setCurrentLocation,
  webviewRef,
}: Props) {
  const {
    status,
    name,
    category,
    region,
    subregion,
    memo,
    lat,
    lng,
    distance,
  } = item;
  const { name: categoryName } = category;
  const { name: regionName } = region;
  const { name: subreegionName } = subregion;

  return (
    <View className="flex-row items-start gap-3 p-3 mt-3 bg-gray-50 rounded-xl ">
      <View className="shrink-0">
        <View
          className={`w-12 h-12 flex justify-center items-center rounded-full ${status === "GOOD" ? "bg-green-100" : "bg-red-100"}`}
        >
          {status === "GOOD" ? (
            <AntDesign name="heart" size={20} color="red" />
          ) : (
            <AntDesign name="close" size={20} color="red" />
          )}
        </View>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="font-semibold text-black truncate">{name}</Text>
          <View className="px-2 py-0.5 bg-gray-200 rounded-full">
            <Text className="text-xs text-gray-600">{categoryName}</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500 mb-1">
          {regionName} / {subreegionName}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-sm text-gray-600"
        >
          {memo}
        </Text>
      </View>
      <View className="flex-col  gap-2">
        <Text className="text-sm text-right font-bold text-black">
          {(distance ?? 0) > 1
            ? `${(distance ?? 1).toFixed(2)} km`
            : `${Math.round((distance ?? 1) * 1000)} m`}
        </Text>
        <TouchableOpacity
          onPress={() => {
            // 1️⃣ 지도 중심 갱신
            setCurrentLocation({ lat: lat, lng: lng });

            // 2️⃣ WebView에 panTo 메시지 전송
            webviewRef.current?.postMessage(
              JSON.stringify({
                type: "panTo",
                lat: lat,
                lng: lng,
              })
            );
          }}
          className="flex-row gap-1 px-2 py-1 bg-blue-100 rounded-lg"
        >
          <Feather name="map-pin" size={12} color="blue" />
          <Text className="text-xs text-blue-600">지도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
