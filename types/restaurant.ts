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
  id: number;
  name: string;
  address: string;
  memo: string;
  categoryId: number;
  regionId: number;
  subregionId: number;
  status: "BAD" | "GOOD";
  category: {
    name: string;
  };
  region: {
    name: string;
  };
  subregion: {
    name: string;
  };
}

export type RestaurantsApiResponse = {
  restaurants: Restaurant[];
  goodCount: number;
  badCount: number;
};
