export interface ICreateMemberReq {
  firstName: string;
  lastName: string;
  emailAddress: string;
  organizationId: string;
}

export interface IMemberCreatedRes {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  organization: string;
}

export interface IMember {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  isAdmin: boolean;
  orgId: string;
}
