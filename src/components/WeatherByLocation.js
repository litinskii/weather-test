import React, { useEffect, useReducer } from "react";
import { useGetLocation, useGetWeatherInformation } from "../hooks";
import i18n from "../i18n.json";

function WeatherByLocation() {
  const [
    coords,
    errorWhileGetLocation,
    loadingWhileGetLocation
  ] = useGetLocation();
  const [
    weather,
    errorWhileGetWeatherInformation,
    loadingWhileGetWeatherInformation
  ] = useGetWeatherInformation(coords);

  if (loadingWhileGetLocation || loadingWhileGetWeatherInformation) {
    return <span>{i18n.loading}</span>;
  }

  if (errorWhileGetLocation || errorWhileGetWeatherInformation) {
    return (
      <span>{errorWhileGetLocation || errorWhileGetWeatherInformation}</span>
    );
  }

  return (
    <div>
      {weather.weather_state_abbr && weather.weather_state_name ? (
        <img
          alt={weather.weather_state_name}
          src={`https://www.metaweather.com/static/img/weather/png/64/${weather.weather_state_abbr}.png`}
        ></img>
      ) : null}
    </div>
  );
}

export default WeatherByLocation;
