import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../../lib/supabaseClient'
import { useOrderWizard } from '../../../stores/orderWizardStore'
import { Card } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Search } from 'lucide-react'
import { useDebounce } from '../../../hooks/useDebounce'
import { addDays, addHours, isBefore, parseISO, formatISO, format } from 'date-fns'
import { RadioGroup } from '../../../components/ui/radio-group'

// Minimal schemas for step validation
const customerSchema = z.object({
  customerId: z.string().optional(),
  full_name: z.string().min(2, 'Provide a name').optional(),
  email: z.string().email('Enter a valid email').optional(),
  phone: z.string().optional(),
})

const productSchema = z.object({
  productId: z.string().min(1, 'Select a product'),
})

export default function WizardContainer({ onBack, onNavigate }: { onBack?: () => void; onNavigate?: (p: string) => void }) {
  const { currentStep, data, setWizardData, nextStep, prevStep, goToStep, resetWizard } = useOrderWizard()
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [totalCents, setTotalCents] = useState<number | null>(null)
  const [depositRequiredCents, setDepositRequiredCents] = useState<number | null>(null)
  const [preferredDiscountPercent] = useState(10)
  const [managerOverrideRequested, setManagerOverrideRequested] = useState(false)

  // Customer form
  const customerForm = useForm({ resolver: zodResolver(customerSchema), defaultValues: { customerId: (data as any).customerId || '', full_name: '', email: '', phone: '' } })

  // Product form
  const productForm = useForm({ resolver: zodResolver(productSchema), defaultValues: { productId: (data as any).productId || '' } })

  const customizeForm = useForm({ defaultValues: { size: (data as any).size || '8-inch', flavor: (data as any).flavor || '', decorations: (data as any).decorations || '' } })

  const pricingForm = useForm({ defaultValues: { applyPreferredDiscount: true, paymentMethod: 'cash' } })

  const scheduleForm = useForm({ defaultValues: { pickupDate: (data as any).pickupDate || '', pickupTime: (data as any).pickupTime || '' } })

  // Debounced search for customers using local hook
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let mounted = true
    if (!debouncedQuery) {
      setCustomers([])
      return
    }
    (async () => {
      try {
        setLoadingCustomers(true)
        const res = await supabase.from('customers').select('*').ilike('full_name', `%${debouncedQuery}%`).limit(50)
        if (!mounted) return
        setCustomers((res as any).data || [])
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingCustomers(false)
      }
    })()
    return () => { mounted = false }
  }, [debouncedQuery])

  useEffect(() => {
    // initial load products
    let mounted = true
    setLoadingProducts(true)
    supabase.from('products').select('*').order('name').then(res => {
      if (!mounted) return
      setProducts(res.data || [])
      setLoadingProducts(false)
    })
    return () => { mounted = false }
  }, [])

  const selectCustomer = (c: any) => {
    setWizardData({ customerId: c.id })
    customerForm.reset({ customerId: c.id, full_name: c.full_name, email: c.email, phone: c.phone })
  }

  const createCustomer = async (vals: any) => {
    // Inline creation
    const payload = { full_name: vals.full_name, email: vals.email, phone: vals.phone, customer_type: 'retail', is_preferred: false }
    const { data: created, error } = await supabase.from('customers').insert(payload).select().single()
    if (error) {
      alert('Failed to create customer')
      return
    }
    selectCustomer(created)
  }

  const handleCustomerNext = async () => {
    const values = customerForm.getValues()
    // if a customer selected in store, proceed
    if ((data as any).customerId) {
      nextStep()
      return
    }
    // otherwise try to create
    const result = customerForm.getValues()
    if (!result.full_name) {
      customerForm.setError('full_name', { message: 'Name required' })
      return
    }
    await createCustomer(result)
    nextStep()
  }

  const handleProductSelect = (p: any) => {
    setWizardData({ productId: p.id })
    productForm.reset({ productId: p.id })
  }

  const handleProductNext = () => {
    const vals = productForm.getValues()
    if (!vals.productId) {
      productForm.setError('productId', { message: 'Select a product' })
      return
    }
    // enforce one-cake-per-order: ensure only single product selected (we do)
    setWizardData({ productId: vals.productId })
    // compute base totals if possible
    const product = products.find(p => p.id === vals.productId)
    if (product) {
      const base = Number(product.base_price || product.price_cents || 0)
      setTotalCents(base)
      const deposit = Math.round(base * 0.5)
      setDepositRequiredCents(deposit)
    }
    nextStep()
  }

  // Customize step handler
  const handleCustomizeNext = () => {
    const vals = customizeForm.getValues()
    setWizardData(prev => ({
      customization: { ...prev.customization, size: vals.size, flavor: vals.flavor, decorations: vals.decorations }
    }))
    // adjust price modestly based on size or decorations
    const product = products.find(p => p.id === (data as any).productId)
    let base = totalCents || Number(product?.base_price || product?.price_cents || 0)
    if (vals.size === '10-inch') base = Math.round(base * 1.25)
    if (vals.decorations) base += 2500 // $25 for extra decorations
    setTotalCents(base)
    setDepositRequiredCents(Math.round(base * 0.5))
    nextStep()
  }

  // Pricing step: confirm deposit and payment method
  const handlePricingNext = () => {
    const vals = pricingForm.getValues()
    // Apply preferred discount if customer is preferred
    const isPreferred = !!(data as any).is_preferred
    let final = totalCents || 0
    if (isPreferred && vals.applyPreferredDiscount) {
      final = Math.round(final * (1 - preferredDiscountPercent / 100))
    }
    setWizardData(prev => ({
      pricing: {
        basePrice: final,
        sizeUpcharge: 0,
        tierUpcharge: 0,
        decorationCost: 0,
        discount: isPreferred ? preferredDiscountPercent : 0,
        subtotal: final,
        depositAmount: Math.round(final * 0.5),
        balanceDue: Math.round(final * 0.5),
        total: final
      }
    }))
    setDepositRequiredCents(Math.round(final * 0.5))
    nextStep()
  }

  // Scheduling validation: enforce 2-day minimum and 4-hour buffer
  const handleScheduleNext = () => {
    const vals = scheduleForm.getValues()
    if (!vals.pickupDate || !vals.pickupTime) {
      scheduleForm.setError('pickupDate', { message: 'Choose pickup date and time' })
      return
    }
    const iso = `${vals.pickupDate}T${vals.pickupTime}:00`
    const target = parseISO(iso)
    const now = new Date()
    const minDate = addDays(now, 2)
    const minBuffer = addHours(now, 4)
    if (isBefore(target, minDate) && !managerOverrideRequested) {
      // require manager override (or deny)
      alert('Pickup must be at least 2 days from now unless manager override is requested.')
      return
    }
    if (isBefore(target, minBuffer)) {
      alert('Pickup time must be at least 4 hours from now.')
      return
    }
    setWizardData(prev => ({
      schedule: { pickupDate: parseISO(iso), pickupTime: vals.pickupTime, isRush: managerOverrideRequested }
    }))
    nextStep()
  }

  // Final submit: create order + deposit payment record
  const handleSubmitOrder = async () => {
    const payload: any = {
      customer_id: (data as any).customerId,
      product_id: (data as any).productId,
      customizations: { size: (data as any).size, flavor: (data as any).flavor, decorations: (data as any).decorations },
      total_cents: (data as any).price_cents || totalCents || 0,
      deposit_required_cents: depositRequiredCents || 0,
      scheduled_at: formatISO(parseISO(`${(data as any).pickupDate}T${(data as any).pickupTime}:00`)),
      status: 'pending_deposit',
    }
    const { data: created, error } = await supabase.from('orders').insert(payload).select().single()
    if (error) {
      alert('Failed to create order: ' + error.message)
      return
    }
    // create deposit payment record if schema supports it
    try {
      await supabase.from('payments').insert({ order_id: created.id, amount_cents: payload.deposit_required_cents, type: 'deposit', status: 'pending' })
    } catch (e) {
      // ignore if payments table absent
    }
    // Reset wizard and navigate to orders page
    resetWizard()
    if (onNavigate) onNavigate('/staff/orders')
    else alert('Order created — awaiting deposit/payment')
  }

  return (
    <div style={{ minHeight: '80vh', padding: 20, background: '#F8EBD7' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <aside>
            <Card style={{ padding: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>Create Order</h3>
              <p style={{ fontSize: 12, color: '#5A3825' }}>Step {currentStep} of 6</p>
              <div style={{ marginTop: 12 }}>
                {[1,2,3,4,5,6].map(s => (
                  <div key={s} style={{ padding: '8px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: currentStep===s? '#fff':'' }} onClick={() => goToStep(s)}>
                    <div>Step {s}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{s===currentStep ? 'current' : ''}</div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          <main>
            <Card style={{ padding: 20 }}>
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold">Customer</h2>
                  <p className="text-sm text-muted-foreground">Select or create a customer</p>

                  <div style={{ marginTop: 12 }}>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search customers..." value={query} onChange={(e: any) => setQuery(e.target.value)} className="pl-10" />
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <ScrollArea style={{ maxHeight: 320 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {loadingCustomers ? <div>Loading…</div> : (
                              customers.map(c => (
                                <div key={c.id} onClick={() => selectCustomer(c)} style={{ padding: 10, border: (data as any).customerId===c.id ? '2px solid #C44569' : '1px solid #EEE', borderRadius: 8, cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                      <div style={{ fontWeight: 600 }}>{c.full_name}</div>
                                      <div style={{ fontSize: 12, color: '#666' }}>{c.email} • {c.phone}</div>
                                    </div>
                                    <div>
                                      {c.is_preferred && <Badge>Preferred</Badge>}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      <div style={{ width: 320 }}>
                        <form onSubmit={customerForm.handleSubmit(createCustomer)}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Input placeholder="Full name" {...customerForm.register('full_name')} />
                            <Input placeholder="Email" {...customerForm.register('email')} />
                            <Input placeholder="Phone" {...customerForm.register('phone')} />
                            <Button type="submit">Create Customer</Button>
                          </div>
                        </form>
                      </div>
                    </div>

                  </div>

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button variant="outline" onClick={() => { if (onBack) onBack() }}>Cancel</Button>
                    <Button onClick={handleCustomerNext}>Continue to Product</Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold">Product</h2>
                  <p className="text-sm text-muted-foreground">Choose base product</p>

                  <div style={{ marginTop: 12 }}>
                    {loadingProducts ? <div>Loading products…</div> : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12 }}>
                        {products.map(p => (
                          <div key={p.id} onClick={() => handleProductSelect(p)} style={{ border: (data as any).productId===p.id ? '2px solid #C44569' : '1px solid #EEE', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
                            <img src={p.image_url || '/placeholder-cake.jpg'} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                            <div style={{ padding: 10 }}>
                              <div style={{ fontWeight: 600 }}>{p.name}</div>
                              <div style={{ color: '#666', fontSize: 13 }}>{p.description}</div>
                              <div style={{ marginTop: 8, fontWeight: 700, color: '#C44569' }}>${(p.base_price/100).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button variant="outline" onClick={() => prevStep()}>Back</Button>
                    <Button onClick={handleProductNext}>Continue to Customize</Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold">Customize</h2>
                  <p className="text-sm text-muted-foreground">Choose size, flavor, and any decorations.</p>
                  <form onSubmit={(e) => { e.preventDefault(); handleCustomizeNext() }}>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label className="block text-sm font-medium">Size</label>
                        <select {...customizeForm.register('size')} aria-label="Cake size" className="mt-2">
                          <option value="8-inch">8-inch (default)</option>
                          <option value="10-inch">10-inch (+25%)</option>
                        </select>

                        <label className="block text-sm font-medium mt-4">Flavor</label>
                        <Input {...customizeForm.register('flavor')} placeholder="e.g., vanilla, chocolate" />

                        <label className="block text-sm font-medium mt-4">Decorations</label>
                        <Input {...customizeForm.register('decorations')} placeholder="Describe decorations or upload later" />
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <Button variant="outline" onClick={() => prevStep()}>Back</Button>
                      <Button type="submit">Continue to Pricing</Button>
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold">Pricing & Deposit</h2>
                  <p className="text-sm text-muted-foreground">Review price and required deposit.</p>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 14 }}>Base price: {totalCents ? `$${(totalCents/100).toFixed(2)}` : '—'}</div>
                    <div style={{ fontSize: 14 }}>Preferred discount: {((pricingForm.getValues().applyPreferredDiscount && (data as any).is_preferred) ? `${preferredDiscountPercent}%` : '0%')}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>Total: {((data as any).price_cents || totalCents) ? `$${(((data as any).price_cents || totalCents)/100).toFixed(2)}` : '—'}</div>
                    <div style={{ fontSize: 14, marginTop: 6 }}>Deposit required (50%): {depositRequiredCents ? `$${(depositRequiredCents/100).toFixed(2)}` : '—'}</div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label className="flex items-center gap-2"><input type="checkbox" {...pricingForm.register('applyPreferredDiscount')} /> Apply preferred customer discount (if eligible)</label>
                    <div style={{ marginTop: 8 }}>
                      <label className="block text-sm">Payment method</label>
                      <select {...pricingForm.register('paymentMethod')} className="mt-2">
                        <option value="cash">Cash</option>
                        <option value="card">Card (in-person)</option>
                        <option value="online">Online (third-party)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button variant="outline" onClick={() => prevStep()}>Back</Button>
                    <Button onClick={handlePricingNext}>Continue to Schedule</Button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold">Schedule Pickup</h2>
                  <p className="text-sm text-muted-foreground">Choose pickup date and time. 2-day minimum, 4-hour buffer enforced.</p>
                  <form onSubmit={(e) => { e.preventDefault(); handleScheduleNext() }}>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <div>
                        <label className="block text-sm">Pickup date</label>
                        <Input type="date" {...scheduleForm.register('pickupDate')} />
                      </div>
                      <div>
                        <label className="block text-sm">Pickup time</label>
                        <Input type="time" {...scheduleForm.register('pickupTime')} />
                      </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={managerOverrideRequested} onChange={(e) => setManagerOverrideRequested(e.target.checked)} /> Request manager override for sooner pickup</label>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <Button variant="outline" onClick={() => prevStep()}>Back</Button>
                      <Button type="submit">Continue to Review</Button>
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  <h2 className="text-xl font-semibold">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground">Confirm details and create the order. A 50% deposit is required to move to production.</p>
                  <div style={{ marginTop: 12 }}>
                    <div><strong>Customer:</strong> {(data as any).customerId || '—'}</div>
                    <div><strong>Product:</strong> {(data as any).productId || '—'}</div>
                    <div><strong>Customizations:</strong> {JSON.stringify((data as any).customizations || { size: (data as any).size, flavor: (data as any).flavor, decorations: (data as any).decorations })}</div>
                    <div><strong>Pickup:</strong> {(data as any).pickupDate} {(data as any).pickupTime}</div>
                    <div style={{ marginTop: 8, fontWeight: 700 }}>Deposit to pay now: {depositRequiredCents ? `$${(depositRequiredCents/100).toFixed(2)}` : '—'}</div>
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button variant="outline" onClick={() => prevStep()}>Back</Button>
                    <Button onClick={handleSubmitOrder}>Create Order</Button>
                  </div>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
