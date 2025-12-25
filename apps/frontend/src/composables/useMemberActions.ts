import type { IGetMembersPaginatedRes } from "@hour-tracker/core-types/members";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

// Type for individual member data from paginated response
type MemberData = IGetMembersPaginatedRes["data"][0];

/**
 * Composable for handling member-related actions and utilities
 * Following Single Responsibility Principle - handles only member actions
 */
export function useMemberActions() {
  const { locale } = useI18n();

  /**
   * Copy email address to clipboard
   */
  async function copyEmail(email: string) {
    await navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  }

  /**
   * Generate initials from first and last name
   */
  function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  /**
   * Format join date (placeholder implementation)
   * TODO: Replace with actual join date from API
   */
  function formatJoinDate(): string {
    const date = new Date(2024, 0, 1);
    return date.toLocaleDateString(locale.value, {
      year: "numeric",
      month: "short",
    });
  }

  /**
   * Handle edit member action
   * TODO: Implement edit functionality
   */
  function editMember(member: MemberData) {
    // TODO: Implement edit functionality
    // Temporarily logging for demonstration
    // eslint-disable-next-line no-console
    console.log("Edit member:", member);
  }

  /**
   * Handle view member details action
   * TODO: Implement view details functionality
   */
  function viewMemberDetails(member: MemberData) {
    // TODO: Implement view details functionality
    // Temporarily logging for demonstration
    // eslint-disable-next-line no-console
    console.log("View member details:", member);
  }

  /**
   * Handle delete member action
   * TODO: Implement delete functionality with confirmation
   */
  function deleteMember(member: MemberData) {
    // TODO: Implement delete functionality with confirmation
    // Temporarily logging for demonstration
    // eslint-disable-next-line no-console
    console.log("Delete member:", member);
  }

  return {
    copyEmail,
    getInitials,
    formatJoinDate,
    editMember,
    viewMemberDetails,
    deleteMember,
  };
}
