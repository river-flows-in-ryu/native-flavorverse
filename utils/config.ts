import { Platform } from "react-native";

const API_URL_ANDROID = process.env.EXPO_PUBLIC_API_URL_ANDROID;
const API_URL_IOS = process.env.EXPO_PUBLIC_API_URL_IOS;

const BASE_URL = Platform.OS === "android" ? API_URL_ANDROID : API_URL_IOS;
export { BASE_URL };
