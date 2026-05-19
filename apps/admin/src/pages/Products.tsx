import React from 'react';
import ProductsTable from '@/features/products/components/ProductsTable';

const Products: React.FC = () => (
  <div className="flex flex-col gap-6 fade-in">
    <div>
      <p className="section-label mb-1">Catalogo e inventario</p>
      <h2
        className="font-display font-bold uppercase tracking-wide"
        style={{ color: 'var(--chalk)', fontSize: '1.5rem' }}
      >
        Productos
      </h2>
      <p className="mono-tag mt-0.5">Administra precios, stock y especificaciones</p>
    </div>
    <ProductsTable />
  </div>
);

export default Products;
