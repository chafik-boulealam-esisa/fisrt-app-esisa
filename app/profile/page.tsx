'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
    },
  });

  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onUpdateProfile = async (data: UpdateProfileInput) => {
    if (!session?.user?.id) return;

    setIsUpdatingProfile(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      await update({
        ...session,
        user: {
          ...session.user,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordInput) => {
    if (!session?.user?.id) return;

    setIsUpdatingPassword(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: data.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }

      toast.success('Password updated successfully!');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-500">Manage your account settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <Badge
                  variant={session?.user?.role === 'admin' ? 'info' : 'default'}
                >
                  {session?.user?.role}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Update Profile Form */}
        <Card>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Update Profile
          </h2>
          <form
            onSubmit={profileForm.handleSubmit(onUpdateProfile)}
            className="space-y-4"
          >
            <Input
              {...profileForm.register('firstName')}
              label="First Name"
              error={profileForm.formState.errors.firstName?.message}
            />
            <Input
              {...profileForm.register('lastName')}
              label="Last Name"
              error={profileForm.formState.errors.lastName?.message}
            />
            <Button type="submit" isLoading={isUpdatingProfile}>
              Update Profile
            </Button>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Change Password
          </h2>
          <form
            onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
            className="max-w-md space-y-4"
          >
            <div className="relative">
              <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                {...passwordForm.register('currentPassword')}
                type="password"
                label="Current Password"
                className="pl-10"
                error={passwordForm.formState.errors.currentPassword?.message}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                {...passwordForm.register('newPassword')}
                type="password"
                label="New Password"
                className="pl-10"
                error={passwordForm.formState.errors.newPassword?.message}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                {...passwordForm.register('confirmPassword')}
                type="password"
                label="Confirm New Password"
                className="pl-10"
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
            </div>
            <Button type="submit" isLoading={isUpdatingPassword}>
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
