import React from "react";
import { Text, View } from "react-native";

import SelectDropdown from "react-native-select-dropdown";

import AntDesign from "@expo/vector-icons/AntDesign";

import { FoodCategory } from "@/types/restaurant";

interface Props {
  foodCategoryData: FoodCategory[];
  setSelectedFoodCategoryId: (id: number) => void;
  foodCategoryDropdownRef: React.RefObject<InstanceType<
    typeof SelectDropdown
  > | null>;
}

export default function FoodCategorySelector({
  foodCategoryData,
  setSelectedFoodCategoryId,
  foodCategoryDropdownRef,
}: Props) {
  return (
    <View className="mb-3">
      <SelectDropdown
        ref={foodCategoryDropdownRef}
        data={foodCategoryData}
        onSelect={(selectedItem) => setSelectedFoodCategoryId(selectedItem?.id)}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View className="w-full h-10 bg-gray-50 rounded-lg text-sm px-3">
              <View className="w-full h-full flex flex-row justify-between items-center">
                <Text>
                  {selectedItem ? selectedItem?.name : "음식 카테고리 : 전체"}
                </Text>
                <AntDesign name="down" size={12} color="black" />
              </View>
            </View>
          );
        }}
        renderItem={(item) => {
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
  );
}
