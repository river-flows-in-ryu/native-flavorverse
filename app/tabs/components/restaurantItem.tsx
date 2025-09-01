import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Restaurant } from "@/types/restaurant";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

interface Props {
  item: Restaurant;
}

export default function RestaurantItem({ item }: Props) {
  const { status, name, category, region, subregion, memo } = item;
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
            <Text className="text-xs text-gray-600">{categoryName}</Text>{" "}
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
        <Text className="text-sm text-right font-bold text-black">120m</Text>
        <TouchableOpacity className="flex-row gap-1 px-2 py-1 bg-blue-100 rounded-lg">
          <Feather name="map-pin" size={12} color="blue" />
          <Text className="text-xs text-blue-600">지도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
