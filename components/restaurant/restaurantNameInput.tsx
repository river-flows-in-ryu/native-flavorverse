import { Text, TextInput, View } from "react-native";

import { Control, Controller } from "react-hook-form";

import { formData } from "@/types/restaurant";
interface Props {
  control: Control<formData>;
}

export default function RestaurantNameInput({ control }: Props) {
  return (
    <Controller
      name="name"
      control={control}
      rules={{ required: "이 필드는 필수입니다." }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-6">
          <View className="flex flex-row mb-2">
            <Text className="mr-2.5 font-semibold text-black">가게 이름</Text>
            <Text className="text-red-500">*</Text>
          </View>
          <TextInput
            placeholder="가게 이름을 입력하세요."
            className="h-[50px] px-4 py-3 rounded-xl bg-[#f9f9f9]"
            onChangeText={onChange}
            value={value}
          />
          {error && (
            <Text className="pl-5 mt-2 text-red-500  text-sm">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
