import React from "react";
import i18n from "./i18n.json";
import {
  useIsSupportGetLocation,
  useGetPermissionToGetLocation
} from "./hooks";
import WeatherByLocation from "./components/WeatherByLocation";
import "./App.css";

function App() {
  const isGetLocationSupported = useIsSupportGetLocation();
  const [
    isAllowToGetLocation,
    checkIsUserAllowToGetLocation
  ] = useGetPermissionToGetLocation(isGetLocationSupported);

  return (
    <div className="App">
      {isAllowToGetLocation === false ? (
        <button onClick={checkIsUserAllowToGetLocation}>
          {i18n.allow_location_again}
        </button>
      ) : (
        <WeatherByLocation />
      )}

      {isGetLocationSupported === false ? (
        <span>{i18n.not_supported_get_location}</span>
      ) : null}
    </div>
  );
}

export default App;
