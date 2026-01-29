'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Modal, ConfirmModal } from '@/components/ui/modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/ui/table';
import { Plus, Search, Pencil, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userManagementSchema, type UserManagementInput } from '@/lib/validations';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    students: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());
      if (search) params.set('search', search);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [fetchUsers, session?.user?.role]);

  const createForm = useForm<UserManagementInput>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      role: 'user',
      isActive: true,
    },
  });

  const editForm = useForm<Partial<UserManagementInput>>({
    resolver: zodResolver(userManagementSchema.partial()),
  });

  const handleCreate = async (data: UserManagementInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('User created successfully');
        setCreateModal(false);
        createForm.reset();
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: Partial<UserManagementInput>) => {
    if (!editModal.user) return;

    setIsSubmitting(true);
    try {
      // Remove empty password field
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(`/api/users/${editModal.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success('User updated successfully');
        setEditModal({ isOpen: false, user: null });
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${deleteModal.user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        setDeleteModal({ isOpen: false, user: null });
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: User) => {
    editForm.reset({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as 'admin' | 'user',
      isActive: user.isActive,
      password: '',
    });
    setEditModal({ isOpen: true, user });
  };

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-500">Manage system users and permissions</p>
        </div>
        <Button onClick={() => setCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPagination((prev) => ({ ...prev, page: 1 }));
                  fetchUsers();
                }
              }}
            />
          </div>
          <Button
            onClick={() => {
              setPagination((prev) => ({ ...prev, page: 1 }));
              fetchUsers();
            }}
            variant="secondary"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students Created</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableEmpty message="No users found" />
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                        <Shield className="mr-1 h-3 w-3" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? (
                          <>
                            <UserCheck className="mr-1 h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="mr-1 h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{user._count.students}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {user.id !== session?.user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteModal({ isOpen: true, user })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          </div>
        </>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
          createForm.reset();
        }}
        title="Create New User"
        className="max-w-md"
      >
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...createForm.register('firstName')}
              label="First Name"
              error={createForm.formState.errors.firstName?.message}
            />
            <Input
              {...createForm.register('lastName')}
              label="Last Name"
              error={createForm.formState.errors.lastName?.message}
            />
          </div>
          <Input
            {...createForm.register('email')}
            type="email"
            label="Email"
            error={createForm.formState.errors.email?.message}
          />
          <Input
            {...createForm.register('password')}
            type="password"
            label="Password"
            error={createForm.formState.errors.password?.message}
          />
          <Select
            {...createForm.register('role')}
            label="Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
            ]}
            error={createForm.formState.errors.role?.message}
          />
          <div className="flex items-center gap-2">
            <input
              {...createForm.register('isActive')}
              type="checkbox"
              id="isActive"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active account
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCreateModal(false);
                createForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        title="Edit User"
        className="max-w-md"
      >
        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...editForm.register('firstName')}
              label="First Name"
              error={editForm.formState.errors.firstName?.message}
            />
            <Input
              {...editForm.register('lastName')}
              label="Last Name"
              error={editForm.formState.errors.lastName?.message}
            />
          </div>
          <Input
            {...editForm.register('email')}
            type="email"
            label="Email"
            error={editForm.formState.errors.email?.message}
          />
          <Input
            {...editForm.register('password')}
            type="password"
            label="New Password (leave blank to keep current)"
            error={editForm.formState.errors.password?.message}
          />
          <Select
            {...editForm.register('role')}
            label="Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
            ]}
            error={editForm.formState.errors.role?.message}
          />
          <div className="flex items-center gap-2">
            <input
              {...editForm.register('isActive')}
              type="checkbox"
              id="editIsActive"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="editIsActive" className="text-sm text-gray-700">
              Active account
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModal({ isOpen: false, user: null })}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.firstName} ${deleteModal.user?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </Layout>
  );
}
