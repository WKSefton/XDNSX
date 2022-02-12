import Finance from "./finance";
import RedirectUser from "../lib/utils/redirectUser";
import {getProjects} from "../lib/db/hasura";

export async function getServerSideProps(context) {
    const {userId, token} = await RedirectUser(context);

    const {projects} = await getProjects(token, userId);
    // const project = {
    //   name: "test",
    //   description: "asdff",
    //   type: 1,
    //   data: { test: "ASDF"}
    // }
    // const asdf = await createNewProject(token, project)
    // console.log({asdf})

    return {
        props: {
            projects,
        },
    };
}

export default function Home({projects}) {
    console.log('INDEX', projects);
    // const { latLong, getGeoLocation, locationErrorMsg, findingLocation } =
    //   GeoLocation();

    // useEffect(() => {
    //   getGeoLocation();
    // }, []);
    return (
        <Finance/>
    );
}
