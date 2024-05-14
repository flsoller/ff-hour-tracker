import { db } from '../index';
import { organizations } from '../schema/organization';
import { users } from '../schema/user';

async function seed() {
  const organization = await db
    .insert(organizations)
    .values({
      name: 'Develop Org',
      description: 'Seeder organization for development',
    })
    .returning();

  await db.insert(users).values({
    organizationId: organization[0].id,
    emailAddress: process.env.ADMIN_USER_EMAIL as string,
    password: process.env.ADMIN_USER_PW as string,
    role: 'ADMIN',
    name: 'Admin',
  });
}

async function main() {
  try {
    await seed();
    console.log('Seeding completed');
    process.exit();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}
main();
