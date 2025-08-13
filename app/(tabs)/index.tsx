import { useEffect, useRef, useState } from "react";
import {
  Text,
  StatusBar,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { useRouter } from "expo-router";

import SelectDropdown from "react-native-select-dropdown";

import { BASE_URL } from "@/utils/config";

import RestaurantItem from "@/components/restaurantItem";
import RestaurantDeleteDialog from "@/components/restaurantDeleteDialog";

import "../../global.css";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import {
  RegionData,
  FoodCategory,
  restaurantsStatusCount,
  Restaurant,
  RestaurantsApiResponse,
} from "@/types/restaurant";
import SearchBar from "./components/searchBar";
import RegionFilter from "./components/regionFilter";
import TasteFilterToggle from "./components/tasteFilterToggle";
import FoodCategorySelector from "./components/foodCategorySelector";

import AntDesign from "@expo/vector-icons/AntDesign";

export default function HomeScreen() {
  const [regionData, setRegionData] = useState<[] | RegionData[]>([]);
  const [subRegionData, setSubRegionData] = useState<[] | RegionData[]>([]);
  const [foodCategoryData, setFoodCategoryData] = useState<[] | FoodCategory[]>(
    []
  );
  const [restaurantData, setRestaurantData] = useState<[] | Restaurant[]>([]);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [isGoodRestaurant, setIsGoodRestaurant] = useState(true);

  const [selectedRegionId, setSelectedRegionId] = useState<null | number>(null);
  const [selectedSubRegionId, setSelectedSubRegionId] = useState<null | number>(
    null
  );
  const [selectedFoodCategoryId, setSelectedFoodCategoryId] = useState<
    null | number
  >(null);

  const [restaurantsStatusCount, setRestaurantsStatusCount] =
    useState<restaurantsStatusCount>({ goodCount: 0, badCount: 0 });

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const regionDropdownRef = useRef<InstanceType<typeof SelectDropdown>>(null);
  const subRegionDropdownRef =
    useRef<InstanceType<typeof SelectDropdown>>(null);

  const foodCategoryDropdownRef =
    useRef<InstanceType<typeof SelectDropdown>>(null);

  const router = useRouter();

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
      setDebouncedSearchText(searchText);
    }, 500); // 디바운스 시간 조절 (ms)

    return () => {
      clearTimeout(timer); // 입력 중 타이머 초기화
    };
  }, [searchText]);

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
          const resJson = (await res.json()) as RestaurantsApiResponse;
          setRestaurantsStatusCount({
            goodCount: resJson?.goodCount,
            badCount: resJson?.badCount,
          });
          setRestaurantData(resJson?.restaurants);
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

  const handleClickDelete = (id: number) => {
    setDeleteTargetId(id);
    setIsDialogVisible(true);
  };

  const regionFilterProps = {
    regionData,
    setSelectedRegionId,
    subRegionData,
    setSelectedSubRegionId,
    selectedRegionId,
    regionDropdownRef,
    subRegionDropdownRef,
  };

  const confirmDelete = async () => {
    if (deleteTargetId !== null) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/restaurants/${deleteTargetId}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setRestaurantData((prev) =>
            prev.filter((r) => r.id !== deleteTargetId)
          );
          setIsDialogVisible(false);
          setDeleteTargetId(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const hideDialog = () => setIsDialogVisible(false);

  const isShowResetButton =
    searchText !== "" ||
    selectedRegionId !== null ||
    selectedSubRegionId !== null ||
    selectedFoodCategoryId !== null;

  return (
    <View className="flex-1">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {isDialogVisible && (
        <RestaurantDeleteDialog
          hideDialog={hideDialog}
          confirmDelete={confirmDelete}
        />
      )}
      <View
        className="flex-1 px-4"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View className="flex flex-row justify-between items-center gap-3 py-4 border-b border-gray-100">
          <Text className=" text-2xl font-bold text-black">맛집 관리</Text>
          <TouchableOpacity
            className="w-10 h-10 flex justify-center text-center items-center bg-black rounded-full"
            onPress={() => router.push("/restaurant/form")}
          >
            <FontAwesome6 name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {isShowResetButton && (
          <View className="flex-row justify-end my-2.5">
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSelectedRegionId(null);
                setSelectedSubRegionId(null);
                setSelectedFoodCategoryId(null);
                regionDropdownRef.current?.reset();
                subRegionDropdownRef.current?.reset();
                foodCategoryDropdownRef.current?.reset();
              }}
              className="flex-row justify-center items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg "
            >
              <AntDesign name="close" size={14} color="black" />
              <Text className="text-gray-600 text-sm">필터 초기화</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-[1px] bg-gray-200 my-2.5 w-full" />

        <RegionFilter regionFilterProps={regionFilterProps} />

        <View className="h-[1px] bg-gray-200 my-2.5 w-full" />

        <TasteFilterToggle
          restaurantsStatusCount={restaurantsStatusCount}
          isGoodRestaurant={isGoodRestaurant}
          setIsGoodRestaurant={setIsGoodRestaurant}
        />

        <FoodCategorySelector
          foodCategoryData={foodCategoryData}
          setSelectedFoodCategoryId={setSelectedFoodCategoryId}
          foodCategoryDropdownRef={foodCategoryDropdownRef}
        />
        <Text className="text-sm text-gray-500 mb-2">
          총 0개의 결과 (페이지 0/0)
        </Text>

        <View className=" h-[300px] px-4 pb-4">
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={restaurantData}
            renderItem={({ item }) => (
              <RestaurantItem
                item={item}
                onDelete={() => handleClickDelete(item.id)}
              />
            )}
          ></FlatList>
        </View>

        <View className="flex flex-row"></View>
      </View>
    </View>
  );
}
