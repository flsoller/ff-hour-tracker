<template>
  <button class="button" :class="getClasses()">
    {{ props.label }}
  </button>
</template>

<script lang="ts" setup>
import { ButtonTypes } from '../types/Button';

interface Props {
  label?: string;
  buttonType: ButtonTypes | null;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  buttonType: null,
});

function getClasses(): string {
  switch (props.buttonType) {
    case ButtonTypes.ICON_BTN_LG:
      return 'button--icon-button-lg';

    default:
      return 'button';
  }
}
</script>

<style lang="scss" scoped>
.button {
  border: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &--icon-button-lg {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    font-size: 1.5rem;
    background: linear-gradient(150deg, #2f353a 14.75%, #1c1f22 84.81%);

    &::after {
      position: absolute;
      content: '';
      width: 4.5rem;
      height: 4.5rem;
      background: radial-gradient(
        transparent 63%,
        #2c3036 14.05%,
        #31343c 85.29%
      );
      box-shadow: 7px 7px 21px #1f2427, -13px -12px 23px #485057;
      border-radius: inherit;
      filter: blur(1px);
    }

    &:active {
      background: linear-gradient(320deg, #2f353a 14.75%, #1c1f22 84.81%);
      font-size: 1.48rem;
      transform: translate(-0.5px, -0.5px);
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
