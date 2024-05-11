<script lang="ts">
  export let type: "stop" | "route" = "route";

  let colors = "bg-indigo-100 text-indigo-800";
  if (type === "stop") {
    colors = "bg-gray-100 text-gray-800";
  }
</script>

<div class="{colors} text-xs font-medium px-2.5 py-0.5 rounded">
  <slot />
</div>
