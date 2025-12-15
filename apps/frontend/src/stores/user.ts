import { useAuth, useOrganization, useUser } from "@clerk/vue";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const { isSignedIn, getToken, signOut } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  const isLoggedIn = computed(() => isSignedIn.value ?? false);

  async function getAccessToken(): Promise<string | null> {
    try {
      const token = await getToken.value();
      return token;
    } catch {
      return null;
    }
  }

  async function logout(): Promise<void> {
    await signOut.value();
  }

  return {
    isLoggedIn,
    user,
    organization,
    getAccessToken,
    logout,
  };
});
