import { db, DrizzleORM, models } from "@hour-tracker/db";
import { Context } from "aws-lambda";
import { handler } from "../src";
import { EventPayload, LambdaActions, ManageOrganizationPayload } from "../src/common/types/actions.type";

describe("manageOrganization", () => {
  it("should create a new organization with support user", async () => {
    const sampleEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "Sample Organization",
          description: "Sample description",
        },
        enableSupportAdmin: true,
        users: [
          {
            emailAddress: "john@continental.com",
            name: "John Wick",
          },
        ],
      },
    };
    await handler(sampleEvent, {} as Context);

    const createdOrganization = await db.select().from(models.organizations);
    expect(createdOrganization.length).toBe(1);
    expect(createdOrganization[0]!.name).toBe("Sample Organization");
    expect(createdOrganization[0]!.description).toBe("Sample description");

    const createdSupportUser = await db
      .select()
      .from(models.users)
      .orderBy(DrizzleORM.asc(models.users.name));
    expect(createdSupportUser.length).toBe(2);
    expect(createdSupportUser[0]!.name).toBe("John Wick");
    expect(createdSupportUser[0]!.emailAddress).toBe("john@continental.com");
    expect(createdSupportUser[1]!.emailAddress).toBe("support@user.com");
  });

  it("should create a new organization with no support user", async () => {
    const sampleEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "Sample Organization",
          description: "Sample description",
        },
        enableSupportAdmin: false,
        users: [
          {
            emailAddress: "john@continental.com",
            name: "John Wick",
          },
        ],
      },
    };
    await handler(sampleEvent, {} as Context);
    const createdUser = await db
      .select()
      .from(models.users)
      .orderBy(DrizzleORM.asc(models.users.name));
    expect(createdUser.length).toBe(1);
    expect(createdUser[0]!.name).toBe("John Wick");
    expect(createdUser[0]!.emailAddress).toBe("john@continental.com");
  });

  it("should not fail when organization and users already exist (independent letter casing)", async () => {
    const orgName = "SAMPLE ORGANIZATION";
    const user = {
      emailAddress: "john@continental.com",
      name: "John Wick",
    };

    const [existingOrg] = await db
      .insert(models.organizations)
      .values({
        name: orgName,
        description: "",
      })
      .returning();

    await db.insert(models.users).values({
      ...user,
      role: "ADMIN",
      organizationId: existingOrg!.id,
      password: "",
    });

    const sampleEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "sample organization",
          description: "",
        },
        enableSupportAdmin: false,
        users: [
          {
            name: "John Wick",
            emailAddress: "JOHN@continental.COM",
          },
        ],
      },
    };
    await expect(handler(sampleEvent, {} as Context)).resolves.not.toThrow();
    const organization = await db.select().from(models.organizations);
    const dbUser = await db.select().from(models.users);
    expect(organization.length).toBe(1);
    expect(dbUser.length).toBe(1);
  });

  it("should remove the support admin when it was previously enabled for the organization", async () => {
    const sampleEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "sample organization",
          description: "",
        },
        enableSupportAdmin: true,
        users: [],
      },
    };
    await expect(handler(sampleEvent, {} as Context)).resolves.not.toThrow();
    const organization = await db.select().from(models.organizations);
    expect(organization.length).toBe(1);
    const user = await db.select().from(models.users);
    expect(user.length).toBe(1);
    expect(user[0]!.emailAddress).toBe("support@user.com");

    const secondSampleEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "sample organization",
          description: "",
        },
        enableSupportAdmin: false,
        users: [],
      },
    };
    await expect(
      handler(secondSampleEvent, {} as Context),
    ).resolves.not.toThrow();
    const noUsers = await db.select().from(models.users);
    expect(noUsers.length).toBe(0);
  });

  it("should keep the support user when manage organization is called twice with same params", async () => {
    const firstEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "sample organization",
          description: "",
        },
        enableSupportAdmin: true,
        users: [],
      },
    };
    const secondEvent: EventPayload<ManageOrganizationPayload> = {
      action: LambdaActions.MANAGE_ORGANIZATION,
      payload: {
        organization: {
          name: "sample organization",
          description: "",
        },
        enableSupportAdmin: true,
        users: [],
      },
    };
    await expect(handler(firstEvent, {} as Context)).resolves.not.toThrow();
    await expect(handler(secondEvent, {} as Context)).resolves.not.toThrow();
    const noUsers = await db.select().from(models.users);
    expect(noUsers.length).toBe(1);
  });
});
