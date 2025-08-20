import React, { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BASE_URL } from "@/utils/config";

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [restaurant, setRestaurant] = useState([]);

  const webviewRef = useRef(null);

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

  const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>카카오 지도</title>
      <!-- JS Key로 변경 -->
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services,clusterer"></script>
      <style>
         body { margin: 0; padding: 0; height: 100%; }
          html { height: 100%; }
          #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
<script>
  var map;
  kakao.maps.load(function() {
  console.log("✅ Kakao maps.load 실행됨");
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(${currentLocation.lat}, ${currentLocation.lng}),
      level: 3
    };
    map = new kakao.maps.Map(container, options);

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

      // 커스텀 오버레이 생성 (onclick 직접 삽입)
      var marker = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
        content: \`
          <div
            style="
              font-size: 16px;
              cursor: pointer;
              background: transparent;
              border: none;
              display: inline-block;
            "
            onclick="window.ReactNativeWebView.postMessage('Marker clicked: \${markerInfo.name}')"
          >
            \${emoji}
          </div>
        \`,
        yAnchor: 1
      });

      marker.setMap(map);
    });
  });
  document.addEventListener("message", function(event) {
        try {
          var msg = JSON.parse(event.data);
          if (msg.type === "panTo" && map) {
            var moveLatLon = new kakao.maps.LatLng(msg.lat, msg.lng);
            map.panTo(moveLatLon);
          }
        } catch (e) {
          console.log("메시지 처리 에러:", e);
        }
      });
    </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <View className="w-full h-[50%]">
        <WebView
          ref={webviewRef}
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="always"
          onMessage={(event) => {
            Alert.alert("마커 클릭", event.nativeEvent.data);
          }}
        />
      </View>
      <View className="w-full h-flex-1">
        <TouchableOpacity
          onPress={() => {
            webviewRef.current.postMessage(
              JSON.stringify({
                type: "panTo",
                lat: currentLocation?.lat,
                lng: currentLocation?.lng,
              })
            );
          }}
        >
          <Text>내 장소로 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// import { WebView } from "react-native-webview";

// const key = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY;

// const html = `
// <html>
//     <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1">
//         <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services,clusterer,drawing"></script>
//     </head>
//     <body >
//         <div id="map" style="width:500px;height:400px;"></div>
//         <script type="text/javascript">
//             (function () {
//                 const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
//                 const options = { //지도를 생성할 때 필요한 기본 옵션
//                     center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
//                     level: 3 //지도의 레벨(확대, 축소 정도)
//                 };

//                 const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

//                 // 주소-좌표 변환 객체를 생성합니다
//                 const geocoder = new kakao.maps.services.Geocoder();
//             })();
//         </script>
//     </body>
// </html>
// `;

// export default function App() {
//   return <WebView source={{ html: html }} />;
// }

// import { View } from "react-native";
// import { WebView } from "react-native-webview";

// const KAKAO_KEY = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY;

// const html = `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <meta charset="utf-8">
//     <style>
//       html, body { margin:0; padding:0; width:100%; height:100%; }
//       #map { width:100%; height:100%; }
//     </style>
//     <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=80b48adb449695d5b5f0f0d20cb01ac5&libraries=services,clusterer,drawing"></script>
//   </head>
//   <body>
//     <div id="map"></div>
//     <script>
//       // SDK가 준비될 때까지 기다리기
//       kakao.maps.load(function() {
//         var container = document.getElementById('map');
//         var options = {
//           center: new kakao.maps.LatLng(33.450701, 126.570667),
//           level: 3
//         };
//         var map = new kakao.maps.Map(container, options);

//         // 현재 위치 마커
//         var marker = new kakao.maps.Marker({
//           position: new kakao.maps.LatLng(33.450701, 126.570667),
//           title: '현재 위치'
//         });
//         marker.setMap(map);
//       });
//     </script>
//   </body>
// </html>
// `;

// export default function App() {
//   return (
//     <View className="w-full h-[50%]">
//       <WebView
//         originWhitelist={["*"]}
//         source={{ html }}
//         javaScriptEnabled
//         domStorageEnabled
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// }
