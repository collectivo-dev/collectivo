<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

setCollectivoTitle("Profile");
const toast = useToast();
const { t } = useI18n();
const user = useCollectivoUser();

// Sort profile.inputs by order
// profile.value.inputs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// Get form data
async function getProfile() {
  await user.value.load();
}

getProfile();

// Submit form data
async function saveProfile(data: CollectivoUser) {
  try {
    await user.value.save(data);

    toast.add({
      title: t("Profile updated"),
      icon: "i-mi-circle-check",
      timeout: 10000,
    });
  } catch (e) {
    console.error(e);

    toast.add({
      title: t("There was an error"),
      icon: "i-mi-warning",
      color: "red",
      timeout: 0,
    });
  }
}
</script>

<template>
  <CollectivoContainer>
    <CollectivoFormBuilder
      v-if="user.data"
      :data="user.data"
      :fields="user.fields"
      :submit="saveProfile"
      submit-label="Save"
    />
  </CollectivoContainer>
</template>

<style scoped lang="scss"></style>
