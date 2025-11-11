import axios, { AxiosInstance } from 'axios';
import { ApiResponse, Product } from '@/types';

class GetKkulApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_GETKKUL_API_URL || 'http://localhost:3002';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': process.env.GETKKUL_API_SECRET || '',
      },
    });
  }

  /**
   * 겟꿀 메인에서 상위 1000개 상품 조회
   */
  async getTopProducts(
    limit: number = 1000,
    sort: 'sales' | 'rating' | 'newest' = 'sales',
    category?: string
  ): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.client.get('/api/partners/products', {
        params: {
          limit,
          sort,
          category,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch top products:', error);
      throw error;
    }
  }

  /**
   * 특정 상품 상세 정보 조회
   */
  async getProductDetail(productId: string): Promise<ApiResponse<Product>> {
    try {
      const response = await this.client.get(`/api/partners/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * 상품 검색
   */
  async searchProducts(
    query: string,
    limit: number = 100
  ): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.client.get('/api/partners/products/search', {
        params: {
          q: query,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  }

  /**
   * 파트너의 판매 주문 조회
   */
  async getPartnerOrders(
    partnerId: string,
    status?: string
  ): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get('/api/partners/orders', {
        params: {
          partnerId,
          status,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch partner orders:', error);
      throw error;
    }
  }

  /**
   * 파트너 정산 정보 조회
   */
  async getPartnerSettlement(
    partnerId: string,
    period?: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/api/partners/settlement', {
        params: {
          partnerId,
          period,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch settlement:', error);
      throw error;
    }
  }
}

export const getKkulApi = new GetKkulApiClient();

