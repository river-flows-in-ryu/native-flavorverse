import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  distance: number;
  setDistance: (value: number) => void;
}

export default function DistanceSelector({ distance, setDistance }: Props) {
  return (
    <View className="flex-row justify-between">
      <Text>검색 반경</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => setDistance(500)}
          className={`px-3 py-1 rounded-lg  ${distance === 500 ? "bg-black" : "bg-gray-100 "}`}
        >
          <Text
            className={`text-xs font-medium ${distance === 500 ? "text-white" : "text-gray-600"}`}
          >
            500m
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDistance(1000)}
          className={`px-3 py-1 rounded-lg  ${distance === 1000 ? "bg-black" : "bg-gray-100"}`}
        >
          <Text
            className={`text-xs font-medium ${distance === 1000 ? "text-white" : "text-gray-600"}`}
          >
            1km
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDistance(3000)}
          className={`px-3 py-1 rounded-lg  ${distance === 3000 ? "bg-black" : "bg-gray-100 "}`}
        >
          <Text
            className={`text-xs font-medium ${distance === 3000 ? "text-white" : "text-gray-600"}`}
          >
            3km
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
