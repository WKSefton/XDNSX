import { useEffect } from 'react';

import Projects from '../components/project/projects';
import GeoLocation from '../hooks/geoLocation';
import projectData from '../data/projects.json';
import {startExecuteMyMutation} from '../lib/db/hasura'
export default function Home() {
  const { latLong, getGeoLocation, locationErrorMsg, findingLocation } =
    GeoLocation();

  useEffect(() => {
    startExecuteMyMutation({"asdf":"asdf"})
    getGeoLocation()
  }, []);
  return (
    <>


      <Projects projectData={projectData} />

      <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 ">
        {findingLocation ? 'Locating...' : 'Your Location:'}{' '}
        {locationErrorMsg.length > 1 ? locationErrorMsg : latLong}
      </span>
    </>
  );
}
