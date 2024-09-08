export interface ICreateOrganizationReq {
  name: string;
  description: string;
}

export interface IOrganizationCreatedRes {
  id: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
}
