import { useEffect } from 'react';

import Projects from '../components/project/projects';
import GeoLocation from '../hooks/geoLocation';
import projectData from '../data/projects.json';

export default function Home() {
  const { latLong, getGeoLocation, locationErrorMsg, findingLocation } =
    GeoLocation();

  useEffect(() => {
    getGeoLocation()
  }, []);

  return (
    <>
      <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 ">
        {findingLocation ? 'Locating...' : 'Your Location:'}{' '}
        {locationErrorMsg.length > 1 ? locationErrorMsg : latLong}
      </span>

      <Projects projectData={projectData} />
    </>
  );
}
