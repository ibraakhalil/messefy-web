import { db } from '..';
import { users } from '../schemas/users.schema';
import { hash } from 'bcryptjs';

export async function seedUsers() {
  try {
    // Check if test users already exist
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, or }) =>
        or(
          eq(users.email, 'john@example.com'),
          eq(users.email, 'jane@example.com'),
          eq(users.email, 'demo@example.com'),
        ),
    });

    if (existingUser) {
      console.log('ℹ️ Test users already exist, skipping seeding');
      return;
    }

    // Hash the passwords for test users
    const password1 = await hash('password123', 10);
    const password2 = await hash('testpass456', 10);
    const password3 = await hash('demopass789', 10);

    // Insert test users
    await db.insert(users).values([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: password1,
        image: 'https://ui-avatars.com/api/?name=John+Doe',
        isActive: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: password2,
        image: 'https://ui-avatars.com/api/?name=Jane+Smith',
        isActive: true,
      },
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: password3,
        image: 'https://ui-avatars.com/api/?name=Demo+User',
        isActive: true,
      },
    ]);

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

// Call the seed function when this file is run directly
if (import.meta.main) {
  try {
    await seedUsers();
  } finally {
    process.exit(0);
  }
}
