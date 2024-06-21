<script setup lang="ts">
setCollectivoTitle("Sign up for a shift", { backLink: "profile" });
const user = useCollectivoUser();
</script>

<template>
  <CollectivoContainer v-if="user.data?.shifts_user_type">
    <ShiftsCalendar :shift-type="user.data?.shifts_user_type" />
  </CollectivoContainer>
</template>
