import { Map, Polygon, MapMarker } from "react-kakao-maps-sdk";
import "./App.css";
import React, { useState, useEffect } from "react";

export default function App() {
  const [mapCenter, setMapCenter] = useState({ lat: 37.566826, lng: 126.9786567 });
  const [mapLevel, setMapLevel] = useState(8);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMarker, setSearchMarker] = useState(null);
  const [map, setMap] = useState(null);

  const handlePolygonClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    console.log(`다각형이 ${count}번 클릭되었습니다.`);
  }, [count]);

  // 검색 기능
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const firstResult = data[0];
        const position = {
          lat: parseFloat(firstResult.y),
          lng: parseFloat(firstResult.x),
        };

        setMapCenter(position);
        setMapLevel(3); 
        
        setSearchMarker({
          position: position,
          content: firstResult.place_name,
        });

        const moveLatLon = new window.kakao.maps.LatLng(position.lat, position.lng);
        map.setCenter(moveLatLon);
        map.setLevel(3);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        setSearchMarker(null);
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert("검색 중 오류가 발생했습니다.");
        setSearchMarker(null);
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <div className="mapWrapper">
      <div className="searchContainer">
        <input
          type="text"
          placeholder="장소 검색 (예: 강남역, 이태원 맛집)"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="searchInput"
        />
        <button onClick={handleSearch} className="searchButton">
          검색
        </button>
      </div>
      <Map 
        className="map" 
        center={mapCenter} 
        level={mapLevel} 
        draggable
        onCreate={setMap}
      >
        <Polygon
          path={[
            { lat: 37.48810143111946, lng: 126.82452978219033 },
            { lat: 37.48695810335867, lng: 126.8251713008845 },
            { lat: 37.486670200045545, lng: 126.82545464527402 },
            { lat: 37.48637306909926, lng: 126.8255910192975 },
            { lat: 37.48648143982792, lng: 126.82576037101748 },
            { lat: 37.486591139557376, lng: 126.82683427430024 },
            { lat: 37.48673551555281, lng: 126.82698093138627 },
            { lat: 37.48729418769895, lng: 126.82701356403113 },
            { lat: 37.48802325474698, lng: 126.82650306144517 },
            { lat: 37.48835113956948, lng: 126.82583517879134 },
            { lat: 37.48856577528182, lng: 126.82474918693414 },
          ]}
          strokeWeight={2}
          strokeColor={"#000000"}
          strokeOpacity={0.8}
          fillColor={isMouseOver ? "#ff4400" : "#ffac13"}
          fillOpacity={isMouseOver ? 0.8 : 0.5}

          onMouseover={() => setIsMouseOver(true)}
          onMouseout={() => setIsMouseOver(false)}
          onMousedown={() => {
            handlePolygonClick();
          }}
          />
          <MapMarker
            position={{
              // 인포윈도우가 표시될 위치
              lat: 37.48750415432594,
              lng: 126.82580887749724,
            }}
            clickable={true} 
            onClick={() => setIsOpen(true)}
          >
   
            {isOpen && (
              <div style={{ minWidth: "150px" }}>
                <img
                  alt="close"
                  width="14"
                  height="13"
                  src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpen(false)}
                />
                <div style={{ padding: "5px", color: "#000" }}>성공회대학교</div>
              </div>
            )}
          </MapMarker>
          {/* 검색 결과 마커 */}
          {searchMarker && (
            <MapMarker
              position={searchMarker.position}
              clickable={true}
            >
              <div style={{ padding: "5px", color: "#000", minWidth: "150px" }}>
                {searchMarker.content}
              </div>
            </MapMarker>
          )}
      </Map>
    </div>
  );
}