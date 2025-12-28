import { handler } from "../../src";
import * as activityRepository from "../../src/common/repository/activity-type";
import {
  createActivityTypesForOrganization,
  createApiRequestEvent,
  createOrganizations,
  createUserForOrganization,
} from "../helpers/test-data";

describe("Update Active Status", () => {
  let orgId: string;
  let userId: string;
  let role: string;
  let activityId: string;
  let activityName: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    const [user] = await createUserForOrganization(organization!.id);
    const [activityType] = await createActivityTypesForOrganization(organization!.id, 1);

    orgId = organization!.id;
    userId = user!.id;
    role = user!.role;
    activityId = activityType!.id;
    activityName = activityType!.activityName;
  });

  it("should update the active status of an activity", async () => {
    const activity = await activityRepository.getByName(orgId, activityName);
    expect(activity.active).toBe(true);
    const event = createApiRequestEvent(
      {
        active: false,
      },
      {},
      "/v1/activity-types/{id}",
      "PATCH",
      { organizationId: orgId, userId, role },
      { id: activityId },
    );
    const result = await handler(event);
    expect(result).toEqual({
      statusCode: 204,
    });
    const patchedActivity = await activityRepository.getByName(orgId, activityName);
    expect(patchedActivity.active).toBe(false);
  });

  it("should throw a 404 when activity type does not exist for organization", async () => {
    const [, otherOrganization] = await createOrganizations();
    const [otherUser] = await createUserForOrganization(otherOrganization!.id);
    const event = createApiRequestEvent(
      {
        active: false,
      },
      {},
      "/v1/activity-types/{id}",
      "PATCH",
      {
        organizationId: otherOrganization!.id,
        userId: otherUser!.id,
        role: otherUser!.role,
      },
      { id: activityId },
    );
    const result = await handler(event);
    expect(result).toEqual({
      statusCode: 404,
      body: JSON.stringify({
        message: "",
        details: [],
      }),
    });
  });

  it("should throw a bad request error when event body is malformed", async () => {
    const event = createApiRequestEvent(
      {
        active: "not_active",
      },
      {},
      "/v1/activity-types/{id}",
      "PATCH",
      { organizationId: orgId, userId, role },
      { id: activityId },
    );
    const result = await handler(event);
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: "InvalidRequest",
        details: [],
      }),
    });
  });
});
