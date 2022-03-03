<template>
    <div class="custom-select">
        <label :for="props.id">{{ labelText }}</label>
        <select v-model="selected" :id="props.id" id="dropdown" @input="updateValue">
            <option value selected disabled hidden>--Select--</option>
            <option v-for="option in props.options" :value="option.value">{{ option.text }}</option>
        </select>

        <div>Selected: {{ selected }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    options: { text: string, value: string }[],
    labelText: string,
    id: string
}>()
const selected = ref('')
const emit = defineEmits(['update:modelValue'])
const updateValue = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
select {
    width: 100%;
    position: relative;
    min-width: 4rem;
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.3rem;
    border-radius: 8px;
    color: $white-blue;
    background-color: $dark;
    border: 2px solid $dark-3;
    justify-content: space-between;
    height: 3rem;
}

label {
    @include header;
    color: $white-blue;
    display: block;
    padding: 0.5rem 0rem;
}

.select-options {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: 999;
    margin: 0;
    padding: 0;
    list-style: none;
}

.custom-select {
    padding: 1.5rem 1rem;
}
</style>