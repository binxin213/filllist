import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const requests = await prisma.repairRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicant, serialNumber, location, applicationTime, projectName, description, expectedReturn } = body;

    const newRequest = await prisma.repairRequest.create({
      data: {
        applicant,
        serialNumber,
        location,
        applicationTime: new Date(applicationTime),
        projectName,
        description,
        expectedReturn: new Date(expectedReturn),
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
