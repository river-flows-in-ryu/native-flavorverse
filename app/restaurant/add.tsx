import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";

import CustomHeader from "@/components/customHeader";

import { BASE_URL } from "@/utils/config";

import { FoodCategory } from "@/types/restaurant";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function Add() {
  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );

  const router = useRouter();

  useEffect(() => {
    console.log(`${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}`);
    const fetchTest = async () => {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent("la일락")}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}`,
          },
        }
      );
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
    };
    fetchTest();
  }, []);

  useEffect(() => {
    const foodCategoryFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/food-categories`);
        if (res.ok) {
          const resJson = (await res.json()) as FoodCategory[];
          setFoodCategoryData(resJson);
        }
      } catch (error) {
        console.error(error);
      }
    };
    foodCategoryFetch();
  }, []);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      foodCategory: "",
    },
  });

  const onSubmit = (data) => console.log(data);

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
                className="h-[50px px-4 py-3 border rounded-xl bg-gray-50"
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
        <Pressable onPress={() => router?.push("/restaurant/search")}>
          <View className="h-[50px] px-4 py-3 flex-row items-center justify-between border rounded-xl ">
            <Text>주소를 검색하세요.</Text>
            <Feather name="map-pin" size={12} color="black" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
