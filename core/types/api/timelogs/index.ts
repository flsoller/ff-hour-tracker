export interface ICreateTimelogReq {
  date: Date;
  hours: number;
  activityTypeId: string;
  memberId: string;
  organizationId: string;
}

export interface ITimelogCreatedRes {
  memberName: string;
  hours: number;
  activity: string;
  date: Date;
}

export interface ITimelog {
  id: string;
  date: Date;
  hours: number;
  activityTypeId: string;
  orgId: string;
  memberId: string;
}
