export enum LambdaActions {
  MANAGE_ORGANIZATION = "MANAGE_ORGANIZATION",
}

export interface ManageOrganizationPayload {
  organization: {
    name: string;
    description?: string;
  };
  enableSupportAdmin: boolean;
  users: {
    name: string;
    emailAddress: string;
  }[];
}

export interface EventPayload<T = any> {
  action: keyof typeof LambdaActions;
  payload: T;
}
