export interface RegionData {
  id: number;
  name: string;
}

export interface FoodCategory {
  id: number;
  name: string;
}

export interface restaurantsStatusCount {
  badCount: number;
  goodCount: number;
}

export interface Restaurant {
  id?: number;
  name: string;
  address?: string;
  memo: string;
  categoryId?: number;
  regionId?: number;
  subregionId?: number;
  status: "BAD" | "GOOD" | string;
  category: {
    name: string;
  };
  region: {
    name: string;
  };
  subregion: {
    name: string;
  };
  lat: number;
  lng: number;
  distance?: number;
}

export type RestaurantsApiResponse = {
  restaurants: Restaurant[];
  goodCount: number;
  badCount: number;
};

export interface KakaoKeywordSearchRestaurant {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: number;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

export interface KakaoKeywordSearchResponse {
  documents: KakaoKeywordSearchRestaurant[];
}

export interface formData {
  address: string;
  foodCategory: number;
  isGoodRestaurant: boolean;
  memo: string;
  name: string;
  latitude?: number;
  longitude?: number;
  region1?: string;
  region2?: string;
}
