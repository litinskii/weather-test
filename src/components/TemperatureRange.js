import React from "react";
import i18n from "../i18n.json";

function TemperatureRange({ currentTemperature = -10, onChagne }) {
  return (
    <div>
      <label htmlFor="temperature">{`${i18n.color_range_label} (${i18n.start}: -10, ${i18n.end}: 30, ${i18n.current}: ${currentTemperature})`}</label>
      <input
        type="range"
        min={-10}
        max={30}
        id="temperature"
        onChange={e => onChagne(e.target.value)}
        value={currentTemperature}
      />
    </div>
  );
}

export default TemperatureRange;
