import React from 'react';

const CarrinhoCompras = ({ products, total, onEditProduct, onRemoveProduct, onClearCart }) => {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fadeIn">
      <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Produtos no Carrinho</h2>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Seu carrinho está vazio
        </div>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((produto, index) => (
              <li 
                key={index} 
                className="p-4 flex flex-wrap md:flex-nowrap justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors animate-fadeIn"
              >
                <div className="flex-grow mb-2 md:mb-0">
                  <h3 className="font-medium text-gray-800 dark:text-white">{produto.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="mr-2">{produto.quantity} unid.</span>
                    <span>R$ {produto.price.toFixed(2)}/unid.</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    R$ {(produto.price * produto.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => onEditProduct(index)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                    aria-label="Editar produto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onRemoveProduct(index)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                    aria-label="Remover produto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 bg-gray-50 dark:bg-gray-750 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400">Total:</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ {total.toFixed(2)}</p>
            </div>
            <button 
              onClick={onClearCart}
              className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors animate-pulse-soft"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrinhoCompras;