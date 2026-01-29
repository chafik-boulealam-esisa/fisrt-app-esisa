import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { studentSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/students/[id] - Get a single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update a student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Validate input (partial update allowed)
    const validatedData = studentSchema.partial().parse(body);

    // Check if new student ID conflicts with another student
    if (validatedData.studentId && validatedData.studentId !== existingStudent.studentId) {
      const conflictStudent = await prisma.student.findUnique({
        where: { studentId: validatedData.studentId },
      });

      if (conflictStudent) {
        return NextResponse.json(
          { error: 'Student ID already exists' },
          { status: 409 }
        );
      }
    }

    // Check if new email conflicts with another student
    if (validatedData.email && validatedData.email !== existingStudent.email) {
      const conflictEmail = await prisma.student.findUnique({
        where: { email: validatedData.email },
      });

      if (conflictEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    // Update student
    const student = await prisma.student.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log action
    await prisma.securityLog.create({
      data: {
        action: 'UPDATE_STUDENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: `Updated student: ${student.firstName} ${student.lastName} (${student.studentId})`,
        userId: session.user.id,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can delete students
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Delete student
    await prisma.student.delete({
      where: { id: params.id },
    });

    // Log action
    await prisma.securityLog.create({
      data: {
        action: 'DELETE_STUDENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: `Deleted student: ${existingStudent.firstName} ${existingStudent.lastName} (${existingStudent.studentId})`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
