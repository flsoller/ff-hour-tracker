export interface ICreateActivityReq {
  activityName: string;
  activityDesc: string;
}

export interface IActivityCreatedRes {
  id: string;
  activityName: string;
  activityDesc: string;
}

export interface IActivityType {
  id: string;
  activityName: string;
  activityDesc: string;
  orgId: string;
}
