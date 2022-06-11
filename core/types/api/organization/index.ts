export interface ICreateOrganizationReq {
  name: string;
  description: string;
}

export interface IOrganizationCreatedRes {
  id: string;
  name: string;
}
