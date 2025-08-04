import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { useForm, Controller } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";

import CustomHeader from "@/components/customHeader";
import RestaurantListItem from "@/components/restaurant/restaurantListItem";

import { BASE_URL } from "@/utils/config";

import { FoodCategory } from "@/types/restaurant";

import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Add() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const [restaurantData, setRestaurantData] = useState([]);

  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );

  const [selectedRestaurant, setSelectedRestaurant] = useState([]);

  const restaurantInputRef = useRef<TextInput>(null);

  console.log(selectedRestaurant);

  const router = useRouter();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      foodCategory: "",
      isGoodRestaurant: true,
      memo: "",
    },
  });

  const onSubmit = (data) => console.log(data);

  //음식 카테고리 가져오는 fetch
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

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  // 키워드 카카오 검색
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
      console.log(resJson);
      setRestaurantData(resJson?.documents);
    };
    kakaoKeywordSearch();
  }, [debouncedSearchText]);

  useEffect(() => {
    if (isSearchVisible) {
      restaurantInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  const addressParts = selectedRestaurant?.address_name?.split(" ") || [];

  return (
    <View className="flex-1">
      <CustomHeader title="음식점 추가" />

      <View className="p-5">
        <Controller
          control={control}
          name="isGoodRestaurant"
          render={({ field: { value, onChange } }) => (
            <View className="mb-6">
              <Text className="mb-2 font-semibold text-black">분류</Text>
              <View className="flex flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 h-12 flex justify-center items-center rounded-lg ${value ? "bg-black" : "bg-gray-200"}`}
                  onPress={() => onChange(true)}
                >
                  <View className="flex flex-row items-center gap-2">
                    <AntDesign
                      name="hearto"
                      size={14}
                      color={`${value ? "white" : "black"}`}
                    />
                    <Text
                      className={`font-semibold ${value ? "text-white" : ""}`}
                    >
                      맛집
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 h-12 justify-center items-center rounded-lg ${value ? "bg-gray-200" : "bg-black "}`}
                  onPress={() => onChange(false)}
                >
                  <View className="flex flex-row items-center gap-2">
                    <FontAwesome5
                      name="heart-broken"
                      size={14}
                      color={`${value ? "black" : "white"}`}
                    />
                    <Text
                      className={`font-semibold ${value ? "" : "text-white"}`}
                    >
                      노맛집
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        ></Controller>

        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-6">
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
            <View className="mb-6">
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

        <View className="relative">
          <TouchableOpacity
            onPress={() => setIsSearchVisible((prev: boolean) => !prev)}
            className="flex-row items-center h-[50px] px-4 py-3  rounded-xl bg-[#f9f9f9] mb-2.5"
          >
            <Text>{selectedRestaurant?.address_name || ""}</Text>
          </TouchableOpacity>

          {isSearchVisible && (
            <View
              className="absolute top-20 z-40 w-full max-h-[350px] bg-white min-h-[150px] shadow-xl/30 rounded-xl px-2.5"
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
                  ref={restaurantInputRef}
                  placeholder="검색어를 입력하세요"
                  className="flex-1 ml-3 "
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              <View className="h-px bg-gray-300 my-3" />
              {debouncedSearchText?.length === 0 ? (
                <Text className="text-center text-gray-500 mt-4">
                  검색어를 입력해주세요
                </Text>
              ) : debouncedSearchText?.length < 2 ? (
                <Text className="text-center text-gray-500 mt-4">
                  2글자 이상 입력해주세요
                </Text>
              ) : restaurantData?.length === 0 ? (
                <Text className="text-center text-gray-500 mt-4">
                  검색 결과가 없습니다
                </Text>
              ) : (
                <FlatList
                  data={restaurantData}
                  renderItem={({ item }) => (
                    <RestaurantListItem
                      item={item}
                      setSelectedRestaurant={setSelectedRestaurant}
                      setIsSearchVisible={setIsSearchVisible}
                    />
                  )}
                />
              )}
            </View>
          )}
        </View>

        {selectedRestaurant?.address_name && (
          <View className="my-6 ">
            <Text className="mb-2 font-semibold text-black">지역 정보</Text>
            <View className="flex-row gap-3">
              <View className="bg-gray-50 border border-gray-200 items-center flex-1 px-4 py-3 rounded-xl">
                <Text>{addressParts[0]}</Text>
              </View>
              <View className="bg-gray-50 border border-gray-200 items-center flex-1 px-4 py-3 rounded-xl">
                <Text>{addressParts[1]}</Text>
              </View>
            </View>
          </View>
        )}

        <Controller
          name="memo"
          control={control}
          render={({}) => (
            <>
              <Text className="mb-2 font-semibold text-black">메모</Text>
              <TextInput
                multiline
                placeholder="맛집에 대한 간단한 메모를 작성하세요"
                style={{ textAlignVertical: "top" }}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl h-[120px]"
              ></TextInput>
            </>
          )}
        ></Controller>

        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text>제출하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
