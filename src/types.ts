export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'supplements' | 'devices' | 'checkup' | 'tcm' | 'firstaid' | 'chronic';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  tagType?: 'bluecap' | 'medical' | 'tcm' | 'hospital';
  image: string;
  sales: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  specs: string[];
  approvalNo?: string;
  manufacturer: string;
  functionDesc: string;
  usageMethod: string;
  contraindications?: string;
  benefits: string[];
  isFlashDeal?: boolean;
  flashSoldPercent?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  shortDesc: string;
  subcategories: { id: string; name: string }[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSpec: string;
  quantity: number;
  selected: boolean;
}

export interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNo: string;
  items: {
    product: Product;
    spec: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  actualAmount: number;
  paymentMethod: 'wechat' | 'alipay' | 'medical_insurance';
  status: 'unpaid' | 'shipping' | 'delivering' | 'completed' | 'refunded';
  createdAt: string;
  address: ShippingAddress;
  trackingNo?: string;
}

export interface HealthRecord {
  name: string;
  gender: '男' | '女';
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  bloodPressure: { systolic: number; diastolic: number; status: '正常' | '轻度偏高' | '理想' };
  bloodSugar: { value: number; status: '正常' | '偏高' };
}

export interface Coupon {
  id: string;
  title: string;
  amount: number;
  minSpend: number;
  validUntil: string;
  description: string;
  isUsed?: boolean;
}

export interface PharmacistMessage {
  id: string;
  sender: 'user' | 'pharmacist';
  content: string;
  time: string;
  suggestedProductIds?: string[];
}
