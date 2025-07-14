import { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import "../../global.css";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";

import SelectDropdown from "react-native-select-dropdown";

import {
  RegionData,
  FoodCategory,
  restaurantsStatusCount,
  Restaurant,
} from "@/types/restaurant";

interface ItemProps {
  item: {
    title: string;
    category: string;
    location: string;
    location2: string;
    address: string;
    description: string;
  };
}

const testData2 = [
  {
    title: "La일락 성남모란본점",
    category: "양식",
    location: "경기도",
    location2: "성남시",
    address: "경기 성남시 중원구 성남동 3218",
    description: "새우로제파스타 존맛집 여기 탑임",
  },
  {
    title: "땡주",
    category: "한식",
    location: "경기도",
    location2: "성남시",
    address: "경기도 성남시 수정구 공원로339번길 36 1층",
    description: "감자채전이 존맛 닭볶음탕보다는 고추장찌개 맛집",
  },
];

const renderItemView = ({ item }: ItemProps) => {
  const { title, category, location, location2, address, description } = item;
  return (
    <View className="rounded-2xl p-5 border border-gray-50 gap-4">
      <View className="flex flex-row justify-between mb-2">
        <Text
          className="text-lg font-bold flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <View className="flex flex-row gap-2">
          <TouchableOpacity className="w-8 h-8 bg-gray-100 justify-center items-center rounded-lg">
            <Feather name="edit-2" size={16} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="w-8 h-8 bg-gray-100 justify-center items-center rounded-lg">
            <Feather name="trash-2" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row mb-2 gap-2">
        <View className="px-2 py-1 bg-black rounded-full">
          <Text className="text-white text-xs">{category}</Text>
        </View>
        <View className="px-2 py-1 bg-gray-100 rounded-full">
          <Text className="text-gray-600 text-xs ">{location}</Text>
        </View>
        <View className="px-2 py-1 bg-gray-100 rounded-full">
          <Text className="text-gray-600 text-xs">{location2}</Text>
        </View>
      </View>
      <Text className="mb-2">{address}</Text>
      <Text>{description}</Text>
      <View className="flex flex-row gap-2 items-center">
        <EvilIcons name="location" size={16} color="black" />
        <Text className="flex">탭하여 지도에서 보기</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [regionData, setRegionData] = useState<[] | RegionData[]>([]);
  const [subRegionData, setSubRegionData] = useState<[] | RegionData[]>([]);
  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );

  const [seatchText, setSearchText] = useState("");

  const [isGoodRestaurant, setIsGoodRestaurant] = useState(true);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubRegion, setSelectedSubRegion] = useState("");
  const [selectedFoodCategory, setSelectedFoodCategory] = useState("");

  const [restaurantsStatusCount, setRestaurantsStatusCount] =
    useState<restaurantsStatusCount>({ goodCount: 0, badCount: 0 });

  useEffect(() => {
    const regionFetch = async () => {
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";

      try {
        const res = await fetch(`${baseUrl}/api/regions`);
        if (res?.ok) {
          const data = (await res.json()) as RegionData[];
          setRegionData(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    regionFetch();
  }, []);

  useEffect(() => {}, [selectedRegion]);

  useEffect(() => {
    const subRegionFetch = async () => {
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";
      try {
        const selectedRegionId = regionData?.filter(
          (item) => item?.name === selectedRegion
        )[0]?.id;

        const res = await fetch(
          `${baseUrl}/api/regions/${selectedRegionId}/subregions`
        );
        if (res?.ok) {
          const resJson = (await res.json()) as RegionData[];
          setSubRegionData(resJson);
        }
      } catch (error) {
        console.error(error);
      }
    };
    subRegionFetch();
  }, [selectedRegion]);

  useEffect(() => {
    const foodCategoryFetch = async () => {
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";
      try {
        const res = await fetch(`${baseUrl}/api/food-categories`);
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
    const restaurantsStatusCountFetch = async () => {
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";
      try {
        const res = await fetch(`${baseUrl}/api/restaurants/count`);
        if (res.ok) {
          const resJson = (await res.json()) as restaurantsStatusCount;
          setRestaurantsStatusCount(resJson);
        }
      } catch (error) {
        console.error(error);
      }
    };
    restaurantsStatusCountFetch();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View
        className="flex-1 px-4"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View className="flex flex-row justify-between items-center gap-3 py-4 border-b border-gray-100">
          <Text className=" text-2xl font-bold text-black">맛집 관리</Text>
          <TouchableOpacity className="w-10 h-10 flex justify-center text-center items-center bg-black rounded-full">
            <FontAwesome6 name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            placeholder="맛집 이름, 주소, 설명으로 검색 "
            value={seatchText}
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

          {seatchText !== "" && (
            <TouchableOpacity
              className="absolute right-3 top-0 h-full justify-center"
              onPress={() => setSearchText("")}
            >
              <AntDesign name="closecircleo" size={12} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View className="h-[1px] bg-gray-200 my-2.5 w-full" />

        <View className="flex flex-row gap-3">
          <View className="flex-1 ">
            <SelectDropdown
              data={regionData}
              onSelect={(selectedItem) => setSelectedRegion(selectedItem?.name)}
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
              data={subRegionData}
              onSelect={(selectedItem) => setSelectedSubRegion(selectedItem)}
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

        <View className="h-[1px] bg-gray-200 my-2.5 w-full" />

        <View className="flex flex-row gap-3 mb-4">
          <TouchableOpacity
            className={`flex-1 h-12 flex justify-center items-center rounded-lg ${isGoodRestaurant ? "bg-black" : "bg-gray-200"}`}
            onPress={() => setIsGoodRestaurant(true)}
          >
            <View className="flex flex-row items-center gap-2">
              <AntDesign
                name="hearto"
                size={14}
                color={`${isGoodRestaurant ? "white" : "black"}`}
              />
              <Text
                className={`font-semibold ${isGoodRestaurant ? "text-white" : ""}`}
              >
                맛집 ({restaurantsStatusCount?.goodCount})
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 h-12 justify-center items-center rounded-lg ${isGoodRestaurant ? "bg-gray-200" : "bg-black "}`}
            onPress={() => setIsGoodRestaurant(false)}
          >
            <View className="flex flex-row items-center gap-2">
              <FontAwesome5
                name="heart-broken"
                size={14}
                color={`${isGoodRestaurant ? "black" : "white"}`}
              />
              <Text
                className={`font-semibold ${isGoodRestaurant ? "" : "text-white"}`}
              >
                노맛집 ({restaurantsStatusCount?.badCount})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mb-3">
          <SelectDropdown
            data={foodCategoryData}
            onSelect={(selectedItem) => setFoodCategoryData(selectedItem)}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View className="w-full h-10 bg-gray-50 rounded-lg text-sm px-3">
                  <View className="w-full h-full flex flex-row justify-between items-center">
                    <Text>
                      {selectedItem
                        ? selectedItem?.name
                        : "음식 카테고리 : 전체"}
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
        <Text className="text-sm text-gray-500 mb-2">
          총 0개의 결과 (페이지 0/0)
        </Text>

        <View className=" h-[300px] px-4 pb-4">
          <FlatList data={testData2} renderItem={renderItemView}></FlatList>
        </View>

        <View className="flex flex-row"></View>
      </View>
    </SafeAreaView>
  );
}
