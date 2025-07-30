import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { toast } from "vue-sonner";
import type {
  ICreateMemberReq,
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
} from "../../../../packages/types/api/members";
import { addMember, getMembers } from "../services/members";
import { useUserStore } from "../stores/user";

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  offset: number;
  loading: boolean;
}

export const useMembersStore = defineStore("members", () => {
  const defaultPageLimit = 5;
  const userStore = useUserStore();
  const loading = ref<boolean>(false);
  const members: Ref<IGetMembersPaginatedRes> = ref({
    data: [],
    totalCount: 0,
  });

  // Pagination state
  const currentPage = ref<number>(1);
  const pageSize = ref<number>(defaultPageLimit);
  const sortOrder = ref<"asc" | "desc">("asc");

  // Computed pagination values
  const totalItems = computed(() => members.value.totalCount);
  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
  const offset = computed(() => (currentPage.value - 1) * pageSize.value);

  // Pagination state object
  const paginationState = computed<PaginationState>(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    totalItems: totalItems.value,
    totalPages: totalPages.value,
    offset: offset.value,
    loading: loading.value,
  }));

  async function getMembersPaginated(params?: IGetMembersPaginatedReq) {
    const requestParams = {
      limit: params?.limit || `${pageSize.value}`,
      offset: params?.offset || `${offset.value}`,
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

  // Pagination helper methods
  async function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    await getMembersPaginated();
  }

  async function goToNextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
      await getMembersPaginated();
    }
  }

  async function goToPreviousPage() {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
      await getMembersPaginated();
    }
  }

  async function changePageSize(newPageSize: number) {
    pageSize.value = newPageSize;
    currentPage.value = 1; // Reset to first page when changing page size
    await getMembersPaginated();
  }

  async function changeSortOrder(order: "asc" | "desc") {
    sortOrder.value = order;
    await getMembersPaginated();
  }

  function resetPagination() {
    currentPage.value = 1;
    pageSize.value = defaultPageLimit;
    sortOrder.value = "asc";
  }

  async function addNewMember(params: ICreateMemberReq) {
    const [data, error] = await addMember(params, userStore.accessToken);

    if (error) {
      toast.error("Unexpected error while adding a member");
      return;
    }

    toast(
      `New member added: ${data?.firstName} ${data?.lastName}`,
    );
    await getMembersPaginated();
  }

  return {
    members,
    loading,
    defaultPageLimit,
    paginationState,
    currentPage,
    pageSize,
    sortOrder,
    totalItems,
    totalPages,
    offset,
    getMembersPaginated,
    addNewMember,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
    changeSortOrder,
    resetPagination,
  };
});
