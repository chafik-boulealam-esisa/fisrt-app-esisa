'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Layout } from '@/components/layout';
import { StatCard, Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

interface Statistics {
  total: number;
  byStatus: {
    active: number;
    graduated: number;
    suspended: number;
    withdrawn: number;
  };
  byDepartment: { department: string; count: number }[];
  byYear: { year: number; count: number }[];
  recentStudents: any[];
  averageGpa: number | null;
  gpaDistribution: {
    excellent: number;
    good: number;
    average: number;
    belowAverage: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/students/statistics');
        if (response.ok) {
          const data = await response.json();
          setStatistics(data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Welcome back, {session?.user?.firstName}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={statistics?.total || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Students"
          value={statistics?.byStatus.active || 0}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Graduated"
          value={statistics?.byStatus.graduated || 0}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Average GPA"
          value={statistics?.averageGpa?.toFixed(2) || 'N/A'}
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Students
            </h2>
            <Link
              href="/students"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {statistics?.recentStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <Badge variant={getStatusColor(student.status) as any}>
                  {student.status}
                </Badge>
              </div>
            ))}
            {(!statistics?.recentStudents || statistics.recentStudents.length === 0) && (
              <p className="text-center text-gray-500">No students yet</p>
            )}
          </div>
        </Card>

        {/* Students by Department */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Students by Department
            </h2>
          </div>
          <div className="space-y-3">
            {statistics?.byDepartment.map((dept) => (
              <div key={dept.department} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{dept.department}</p>
                    <p className="text-sm font-medium text-gray-600">
                      {dept.count} students
                    </p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(dept.count / (statistics?.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!statistics?.byDepartment || statistics.byDepartment.length === 0) && (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>
        </Card>

        {/* GPA Distribution */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              GPA Distribution
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Excellent (3.5+)</span>
              </div>
              <span className="font-medium text-gray-900">
                {statistics?.gpaDistribution.excellent || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Good (3.0-3.5)</span>
              </div>
              <span className="font-medium text-gray-900">
                {statistics?.gpaDistribution.good || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">Average (2.5-3.0)</span>
              </div>
              <span className="font-medium text-gray-900">
                {statistics?.gpaDistribution.average || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Below Average (&lt;2.5)</span>
              </div>
              <span className="font-medium text-gray-900">
                {statistics?.gpaDistribution.belowAverage || 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Status Overview */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Status Overview
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <UserCheck className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {statistics?.byStatus.active || 0}
              </p>
              <p className="text-sm text-green-700">Active</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <GraduationCap className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">
                {statistics?.byStatus.graduated || 0}
              </p>
              <p className="text-sm text-purple-700">Graduated</p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 text-center">
              <UserX className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
              <p className="text-2xl font-bold text-yellow-600">
                {statistics?.byStatus.suspended || 0}
              </p>
              <p className="text-sm text-yellow-700">Suspended</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <UserX className="mx-auto mb-2 h-8 w-8 text-red-600" />
              <p className="text-2xl font-bold text-red-600">
                {statistics?.byStatus.withdrawn || 0}
              </p>
              <p className="text-sm text-red-700">Withdrawn</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
