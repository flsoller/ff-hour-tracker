import { defineStore } from 'pinia';
import { signIn } from '../services/auth';
import { ref } from 'vue';
import { useToastService } from '../services/toast';
import router from '../router';

export const useUserStore = defineStore('user', () => {
  const accessToken = ref<null | string>(null);
  const isLoggedIn = ref<boolean>(false);
  const toast = useToastService();
  const loading = ref<boolean>(false);

  async function login(emailAddress: string, password: string) {
    loading.value = true;
    const [data, error] = await signIn({ emailAddress, password });

    if (error) {
      accessToken.value = null;
      isLoggedIn.value = false;
      toast.showToast('error', 'Invalid Credentials');
      loading.value = false;
      return;
    }

    accessToken.value = data && data.accessToken;
    isLoggedIn.value = true;
    loading.value = false;
    router.push('/');
  }

  return { accessToken, isLoggedIn, loading, login };
});
