import type { ICreateActivityReq, IGetActivitiesReq, IGetActivitiesRes } from "@hour-tracker/core-types/activities";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { addActivity, getActivities, updateActivity } from "../services/activities";

/**
 * Activity types store focused on data management following Single Responsibility Principle
 * Pagination UI logic is handled by parent components
 */
export const useActivityTypesStore = defineStore("activityTypes", () => {
  const { t } = useI18n();
  const defaultPageLimit = 5;
  const loading = ref<boolean>(false);
  const activities: Ref<IGetActivitiesRes> = ref({
    data: [],
    totalCount: 0,
  });
  const sortOrder = ref<"asc" | "desc">("asc");
  const totalItems = computed(() => activities.value.totalCount);

  /**
   * Fetch activity types with pagination parameters
   * @param params - Pagination and filtering parameters
   */
  async function getActivitiesPaginated(params?: IGetActivitiesReq) {
    const requestParams = {
      limit: params?.limit || defaultPageLimit,
      offset: params?.offset || 0,
      order: params?.order || sortOrder.value,
    };

    loading.value = true;
    const [data, error] = await getActivities(requestParams);

    if (error) {
      toast.error("Unexpected error while loading activity types data");
    }

    activities.value = {
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
    await getActivitiesPaginated({
      order,
      limit: limit || defaultPageLimit,
      offset: offset || 0,
    });
  }

  /**
   * Add a new activity type and refresh the current page
   * @param activityData - Activity type data to create
   * @param currentParams - Current pagination parameters for refresh
   */
  async function addNewActivity(activityData: ICreateActivityReq, currentParams?: IGetActivitiesReq) {
    const [data, error] = await addActivity(activityData);

    if (error) {
      toast.error("Unexpected error while adding activity type");
      return;
    }
    toast(
      `New activity type added: ${data?.activityName}`,
    );
    await getActivitiesPaginated(currentParams);
  }

  /**
   * Update an existing activity type and refresh the current page
   * @param id - ID of the activity type to update
   * @param activityData - Updated activity type data
   * @param currentParams - Current pagination parameters for refresh
   * @returns Promise resolving to true on success, false on failure
   */
  async function updateExistingActivity(
    id: string,
    activityData: ICreateActivityReq,
    currentParams?: IGetActivitiesReq,
  ): Promise<boolean> {
    loading.value = true;
    const [data, error] = await updateActivity(id, activityData);

    if (error) {
      toast.error(t("configuration.toasts.updateError"));
      loading.value = false;
      return false;
    }

    toast(t("configuration.toasts.updateSuccess", { name: data?.activityName }));
    await getActivitiesPaginated(currentParams);
    loading.value = false;
    return true;
  }

  return {
    activities,
    loading,
    defaultPageLimit,
    sortOrder,
    totalItems,
    getActivitiesPaginated,
    addNewActivity,
    updateExistingActivity,
    changeSortOrder,
  };
});
