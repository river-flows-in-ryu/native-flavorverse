import { Text, TextInput, View } from "react-native";

import { Control, Controller } from "react-hook-form";

import { formData } from "@/types/restaurant";
interface Props {
  control: Control<formData>;
}

export default function MemoInput({ control }: Props) {
  return (
    <Controller
      name="memo"
      control={control}
      render={({ field: { onChange, value } }) => (
        <View className="mt-6">
          <Text className="mb-2 font-semibold text-black">메모</Text>
          <TextInput
            multiline
            placeholder="맛집에 대한 간단한 메모를 작성하세요"
            style={{ textAlignVertical: "top" }}
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl h-[120px]"
            onChangeText={onChange}
            value={value}
          ></TextInput>
        </View>
      )}
    ></Controller>
  );
}
