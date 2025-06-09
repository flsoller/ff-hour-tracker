import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import {
  ICreateMemberReq,
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
} from "../../../../packages/types/api/members";
import { addMember, getMembers } from "../services/members";
import { useToastService } from "../services/toast";
import { useUserStore } from "../stores/user";

export const useMembersStore = defineStore("members", () => {
  const defaultPageLimit = 5;
  const userStore = useUserStore();
  const toast = useToastService();
  const loading = ref<boolean>(false);
  const members: Ref<IGetMembersPaginatedRes> = ref({
    data: [],
    totalCount: 0,
  });

  async function getMembersPaginated(params?: IGetMembersPaginatedReq) {
    const requestParams = {
      limit: params?.limit || `${defaultPageLimit}`,
      offset: params?.offset || "0",
      order: params?.order || "asc",
    };

    loading.value = true;
    const [data, error] = await getMembers(
      requestParams,
      userStore.accessToken,
    );

    if (error) {
      toast.showToast("error", "Unexpected error while loading members data");
    }

    members.value = {
      data: data?.data || [],
      totalCount: data?.totalCount || 0,
    };
    loading.value = false;
  }

  async function addNewMember(params: ICreateMemberReq) {
    const [data, error] = await addMember(params, userStore.accessToken);

    if (error) {
      toast.showToast("error", "Unexpected error while adding a member");
      return;
    }

    toast.showToast(
      "success",
      `New member added: ${data?.firstName} ${data?.lastName}`,
    );
    await getMembersPaginated();
  }

  return {
    members,
    loading,
    defaultPageLimit,
    getMembersPaginated,
    addNewMember,
  };
});
