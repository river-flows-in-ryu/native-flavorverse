import { useEffect, useRef, useState } from "react";
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

import { BASE_URL } from "@/utils/config";

import RestaurantItem from "@/components/restaurantItem";

import "../../global.css";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";

import SelectDropdown from "react-native-select-dropdown";

import {
  RegionData,
  FoodCategory,
  restaurantsStatusCount,
  Restaurant,
} from "@/types/restaurant";

export default function HomeScreen() {
  const [regionData, setRegionData] = useState<[] | RegionData[]>([]);
  const [subRegionData, setSubRegionData] = useState<[] | RegionData[]>([]);
  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );
  const [restaurantData, setRestaurantData] = useState<[] | Restaurant[]>([]);

  const [seartchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [isGoodRestaurant, setIsGoodRestaurant] = useState(true);

  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedSubRegionId, setSelectedSubRegionId] = useState(null);
  const [selectedFoodCategoryId, setSelectedFoodCategoryId] = useState(null);

  const subDropdownRef = useRef<InstanceType<typeof SelectDropdown>>(null);

  const [restaurantsStatusCount, setRestaurantsStatusCount] =
    useState<restaurantsStatusCount>({ goodCount: 0, badCount: 0 });

  useEffect(() => {
    const regionFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/regions`);
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

  useEffect(() => {}, [selectedRegionId]);

  useEffect(() => {
    const subRegionFetch = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/regions/${selectedRegionId}/subregions`
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
  }, [selectedRegionId]);

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
    const restaurantsStatusCountFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/restaurants/count`);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(seartchText);
    }, 500); // 디바운스 시간 조절 (ms)

    return () => {
      clearTimeout(timer); // 입력 중 타이머 초기화
    };
  }, [seartchText]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (selectedRegionId) {
          queryParams.append("regionId", String(selectedRegionId));
        }
        if (selectedSubRegionId) {
          queryParams.append("subRegionId", String(selectedSubRegionId));
        }
        if (selectedFoodCategoryId) {
          queryParams.append("foodCategoryId", String(selectedFoodCategoryId));
        }
        if (typeof isGoodRestaurant === "boolean") {
          queryParams.append("isGood", isGoodRestaurant ? "true" : "false");
        }
        if (debouncedSearchText.trim()) {
          queryParams.append("search", debouncedSearchText.trim());
        }

        const res = await fetch(
          `${BASE_URL}/api/restaurants?${queryParams.toString()}`
        );
        if (res.ok) {
          const resJson = (await res.json()) as Restaurant[];
          setRestaurantData(resJson);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [
    selectedRegionId,
    selectedSubRegionId,
    selectedFoodCategoryId,
    isGoodRestaurant,
    debouncedSearchText,
  ]);

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
            value={seartchText}
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

          {seartchText !== "" && (
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
              onSelect={(selectedItem) =>
                setSelectedSubRegionId(selectedItem?.id)
              }
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
            onSelect={(selectedItem) =>
              setSelectedFoodCategoryId(selectedItem?.id)
            }
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
          <FlatList
            data={restaurantData}
            renderItem={RestaurantItem}
          ></FlatList>
        </View>

        <View className="flex flex-row"></View>
      </View>
    </SafeAreaView>
  );
}
