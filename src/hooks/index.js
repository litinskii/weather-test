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
    case "succes":
      return {
        ...state,
        ...{ position: action.payload, loading: false, error: "" }
      };
    case "error":
      return {
        ...state,
        ...{
          position: {},
          loading: false,
          error: `ERROR(${action.payload.code}): ${action.payload.message}`
        }
      };
    default:
      throw new Error();
  }
}

export const useGetLocation = () => {
  const [state, dispatch] = useReducer(reducerForGetLocation, {
    loading: true,
    position: {},
    error: ""
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => dispatch({ type: "succes", payload: position }),
      error => dispatch({ type: "error", payload: error })
    );
  }, []);

  return [state.position, state.error, state.loading];
};
