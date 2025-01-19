import api from '../api/axios';

export interface Package {
  id: string;
  orderId: string;
  lengthCm: number;
  heightCm: number;
  widthCm: number;
  weightLb: number;
  content: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' |'DELIVERED'| 'CANCELLED';
  pickupAddress: string;
  scheduledDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  department: string;
  municipality: string;
  referencePoint: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  packages: Package[];
}

export interface CreateOrderData {
  pickupAddress: string;
  scheduledDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  department: string;
  municipality: string;
  referencePoint: string;
  instructions: string;
}

export interface CreatePackageData {
  lengthCm: number;
  heightCm: number;
  widthCm: number;
  weightLb: number;
  content: string;
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await api.post<Order>('/orders', data);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const response = await api.patch<Order>(`/orders/${id}/status`, { status });
  return response.data;
};

export const addPackageToOrder = async (orderId: string, packageData: CreatePackageData): Promise<Package> => {
  const response = await api.post<Package>(`/orders/${orderId}/packages`, packageData);
  return response.data;
};

export const deletePackage = async (orderId: string, packageId: string): Promise<void> => {
  await api.delete(`/orders/${orderId}/packages/${packageId}`);
};
