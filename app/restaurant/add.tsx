import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";

import CustomHeader from "@/components/customHeader";
import RestaurantListItem from "@/components/restaurant/restaurantListItem";

import { FoodCategory } from "@/types/restaurant";

import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function Add() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const [restaurantData, setRestaurantData] = useState([]);

  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );

  const router = useRouter();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      foodCategory: "",
    },
  });

  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  useEffect(() => {
    const kakaoKeywordSearch = async () => {
      if (debouncedSearchText.length < 2) {
        setRestaurantData([]);
        return;
      }

      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}`,
          },
        }
      );
      const resJson = await res.json();
      // console.log(resJson);
      setRestaurantData(resJson?.documents);
    };
    kakaoKeywordSearch();
  }, [debouncedSearchText]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader title="음식점 추가" />
      <View className="p-5">
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <View className="flex flex-row mb-2">
                <Text className="mr-2.5 font-semibold text-black">
                  가게 이름
                </Text>
                <Text className="text-red-500">*</Text>
              </View>
              <TextInput
                placeholder="가게 이름을 입력하세요."
                className="h-[50px] px-4 py-3 rounded-xl bg-[#f9f9f9]"
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        <Controller
          name="foodCategory"
          control={control}
          rules={{ required: true }}
          render={(
            { field: { onChange, value } } //
          ) => (
            <View className="mt-6">
              <SelectDropdown
                data={foodCategoryData}
                onSelect={(selectedItem) => onChange(selectedItem?.id)}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <>
                      <Text className="mb-2 font-semibold text-black">
                        음식 카테고리
                      </Text>
                      <View className="w-full h-[50px] bg-gray-50 rounded-lg text-sm px-3">
                        <View className="w-full h-full flex flex-row justify-between items-center">
                          <Text>
                            {selectedItem ? selectedItem?.name : "카테고리"}
                          </Text>
                          <AntDesign name="down" size={12} color="black" />
                        </View>
                      </View>
                    </>
                  );
                }}
                renderItem={(item, selectedItem) => {
                  return (
                    <View
                      className={`w-full flex-row px-3 py-2 justify-center items-center text-center border-none rounded `}
                    >
                      <Text className={`flex-1 text-lg font-semibold `}>
                        {item.name}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          )}
        />
        <View className="flex-row">
          <Text className="mr-2.5">주소</Text>
          <Text className="text-red-500">*</Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsSearchVisible((prev: boolean) => !prev)}
          className="h-[50px] px-4 py-3  rounded-xl bg-[#f9f9f9] mb-2.5"
        ></TouchableOpacity>

        {isSearchVisible && (
          <View
            className="w-full max-h-[350px] min-h-[150px] shadow-xl/30 rounded-xl px-2.5"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,

              elevation: 6,
            }}
          >
            <View className="flex-row justify-center items-center bg-[#f9f9f9] rounded-xl h-[50px]">
              <EvilIcons
                name="search"
                size={24}
                color="black"
                className="ml-3"
              />
              <TextInput
                placeholder="검색어를 입력하세요"
                className="flex-1 ml-3 "
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View className="h-px bg-gray-300 my-3" />
            {debouncedSearchText.length === 0 ? (
              <Text className="text-center text-gray-500 mt-4">
                검색어를 입력해주세요
              </Text>
            ) : debouncedSearchText.length < 2 ? (
              <Text className="text-center text-gray-500 mt-4">
                2글자 이상 입력해주세요
              </Text>
            ) : restaurantData.length === 0 ? (
              <Text className="text-center text-gray-500 mt-4">
                검색 결과가 없습니다
              </Text>
            ) : (
              <FlatList
                data={restaurantData}
                renderItem={({ item }) => <RestaurantListItem item={item} />}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
