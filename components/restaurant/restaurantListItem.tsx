import React from "react";
import { Text, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

export default function RestaurantListItem({ item }: { item: any }) {
  const { address_name, place_name, category_name } = item;

  return (
    <>
      <View className="mb-5">
        <View className="flex-row items-center justify-center">
          <Feather name="map-pin" size={16} color="black" />
          <Text className="flex-1 ml-2.5 text-lg font-bold">{place_name}</Text>
        </View>
        <View className="ml-[26px]">
          <Text className="text-sm">지번 : {address_name}</Text>
        </View>
        <View className="ml-[26px]">
          <Text className="text-sm">카테고리 : {category_name}</Text>
        </View>
      </View>
    </>
  );
}
