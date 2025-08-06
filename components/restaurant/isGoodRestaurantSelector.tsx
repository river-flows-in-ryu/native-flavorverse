import { Text, TouchableOpacity, View } from "react-native";

import { Controller, Control } from "react-hook-form";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

import { formData } from "@/types/restaurant";

interface Props {
  control: Control<formData>;
}

export default function IsGoodRestaurantSelector({ control }: Props) {
  return (
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
                <Text className={`font-semibold ${value ? "text-white" : ""}`}>
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
                <Text className={`font-semibold ${value ? "" : "text-white"}`}>
                  노맛집
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    ></Controller>
  );
}
