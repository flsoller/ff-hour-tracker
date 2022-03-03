<template>
    <div class="custom-input">
        <label :for="props.id">{{ labelText }}</label>
        <input :value="modelValue" @input="updateValue" :type="props.type" :id="props.id" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    type: string,
    labelText: string,
    id: string,
    modelValue?: string | number
}>()
const emit = defineEmits(['update:modelValue'])
const updateValue = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
input {
    min-width: 4rem;
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
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

.custom-input {
    padding: 1.5rem 1rem;
}
</style>