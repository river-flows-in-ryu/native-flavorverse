import React, { useEffect, useState } from "react";

import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { BASE_URL } from "@/utils/config";

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [restaurant, setRestaurant] = useState([]);

  useEffect(() => {
    const restaurantFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/restaurants/location`);
        const resJson = await res.json();
        const simplified = resJson?.restaurants.map((r) => ({
          name: r.name,
          lat: r.latitude,
          lng: r.longitude,
          status: r.status,
        }));
        setRestaurant(simplified);
        console.log(simplified);
      } catch (error) {
        console.error(error);
      }
    };
    restaurantFetch();
  }, []);

  const test = [
    {
      lat: 37.4325581545104,
      lng: 127.129757740871,
      name: "La일락 성남모란본점",
      status: "GOOD",
    },
    {
      lat: 37.44202657754082,
      lng: 127.1469843284118,
      name: "땡주",
      status: "GOOD",
    },
    {
      lat: 37.4053564197474,
      lng: 127.442747417502,
      name: "당빛",
      status: "BAD",
    },
    {
      lat: 37.3329615377854,
      lng: 127.172264070704,
      name: "황소고집 본점",
      status: "GOOD",
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "위치 권한 필요",
          "위치 권한을 허용해야 지도를 사용할 수 있습니다."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  if (!currentLocation) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>카카오 지도</title>
      <!-- JS Key로 변경 -->
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false"></script>
      <style>
        html, body, #map { margin:0; padding:0; height:100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        kakao.maps.load(function() {
          var container = document.getElementById('map');
          var options = {
            center: new kakao.maps.LatLng(${currentLocation.lat}, ${currentLocation.lng}),
            level: 3
          };
          var map = new kakao.maps.Map(container, options);

          // 현재 위치 마커
          var currentMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(${currentLocation.lat}, ${currentLocation.lng}),
            title: '현재 위치'
          });
          currentMarker.setMap(map);

          // 추가 마커
          var markers = ${JSON.stringify(test)};
          
          markers.forEach(function(markerInfo) {
            var emoji = markerInfo.status === "GOOD" ? "❤️" : "❌";

        // 커스텀 오버레이 생성
        var marker = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
            content: '<div style="font-size:24px; text-align:center;">' + emoji + '</div>',
            yAnchor: 1 // 마커 아래쪽 기준
        });
            marker.setMap(map);

            // 마커 클릭 이벤트 예시
            kakao.maps.event.addListener(marker, 'click', function() {
              window.ReactNativeWebView.postMessage('Marker clicked: ' + markerInfo.name);
            });
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <View className="w-full h-[50%]">
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={(event) => {
            Alert.alert("마커 클릭", event.nativeEvent.data);
          }}
        />
      </View>
    </View>
  );
}
