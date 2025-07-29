import React, { useEffect, useState } from "react";
import { TextInput, View, Pressable, Text, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeader from "@/components/customHeader";
import RestaurantListItem from "@/components/restaurant/restaurantListItem";

export default function Search() {
  const [searchText, setSearchText] = useState("");

  const [restaurantData, setRestaurantData] = useState([]);

  const kakaoKeywordSearch = async () => {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchText)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}`,
        },
      }
    );
    const resJson = await res.json();
    console.log(resJson);
    setRestaurantData(resJson?.documents);
  };

  // todo 리스트중 위치 선택시 해당 값의 좌표로 변경해서 region1_depth,2depth 받아오기
  // const fetchTest1 = async (x: string, y: string) => {
  //   const res = await fetch(
  //     `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
  //     {
  //       headers: {
  //         Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}`,
  //       },
  //     }
  //   );
  //   const resJson = await res.json();
  //   console.log(resJson?.documents[0]);
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader title="주소 검색" />
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row gap-3">
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            className=" flex-1 rounded-xl px-4 py-3 bg-gray-50 "
            placeholder="가게 상호명 + 지역으로 검색"
          />
          <Pressable
            onPress={kakaoKeywordSearch}
            className="px-6 py-3 w-[75px] h-[48px] bg-black rounded-xl items-center justify-center "
          >
            <Text className="text-white font-medium ">검색</Text>
          </Pressable>
        </View>
      </View>
      <View>
        <FlatList
          data={restaurantData}
          renderItem={RestaurantListItem}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
