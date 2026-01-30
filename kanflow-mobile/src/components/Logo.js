import React from "react";
import Svg, { Rect, Path, Circle } from "react-native-svg";

export const Logo = ({ size = 24, style }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      style={style}
    >
      <Rect width="40" height="40" rx="8" fill="#09090b" />
      <Path
        d="M12 28V12"
        stroke="#e4e4e7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M20 28V16"
        stroke="#e4e4e7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M28 28V20"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="28" cy="14" r="2" fill="#3b82f6" />
    </Svg>
  );
};
