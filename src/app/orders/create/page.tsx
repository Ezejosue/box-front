'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/services/orders.service';
import { departments } from '@/utils/locations';
import { directions as directionsList } from '@/utils/directions';
import { countries, Country } from '@/utils/countries';

export default function CreateOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickupAddress: '',
    scheduledDate: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    department: 'San Salvador',
    municipality: 'San Salvador',
    referencePoint: '',
    instructions: '',
  });

  const [municipalities, setMunicipalities] = useState<string[]>(departments['San Salvador']);
  const [directionsOptions, setDirectionsOptions] = useState<string[]>(directionsList);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  // Update municipalities when department changes
  useEffect(() => {
    setMunicipalities(departments[formData.department as keyof typeof departments]);
    setFormData(prev => ({
      ...prev,
      municipality: departments[formData.department as keyof typeof departments][0],
    }));
  }, [formData.department]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Format the number
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format the date to ISO string
      const date = new Date(formData.scheduledDate);
      date.setHours(0, 0, 0, 0);

      const orderData = {
        ...formData,
        scheduledDate: date.toISOString(),
        phone: selectedCountry.prefix + ' ' + formData.phone
      };

      const order = await createOrder(orderData);
      router.push(`/orders/create/packages/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow space-y-6">
          {/* Pickup Address and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-x-12 md:flex md:flex-row md:justify-start">
            <div className="space-y-2 w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                📍 Dirección de recolección
              </label>
              <select
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione una dirección</option>
                {directionsOptions.map((direction) => (
                  <option key={direction} value={direction}>
                    {direction}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                📅 Fecha Programada
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Nombres
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombres"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Apellidos
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apellidos"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* Phone and Delivery Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Teléfono
              </label>
              <div className="flex">
                <div className="relative">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find(c => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="h-full py-3 pl-10 pr-7 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    style={{ paddingLeft: '2.5rem' }}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code} className="flex items-center">
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <img
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-1.5 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7123 4567"
                  maxLength={9}
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCountry.prefix} {formData.phone}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                📍 Dirección del destinatario
              </label>
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dirección de entrega"
                required
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Departamento
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {Object.keys(departments).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Municipio
              </label>
              <select
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {municipalities.map((muni) => (
                  <option key={muni} value={muni}>
                    {muni}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Punto de Referencia
              </label>
              <input
                type="text"
                value={formData.referencePoint}
                onChange={(e) => setFormData({ ...formData, referencePoint: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cerca de..."
                required
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Indicaciones
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Instrucciones adicionales para la entrega..."
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            Siguiente
            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
