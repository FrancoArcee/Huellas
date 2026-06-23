import React from 'react';
import { View } from 'react-native';

export const MapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
        fitToCoordinates: () => {},
        animateToRegion: () => {},
        animateToCoordinate: () => {},
        setMapBoundaries: () => {},
        animateCamera: () => {},
        animateToNavigation: () => {},
    }));
    const { children, ...rest } = props;
    return React.createElement(View, rest, children);
});
MapView.displayName = 'MapView';

export const Marker = ({ children }) =>
    children != null ? React.createElement(React.Fragment, null, children) : null;

export const UrlTile = () => null;

export const Polyline = () => null;
export const Polygon = () => null;
export const Circle = () => null;
export const Callout = ({ children }) =>
    children != null ? React.createElement(React.Fragment, null, children) : null;
export const Heatmap = () => null;
export const Geojson = () => null;
export const Overlay = () => null;

export default MapView;