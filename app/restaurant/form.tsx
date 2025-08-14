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
import { useLocalSearchParams } from "expo-router";

import CustomHeader from "@/components/customHeader";

import { BASE_URL } from "@/utils/config";

import {
  FoodCategory,
  KakaoKeywordSearchRestaurant,
  Restaurant,
  formData,
} from "@/types/restaurant";

import IsGoodRestaurantSelector from "./components/form/isGoodRestaurantSelector";
import RestaurantNameInput from "./components/form/restaurantNameInput";
import FoodCategorySelector from "./components/form/foodCategorySelector";
import MemoInput from "./components/form/memoInput";
import AddressInput from "./components/form/addressInput";

export default function Form() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | KakaoKeywordSearchRestaurant>(null);

  const {
    address,
    category,
    categoryId,
    memo,
    name,
    region,
    status,
    subregion,
  } = restaurant || {};

  const categoryName = category?.name;
  const regionName = region?.name;
  const subRegionName = subregion?.name;

  useEffect(() => {
    if (!id) return;
    const fetchRestaurantById = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/restaurants/${id}`);
        if (res.ok) {
          const resJson = (await res.json()) as Restaurant;
          setRestaurant(resJson);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchRestaurantById();
  }, [id, isEdit]);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: isEdit ? name || "" : "",
      foodCategory: isEdit ? categoryId || 0 : 0,
      isGoodRestaurant: isEdit ? status === "GOOD" : true,
      memo: isEdit ? memo || "" : "",
      address: isEdit ? address || "" : "",
    },
  });

  useEffect(() => {
    if (restaurant) {
      reset({
        name: name,
        foodCategory: categoryId,
        isGoodRestaurant: restaurant.status === "GOOD",
        memo: memo,
        address: address,
      });
    }
  }, [restaurant, reset, name, categoryId, memo, address]);

  const onSubmit = async (formData: formData) => {
    if (!selectedRestaurant && !isEdit) {
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
      address: selectedRestaurant?.address_name || address,
    };

    try {
      const url = isEdit
        ? `${BASE_URL}/api/restaurants/${id}`
        : `${BASE_URL}/api/restaurants/`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method,
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

  const addressParts =
    (selectedRestaurant?.address_name || address || "").split(" ") || [];

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
            isEdit={isEdit}
            control={control}
            foodCategoryData={foodCategoryData}
          />

          <AddressInput
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
            errors={errors}
            address={address}
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
