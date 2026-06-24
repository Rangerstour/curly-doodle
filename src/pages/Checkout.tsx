import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, MapPin, Check, AlertCircle, Tag, ChevronRight, Package } from 'lucide-react';

interface AddressForm {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

const initialAddress: AddressForm = {
  first_name: '',
  last_name: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US',
  phone: '',
};

export default function Checkout() {
  const items = useStore((state) => state.items);
  const getSubtotal = useStore((state) => state.getSubtotal);
  const getTax = useStore((state) => state.getTax);
  const getShipping = useStore((state) => state.getShipping);
  const getTotal = useStore((state) => state.getTotal);
  const clearCart = useStore((state) => state.clearCart);
  const user = useStore((state) => state.user);
  const couponCode = useStore((state) => state.couponCode);
  const discount = useStore((state) => state.discount);
  const setCoupon = useStore((state) => state.setCoupon);
  const resetCheckout = useStore((state) => state.resetCheckout);

  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<AddressForm>(initialAddress);
  const [billingAddress, setBillingAddress] = useState<AddressForm>(initialAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    const addr = shippingAddress;
    if (!addr.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!addr.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!addr.address_line1.trim()) newErrors.address_line1 = 'Address is required';
    if (!addr.city.trim()) newErrors.city = 'City is required';
    if (!addr.state.trim()) newErrors.state = 'State is required';
    if (!addr.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
    if (!addr.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBilling = () => {
    if (sameAsShipping) return true;
    const newErrors: Record<string, string> = {};
    const addr = billingAddress;
    if (!addr.first_name.trim()) newErrors.billing_first_name = 'First name is required';
    if (!addr.last_name.trim()) newErrors.billing_last_name = 'Last name is required';
    if (!addr.address_line1.trim()) newErrors.billing_address_line1 = 'Address is required';
    if (!addr.city.trim()) newErrors.billing_city = 'City is required';
    if (!addr.state.trim()) newErrors.billing_state = 'State is required';
    if (!addr.postal_code.trim()) newErrors.billing_postal_code = 'Postal code is required';
    if (!addr.phone.trim()) newErrors.billing_phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === 'credit-card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) newErrors.card_number = 'Valid card number required';
      if (!cardExpiry.trim() || !cardExpiry.match(/^\d{2}\/\d{2}$/)) newErrors.card_expiry = 'Valid MM/YY required';
      if (!cardCvc.trim() || cardCvc.length < 3) newErrors.card_cvc = 'Valid CVC required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'shipping' && validateShipping()) {
      setStep('payment');
    } else if (step === 'payment' && validateBilling() && validatePayment()) {
      setStep('review');
    }
  };

  const handleBack = () => {
    if (step === 'payment') setStep('shipping');
    else if (step === 'review') setStep('payment');
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();
    if (!data) {
      setCouponError('Invalid coupon code.');
      setCouponLoading(false);
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponError('Coupon has expired.');
      setCouponLoading(false);
      return;
    }
    if (data.max_uses && data.uses_count >= data.max_uses) {
      setCouponError('Coupon usage limit reached.');
      setCouponLoading(false);
      return;
    }
    if (subtotal < (data.min_order_value || 0)) {
      setCouponError(`Minimum order of $${data.min_order_value} required.`);
      setCouponLoading(false);
      return;
    }
    const discountAmount = data.discount_type === 'percentage' ? subtotal * (data.discount_value / 100) : data.discount_value;
    setCoupon(couponInput.trim().toUpperCase(), Math.min(discountAmount, subtotal));
    setCouponLoading(false);
    setCouponInput('');
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const finalShipping = sameAsShipping ? shippingAddress : billingAddress;
      const finalBilling = sameAsShipping ? shippingAddress : billingAddress;
      const { data: orderData, error } = await supabase.from('orders').insert({
        user_id: user?.id || null,
        status: 'pending',
        payment_status: 'paid',
        payment_method: paymentMethod,
        shipping_address: finalShipping,
        billing_address: finalBilling,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        coupon_code: couponCode || null,
      }).select('id').single();
      if (error) throw error;
      const orderId = orderData.id;
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      }));
      await supabase.from('order_items').insert(orderItems);
      clearCart();
      resetCheckout();
      navigate('/order-success', { state: { orderId } });
    } catch (err) {
      setProcessing(false);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2)}`;
    return v;
  };

  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            value={shippingAddress.first_name}
            onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            value={shippingAddress.last_name}
            onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 1</label>
        <input
          type="text"
          value={shippingAddress.address_line1}
          onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Street address"
        />
        {errors.address_line1 && <p className="text-xs text-red-600 mt-1">{errors.address_line1}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 2 (Optional)</label>
        <input
          type="text"
          value={shippingAddress.address_line2}
          onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Apt, Suite, etc."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
          <input
            type="text"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
          <input
            type="text"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
          <input
            type="text"
            value={shippingAddress.postal_code}
            onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postal_code && <p className="text-xs text-red-600 mt-1">{errors.postal_code}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
          <input
            type="tel"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 pt-4">
        <input
          type="checkbox"
          id="same-address"
          checked={sameAsShipping}
          onChange={(e) => setSameAsShipping(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="same-address" className="text-sm text-gray-700 dark:text-gray-300">
          Billing address is same as shipping
        </label>
      </div>
      {!sameAsShipping && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-white">Billing Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                value={billingAddress.first_name}
                onChange={(e) => setBillingAddress({ ...billingAddress, first_name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.billing_first_name && <p className="text-xs text-red-600 mt-1">{errors.billing_first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                value={billingAddress.last_name}
                onChange={(e) => setBillingAddress({ ...billingAddress, last_name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.billing_last_name && <p className="text-xs text-red-600 mt-1">{errors.billing_last_name}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input
              type="text"
              value={billingAddress.address_line1}
              onChange={(e) => setBillingAddress({ ...billingAddress, address_line1: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.billing_address_line1 && <p className="text-xs text-red-600 mt-1">{errors.billing_address_line1}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input
                type="text"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.billing_city && <p className="text-xs text-red-600 mt-1">{errors.billing_city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
              <input
                type="text"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.billing_state && <p className="text-xs text-red-600 mt-1">{errors.billing_state}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
              <input
                type="text"
                value={billingAddress.postal_code}
                onChange={(e) => setBillingAddress({ ...billingAddress, postal_code: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.billing_postal_code && <p className="text-xs text-red-600 mt-1">{errors.billing_postal_code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={billingAddress.phone}
                onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.billing_phone && <p className="text-xs text-red-600 mt-1">{errors.billing_phone}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Method</h2>
      </div>
      <div className="space-y-3">
        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'credit-card' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800'}`}>
          <input type="radio" name="payment" value="credit-card" checked={paymentMethod === 'credit-card'} onChange={() => setPaymentMethod('credit-card')} className="w-4 h-4 text-blue-600" />
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Credit / Debit Card</p>
              <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
            </div>
          </div>
        </label>
        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800'}`}>
          <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="w-4 h-4 text-blue-600" />
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">PP</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">PayPal</p>
              <p className="text-sm text-gray-500">Pay with your PayPal account</p>
            </div>
          </div>
        </label>
        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800'}`}>
          <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-4 h-4 text-blue-600" />
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when you receive</p>
            </div>
          </div>
        </label>
      </div>

      {paymentMethod === 'credit-card' && (
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={19}
            />
            {errors.card_number && <p className="text-xs text-red-600 mt-1">{errors.card_number}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={5}
              />
              {errors.card_expiry && <p className="text-xs text-red-600 mt-1">{errors.card_expiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
              <input
                type="text"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                placeholder="123"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
              />
              {errors.card_cvc && <p className="text-xs text-red-600 mt-1">{errors.card_cvc}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Your Order</h2>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Items</h3>
        {items.map((item) => (
          <div key={item.product_id} className="flex items-center gap-3">
            <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {shippingAddress.first_name} {shippingAddress.last_name}<br />
          {shippingAddress.address_line1}<br />
          {shippingAddress.address_line2 && <>{shippingAddress.address_line2}<br /></>}
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment Method</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {paymentMethod === 'credit-card' ? 'Credit / Debit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
        </p>
      </div>
    </div>
  );

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Package },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Checkout</h1>
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = steps.findIndex((st) => st.id === step) > i;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{s.label}</span>
                    {isCompleted && <Check className="w-4 h-4" />}
                  </div>
                  {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              {step === 'shipping' && renderShippingStep()}
              {step === 'payment' && renderPaymentStep()}
              {step === 'review' && renderReviewStep()}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                {step !== 'shipping' ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                  </Link>
                )}
                {step !== 'review' ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25 disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : <>Place Order <Check className="w-4 h-4" /></>}
                  </button>
                )}
              </div>
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.submit}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <img src={item.product.image_url} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount ({couponCode})</span>
                    <span className="text-green-600 font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>
              {/* Coupon */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Coupon Code</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                {discount > 0 && <p className="text-xs text-green-600 mt-1">Coupon applied successfully!</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
