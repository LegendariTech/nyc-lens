'use client';

import React, { useRef, useEffect, useState } from 'react';
import Map, { Layer, Source, MapRef } from 'react-map-gl/mapbox';
import type { MapMouseEvent } from 'react-map-gl/mapbox';
import { useRouter } from 'next/navigation';
import { bblToSbl, sblToBbl } from '@/utils/bbl';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ParcelMapProps {
  /** BBL in URL format (e.g., "4-476-1") */
  bbl: string;
  /** Latitude for map center */
  latitude: number;
  /** Longitude for map center */
  longitude: number;
  /** Mapbox access token */
  accessToken: string;
  /** Optional className for styling */
  className?: string;
  /** Show fullscreen button */
  showFullscreenButton?: boolean;
}

const MAPBOX_TILESET_ID = 'svayser.nys-tax-parcels-prod';
const MAPBOX_LAYER_NAME = 'nys-parcels';

interface MapViewProps {
  bbl: string;
  latitude: number;
  longitude: number;
  accessToken: string;
  onParcelClick?: (clickedBbl: string) => void;
  className?: string;
}

/**
 * Internal map view component used by both regular and fullscreen modes
 */
function MapView({ bbl, latitude, longitude, accessToken, onParcelClick, className }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const router = useRouter();
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Convert BBL to SBL format for matching with tileset
  const selectedSbl = bblToSbl(bbl);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Center map on the property
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 17,
        duration: 1000,
      });
    }
  }, [latitude, longitude, mapLoaded]);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleMapClick = (event: MapMouseEvent) => {
    const features = event.features;
    if (!features || features.length === 0) return;

    // Get the SBL from the clicked parcel
    const clickedSbl = features[0].properties?.SBL;
    if (!clickedSbl) return;

    try {
      // Convert SBL to BBL format for navigation
      const clickedBbl = sblToBbl(clickedSbl);

      // Use custom handler if provided, otherwise navigate
      if (onParcelClick) {
        onParcelClick(clickedBbl);
      } else {
        // Navigate to the clicked property's overview page
        router.push(`/property/${clickedBbl}/overview`);
      }
    } catch (error) {
      console.error('Error converting SBL to BBL:', error);
    }
  };

  /**
   * Handle mouse movement over the map
   * Uses onMouseMove instead of onMouseEnter/Leave for better performance
   * and more reliable hover detection across all parcel boundaries
   */
  const handleMouseMove = (event: MapMouseEvent) => {
    const features = event.features;

    if (features && features.length > 0) {
      // Get the SBL from the parcel under cursor
      const sbl = features[0].properties?.SBL;
      // Only update state if hovering over a different parcel (optimization)
      if (sbl !== hoveredParcelId) {
        setHoveredParcelId(sbl);
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        }
      }
    } else {
      // No parcel under cursor - reset hover state
      if (hoveredParcelId !== null) {
        setHoveredParcelId(null);
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = '';
        }
      }
    }
  };

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude,
          latitude,
          zoom: 17,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        interactiveLayerIds={['parcels-fill', 'parcels-line']}
      >
        <Source
          id="parcels"
          type="vector"
          url={`mapbox://${MAPBOX_TILESET_ID}`}
        >
          {/*
            Parcel layers - optimized for streets map style
            - Selected: Amber-500 (#f59e0b) with 60% opacity
            - Hovered: Blue-500 (#3b82f6) with 40% opacity
            - Others: Very light blue with 80% opacity for subtle visibility
          */}
          {/* Parcel fill layer */}
          <Layer
            id="parcels-fill"
            type="fill"
            source-layer={MAPBOX_LAYER_NAME}
            paint={{
              'fill-color': [
                'case',
                ['==', ['get', 'SBL'], selectedSbl],
                '#f59e0b', // amber-500 for selected parcel
                ['==', ['get', 'SBL'], hoveredParcelId || ''],
                '#3b82f6', // blue-500 for hovered parcel
                'rgba(59, 130, 246, 0.05)', // very light blue for other parcels
              ],
              'fill-opacity': [
                'case',
                ['==', ['get', 'SBL'], selectedSbl],
                0.6,
                ['==', ['get', 'SBL'], hoveredParcelId || ''],
                0.4,
                0.8,
              ],
            }}
          />
          {/* Parcel outline layer */}
          <Layer
            id="parcels-line"
            type="line"
            source-layer={MAPBOX_LAYER_NAME}
            paint={{
              'line-color': [
                'case',
                ['==', ['get', 'SBL'], selectedSbl],
                '#d97706', // amber-600 for selected parcel border (stronger)
                ['==', ['get', 'SBL'], hoveredParcelId || ''],
                '#2563eb', // blue-600 for hovered parcel border (stronger)
                'rgba(100, 116, 139, 0.4)', // slate gray for other parcel borders
              ],
              'line-width': [
                'case',
                ['==', ['get', 'SBL'], selectedSbl],
                3,
                ['==', ['get', 'SBL'], hoveredParcelId || ''],
                2.5,
                0.8,
              ],
            }}
          />
        </Source>
      </Map>
    </div>
  );
}

/**
 * ParcelMap component with optional fullscreen mode
 * Displays NYC parcel boundaries on a Mapbox satellite map
 */
export function ParcelMap({
  bbl,
  latitude,
  longitude,
  accessToken,
  className,
  showFullscreenButton = true,
}: ParcelMapProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleParcelClick = (clickedBbl: string) => {
    // Close fullscreen modal if open
    setIsFullscreen(false);
    // Navigate to the clicked property's overview page
    router.push(`/property/${clickedBbl}/overview`);
  };

  return (
    <>
      <div className="relative w-full h-full">
        <MapView
          bbl={bbl}
          latitude={latitude}
          longitude={longitude}
          accessToken={accessToken}
          className={className}
        />
        {showFullscreenButton && (
          <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
            <DialogTrigger asChild>
              <button
                className="absolute top-2 right-2 z-10 p-2 bg-background/90 hover:bg-background border border-foreground/10 rounded-md shadow-md transition-colors cursor-pointer"
                aria-label="View fullscreen map"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </DialogTrigger>
            <DialogContent
              size="full"
              className="h-screen w-screen max-w-none p-0 m-0 rounded-none border-0"
              overlayClassName="bg-black/80 backdrop-blur-sm"
              showClose={false}
            >
              <DialogTitle className="sr-only">
                Fullscreen Parcel Map for BBL {bbl}
              </DialogTitle>
              <div className="relative w-full h-full">
                <MapView
                  bbl={bbl}
                  latitude={latitude}
                  longitude={longitude}
                  accessToken={accessToken}
                  onParcelClick={handleParcelClick}
                  className="w-full h-full"
                />
                {/* Prominent Exit Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-background/95 hover:bg-background text-foreground border border-foreground/20 rounded-lg shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm"
                  aria-label="Exit fullscreen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                  <span className="text-sm font-medium hidden sm:inline">Exit Fullscreen</span>
                  <span className="text-sm font-medium sm:hidden">Exit</span>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
