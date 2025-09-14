import type {
  ICreateMemberReq,
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
} from "@hour-tracker/core-types/members";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { toast } from "vue-sonner";
import { addMember, getMembers } from "../services/members";
import { useUserStore } from "../stores/user";

/**
 * Members store focused on data management following Single Responsibility Principle
 * Pagination UI logic is handled by parent components
 */
export const useMembersStore = defineStore("members", () => {
  const defaultPageLimit = 5;
  const userStore = useUserStore();
  const loading = ref<boolean>(false);
  const members: Ref<IGetMembersPaginatedRes> = ref({
    data: [],
    totalCount: 0,
  });
  const sortOrder = ref<"asc" | "desc">("asc");

  // Computed values for data access
  const totalItems = computed(() => members.value.totalCount);

  /**
   * Fetch members with pagination parameters
   * @param params - Pagination and filtering parameters
   */
  async function getMembersPaginated(params?: IGetMembersPaginatedReq) {
    const requestParams = {
      limit: params?.limit || `${defaultPageLimit}`,
      offset: params?.offset || "0",
      order: params?.order || sortOrder.value,
    };

    loading.value = true;
    const [data, error] = await getMembers(
      requestParams,
      userStore.accessToken,
    );

    if (error) {
      toast.error("Unexpected error while loading members data");
    }

    members.value = {
      data: data?.data || [],
      totalCount: data?.totalCount || 0,
    };
    loading.value = false;
  }

  /**
   * Change sort order and refetch data
   * @param order - Sort order (asc or desc)
   * @param limit - Page size
   * @param offset - Page offset
   */
  async function changeSortOrder(order: "asc" | "desc", limit?: number, offset?: number) {
    sortOrder.value = order;
    await getMembersPaginated({
      order,
      limit: limit?.toString() || `${defaultPageLimit}`,
      offset: offset?.toString() || "0",
    });
  }

  /**
   * Add a new member and refresh the current page
   * @param memberData - Member data to create
   * @param currentParams - Current pagination parameters for refresh
   */
  async function addNewMember(memberData: ICreateMemberReq, currentParams?: IGetMembersPaginatedReq) {
    const [data, error] = await addMember(memberData, userStore.accessToken);

    if (error) {
      toast.error("Unexpected error while adding a member");
      return;
    }

    toast(
      `New member added: ${data?.firstName} ${data?.lastName}`,
    );

    // Refresh with current pagination state
    await getMembersPaginated(currentParams);
  }

  return {
    members,
    loading,
    defaultPageLimit,
    sortOrder,
    totalItems,
    getMembersPaginated,
    addNewMember,
    changeSortOrder,
  };
});
