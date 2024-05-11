<script lang="ts">
  import { onMount } from "svelte";
  //import { getPlaces } from "./routes/api/places/+server";
  import type { PlaceAndDistance } from "../types";
  import Badge from "$lib/components/Badge.svelte"
  import BikesAvailable from "$lib/components/BikesAvailable.svelte";
  import Icon from "$lib/components/Icon.svelte";

  let places: PlaceAndDistance[];
  let location: {
    latitude: string;
    longitude: string;
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }

  const onSuccess = async ({ coords }: { coords: GeolocationCoordinates}) => {
    location = { latitude: coords.latitude.toString(), longitude: coords.longitude.toString() };
    const response = await fetch(`/api/places?lat=${location.latitude}&lon=${location.longitude}`, {
			method: 'GET',
		});
    places = await response.json();
  };
  
  const onError = console.error.bind(console, "error");

  function calculateTime(departure: number) {
    const timeDiff = Math.trunc(
      (new Date(departure * 1000).getTime() - new Date().getTime()) / 60000
    );
    if (timeDiff < 0) {
      return "";
    }

    return timeDiff ? `${timeDiff}min` : "Now";
  }

  onMount(() => {
    getLocation();
  });
</script>

<main class="p-3 max-w-md mx-auto">
  <div class="flex items-center gap-2">
    <h1
      class="flex-1 mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
      Stops near me
    </h1>
    <button
      on:click={getLocation}
      class="flex items-center px-2 py-1 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80"
    >
      <Icon name="refresh" />
      <span class="mx-1 text-xs font-medium">Refresh</span>
    </button>
  </div>
  {#if location}
    <p class="text-xs font-medium">
      Location: {location.latitude}, {location.longitude}
    </p>
  {/if}
  {#if places}
    <ul role="list">
      {#each places as { node }}
        {#if node.place.stoptimesWithoutPatterns?.length || (node.place.capacity && node.place.state !== "Station off")}
          <li role="listitem" class="rounded border border-gray-200 p-3 my-3">
            <div class="flex items-center gap-2">
              <h2
                class="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {node.place.name}
              </h2>
              {#if node.place.code || node.place.stationId}
                <Badge type="stop"
                  >{node.place.code || node.place.stationId}</Badge
                >
              {/if}
              {#if node.distance}
                <p class="text-xs font-medium ml-auto">{node.distance}m</p>
              {/if}
            </div>
            {#if node.place.stoptimesWithoutPatterns}
              <ul class="mt-2 flex items-center gap-2 flex-wrap">
                {#each node.place.stoptimesWithoutPatterns as { trip, serviceDay, realtimeDeparture }}
                  <li
                    class="rounded border border-gray-200 p-1 flex items-center gap-2"
                  >
                    <Badge>{trip.route.shortName}</Badge>
                    <p class="text-xs font-medium">
                      {calculateTime(serviceDay + realtimeDeparture)}
                    </p>
                  </li>
                {/each}
              </ul>
            {/if}
            {#if node.place.capacity}
              <div class="mt-2 flex items-center gap-2">
                <BikesAvailable place={node.place} />
                <p class="text-xs font-medium px-2.5 py-0.5">
                  {node.place.bikesAvailable} / {node.place.capacity}
                </p>
              </div>
            {/if}
          </li>
        {/if}
      {/each}
    </ul>
  {:else}
    <p class="text-xs font-medium">loading...</p>
  {/if}
</main>
