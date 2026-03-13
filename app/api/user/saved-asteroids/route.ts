import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const savedAsteroids = await prisma.savedAsteroid.findMany({
    where: { userEmail: session.user.email },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ savedAsteroids });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing asteroid id' }, { status: 400 });
  }

  await prisma.savedAsteroid.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
