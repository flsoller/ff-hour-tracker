export interface ICreateMemberReq {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface IMemberCreatedRes {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface IMember {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetMembersPaginatedReq {
  limit?: string;
  offset?: string;
  order?: "asc" | "desc";
}

export interface IGetMembersPaginatedRes {
  data: IMember[];
  totalCount: number;
}
