'use client';
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, addPackageToOrder, deletePackage, Order, Package } from '@/services/orders.service';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [packageData, setPackageData] = useState({
    lengthCm: 0,
    heightCm: 0,
    widthCm: 0,
    weightLb: 0,
    content: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError('Error al cargar las órdenes');
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      console.log(orderId, status);
      await updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setError('Error al actualizar el estado');
    }
  };

  const handleAddPackage = async (orderId: string) => {
    try {
      await addPackageToOrder(orderId, packageData);
      setIsAddingPackage(false);
      setPackageData({
        lengthCm: 0,
        heightCm: 0,
        widthCm: 0,
        weightLb: 0,
        content: '',
      });
      loadOrders();
    } catch (err) {
      setError('Error al añadir el paquete');
    }
  };

  const handleDeletePackage = async (orderId: string, packageId: string) => {
    try {
      await deletePackage(orderId, packageId);
      loadOrders();
    } catch (err) {
      setError('Error al eliminar el paquete');
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Órdenes</h1>
      
      <div className="mb-6 flex justify-end">
        <Link
          href="/orders/create"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          Crear Orden
          <span>+</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Orden para {order.firstName} {order.lastName}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Dirección de recogida:</p>
                <p className="text-gray-800">{order.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dirección de entrega:</p>
                <p className="text-gray-800">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono:</p>
                <p className="text-gray-800">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="text-gray-800">{order.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Paquetes:</h3>
              <div className="space-y-2">
                {order.packages?.map((pkg: Package) => (
                  <div key={pkg.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <p className="font-medium">{pkg.content}</p>
                      <p className="text-sm text-gray-600">
                        {pkg.lengthCm}cm x {pkg.widthCm}cm x {pkg.heightCm}cm - {pkg.weightLb}lb
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePackage(order.id, pkg.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(order.id);
                  setIsAddingPackage(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Añadir Paquete
              </button>
            </div>

            {isAddingPackage && selectedOrder === order.id && (
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-3">Nuevo Paquete</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Largo (cm)</label>
                    <input
                      type="number"
                      value={packageData.lengthCm}
                      onChange={(e) => setPackageData({...packageData, lengthCm: Number(e.target.value)})}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
                    <input
                      type="number"
                      value={packageData.heightCm}
                      onChange={(e) => setPackageData({...packageData, heightCm: Number(e.target.value)})}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
                    <input
                      type="number"
                      value={packageData.widthCm}
                      onChange={(e) => setPackageData({...packageData, widthCm: Number(e.target.value)})}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Peso (lb)</label>
                    <input
                      type="number"
                      value={packageData.weightLb}
                      onChange={(e) => setPackageData({...packageData, weightLb: Number(e.target.value)})}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Contenido</label>
                    <input
                      type="text"
                      value={packageData.content}
                      onChange={(e) => setPackageData({...packageData, content: e.target.value})}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingPackage(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleAddPackage(order.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Guardar Paquete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
