import React, { useEffect, useReducer } from "react";
import { useGetLocation } from "../hooks";
import i18n from "../i18n.json";

function WeatherByLocation() {
  const [position, error, loading] = useGetLocation();

  if (loading) {
    return <span>{i18n.loading}</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  return <span></span>;
}

export default WeatherByLocation;
