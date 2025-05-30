import React, { useState, useEffect } from 'react';

const FormularioProduto = ({ onAddProduct, editingProduct, onCancelEdit }) => {
  const [produto, setProduto] = useState({
    name: '',
    quantity: 1,
    price: ''
  });
  
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});

  // Carrega dados do produto no modo de edição
  useEffect(() => {
    if (editingProduct) {
      setProduto({
        name: editingProduct.name,
        quantity: editingProduct.quantity,
        price: editingProduct.price
      });
    } else {
      // Reinicia formulário quando não estiver editando
      setProduto({
        name: '',
        quantity: 1,
        price: ''
      });
    }
  }, [editingProduct]);

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!produto.name.trim()) {
      novosErros.name = 'O nome do produto é obrigatório';
    }
    
    if (!produto.quantity || produto.quantity < 1) {
      novosErros.quantity = 'A quantidade deve ser pelo menos 1';
    }
    
    if (!produto.price || isNaN(Number(produto.price)) || Number(produto.price) <= 0) {
      novosErros.price = 'Informe um preço válido';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const manipularMudanca = (e) => {
    const { name, value } = e.target;
    
    // Manipula entradas numéricas
    if (name === 'quantity') {
      setProduto({ ...produto, [name]: parseInt(value) || '' });
    } else if (name === 'price') {
      // Permite números decimais para preço
      const valorNumerico = value.replace(/[^0-9.]/g, '');
      setProduto({ ...produto, [name]: valorNumerico });
    } else {
      setProduto({ ...produto, [name]: value });
    }
  };

  const manipularEnvio = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setEnviando(true);
    
    // Converte preço de string para número
    const produtoParaAdicionar = {
      ...produto,
      price: parseFloat(produto.price)
    };
    
    onAddProduct(produtoParaAdicionar);
    
    // Reinicia formulário se não estiver editando
    if (!editingProduct) {
      setProduto({
        name: '',
        quantity: 1,
        price: ''
      });
    }
    
    setEnviando(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-slideUp">
      <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
        </h2>
      </div>
      
      <form onSubmit={manipularEnvio} className="p-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={produto.name}
            onChange={manipularMudanca}
            placeholder="Ex: Arroz"
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {erros.name && <p className="mt-1 text-sm text-red-500">{erros.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantidade
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={produto.quantity}
              onChange={manipularMudanca}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.quantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {erros.quantity && <p className="mt-1 text-sm text-red-500">{erros.quantity}</p>}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preço (R$)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">R$</span>
              </div>
              <input
                type="text"
                id="price"
                name="price"
                value={produto.price}
                onChange={manipularMudanca}
                placeholder="0.00"
                className={`w-full pl-9 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.price ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {erros.price && <p className="mt-1 text-sm text-red-500">{erros.price}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          {editingProduct && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={enviando}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-pulse-light"
            disabled={enviando}
          >
            {enviando 
              ? 'Processando...' 
              : editingProduct 
                ? 'Atualizar Produto' 
                : 'Adicionar ao Carrinho'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioProduto;