import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";

export default function CustomHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black"></AntDesign>
      </TouchableOpacity>
      <Text className="ml-5 text-xl font-semibold">{title}</Text>
    </View>
  );
}
