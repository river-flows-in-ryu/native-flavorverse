import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { restaurantsStatusCount } from "@/types/restaurant";

interface Props {
  isGoodRestaurant: boolean;
  setIsGoodRestaurant: (value: boolean) => void;
  restaurantsStatusCount: restaurantsStatusCount;
}

export default function TasteFilterToggle({
  isGoodRestaurant,
  setIsGoodRestaurant,
  restaurantsStatusCount,
}: Props) {
  const { goodCount, badCount } = restaurantsStatusCount;

  return (
    <View className="flex flex-row gap-3 mb-4">
      <TouchableOpacity
        className={`flex-1 h-12 flex justify-center items-center rounded-lg ${isGoodRestaurant ? "bg-black" : "bg-gray-200"}`}
        onPress={() => setIsGoodRestaurant(true)}
      >
        <View className="flex flex-row items-center gap-2">
          <AntDesign
            name="hearto"
            size={14}
            color={`${isGoodRestaurant ? "white" : "black"}`}
          />
          <Text
            className={`font-semibold ${isGoodRestaurant ? "text-white" : ""}`}
          >
            맛집 ({goodCount})
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 h-12 justify-center items-center rounded-lg ${isGoodRestaurant ? "bg-gray-200" : "bg-black "}`}
        onPress={() => setIsGoodRestaurant(false)}
      >
        <View className="flex flex-row items-center gap-2">
          <FontAwesome5
            name="heart-broken"
            size={14}
            color={`${isGoodRestaurant ? "black" : "white"}`}
          />
          <Text
            className={`font-semibold ${isGoodRestaurant ? "" : "text-white"}`}
          >
            노맛집 ({badCount})
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
