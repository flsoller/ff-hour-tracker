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
  isAdmin: boolean;
  orgId: string;
}

export interface IGetMembersPaginatedReq {
  limit?: string;
  offset?: string;
  order?: "asc" | "desc";
}

interface IGetMembersPaginatedData {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface IGetMembersPaginatedRes {
  data: IGetMembersPaginatedData[];
  totalCount: number;
}
