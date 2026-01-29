import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/students/statistics - Get student statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total counts
    const totalStudents = await prisma.student.count();
    
    // Get counts by status
    const activeStudents = await prisma.student.count({
      where: { status: 'active' },
    });
    
    const graduatedStudents = await prisma.student.count({
      where: { status: 'graduated' },
    });
    
    const suspendedStudents = await prisma.student.count({
      where: { status: 'suspended' },
    });
    
    const withdrawnStudents = await prisma.student.count({
      where: { status: 'withdrawn' },
    });

    // Get counts by program (department)
    const studentsByProgram = await prisma.student.groupBy({
      by: ['program'],
      _count: {
        id: true,
      },
    });

    // Get counts by year
    const studentsByYear = await prisma.student.groupBy({
      by: ['year'],
      _count: {
        id: true,
      },
    });

    // Get recent students (last 5)
    const recentStudents = await prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        email: true,
        program: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate average GPA
    const avgGpaResult = await prisma.student.aggregate({
      _avg: {
        gpa: true,
      },
      where: {
        gpa: { not: null },
      },
    });

    // Get GPA distribution
    const gpaDistribution = {
      excellent: await prisma.student.count({ where: { gpa: { gte: 3.5 } } }),
      good: await prisma.student.count({ where: { gpa: { gte: 3.0, lt: 3.5 } } }),
      average: await prisma.student.count({ where: { gpa: { gte: 2.5, lt: 3.0 } } }),
      belowAverage: await prisma.student.count({ where: { gpa: { lt: 2.5 } } }),
    };

    return NextResponse.json({
      total: totalStudents,
      byStatus: {
        active: activeStudents,
        graduated: graduatedStudents,
        suspended: suspendedStudents,
        withdrawn: withdrawnStudents,
      },
      byDepartment: studentsByProgram.map((d) => ({
        department: d.program || 'Unknown',
        count: d._count.id,
      })),
      byYear: studentsByYear.map((y) => ({
        year: y.year,
        count: y._count.id,
      })),
      recentStudents: recentStudents.map((s) => ({
        ...s,
        department: s.program,
      })),
      averageGpa: avgGpaResult._avg.gpa ? parseFloat(avgGpaResult._avg.gpa.toFixed(2)) : null,
      gpaDistribution,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
