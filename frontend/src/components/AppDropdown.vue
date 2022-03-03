<template>
  <div class="dropdown">
    <!-- Dropdown label -->
    <label class="dropdown__label">{{ label }}</label>

    <!-- Select element -->
    <button
      class="dropdown__select"
      :class="{ 'dropdown__select--disabled': !props.listItems.length }"
      @click="toggleDropdown"
      type="button"
    >
      <span class="dropdown__selected">{{ selectedItem }}</span>
      <font-awesome-icon
        :icon="faCaretSquareDown"
        :class="{ 'dropdown__icon--disabled': !props.listItems.length }"
        size="lg"
      />
    </button>

    <!-- Dropdown -->
    <ul class="dropdown__menu" :class="{ 'dropdown__menu--menu-visible': dropdownOpen }">
      <li
        v-for="item in listItems"
        class="dropdown__menu__item"
        @click="onSelectionChanged(item)"
      >{{ item }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons';

interface Props {
  listItems: string[];
  label: string;
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  listItems: () => [],
  label: 'unspecified',
});

const selectedItem = ref('');
const dropdownOpen = ref(false);

// Open/Close dropdown
function toggleDropdown(): void {
  dropdownOpen.value = !dropdownOpen.value;
}

/**
 * Sets and emits selected value, closes dropdown
 * @param item The item selected from the list
 */
function onSelectionChanged(item: string): void {
  selectedItem.value = item;
  toggleDropdown();
}
</script>

<style lang="scss">
.dropdown {
  width: 100%;
  min-width: 8rem;
  position: relative;

  &__label {
    @include header;
    color: $white-blue;
    display: block;
    padding: 0.5rem 0rem;
  }

  &__button {
    &--disabled {
      &:hover {
        cursor: not-allowed;
      }
    }
  }

  &__select {
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.3rem;
    border-radius: 8px;
    color: $white-blue;
    background-color: $dark;
    border: 2px solid $dark-3;
    justify-content: space-between;
    padding: 1.5rem 1rem;

    &:hover {
      cursor: pointer;
    }

    &--disabled {
      &:hover {
        cursor: not-allowed;
      }
    }
  }

  &__selected {
    @include text-select;
    padding-right: 1rem;
  }

  &__icon--disabled {
    color: $gray;
  }

  &__menu {
    display: none;
    flex-direction: column;
    position: absolute;
    width: 100%;
    left: 0;
    top: calc(100% + 0.3rem);
    background-color: $dark-3;
    border-radius: 0.25rem;
    box-shadow: 0 5px 9px rgba($color: $dark-2-light-accent, $alpha: 0.4);
    max-height: 13rem;
    overflow-y: scroll;
    box-sizing: border-box;
    border: 5px solid $dark-3;
    z-index: 9999;

    &--menu-visible {
      display: flex;
    }

    &__item {
      @include text-select;
      color: $gray;
      padding: 0.75rem 0.5rem;
      border-radius: 0.25rem;

      &:hover {
        background-color: $dark;
        cursor: pointer;
      }
    }
  }
}
</style>
