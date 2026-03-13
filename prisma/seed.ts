import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  if (process.env.SEED !== 'true') {
    console.log('SEED not enabled — skipping seed script.')
    return
  }
  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'testuser@example.com',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      userPreferences: {
        create: {},
      },
    },
  })

  console.log('Seed data inserted!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
