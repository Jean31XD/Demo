import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
    <span className="text-8xl font-black text-gray-200">404</span>
    <h1 className="text-2xl font-bold text-gray-900">Página no encontrada</h1>
    <p className="text-gray-500">La página que buscas no existe o fue movida.</p>
    <Link
      to="/"
      className="mt-4 rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-700"
    >
      Ir al inicio
    </Link>
  </div>
);

export default NotFound;
