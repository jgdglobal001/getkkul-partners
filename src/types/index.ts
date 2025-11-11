// 파트너 정보
export interface Partner {
  id: string;
  email: string;
  name: string;
  companyName: string;
  businessNumber: string;
  phone: string;
  address: string;
  role: 'partner' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

// 상품 정보 (겟꿀 메인에서 가져옴)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

// 파트너 상품 (파트너가 판매하는 상품)
export interface PartnerProduct {
  id: string;
  partnerId: string;
  productId: string;
  product?: Product;
  commission: number; // 커미션 비율 (%)
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// 주문 정보
export interface Order {
  id: string;
  orderId: string; // 겟꿀 메인의 주문 ID
  partnerId: string;
  productId: string;
  quantity: number;
  price: number;
  commission: number; // 커미션 금액
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// 정산 정보
export interface Settlement {
  id: string;
  partnerId: string;
  period: string; // YYYY-MM
  totalSales: number;
  totalCommission: number;
  totalOrders: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// 대시보드 통계
export interface DashboardStats {
  totalSales: number;
  totalCommission: number;
  totalOrders: number;
  activeProducts: number;
  monthlyRevenue: number;
  conversionRate: number;
}

// API 응답
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

