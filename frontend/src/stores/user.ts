import { defineStore } from 'pinia';
import { signIn } from '../services/auth';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export const useUserStore = defineStore('user', () => {
  const accessToken = ref<null | string>(null);
  const isLoggedIn = ref<boolean>(false);
  const toast = useToast();
  const loading = ref<boolean>(false);

  async function login(emailAddress: string, password: string) {
    loading.value = true;
    const [data, error] = await signIn({ emailAddress, password });
    console.log('error', error);

    if (error) {
      accessToken.value = null;
      isLoggedIn.value = false;
      toast.add({
        severity: 'error',
        detail: 'Invalid Credentials',
        life: 2000,
      });
      loading.value = false;
      return;
    }

    accessToken.value = data && data.accessToken;
    isLoggedIn.value = true;
    loading.value = false;
  }

  return { accessToken, isLoggedIn, loading, login };
});
