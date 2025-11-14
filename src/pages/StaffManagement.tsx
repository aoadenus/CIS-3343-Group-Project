import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, UserPlus, Edit, ShieldCheck, ShieldOff, AlertCircle, X, Loader2, ArrowUpDown } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function StaffManagement() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [userRole, setUserRole] = useState<string>('sales');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    role: 'sales',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || 'sales');
      } catch {
        setUserRole('sales');
      }
    }
    fetchEmployees();
  }, []);

  const isAdmin = userRole === 'manager' || userRole === 'owner';

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        showToast('error', 'You do not have permission to view staff. Please contact an administrator.', 'Access Denied');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
        setFilteredEmployees(data);
      } else {
        showToast('error', 'Failed to load staff. Please try again.', 'Error');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showToast('error', 'Failed to load staff. Please try again.', 'Connection Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      applyFiltersAndSort(employees);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/employees/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          applyFiltersAndSort(data);
        } else if (response.status === 401 || response.status === 403) {
          showToast('error', 'Access denied', 'Error');
        }
      } catch (error) {
        console.error('Error searching employees:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    applyFiltersAndSort(employees);
  }, [roleFilter, statusFilter, sortBy, sortOrder, employees]);

  const applyFiltersAndSort = (data: Employee[]) => {
    let filtered = [...data];

    if (roleFilter !== 'all') {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter(emp => emp.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(emp => !emp.isActive);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'role') {
        comparison = a.role.localeCompare(b.role);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredEmployees(filtered);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      owner: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      manager: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      sales: '#3B82F6',
      baker: '#92400E',
      decorator: '#9333EA',
      accountant: '#10B981'
    };
    return colors[role as keyof typeof colors] || '#6B7280';
  };

  const validateForm = (isEdit: boolean = false) => {
    const errors = { name: '', email: '', role: '', password: '' };
    let isValid = true;

    if (!employeeForm.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!employeeForm.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeForm.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!isEdit && !employeeForm.password) {
      errors.password = 'Password is required for new staff';
      isValid = false;
    } else if (employeeForm.password && employeeForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!employeeForm.role) {
      errors.role = 'Role is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeForm)
      });

      if (response.status === 401 || response.status === 403) {
        showToast('error', 'You do not have permission to add staff members', 'Access Denied');
        setIsAddModalOpen(false);
        return;
      }

      if (response.ok) {
        const created = await response.json();
        setEmployees(prev => [created, ...prev]);
        setIsAddModalOpen(false);
        setEmployeeForm({ name: '', email: '', role: 'sales', password: '' });
        setFormErrors({ name: '', email: '', role: '', password: '' });
        showToast('success', `${created.name} has been added to the team`, 'Staff Member Added');
      } else {
        const error = await response.json();
        if (error.error?.includes('already exists')) {
          setFormErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          showToast('error', error.error || 'Failed to create staff member', 'Error');
        }
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      showToast('error', 'An unexpected error occurred. Please try again.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEmployee || !validateForm(true)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const updateData: any = {
        name: employeeForm.name,
        email: employeeForm.email,
        role: employeeForm.role
      };

      if (employeeForm.password) {
        updateData.password = employeeForm.password;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.status === 401 || response.status === 403) {
        showToast('error', 'You do not have permission to update staff members', 'Access Denied');
        setIsEditModalOpen(false);
        return;
      }

      if (response.ok) {
        const updated = await response.json();
        setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
        setIsEditModalOpen(false);
        setEditingEmployee(null);
        setEmployeeForm({ name: '', email: '', role: 'sales', password: '' });
        setFormErrors({ name: '', email: '', role: '', password: '' });
        showToast('success', `${updated.name}'s information has been updated`, 'Staff Updated');
      } else {
        const error = await response.json();
        if (error.error?.includes('already')) {
          setFormErrors(prev => ({ ...prev, email: 'This email is already in use' }));
        } else {
          showToast('error', error.error || 'Failed to update staff member', 'Error');
        }
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      showToast('error', 'An unexpected error occurred. Please try again.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (employee: Employee) => {
    const action = employee.isActive ? 'deactivate' : 'activate';
    
    if (!confirm(`Are you sure you want to ${action} ${employee.name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/employees/${employee.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        showToast('error', 'You do not have permission to change staff status', 'Access Denied');
        return;
      }

      if (response.ok) {
        const updated = await response.json();
        setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
        showToast('success', `${updated.name} has been ${updated.isActive ? 'activated' : 'deactivated'}`, 'Status Updated');
      } else {
        showToast('error', 'Failed to update status', 'Error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('error', 'An unexpected error occurred', 'Error');
    }
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      password: ''
    });
    setFormErrors({ name: '', email: '', role: '', password: '' });
    setIsEditModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEmployeeForm({ name: '', email: '', role: 'sales', password: '' });
    setFormErrors({ name: '', email: '', role: '', password: '' });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
    setEmployeeForm({ name: '', email: '', role: 'sales', password: '' });
    setFormErrors({ name: '', email: '', role: '', password: '' });
  };

  const toggleSort = (field: 'name' | 'role' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#F7EAD9' }}>
        <Card className="p-8 max-w-md" style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <AlertCircle size={32} color="#F59E0B" />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: '#3C2B2F', marginBottom: '12px' }}>
              Access Restricted
            </h2>
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
              Staff Management is only available to Manager and Owner roles.
            </p>
            <Badge style={{ background: '#3B82F615', color: '#3B82F6', border: '1px solid #3B82F630', padding: '6px 12px' }}>
              Your Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 style={{ 
            fontFamily: 'Playfair Display', 
            fontWeight: 700, 
            fontSize: 'clamp(28px, 5vw, 36px)',
            color: '#C44569',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            Staff Management
          </h1>
          <p style={{ 
            fontFamily: 'Lucida Handwriting', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            color: '#C44569', 
            opacity: 0.85,
            marginTop: '8px',
            letterSpacing: '0.01em'
          }}>
            Manage your team
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="text-white w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200" 
          style={{ 
            borderRadius: '10px', 
            fontFamily: 'Poppins', 
            fontWeight: 600, 
            background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
            boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)',
            height: '48px',
            minWidth: '48px',
            paddingLeft: '24px',
            paddingRight: '24px'
          }}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Staff Member
        </Button>
      </motion.div>

      <Card className="p-4 sm:p-6" style={{ background: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search staff by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="baker">Baker</SelectItem>
              <SelectItem value="decorator">Decorator</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: '#C44569' }} />
              <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#6B7280' }}>Loading staff...</p>
            </div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#6B7280', fontSize: '16px' }}>
              {searchQuery ? 'No staff found matching your search' : 'No staff members yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button 
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}
                    >
                      Name
                      {sortBy === 'name' && <ArrowUpDown className="w-4 h-4" />}
                    </button>
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                    Email
                  </TableHead>
                  <TableHead>
                    <button 
                      onClick={() => toggleSort('role')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}
                    >
                      Role
                      {sortBy === 'role' && <ArrowUpDown className="w-4 h-4" />}
                    </button>
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                    Status
                  </TableHead>
                  <TableHead>
                    <button 
                      onClick={() => toggleSort('createdAt')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}
                    >
                      Joined
                      {sortBy === 'createdAt' && <ArrowUpDown className="w-4 h-4" />}
                    </button>
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: '#3C2B2F' }}>
                        {employee.name}
                      </TableCell>
                      <TableCell style={{ fontFamily: 'Open Sans, sans-serif', color: '#6B7280' }}>
                        {employee.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          style={{ 
                            background: getRoleBadgeColor(employee.role),
                            color: 'white',
                            border: 'none',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 600,
                            fontSize: '12px',
                            padding: '4px 12px'
                          }}
                        >
                          {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={employee.isActive ? 'default' : 'secondary'}
                          style={{ 
                            background: employee.isActive ? '#10B98115' : '#6B728015',
                            color: employee.isActive ? '#10B981' : '#6B7280',
                            border: employee.isActive ? '1px solid #10B98130' : '1px solid #6B728030',
                            fontFamily: 'Open Sans, sans-serif',
                            fontWeight: 600,
                            fontSize: '12px',
                            padding: '4px 12px'
                          }}
                        >
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ fontFamily: 'Open Sans, sans-serif', color: '#6B7280', fontSize: '14px' }}>
                        {formatDate(employee.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(employee)}
                            style={{ fontFamily: 'Open Sans, sans-serif' }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(employee)}
                            style={{ 
                              fontFamily: 'Open Sans, sans-serif',
                              color: employee.isActive ? '#DC2626' : '#10B981',
                              borderColor: employee.isActive ? '#DC262630' : '#10B98130'
                            }}
                          >
                            {employee.isActive ? (
                              <>
                                <ShieldOff className="w-4 h-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#6B7280' }}>
            Showing <span style={{ fontWeight: 600, color: '#3C2B2F' }}>{filteredEmployees.length}</span> of{' '}
            <span style={{ fontWeight: 600, color: '#3C2B2F' }}>{employees.length}</span> staff members
          </p>
        </div>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: '#3C2B2F' }}>
              Add New Staff Member
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEmployee}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  placeholder="John Doe"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  placeholder="john.doe@emilybakes.com"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="role" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select value={employeeForm.role} onValueChange={(value) => setEmployeeForm({ ...employeeForm, role: value })}>
                  <SelectTrigger style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="baker">Baker</SelectItem>
                    <SelectItem value="decorator">Decorator</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    {userRole === 'owner' && <SelectItem value="owner">Owner</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={formErrors.password ? 'border-red-500' : ''}
                />
                {formErrors.password && (
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                    {formErrors.password}
                  </p>
                )}
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Must be at least 8 characters long
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeAddModal}
                disabled={isSubmitting}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                  color: 'white'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Staff Member'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: '#3C2B2F' }}>
              Edit Staff Member
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditEmployee}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  placeholder="John Doe"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-email" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  placeholder="john.doe@emilybakes.com"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-role" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select value={employeeForm.role} onValueChange={(value) => setEmployeeForm({ ...employeeForm, role: value })}>
                  <SelectTrigger style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="baker">Baker</SelectItem>
                    <SelectItem value="decorator">Decorator</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    {userRole === 'owner' && <SelectItem value="owner">Owner</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-password" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#3C2B2F' }}>
                  New Password (optional)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={formErrors.password ? 'border-red-500' : ''}
                />
                {formErrors.password && (
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                    {formErrors.password}
                  </p>
                )}
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Leave blank to keep existing password
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeEditModal}
                disabled={isSubmitting}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                  color: 'white'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Staff Member'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
