import { useEffect } from 'react';

import Projects from '../components/project/projects';
import GeoLocation from '../hooks/geoLocation';

import Layout from '../components/layout/layout';
import RedirectUser from '../lib/utils/redirectUser';
import projectData from '../data/projects.json';

export async function getServerSideProps(context) {
  const { userId, token } = RedirectUser(context);
  const projects = projectData;
  return {
    props: {
      projects,
    },
  };
}

export default function Home({ projects }) {
  //console.log("INDEX", projects)
  const { latLong, getGeoLocation, locationErrorMsg, findingLocation } =
    GeoLocation();

  useEffect(() => {
    getGeoLocation();
  }, []);

  return (
    <Layout>
      <Projects projects={projects} />

      <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 ">
        {findingLocation ? 'Locating...' : 'Your Location:'}{' '}
        {locationErrorMsg.length > 1 ? locationErrorMsg : latLong}
      </span>
    </Layout>
  );
}
