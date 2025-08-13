import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { useForm } from "react-hook-form";

import CustomHeader from "@/components/customHeader";

import { BASE_URL } from "@/utils/config";

import {
  FoodCategory,
  KakaoKeywordSearchRestaurant,
  formData,
} from "@/types/restaurant";

import IsGoodRestaurantSelector from "@/app/restaurant/components/form/isGoodRestaurantSelector";
import RestaurantNameInput from "@/app/restaurant/components/form/restaurantNameInput";
import FoodCategorySelector from "@/app/restaurant/components/form/foodCategorySelector";
import MemoInput from "@/app/restaurant/components/form/memoInput";
import AddressInput from "@/app/restaurant/components/form/addressInput";

export default function Add() {
  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | KakaoKeywordSearchRestaurant>(null);

  // console.log(selectedRestaurant);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      foodCategory: 0,
      isGoodRestaurant: true,
      memo: "",
      address: "",
    },
  });

  const onSubmit = async (formData: formData) => {
    if (!selectedRestaurant) {
      setError("address", {
        type: "manual",
        message: "식당을 선택해주세요",
      });
      return;
    }

    const data = {
      ...formData,
      region1: addressParts[0],
      region2: addressParts[1],
      address: selectedRestaurant?.address_name,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/restaurants/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      const resJson = await res.json();
      console.log(resJson);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    if (selectedRestaurant) {
      clearErrors("address");
    }
  }, [selectedRestaurant]);

  const addressParts = selectedRestaurant?.address_name?.split(" ") || [];

  return (
    <View className="flex-1">
      <CustomHeader title="음식점 추가" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          className="flex-1 p-5 "
          contentContainerStyle={{ paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          <IsGoodRestaurantSelector control={control} />

          <RestaurantNameInput control={control} />

          <FoodCategorySelector
            control={control}
            foodCategoryData={foodCategoryData}
          />

          <AddressInput
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
            errors={errors}
          />

          <MemoInput control={control} />

          <View className="mt-10">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-black py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">제출하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
