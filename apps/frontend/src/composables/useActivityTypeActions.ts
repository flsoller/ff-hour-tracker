import type { IGetActivitiesRes } from "@hour-tracker/core-types/activities";
import { toast } from "vue-sonner";

// Type for individual activity type data from paginated response
type ActivityTypeData = IGetActivitiesRes["data"][0];

/**
 * Composable for handling activity type-related actions and utilities
 * Following Single Responsibility Principle - handles only activity type actions
 */
export function useActivityTypeActions() {
  /**
   * Handle edit activity type action
   * TODO: Implement edit functionality
   */
  function editActivityType(activityType: ActivityTypeData) {
    toast.info(`Edit functionality coming soon for ${activityType.activityName}`);
  }

  /**
   * Handle view activity type details action
   * TODO: Implement view details functionality
   */
  function viewActivityTypeDetails(activityType: ActivityTypeData) {
    toast.info(`View details functionality coming soon for ${activityType.activityName}`);
  }

  /**
   * Handle delete activity type action
   * TODO: Implement delete functionality with confirmation
   */
  function deleteActivityType(activityType: ActivityTypeData) {
    toast.info(`Delete functionality coming soon for ${activityType.activityName}`);
  }

  /**
   * Handle toggle activity type status action
   * TODO: Implement toggle status functionality
   */
  function toggleActivityTypeStatus(activityType: ActivityTypeData) {
    const newStatus = activityType.active ? "deactivate" : "activate";
    toast.info(`${newStatus} functionality coming soon for ${activityType.activityName}`);
  }

  return {
    editActivityType,
    viewActivityTypeDetails,
    deleteActivityType,
    toggleActivityTypeStatus,
  };
}
