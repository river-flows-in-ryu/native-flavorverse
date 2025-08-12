import { Text, View } from "react-native";

import { Control, Controller } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";

import { FoodCategory, formData } from "@/types/restaurant";

import AntDesign from "@expo/vector-icons/AntDesign";
interface Props {
  control: Control<formData>;
  foodCategoryData: [] | FoodCategory[];
}

export default function FoodCategorySelector({
  control,
  foodCategoryData,
}: Props) {
  return (
    <Controller
      name="foodCategory"
      control={control}
      rules={{
        validate: (value) => value !== 0 || "카테고리를 선택해주세요",
      }}
      render={(
        { field: { onChange, value }, fieldState: { error } } //
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
          {error && (
            <Text className="text-red-500 pl-5 text-sm mt-2">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
