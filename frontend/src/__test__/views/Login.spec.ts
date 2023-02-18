import { expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { flushPromises } from '../mocks/helpers';
import LoginView from '../../views/Login.vue';
import ToastService from 'primevue/toastservice';
import { useUserStore } from '../../stores/user';

describe('Login View', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(LoginView, {
      global: {
        plugins: [ToastService],
      },
    });
  });

  describe('component tests', () => {
    it('should create', () => {
      expect(wrapper.isVisible()).toBe(true);
    });

    it('should have submit button disabled by default', () => {
      const button = wrapper.find('button');
      expect(button.element.disabled).toBe(true);
    });

    it('should enable submit button when inputs are valid', async () => {
      const button = wrapper.find('button');
      await wrapper.find('input[type=email]').setValue('user@email.com');
      await wrapper.find('input[type=password]').setValue('supersecret');
      expect(button.element.disabled).toBe(false);
    });

    it('should have submit button disabled when inputs are invalid', async () => {
      const button = wrapper.find('button');
      await wrapper.find('input[type=email]').setValue('user');
      await wrapper.find('input[type=password]').setValue('');
      expect(button.element.disabled).toBe(true);
    });
  });

  describe('store integration', () => {
    it('should submit form and resolve store params to correct values', async () => {
      const userStore = useUserStore();
      await wrapper.find('input[type=email]').setValue('user@email.com');
      await wrapper.find('input[type=password]').setValue('supersecret');
      await wrapper.find('form').trigger('submit');
      expect(userStore.loading).toBe(true);
      expect(userStore.login).toHaveBeenCalledTimes(1);
      expect(userStore.login).toHaveBeenCalledWith(
        'user@email.com',
        'supersecret'
      );
      await flushPromises();
      expect(userStore.loading).toBe(false);
      expect(userStore.isLoggedIn).toBe(true);
      expect(userStore.accessToken).toBe('token');
    });
  });
});
