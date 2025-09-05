import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";

interface Props {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ searchText, setSearchText }: Props) {
  return (
    <View>
      <TextInput
        placeholder="맛집 이름, 주소, 설명으로 검색 "
        value={searchText}
        onChangeText={setSearchText}
        className="w-full h-12 relative border-none border-gray-100 bg-gray-50 rounded-lg px-12"
        spellCheck={false}
        autoCorrect={false}
        style={{
          textDecorationLine: "none",
        }}
      />

      <View className="absolute left-3 top-0 h-full justify-center">
        <AntDesign name="search1" size={20} color="black" />
      </View>

      {searchText !== "" && (
        <TouchableOpacity
          className="absolute right-3 top-0 h-full justify-center"
          onPress={() => setSearchText("")}
        >
          <AntDesign name="closecircleo" size={12} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}
