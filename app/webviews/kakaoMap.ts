export const getKakaoMapHtml = (
  lat: number,
  lng: number,
  markers: any[],
  KAKAO_JS_KEY: string | undefined
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>카카오 지도</title>
  <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services,clusterer"></script>
  <style>
    body { margin: 0; padding: 0; height: 100%; }
    html { height: 100%; }
    #map { width: 100%; height: 100%; }
    #recenterBtn {width: 40px; height: 40px; z-index: 1000; position: absolute; bottom: 10px; right: 10px; background-color: #fff; border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 50% ;display:flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <div id="map"></div>
  <button id="recenterBtn">
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M541.9 139.5C546.4 127.7 543.6 114.3 534.7 105.4C525.8 96.5 512.4 93.6 500.6 98.2L84.6 258.2C71.9 263 63.7 275.2 64 288.7C64.3 302.2 73.1 314.1 85.9 318.3L262.7 377.2L321.6 554C325.9 566.8 337.7 575.6 351.2 575.9C364.7 576.2 376.9 568 381.8 555.4L541.8 139.4z"/></svg>
  </button>
  <script>
    var map;
    kakao.maps.load(function() {
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(${lat}, ${lng}),
        level: 3
      };
      map = new kakao.maps.Map(container, options);

      // 현재 위치 마커
      var currentMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(${lat}, ${lng}),
        title: '현재 위치'
      });
      currentMarker.setMap(map);

      // 추가 마커
      var markers = ${JSON.stringify(markers)};
      markers.forEach(function(markerInfo) {
        var emoji = markerInfo.status === "GOOD" ? "❤️" : "❌";
        var marker = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
          content: \`
            <div
              style="font-size:16px; cursor:pointer;"
              onClick = "window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerClick', payload:{name:markerInfo.name}}))"
            >\${emoji}</div>
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

    document.getElementById("recenterBtn").addEventListener("click", function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "recenter" }));
    });

    document.addEventListener("message",function(event) {
        try{
            const msg = JSON.parse(event.data);
         
            if(msg.type === "panTo" && map){
                const newCenter = new kakao.maps.LatLng(msg.lat, msg.lng);
                map.panTo(newCenter);
            }
        }
        catch(error){
            console.log("메시지 처리 오류", error);
        }
    })


  </script>
</body>
</html>
`;
