import React from 'react';
import AlternadorTema from './AlternadorTema';

const Cabecalho = () => {
  return (
    <header className="flex justify-between items-center mb-8 animate-slideDown">
      <div>
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Carrinho de Compras
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Acompanhe suas compras no supermercado
        </p>
      </div>
      <AlternadorTema />
    </header>
  );
};

export default Cabecalho;