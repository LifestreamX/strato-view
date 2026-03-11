import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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

  // Add a saved aircraft
  await prisma.savedAircraft.create({
    data: {
      userId: user.id,
      icao24: 'abc123',
      callsign: 'TEST123',
      country: 'United States',
      notes: 'Demo aircraft',
    },
  })

  // Add a saved location
  await prisma.savedLocation.create({
    data: {
      userId: user.id,
      name: 'Home',
      latitude: 40.7128,
      longitude: -74.006,
      radius: 25,
      description: 'Home location',
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
