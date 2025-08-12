import React, { useRef } from "react";
import { Text, View } from "react-native";

import SelectDropdown from "react-native-select-dropdown";

import AntDesign from "@expo/vector-icons/AntDesign";

import { RegionData } from "@/types/restaurant";

interface Props {
  regionData: RegionData[];
  setSelectedRegionId: React.Dispatch<React.SetStateAction<number | null>>;
  subRegionData: RegionData[];
  setSelectedSubRegionId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function RegionFilter({
  regionData,
  setSelectedRegionId,
  subRegionData,
  setSelectedSubRegionId,
}: Props) {
  const subDropdownRef = useRef<InstanceType<typeof SelectDropdown>>(null);

  return (
    <View className="flex flex-row gap-3">
      <View className="flex-1 ">
        <SelectDropdown
          data={regionData}
          onSelect={(selectedItem) => {
            setSelectedRegionId(selectedItem?.id);
            subDropdownRef.current?.reset();
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View className="w-full h-10 bg-gray-50 rounded-lg text-sm px-3">
                <View className="w-full h-full flex flex-row justify-between items-center">
                  <Text>{selectedItem ? selectedItem?.name : "전체"}</Text>
                  <AntDesign name="down" size={12} color="black" />
                </View>
              </View>
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

      <View className="flex-1 ">
        <SelectDropdown
          ref={subDropdownRef}
          data={subRegionData}
          onSelect={(selectedItem) => setSelectedSubRegionId(selectedItem?.id)}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View className="w-full h-10 bg-gray-50 rounded-lg text-sm px-3">
                <View className="w-full h-full flex flex-row justify-between items-center">
                  <Text>{selectedItem ? selectedItem?.name : "전체"}</Text>
                  <AntDesign name="down" size={12} color="black" />
                </View>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View className="w-full flex-row px-3 py-2 justify-center items-center">
                <Text className="flex-1 text-lg font-semibold">
                  {item.name}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
