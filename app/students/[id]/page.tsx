'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  User,
} from 'lucide-react';
import { getStatusColor, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string;
  gender: string;
  address: string | null;
  department: string;
  program: string;
  year: number;
  semester: number;
  enrollmentDate: string;
  gpa: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setStudent(data);
        } else if (response.status === 404) {
          toast.error('Student not found');
          router.push('/students');
        }
      } catch (error) {
        console.error('Failed to fetch student:', error);
        toast.error('Failed to fetch student');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!student) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Student deleted successfully');
        router.push('/students');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete student');
      }
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAdmin = session?.user?.role === 'admin';

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/students"
          className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Students
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h1>
              <Badge variant={getStatusColor(student.status) as any}>
                {student.status}
              </Badge>
            </div>
            <p className="mt-1 text-gray-500">Student ID: {student.studentId}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/students/${student.id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            {isAdmin && (
              <Button variant="danger" onClick={() => setDeleteModal(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{student.email}</p>
              </div>
            </div>
            {student.phone && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{student.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {formatDate(student.dateOfBirth)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize text-gray-900">
                  {student.gender}
                </p>
              </div>
            </div>
            {student.address && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{student.address}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Academic Information */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Academic Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{student.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium text-gray-900">{student.program}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-xl font-semibold text-gray-900">
                  {student.year}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-500">Semester</p>
                <p className="text-xl font-semibold text-gray-900">
                  {student.semester}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-500">GPA</p>
              <p className="text-xl font-semibold text-gray-900">
                {student.gpa ? student.gpa.toFixed(2) : 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrollment Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(student.enrollmentDate)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Record Information */}
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Record Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium text-gray-900">
                {formatDate(student.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">
                {formatDate(student.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium text-gray-900">
                {student.createdBy ? `${student.createdBy.firstName} ${student.createdBy.lastName}` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </Layout>
  );
}
