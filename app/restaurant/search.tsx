import React from "react";
import { TextInput, View, Pressable, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeader from "@/components/customHeader";

export default function Search() {
  return (
    //
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader title="주소 검색" />
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row gap-3">
          <TextInput
            className=" flex-1 rounded-xl px-4 py-3 bg-gray-50 "
            placeholder="가게 상호명 + 지역으로 검색"
          />
          <Pressable
            onPress={() => console.log("rzzz")}
            className="px-6 py-3 w-[75px] h-[48px] bg-black rounded-xl items-center justify-center "
          >
            <Text className="text-white font-medium ">검색</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
