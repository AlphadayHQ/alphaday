import { FC } from "react";
import { LayoutProps } from "@alphaday/shared/styled";
import {
  GoogleMap as GoogleMapComponent,
  useJsApiLoader,
  Marker as MarkerComponent,
} from "@react-google-maps/api";
import { Spinner } from "../../ui/spinner/spinner";
import { StyledMap } from "./style";

interface IProps extends LayoutProps {
  /**
   * Required. Pass google maps latitude
   */
  lat: number;
  /**
   * Required. Pass google maps longitude
   */
  lng: number;
  /**
   * 	The initial Map zoom level. Required. Valid values: Integers between zero, and up to the supported maximum zoom level.
   */
  zoom?: number;
  children?: React.ReactNode;
  /**
   * The type of the map to show, defaults to roadmap when not set
   */
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
}

export const GoogleMap: FC<IProps> = ({
  width,
  height,
  lat,
  lng,
  zoom,
  mapType,
  children,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY",
  });
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return (
    <StyledMap width={width} height={height}>
      {isLoaded ? (
        <GoogleMapComponent
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat, lng }}
          zoom={zoom}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            scaleControl: false,
            mapTypeId: mapType?.toUpperCase(),
          }}
        >
          {children}
        </GoogleMapComponent>
      ) : (
        <Spinner size="lg" color="primary" />
      )}
    </StyledMap>
  );
};

interface IMarkerProps {
  /**
   * Required. Pass google maps latitude
   */
  lat: number;
  /**
   * Required. Pass google maps longitude
   */
  lng: number;
  /**
   * Required. Label for marker
   */
  label: string;
  size?: number;
  /**
   * Required. Hex color code for marker
   */
  color: string;
  /**
   * Required. Hex color code for marker stroke
   */
  strokeColor: string;
  // e is of type MapMouseEvent, but it is not exposed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
}
const MAP_PIN_PATH =
  "M16,3C10.5,3,6,7.5,6,13c0,8.4,9,15.5,9.4,15.8c0.2,0.1,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C17,28.5,26,21.4,26,13   C26,7.5,21.5,3,16,3z M16,17c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S18.2,17,16,17z";
export const GoogleMapMarker: FC<IMarkerProps> = ({
  lat,
  lng,
  label,
  color,
  strokeColor,
  onClick,
}) => {
  return (
    <MarkerComponent
      position={{ lat, lng }}
      title={label}
      icon={{
        path: MAP_PIN_PATH,
        fillColor: color,
        strokeColor,
        fillOpacity: 1,
        strokeWeight: 0.5,
      }}
      onClick={onClick}
    />
  );
};

GoogleMap.defaultProps = {
  width: "100%",
  height: "400px",
  lat: -3.745,
  lng: -38.523,
  zoom: 12,
};
