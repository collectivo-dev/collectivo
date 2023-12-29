<script setup lang="ts">
import {
  object,
  string,
  number,
  boolean,
  type InferType,
  type Schema as YupSchema,
  date,
} from "yup";
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";

const toast = useToast();
const { t } = useI18n();
const config = useRuntimeConfig();

const props = defineProps({
  fields: Object as PropType<CollectivoFormFields>,
  data: Object as PropType<Record<string, any>>,
  submit: Function as PropType<(data: any) => Promise<void>>,
});

const form = { fields: props.fields ?? {} };
const loading = ref(false);

// Create ordered list of form fields
form.fields = Object.fromEntries(
  Object.entries(form.fields).sort((a, b) => a[1].order - b[1].order)
);

function checkConditions(conditions: FormCondition[] | undefined) {
  if (!conditions) {
    return true;
  }

  for (const condition of conditions) {
    if (state[condition.key] !== condition.value) {
      return false;
    }
  }

  return true;
}

// Compute visibility of fields
for (const [_, field] of Object.entries(form.fields)) {
  if (field.conditions) {
    field._visible = computed(() => {
      return checkConditions(field.conditions);
    });
  }
}

const state: { [key: string]: any } = reactive({});
let schema = object();

function addInputToSchema(
  key: string,
  input: CollectivoFormInput,
  schema_field: YupSchema
) {
  if (input.required) {
    if (input.type === "checkbox" || input.type === "toggle") {
      schema_field = schema_field.test(
        "checkbox",
        "This field is required",
        (value) => {
          return value === true;
        }
      );
    } else {
      schema_field = schema_field.required("This field is required");
    }
  }

  // Create a conditional schema field
  // If the condition is met, use the original schema field
  // If the condition is not met, use a hidden schema field
  if (input.conditions && input.conditions.length > 0) {
    const schema_field_with_conditions = object().when(
      input.conditions.map((c) => c.key),
      (_, schema_field_hidden) => {
        if (checkConditions(input.conditions)) {
          return schema_field;
        } else {
          return schema_field_hidden.strip();
        }
      }
    );

    schema = schema.shape({ [key]: schema_field_with_conditions });
  } else {
    schema = schema.shape({ [key]: schema_field });
  }

  // Fill state with either data or default value
}

function valString(validators: FormValidator[] | undefined) {
  let schema = string();

  for (const validator of validators ?? []) {
    if (validator.type === "min") {
      schema = schema.min(validator.value as number);
    } else if (validator.type === "max") {
      schema = schema.max(validator.value as number);
    } else if (validator.type === "email") {
      schema = schema.email();
    } else if (validator.type === "url") {
      schema = schema.url();
    } else if (validator.type === "regex") {
      schema = schema.matches(validator.value as RegExp);
    }
  }

  return schema;
}

function valNumber(validators: FormValidator[] | undefined) {
  let schema = number();

  for (const validator of validators ?? []) {
    if (validator.type === "min") {
      schema = schema.min(validator.value as number);
    } else if (validator.type === "max") {
      schema = schema.max(validator.value as number);
    }
  }

  return schema;
}

function valDate(validators: FormValidator[] | undefined) {
  let schema = date();

  for (const validator of validators ?? []) {
    if (validator.type === "min") {
      schema = schema.min(validator.value as number);
    } else if (validator.type === "max") {
      schema = schema.max(validator.value as number);
    }
  }

  return schema;
}

// Define state and schema from form object
for (const [key, input] of Object.entries(form.fields)) {
  if (
    input.type === "text" ||
    input.type === "textarea" ||
    input.type === "password"
  ) {
    addInputToSchema(key, input, valString(input.validators));
  } else if (input.type === "email") {
    input.validators = input.validators ?? [];
    input.validators.push({ type: "email" });
    addInputToSchema(key, input, valString(input.validators));
  } else if (input.type === "date") {
    addInputToSchema(key, input, valDate(input.validators));
  } else if (input.type === "number") {
    addInputToSchema(key, input, valNumber(input.validators));
  } else if (input.type === "select" || input.type === "select-radio") {
    addInputToSchema(key, input, valString(input.validators));
  } else if (input.type === "toggle" || input.type === "checkbox") {
    addInputToSchema(key, input, boolean());
  }

  if (props.data?.[key]) {
    state[key] = props.data[key];
  } else if ("default" in input && input.default) {
    state[key] = input.default;
  }
}

type Schema = InferType<typeof schema>;

// Form handlers
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  await props.submit!(event.data);
  loading.value = false;
}

async function onError(event: FormErrorEvent) {
  toast.add({
    title: t("Some fields are not filled in correctly"),
    icon: "i-mi-warning",
    color: "red",
    timeout: 0,
  });

  const element = document.getElementById(event.errors[0].id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Debug tools
async function fillOutAll() {
  for (const [key, input] of Object.entries(form.fields)) {
    if ("choices" in input && input.choices) {
      state[key] = input.choices[0].value;
    } else if (input.type === "email") {
      state[key] = "test@example.com";
    } else if (input.type === "toggle") {
      state[key] = true;
    } else if (input.type === "date") {
      state[key] = "2021-01-01";
    } else {
      state[key] = "test";
    }
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="flex flex-wrap w-full"
    @submit="onSubmit"
    @error="onError"
  >
    <template v-for="(input, key) in form.fields" :key="key">
      <template v-if="typeof key === 'string' && (input._visible ?? true)">
        <div v-if="input.type === 'section'" class="element-full">
          <div v-if="input.title" class="form-title">
            {{ t(input.title) }}
          </div>
          <div
            v-if="input.description"
            class="text-cv-primary text-sm leading-5"
          >
            {{ t(input.description) }}
          </div>
        </div>
        <div v-else-if="input.type === 'description'" class="element-full">
          {{ input.content }}
        </div>
        <component
          :is="input.component"
          v-else-if="input.type === 'custom-layout'"
          :class="input.width ? `element-${input.width}` : 'element-full'"
          :input="input"
          :state="state"
        >
        </component>
        <div v-else-if="input.type === 'clear'" class="basis-full"></div>
        <div
          v-else
          :class="input.width ? `element-${input.width}` : 'element-md'"
        >
          <UFormGroup
            v-if="input.type === 'text'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <UInput
              v-model="state[key]"
              :placeholder="input.placeholder"
              :disabled="input.disabled"
            >
              <template v-if="input.icon" #trailing>
                <UIcon :name="input.icon" />
              </template>
            </UInput>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'email'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <UInput v-model="state[key]" :placeholder="input.placeholder">
              <template v-if="input.icon" #trailing>
                <UIcon :name="input.icon" />
              </template>
            </UInput>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'password'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <UInput
              v-model="state[key]"
              type="password"
              :placeholder="input.placeholder"
              :disabled="input.disabled"
            >
              <template v-if="input.icon" #trailing>
                <UIcon :name="input.icon" />
              </template>
            </UInput>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'number'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
            :placeholder="input.placeholder"
          >
            <UInput
              v-model="state[key]"
              type="number"
              :placeholder="input.placeholder"
              :disabled="input.disabled"
            />
          </UFormGroup>
          <UFormGroup
            v-if="input.type === 'textarea'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <UTextarea
              v-model="state[key]"
              resize
              :placeholder="input.placeholder"
              :disabled="input.disabled"
            />
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'select'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <USelectMenu
              v-model="state[key]"
              :options="input.choices"
              :disabled="input.disabled"
              value-attribute="value"
            >
              <!-- Get choice label with value==state[key] -->
              <template #label>{{
                t(
                  input.choices?.find((choice) => choice.value === state[key])
                    ?.label ?? ""
                )
              }}</template>
              <template #option="{ option }">{{ t(option.label) }}</template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'select-radio'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <URadioGroup
              v-model="state[key]"
              :options="input.choices"
              :disabled="input.disabled"
            >
              <template #label="{ option }">{{ t(option.label) }}</template>
            </URadioGroup>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'multiselect-checkbox'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <CollectivoFormCheckboxGroup
              v-model="state[key]"
              :choices="input.choices"
            />
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'date'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :disabled="input.disabled"
            :name="key"
          >
            <CollectivoFormDate v-model="state[key]"></CollectivoFormDate>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'toggle'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <div
              class="bg-[#F4F7FE] shadow-sm rounded-lg px-4 py-3 flex flex-row gap-2"
            >
              <UToggle v-model="state[key]" :disabled="input.disabled" />
              <span
                class="text-sm font-medium text-gray-700 dark:text-gray-200"
                >{{ input.description }}</span
              >
            </div>
          </UFormGroup>
          <UFormGroup
            v-else-if="input.type === 'custom-input'"
            :label="input.label ? t(input.label) : undefined"
            :required="input.required"
            :name="key"
          >
            <component :is="input.component" v-model="state[key]" />
          </UFormGroup>
        </div>
      </template>
    </template>
    <div class="basis-full"></div>
    <div class="px-2 py-3 lg:p-4">
      <UButton
        v-if="props.submit"
        class="btn"
        variant="solid"
        color="cyan"
        size="md"
        icon="i-mi-circle-check"
        :loading="loading"
        type="submit"
      >
        {{ t("Submit") }}
      </UButton>
    </div>
  </UForm>
  <div v-if="config.public.debug" class="element-full">
    <div class="form-title">DEBUG TOOLS</div>
    <div>You are seeing this because NUXT_DEBUG=True</div>
    <div class="">
      <UButton class="btn" @click="fillOutAll">
        {{ t("Fill out all") }}
      </UButton>
    </div>
    <div class="text-sm">Form state: {{ state }}</div>
  </div>
</template>

<style lang="scss" scoped>
.form-title {
  @apply text-cv-primary font-semibold text-2xl leading-7;
}

.input {
  @apply px-2 py-3 lg:p-4;
}
.element-full {
  @apply input basis-full;
}

.element-xl {
  @apply input basis-full md:basis-1/2;
}

.element-lg {
  @apply input basis-full md:basis-1/2 lg:basis-1/3;
}
.element-md {
  @apply input basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4;
}

.element-sm {
  @apply input basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5;
}

.element-xs {
  @apply input basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6;
}
</style>