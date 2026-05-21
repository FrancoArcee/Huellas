import React from 'react';
import Svg, { G, Circle, Ellipse, Path, Line, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export const ReactLogo = ({ width = 28, height = 28, color = '#111' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 256 256" fill="none">
    <G stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
      <Ellipse cx="128" cy="128" rx="96" ry="48" transform="rotate(0 128 128)" />
      <Ellipse cx="128" cy="128" rx="96" ry="48" transform="rotate(60 128 128)" />
      <Ellipse cx="128" cy="128" rx="96" ry="48" transform="rotate(120 128 128)" />
      <Circle cx="128" cy="128" r="18" fill={color} />
    </G>
  </Svg>
);

export const SearchIcon = ({ width = 20, height = 20, color = '#6B7280' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="6" stroke={color} strokeWidth={2} />
    <Line x1="20" y1="20" x2="16.5" y2="16.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const FilterIcon = ({ width = 20, height = 20, color = '#fff' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="2" rx="1" fill={color} />
    <Rect x="6" y="11" width="12" height="2" rx="1" fill={color} />
    <Rect x="9" y="16" width="6" height="2" rx="1" fill={color} />
  </Svg>
);

export const HeartIcon = ({ width = 20, height = 20, color = '#FF6B6B' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21s-7.5-4.35-10-7.2C-1.3 10.2 3 4 8.5 7.5 11 9.2 12 11 12 11s1-1.8 3.5-3.5C21 4 26.3 10.2 22 13.8 19.5 16.65 12 21 12 21z" fill={color} opacity="0.95" />
  </Svg>
);

export const LocationIcon = ({ width = 14, height = 14, color = '#fff' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} />
    <Circle cx="12" cy="9" r="2.5" fill="#000000" opacity="0.3" />
  </Svg>
);

export default {
  ReactLogo,
  SearchIcon,
  FilterIcon,
  HeartIcon,
  LocationIcon,
};
