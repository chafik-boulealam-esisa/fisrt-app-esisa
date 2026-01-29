'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentInput } from '@/lib/validations';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          // Format dates for input fields
          reset({
            ...data,
            dateOfBirth: data.dateOfBirth.split('T')[0],
            enrollmentDate: data.enrollmentDate.split('T')[0],
          });
        } else if (response.status === 404) {
          toast.error('Student not found');
          router.push('/students');
        }
      } catch (error) {
        console.error('Failed to fetch student:', error);
        toast.error('Failed to fetch student');
      } finally {
        setIsFetching(false);
      }
    };

    fetchStudent();
  }, [params.id, reset, router]);

  const onSubmit = async (data: StudentInput) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update student');
      }

      toast.success('Student updated successfully!');
      router.push(`/students/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/students/${params.id}`}
          className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Student Details
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
        <p className="mt-1 text-gray-500">
          Update student information
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
            <div className="space-y-4">
              <Input
                {...register('studentId')}
                label="Student ID"
                placeholder="e.g., STU2024001"
                error={errors.studentId?.message}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('firstName')}
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                />
                <Input
                  {...register('lastName')}
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                />
              </div>
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="john.doe@esisa.ac.ma"
                error={errors.email?.message}
              />
              <Input
                {...register('phone')}
                label="Phone (Optional)"
                placeholder="+212 6XX XXX XXX"
                error={errors.phone?.message}
              />
              <Input
                {...register('dateOfBirth')}
                type="date"
                label="Date of Birth"
                error={errors.dateOfBirth?.message}
              />
              <Select
                {...register('gender')}
                label="Gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                error={errors.gender?.message}
              />
              <Textarea
                {...register('address')}
                label="Address (Optional)"
                placeholder="Enter full address"
                error={errors.address?.message}
              />
            </div>
          </Card>

          {/* Academic Information */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Academic Information
            </h2>
            <div className="space-y-4">
              <Select
                {...register('department')}
                label="Department"
                options={[
                  { value: '', label: 'Select Department' },
                  { value: 'Computer Science', label: 'Computer Science' },
                  { value: 'Information Technology', label: 'Information Technology' },
                  { value: 'Software Engineering', label: 'Software Engineering' },
                  { value: 'Data Science', label: 'Data Science' },
                  { value: 'Cybersecurity', label: 'Cybersecurity' },
                ]}
                error={errors.department?.message}
              />
              <Select
                {...register('program')}
                label="Program"
                options={[
                  { value: '', label: 'Select Program' },
                  { value: 'Bachelor', label: 'Bachelor' },
                  { value: 'Master', label: 'Master' },
                  { value: 'PhD', label: 'PhD' },
                  { value: 'Diploma', label: 'Diploma' },
                ]}
                error={errors.program?.message}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  {...register('year', { valueAsNumber: true })}
                  label="Year"
                  options={[
                    { value: '1', label: 'Year 1' },
                    { value: '2', label: 'Year 2' },
                    { value: '3', label: 'Year 3' },
                    { value: '4', label: 'Year 4' },
                    { value: '5', label: 'Year 5' },
                  ]}
                  error={errors.year?.message}
                />
                <Select
                  {...register('semester', { valueAsNumber: true })}
                  label="Semester"
                  options={[
                    { value: '1', label: 'Semester 1' },
                    { value: '2', label: 'Semester 2' },
                  ]}
                  error={errors.semester?.message}
                />
              </div>
              <Input
                {...register('enrollmentDate')}
                type="date"
                label="Enrollment Date"
                error={errors.enrollmentDate?.message}
              />
              <Input
                {...register('gpa', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                max="4"
                label="GPA (Optional)"
                placeholder="e.g., 3.50"
                error={errors.gpa?.message}
              />
              <Select
                {...register('status')}
                label="Status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'graduated', label: 'Graduated' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'withdrawn', label: 'Withdrawn' },
                ]}
                error={errors.status?.message}
              />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Link href={`/students/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading}>
            Update Student
          </Button>
        </div>
      </form>
    </Layout>
  );
}
