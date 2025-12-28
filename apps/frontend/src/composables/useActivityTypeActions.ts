import type { IGetActivitiesReq, IGetActivitiesRes } from "@hour-tracker/core-types/activities";
import { ref } from "vue";
import type { Ref } from "vue";
import { useActivityTypesStore } from "../stores/activities";

// Type for individual activity type data from paginated response
type ActivityTypeData = IGetActivitiesRes["data"][0];

/**
 * Composable for handling activity type-related actions and utilities
 * Following Single Responsibility Principle - handles only activity type actions
 */
export function useActivityTypeActions() {
  // State for edit modal
  const editingActivityType: Ref<ActivityTypeData | null> = ref(null);
  const isEditModalOpen = ref(false);

  /**
   * Handle edit activity type action
   * Opens the edit modal with the selected activity type
   */
  function editActivityType(activityType: ActivityTypeData) {
    editingActivityType.value = activityType;
    isEditModalOpen.value = true;
  }

  /**
   * Close the edit modal and clear selection
   */
  function closeEditModal() {
    isEditModalOpen.value = false;
    editingActivityType.value = null;
  }

  /**
   * Handle toggle activity type status action
   * Requires pagination params from parent component to maintain page state
   */
  function toggleActivityTypeStatus(
    activityType: ActivityTypeData,
    currentParams?: IGetActivitiesReq,
  ) {
    return useActivityTypesStore().toggleActivityStatus(
      activityType.id,
      activityType.active,
      activityType.activityName,
      currentParams,
    );
  }

  return {
    // State
    editingActivityType,
    isEditModalOpen,
    // Actions
    editActivityType,
    closeEditModal,
    toggleActivityTypeStatus,
  };
}
