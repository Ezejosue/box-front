'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addPackageToOrder, updateOrderStatus, Package } from '@/services/orders.service';

interface PackageFormData {
  lengthCm: number;
  heightCm: number;
  widthCm: number;
  weightLb: number;
  content: string;
}

export default function AddPackagesPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPackage, setCurrentPackage] = useState<PackageFormData>({
    lengthCm: 0,
    heightCm: 0,
    widthCm: 0,
    weightLb: 0,
    content: ''
  });

  const handleAddPackage = async () => {
    try {
      const newPackage = await addPackageToOrder(params.orderId, currentPackage);
      setPackages([...packages, newPackage]);
      setCurrentPackage({
        lengthCm: 0,
        heightCm: 0,
        widthCm: 0,
        weightLb: 0,
        content: ''
      });
    } catch (error) {
      console.error('Error adding package:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateOrderStatus(params.orderId, 'PROCESSING');
      router.push('/orders');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <div className="bg-white rounded-lg p-6 shadow space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Agrega tus bultos
        </h2>

        {/* Package Form */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Largo
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={currentPackage.lengthCm}
                  onChange={(e) => setCurrentPackage({...currentPackage, lengthCm: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <span className="ml-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Alto
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={currentPackage.heightCm}
                  onChange={(e) => setCurrentPackage({...currentPackage, heightCm: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <span className="ml-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Ancho
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={currentPackage.widthCm}
                  onChange={(e) => setCurrentPackage({...currentPackage, widthCm: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <span className="ml-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Peso en libras
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={currentPackage.weightLb}
                  onChange={(e) => setCurrentPackage({...currentPackage, weightLb: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <span className="ml-2 text-gray-500">lb</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Contenido
              </label>
              <input
                type="text"
                value={currentPackage.content}
                onChange={(e) => setCurrentPackage({...currentPackage, content: e.target.value})}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del contenido"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddPackage}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              Agregar
              <span>+</span>
            </button>
          </div>
        </div>

        {/* Package List */}
        {packages.map((pkg, index) => (
          <div
            key={pkg.id || index}
            className="border border-green-200 bg-green-50 p-4 rounded-lg flex justify-between items-center"
          >
            <div className="flex-1 grid grid-cols-5 gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Peso:</span>
                <span className="ml-1 font-medium">{pkg.weightLb} lb</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Contenido:</span>
                <span className="ml-1 font-medium">{pkg.content}</span>
              </div>
              <div className="col-span-3 text-sm">
                <span className="text-gray-600">Dimensiones:</span>
                <span className="ml-1 font-medium">
                  {pkg.lengthCm} x {pkg.heightCm} x {pkg.widthCm} cm
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPackages(packages.filter((p) => p.id !== pkg.id));
              }}
              className="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        ))}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-2"
          >
            ← Regresar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            Enviar
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
