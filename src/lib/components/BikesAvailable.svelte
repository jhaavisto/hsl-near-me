<script lang="ts">
  import type { Place } from "../../types";

  export let place: Place;
</script>

<div class="flex-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  <div
    class="bg-yellow-400 h-2.5 rounded-full"
    style="width: {Math.min(
      (place.bikesAvailable / place.capacity) * 100,
      100
    )}%"
  ></div>
</div>
