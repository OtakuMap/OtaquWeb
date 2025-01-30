import React, { useEffect, useRef, useCallback } from 'react';
import * as S from '../../styles/map/MapContainer.styles';
import { RouteLocation } from '../../types/map/route';
import { getPlaceDetails, PlaceDetails } from '../../utils/mapUtils';

// interface MapContainerProps {
//   apiKey: string;
//   center: {
//     lat: number;
//     lng: number;
//   };
//   zoom?: number;
//   mapId?: string;
//   locations?: RouteLocation[];
//   onMarkerClick?: (location: RouteLocation) => void;
// }
interface MapContainerProps {
  apiKey: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  mapId?: string;
  locations?: RouteLocation[];
  onMarkerClick?: (location: RouteLocation, placeDetails?: PlaceDetails) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_LOADING_STATE = {
  loading: false,
  loaded: false,
  error: false,
  promise: null as Promise<void> | null,
};

const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  // 이미 로드된 경우
  if (GOOGLE_MAPS_LOADING_STATE.loaded) {
    return Promise.resolve();
  }

  // 로딩 중인 경우
  if (GOOGLE_MAPS_LOADING_STATE.loading && GOOGLE_MAPS_LOADING_STATE.promise) {
    return GOOGLE_MAPS_LOADING_STATE.promise;
  }

  // 이미 스크립트가 존재하는지 확인
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');

  if (existingScript) {
    GOOGLE_MAPS_LOADING_STATE.loaded = true;
    return Promise.resolve();
  }

  GOOGLE_MAPS_LOADING_STATE.loading = true;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=beta`;
  script.async = true;

  GOOGLE_MAPS_LOADING_STATE.promise = new Promise((resolve, reject) => {
    script.addEventListener('load', () => {
      GOOGLE_MAPS_LOADING_STATE.loaded = true;
      GOOGLE_MAPS_LOADING_STATE.loading = false;
      resolve();
    });

    script.addEventListener('error', (error) => {
      GOOGLE_MAPS_LOADING_STATE.error = true;
      GOOGLE_MAPS_LOADING_STATE.loading = false;
      reject(error);
    });
  });

  document.head.appendChild(script);
  return GOOGLE_MAPS_LOADING_STATE.promise;
};

const MapContainer: React.FC<MapContainerProps> = ({
  apiKey,
  center,
  zoom = 12,
  mapId = 'DEMO_MAP_ID',
  locations = [],
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // 경로 라인 업데이트 함수
  const updatePolyline = useCallback(() => {
    if (!mapInstance.current || !window.google?.maps) return;

    // 기존 라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // 새로운 경로 좌표 생성
    const path = locations.map((location) => ({
      lat: location.latitude,
      lng: location.longitude,
    }));

    // 새로운 라인 생성
    polylineRef.current = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#252660',
      strokeOpacity: 1,
      strokeWeight: 4,
      map: mapInstance.current,
    });
  }, [locations]);

  // 마커 생성 함수
  const createMarker = useCallback(
    (location: RouteLocation) => {
      if (!mapInstance.current) return null;

      const getMarkerSize = (zoomLevel: number) => {
        // 기본 크기 설정
        const baseWidth = 20; // 기본 너비의 절반
        const baseHeight = 38; // 기본 높이의 절반

        // 줌 레벨에 따른 크기 조정
        if (zoomLevel <= 10) {
          return { width: baseWidth * 0.5, height: baseHeight * 0.5 };
        } else if (zoomLevel <= 12) {
          return { width: baseWidth * 0.7, height: baseHeight * 0.7 };
        } else if (zoomLevel <= 14) {
          return { width: baseWidth * 0.9, height: baseHeight * 0.9 };
        }
        return { width: baseWidth, height: baseHeight };
      };

      const initialSize = getMarkerSize(mapInstance.current?.getZoom() || 12);

      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: mapInstance.current,
        icon: {
          url: '/src/assets/pin.png',
          scaledSize: new window.google.maps.Size(initialSize.width * 2, initialSize.height * 2),
        },
      });

      // 줌 변경 시 마커 크기 업데이트
      mapInstance.current?.addListener('zoom_changed', () => {
        const newZoom = mapInstance.current?.getZoom() || 12;
        const newSize = getMarkerSize(newZoom);
        marker.setIcon({
          url: '/src/assets/pin.png',
          scaledSize: new window.google.maps.Size(newSize.width * 2, newSize.height * 2),
        });
      });

      // 클릭 핸들러를 별도 함수로 분리
      const handleMarkerClick = async () => {
        try {
          console.log('Marker clicked:', location);

          if (!mapInstance.current) {
            console.error('Map instance not available');
            return;
          }

          const placeDetails = await getPlaceDetails(
            location.latitude,
            location.longitude,
            apiKey,
            mapInstance.current,
          );

          console.log('Place details received:', placeDetails);

          if (onMarkerClick) {
            onMarkerClick(location, placeDetails);
          }

          requestAnimationFrame(() => {
            const map = mapInstance.current;
            if (!map) return;

            map.setCenter({
              lat: location.latitude,
              lng: location.longitude,
            });
            map.setZoom(17);
          });
        } catch (error) {
          console.error('Error in marker click handler:', error);
          if (onMarkerClick) {
            onMarkerClick(location);
          }
        }
      };

      marker.addListener('click', handleMarkerClick);
      return marker;
    },
    [apiKey, onMarkerClick],
  );

  // 마커 업데이트
  const updateMarkers = useCallback(() => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 생성
    locations.forEach((location) => {
      const marker = createMarker(location);
      if (marker) {
        markersRef.current.push(marker);
      }
    });

    // 경로 라인 업데이트
    updatePolyline();
  }, [locations, createMarker, updatePolyline]);

  const initializeMap = useCallback(async () => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer || !window.google?.maps) return;

    try {
      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapContainer, {
          center,
          zoom,
          mapId,
        });
        updateMarkers();
      } else {
        mapInstance.current.setCenter(center);
        mapInstance.current.setZoom(zoom);
        updateMarkers();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [center, zoom, mapId, updateMarkers]);

  useEffect(() => {
    const setupMap = async () => {
      try {
        await loadGoogleMapsApi(apiKey);
        await initializeMap();
      } catch (error) {
        console.error('Error setting up Google Maps:', error);
      }
    };

    setupMap();

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, [apiKey, initializeMap]);

  // locations가 변경될 때마다 마커와 경로 라인 업데이트
  useEffect(() => {
    if (mapInstance.current) {
      updateMarkers();
    }
  }, [locations, updateMarkers]);

  return <S.MapDiv ref={mapContainerRef} />;
};

export default MapContainer;
