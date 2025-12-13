// Request types
export interface ICreateActivityReq {
  activityName: string;
  activityDescription: string;
  colorCode: string;
}

export interface IGetActivitiesReq {
  limit?: number;
  offset?: number;
  order?: "asc" | "desc";
}

// Response types
export interface IActivityCreatedRes {
  id: string;
  activityName: string;
  activityDescription: string;
  colorCode: string;
}

export interface IActivityType {
  id: string;
  activityName: string;
  activityDescription: string;
  organizationId: string;
  active: boolean;
  colorCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IGetActivitiesRes {
  data: IActivityType[];
  totalCount: number;
}
