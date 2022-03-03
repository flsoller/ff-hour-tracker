<template>
    <button>
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
button {
    background-color: $dark-3;
    border-radius: 0.25rem;
    box-shadow: 0 5px 9px rgba($color: $dark-2-light-accent, $alpha: 0.4);
    max-height: 13rem;
    overflow-y: scroll;
    box-sizing: border-box;
    border: 5px solid $dark-3;
    padding: 0.5rem;
    z-index: 9999;
    color: $white-blue;
    &:hover {
        cursor: pointer;
        background-color: $dark;
    }
}
</style>