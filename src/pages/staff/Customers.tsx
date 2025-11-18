import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useCustomersQuery } from "../../hooks/dataHooks";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../components/ToastContext";
import { UserPlus, Edit, Trash2, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_type?: "retail" | "corporate";
  is_preferred: boolean;
  allergies?: string;
  special_notes?: string;
  created_at: string;
  updated_at: string;
  orders?: { count: number }[];
}

export function Customers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [customerForm, setCustomerForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    customer_type: "retail" as "retail" | "corporate",
    is_preferred: false,
    allergies: "",
    special_notes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch customers data
  const { data, isLoading, error, refetch } = useCustomersQuery({
    search: searchQuery || undefined,
  });

  const customers = data?.data || [];

  const resetForm = () => {
    setCustomerForm({
      full_name: "",
      email: "",
      phone: "",
      address: "",
      customer_type: "retail",
      is_preferred: false,
      allergies: "",
      special_notes: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!customerForm.full_name.trim()) {
      errors.full_name = "Full name is required";
    }

    if (!customerForm.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (customerForm.phone && !/^[\d\s()+\-]+$/.test(customerForm.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("customers").insert({
        full_name: customerForm.full_name.trim(),
        email: customerForm.email?.trim(),
        phone: customerForm.phone?.trim() || null,
        address: customerForm.address?.trim() || null,
        customer_type: customerForm.customer_type,
        is_preferred: customerForm.is_preferred,
        allergies: customerForm.allergies?.trim() || null,
        special_notes: customerForm.special_notes?.trim() || null,
      });

      if (error) throw error;

      showToast("success", "Customer added successfully", "Success");
      setIsAddModalOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error adding customer:", error);
      showToast("error", "Failed to add customer", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCustomer = async () => {
    if (!validateForm() || !selectedCustomer) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("customers")
        .update({
          full_name: customerForm.full_name.trim(),
          email: customerForm.email?.trim(),
          phone: customerForm.phone?.trim() || null,
          address: customerForm.address?.trim() || null,
          customer_type: customerForm.customer_type,
          is_preferred: customerForm.is_preferred,
          allergies: customerForm.allergies?.trim() || null,
          special_notes: customerForm.special_notes?.trim() || null,
        })
        .eq("id", selectedCustomer.id);

      if (error) throw error;

      showToast("success", "Customer updated successfully", "Success");
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating customer:", error);
      showToast("error", "Failed to update customer", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.full_name}?`)) return;

    try {
      const { error } = await supabase.from("customers").delete().eq("id", customer.id);
      if (error) throw error;

      showToast("success", "Customer deleted successfully", "Success");
      refetch();
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      showToast("error", "Failed to delete customer", "Error");
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    // Navigate to customer detail page - for now redirect to customer-accounts
    navigate("/customer-accounts", { state: { selectedCustomer: customer } });
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      full_name: customer.full_name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      customer_type: customer.customer_type || "retail",
      is_preferred: customer.is_preferred,
      allergies: customer.allergies || "",
      special_notes: customer.special_notes || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleExport = async (type: "email" | "phone") => {
    const list = customers
      .filter(customer => type === "email" ? customer.email : customer.phone)
      .map(customer => type === "email" ? customer.email! : customer.phone!)
      .join("\n");

    if (!list) {
      showToast("error", `No ${type} addresses found`, "Export Error");
      return;
    }

    const blob = new Blob([list], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_list.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("success", `${type} list exported successfully`, "Export Complete");
  };

  const getTotalOrders = (customer: Customer) => {
    return customer.orders?.[0]?.count || 0;
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading customers: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport("email")}>
                <Download className="w-4 h-4 mr-2" />
                Export Emails
              </Button>
              <Button variant="outline" onClick={() => handleExport("phone")}>
                <Download className="w-4 h-4 mr-2" />
                Export Phones
              </Button>
              <Button onClick={() => { resetForm(); setIsAddModalOpen(true); }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Preferred</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <TableCell className="font-medium">{customer.full_name}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={customer.customer_type === "corporate" ? "default" : "secondary"}>
                        {customer.customer_type || "retail"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.is_preferred ? "default" : "outline"}>
                        {customer.is_preferred ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTotalOrders(customer)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Customer Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedCustomer(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAddModalOpen ? "Add New Customer" : "Edit Customer"}
            </DialogTitle>
            <DialogDescription>
              {isAddModalOpen
                ? "Enter customer information below"
                : "Update customer information below"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={customerForm.full_name}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, full_name: e.target.value }))}
                className={formErrors.full_name ? "border-red-500" : ""}
              />
              {formErrors.full_name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div>
              <Label>Type</Label>
              <RadioGroup
                value={customerForm.customer_type}
                onValueChange={(value: "retail" | "corporate") =>
                  setCustomerForm(prev => ({ ...prev, customer_type: value }))
                }
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retail" id="retail" />
                  <Label htmlFor="retail">Retail</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporate" id="corporate" />
                  <Label htmlFor="corporate">Corporate</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="preferred"
                checked={customerForm.is_preferred}
                onCheckedChange={(checked) =>
                  setCustomerForm(prev => ({ ...prev, is_preferred: !!checked }))
                }
              />
              <Label htmlFor="preferred">Preferred Customer</Label>
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={customerForm.allergies}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, allergies: e.target.value }))}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="special_notes">Special Notes</Label>
              <Textarea
                id="special_notes"
                value={customerForm.special_notes}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, special_notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedCustomer(null);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={isAddModalOpen ? handleAddCustomer : handleEditCustomer}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting
                ? "Saving..."
                : isAddModalOpen
                ? "Add Customer"
                : "Update Customer"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
