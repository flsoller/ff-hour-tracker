export {};

declare global {
  interface CustomJwtSessionClaims {
    "orgId": string;
    "orgName": string;
    "orgRole": string;
    "version": 1;
    "userName": string;
    "userEmail": string;
  }
}
