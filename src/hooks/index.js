import React, { useState, useEffect, useReducer } from "react";
import i18n from "../i18n.json";

export const useIsSupportGetLocation = () => {
  const [isSupport, serIsSupport] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      serIsSupport(true);
    } else {
      serIsSupport(false);
    }
  }, []);

  return isSupport;
};

export const useGetPermissionToGetLocation = isGetLocationSupported => {
  const [isAllowToGetLocation, serIsAllowToGetLocation] = useState(null);

  const checkIsUserAllowToGetLocation = () => {
    if (window.confirm(i18n.allow_location)) {
      serIsAllowToGetLocation(true);
      window.sessionStorage.setItem("isAllowToGetLocation", "true");
    } else {
      serIsAllowToGetLocation(false);
    }
  };

  useEffect(() => {
    if (isGetLocationSupported) {
      if (window.sessionStorage.getItem("isAllowToGetLocation") === "true") {
        serIsAllowToGetLocation(true);
      } else {
        checkIsUserAllowToGetLocation();
      }
    }
  }, [isGetLocationSupported]);

  return [isAllowToGetLocation, checkIsUserAllowToGetLocation];
};

function reducerForGetLocation(state, action) {
  switch (action.type) {
    case "start":
      return {
        ...state,
        ...{ coords: {}, loading: true, error: "" }
      };
    case "succes":
      return {
        ...state,
        ...{ coords: action.payload, loading: false, error: "" }
      };
    case "error":
      return {
        ...state,
        ...{
          coords: {},
          loading: false,
          error: `ERROR(${action.payload.code}): ${action.payload.message}`
        }
      };
    default:
      throw new Error("Unknow action for reducerForGetLocation");
  }
}

export const useGetLocation = () => {
  const [state, dispatch] = useReducer(reducerForGetLocation, {
    loading: true,
    coords: {},
    error: ""
  });

  useEffect(() => {
    dispatch({ type: "start" });

    navigator.geolocation.getCurrentPosition(
      position => dispatch({ type: "succes", payload: position.coords }),
      error => dispatch({ type: "error", payload: error })
    );
  }, []);

  return [state.coords, state.error, state.loading];
};

function reducerForGetWeatherInformation(state, action) {
  switch (action.type) {
    case "start":
      return {
        ...state,
        ...{ loading: true, weather: {}, error: "" }
      };

    case "error":
      return {
        ...state,
        ...{
          loading: false,
          weather: {},
          error: action.payload
        }
      };
    case "succes":
      return {
        ...state,
        ...{
          loading: false,
          weather: action.payload,
          error: ""
        }
      };
    default:
      throw new Error("Unknow action for reducerForGetLocation");
  }
}

export const useGetWeatherInformation = ({ latitude, longitude } = {}) => {
  const [state, dispatch] = useReducer(reducerForGetWeatherInformation, {
    loading: true,
    weather: {},
    error: ""
  });

  useEffect(() => {
    let didCancel = false;

    if (!latitude || !longitude) {
      return;
    }

    dispatch({ type: "start" });

    const getWeatherInformation = async () => {
      try {
        const [{ woeid }] = await (
          await fetch(`/api/location/search/?lattlong=${latitude},${longitude}`)
        ).json();

        const {
          consolidated_weather: [
            { weather_state_name, weather_state_abbr, the_temp }
          ]
        } = await (await fetch(`/api/location/${woeid}/`)).json();

        if (!didCancel) {
          dispatch({
            type: "succes",
            payload: { weather_state_name, weather_state_abbr, the_temp }
          });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({
            type: "error",
            payload: "Error while trying to get weather information =("
          });
        }
      }
    };

    getWeatherInformation();
    return () => {
      didCancel = true;
    };
  }, [latitude, longitude]);

  return [state.weather, state.error, state.loading];
};
