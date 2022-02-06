import { useState } from 'react';

function GeoLocation() {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [latLong, setLatLong] = useState('');
  const [findingLocation, setFindingLocation] = useState(false);
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLatLong(`${latitude},${longitude}`);
    setLocationErrorMsg('');
    setFindingLocation(false);
  };
  const error = () => {
    setFindingLocation(false);
    setLocationErrorMsg('Unable to retrieve your location');
  };
  const getGeoLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');
    } else {
      setFindingLocation(true);
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return { latLong, getGeoLocation, locationErrorMsg, findingLocation };
}

export default GeoLocation;
