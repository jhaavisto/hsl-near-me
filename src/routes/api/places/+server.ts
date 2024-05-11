import type { PlaceAndDistance } from "../../../types";
import { DIGITRANSIT_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

const query = `
    query nearestQuery(
      $lat: Float!
      $lon: Float!
    )
    {
      nearest(lat:$lat,lon:$lon,filterByPlaceTypes: [BICYCLE_RENT, STOP]) {
        edges {
          node {
            place {
              ...on BikeRentalStation {
                stationId
                name
                bikesAvailable
                capacity
                state
              } 
              
              ...on Stop {
                name
                code
                vehicleType
                vehicleMode
                stoptimesWithoutPatterns {
                  scheduledArrival
                  realtimeArrival
                  arrivalDelay
                  scheduledDeparture
                  realtimeDeparture
                  departureDelay
                  realtime
                  realtimeState
                  serviceDay
                  headsign
                  trip {
                    route {
                      shortName
                    }
                  }
                }
              }
            }
            distance
          }
        }
      }
  }`;

const getPlaces = async (location: { latitude: string; longitude: string }) => {
  if (!location || !location.latitude || !location.longitude) return;

  const variables = {
    lat: location.latitude,
    lon: location.longitude,
  };
  const response = await fetch(
    "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
    {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "digitransit-subscription-key": DIGITRANSIT_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const { data } = await response.json();
  return data?.nearest?.edges as PlaceAndDistance[];
};

export async function GET({ url }) {
  const lat = url.searchParams.get("lat") ?? "";
  const lon = url.searchParams.get("lon") ?? "";

  return json(await getPlaces({ latitude: lat, longitude: lon }));
}
