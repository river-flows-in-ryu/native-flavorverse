import { useEffect, useRef, useState } from "react";

import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import RestaurantListItem from "./restaurantListItem";

import EvilIcons from "@expo/vector-icons/EvilIcons";

import { KakaoKeywordSearchRestaurant } from "@/types/restaurant";

interface Props {
  selectedRestaurant: null | KakaoKeywordSearchRestaurant;
  setSelectedRestaurant: React.Dispatch<
    React.SetStateAction<KakaoKeywordSearchRestaurant | null>
  >;
  errors: any;
}

export default function AddressInput({
  selectedRestaurant,
  setSelectedRestaurant,
  errors,
}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");

  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [restaurantData, setRestaurantData] = useState<
    [] | KakaoKeywordSearchRestaurant[]
  >([]);

  const restaurantInputRef = useRef<TextInput>(null);

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  // 키워드 카카오 검색
  useEffect(() => {
    const kakaoKeywordSearch = async () => {
      if (debouncedSearchText.length < 2) {
        setRestaurantData([]);
        return;
      }

      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY}`,
          },
        }
      );
      const resJson = (await res.json()) as {
        documents: KakaoKeywordSearchRestaurant[];
      };
      // console.log(resJson);
      setRestaurantData(resJson?.documents);
    };
    kakaoKeywordSearch();
  }, [debouncedSearchText]);

  useEffect(() => {
    if (isSearchVisible) {
      restaurantInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  const addressParts = selectedRestaurant?.address_name?.split(" ") || [];

  return (
    <>
      <View className="flex-row">
        <Text className="mr-2.5">주소</Text>
        <Text className="text-red-500">*</Text>
      </View>

      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsSearchVisible((prev: boolean) => !prev)}
          className="flex-row items-center h-[50px] px-4 py-3  rounded-xl bg-[#f9f9f9] mb-2.5"
        >
          <Text>{selectedRestaurant?.address_name || ""}</Text>
        </TouchableOpacity>

        {isSearchVisible && (
          <View
            className="absolute top-20 z-40 w-full max-h-[235px] bg-white min-h-[150px] shadow-xl/30 rounded-xl px-2.5"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,

              elevation: 6,
            }}
          >
            <View className="flex-row justify-center items-center bg-[#f9f9f9] rounded-xl h-[50px]">
              <EvilIcons
                name="search"
                size={24}
                color="black"
                className="ml-3"
              />
              <TextInput
                ref={restaurantInputRef}
                placeholder="검색어를 입력하세요"
                className="flex-1 ml-3 "
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View className=" bg-gray-300 my-3" />
            {debouncedSearchText?.length === 0 ? (
              <Text className="text-center text-gray-500 mt-4">
                검색어를 입력해주세요
              </Text>
            ) : debouncedSearchText?.length < 2 ? (
              <Text className="text-center text-gray-500 mt-4">
                2글자 이상 입력해주세요
              </Text>
            ) : restaurantData?.length === 0 ? (
              <Text className="text-center text-gray-500 mt-4">
                검색 결과가 없어요. 직접 가게를 등록하시겠어요?
              </Text>
            ) : (
              <FlatList
                data={restaurantData}
                renderItem={({ item }) => (
                  <RestaurantListItem
                    item={item}
                    setSelectedRestaurant={setSelectedRestaurant}
                    setIsSearchVisible={setIsSearchVisible}
                  />
                )}
              />
            )}
          </View>
        )}
      </View>

      {selectedRestaurant?.address_name && (
        <View className="mt-6 ">
          <Text className="mb-2 font-semibold text-black">지역 정보</Text>
          <View className="flex-row gap-3">
            <View className="bg-gray-50 border border-gray-200 items-center flex-1 px-4 py-3 rounded-xl">
              <Text>{addressParts[0]}</Text>
            </View>
            <View className="bg-gray-50 border border-gray-200 items-center flex-1 px-4 py-3 rounded-xl">
              <Text>{addressParts[1]}</Text>
            </View>
          </View>
        </View>
      )}

      {errors.address && (
        <Text className="text-red-500 text-sm mt-2">
          {errors.address.message}
        </Text>
      )}
    </>
  );
}
