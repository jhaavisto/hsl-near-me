export type TripRoute = {
  route: {
    shortName: string;
  };
};

export type Place = {
  name: string;
  code: string;
  stationId: string;
  stoptimesWithoutPatterns: {
    realtimeDeparture: number;
    scheduledDeparture: number;
    serviceDay: number;
    trip: TripRoute;
  }[];
  bikesAvailable: number;
  capacity: number;
  state: string;
};

export type PlaceAndDistance = {
  node: {
    place: Place;
    distance: number;
  };
};
