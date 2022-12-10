import { expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginView from '../../views/Login.vue';
import * as auth from '../../services/auth';

describe('Login View', () => {
  it('should create', () => {
    const wrapper = mount(LoginView);
    expect(wrapper.isVisible()).toBe(true);
  });

  it('should have submit button disabled by default', () => {
    const wrapper = mount(LoginView);
    const button = wrapper.find('button');
    expect(button.element.disabled).toBe(true);
  });

  it('should enable submit button when inputs are valid', async () => {
    const wrapper = mount(LoginView);
    const button = wrapper.find('button');
    await wrapper.find('input[type=email]').setValue('user@email.com');
    await wrapper.find('input[type=password]').setValue('supersecret');
    expect(button.element.disabled).toBe(false);
  });

  it('should have submit button disabled when inputs are invalid', async () => {
    const wrapper = mount(LoginView);
    const button = wrapper.find('button');
    await wrapper.find('input[type=email]').setValue('user');
    await wrapper.find('input[type=password]').setValue('');
    expect(button.element.disabled).toBe(true);
  });

  it('should submit form and call signin', async () => {
    const wrapper = mount(LoginView);
    const apiSpy = vi.spyOn(auth, 'signIn');
    await wrapper.find('input[type=email]').setValue('user@email.com');
    await wrapper.find('input[type=password]').setValue('supersecret');
    await wrapper.find('form').trigger('submit');
    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(apiSpy).toHaveBeenCalledWith({
      emailAddress: 'user@email.com',
      password: 'supersecret',
    });
  });
});
