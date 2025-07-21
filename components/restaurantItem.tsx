import { View, Text, TouchableOpacity } from "react-native";

import { Restaurant } from "@/types/restaurant";

import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const RestaurantItem = ({ item }: { item: Restaurant }) => {
  const {
    name,
    address,
    memo,
    category: { name: categoryName } = {},
    region: { name: regionName } = {},
    subregion: { name: subRegionName } = {},
  } = item;

  return (
    <View className="rounded-2xl p-5 border border-gray-50 gap-4">
      <View className="flex flex-row justify-between mb-2">
        <Text
          className="text-lg font-bold flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        <View className="flex flex-row gap-2">
          <TouchableOpacity className="w-8 h-8 bg-gray-100 justify-center items-center rounded-lg">
            <Feather name="edit-2" size={16} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="w-8 h-8 bg-gray-100 justify-center items-center rounded-lg">
            <Feather name="trash-2" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row mb-2 gap-2">
        <View className="px-2 py-1 bg-black rounded-full">
          <Text className="text-white text-xs">{categoryName}</Text>
        </View>
        <View className="px-2 py-1 bg-gray-100 rounded-full">
          <Text className="text-gray-600 text-xs ">{regionName}</Text>
        </View>
        <View className="px-2 py-1 bg-gray-100 rounded-full">
          <Text className="text-gray-600 text-xs">{subRegionName}</Text>
        </View>
      </View>
      <Text className="mb-2">{address}</Text>
      <Text>{memo}</Text>
      <View className="flex flex-row gap-2 items-center">
        <EvilIcons name="location" size={16} color="black" />
        <Text className="flex">탭하여 지도에서 보기</Text>
      </View>
    </View>
  );
};

export default RestaurantItem;
