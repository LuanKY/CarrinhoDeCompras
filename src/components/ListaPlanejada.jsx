import { useState } from 'react';

const ListaPlanejada = ({ itens, setItens, onEnviarParaCarrinho, onLimparLista, onRemoveItem }) => {
  const [novoItem, setNovoItem] = useState({
    name: '',
    quantity: 1,
    price: ''
  });
  
  const [itemEditando, setItemEditando] = useState(null);
  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!novoItem.name.trim()) {
      novosErros.name = 'O nome do produto é obrigatório';
    }
    
    if (!novoItem.quantity || novoItem.quantity < 1) {
      novosErros.quantity = 'A quantidade deve ser pelo menos 1';
    }
    
    if (!novoItem.price || isNaN(Number(novoItem.price)) || Number(novoItem.price) <= 0) {
      novosErros.price = 'Informe um preço válido';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const manipularMudanca = (e) => {
    const { name, value } = e.target;

    if (erros[name]) {
      const novosErros = { ...erros };
      delete novosErros[name];
      setErros(novosErros);
    }
    
    if (name === 'quantity') {
      setNovoItem({ ...novoItem, [name]: parseInt(value) || '' });
    } else if (name === 'price') {
      const valorNumerico = value.replace(/[^0-9.]/g, '');
      setNovoItem({ ...novoItem, [name]: valorNumerico });
    } else {
      setNovoItem({ ...novoItem, [name]: value });
    }
  };

  const adicionarOuAtualizar = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    const precoFinal = parseFloat(novoItem.price);

    if (itemEditando) {
      setItens(itens.map(item => item.id === itemEditando ? { ...item, name: novoItem.name, quantity: novoItem.quantity, price: precoFinal } : item));
      setItemEditando(null);
    } else {
      setItens([...itens, { ...novoItem, id: Date.now(), comprado: false, price: precoFinal }]);
    }
    
    setNovoItem({ name: '', quantity: 1, price: '' });
  };

  const editarItem = (item) => {
    setNovoItem({ name: item.name, quantity: item.quantity, price: item.price });
    setItemEditando(item.id);
    setErros({}); 
  };

  const cancelarEdicao = () => {
    setItemEditando(null);
    setNovoItem({ name: '', quantity: 1, price: '' });
    setErros({});
  };

  const alternarCheckbox = (item) => {
    if (item.comprado) {
      setItens(itens.map(i => i.id === item.id ? { ...i, comprado: false } : i));
    } else {
      onEnviarParaCarrinho(item);
    }
  };

  const totalPlanejado = itens.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col">
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-slideUp">
        <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {itemEditando ? 'Editar Produto' : 'Adicionar Produto a Lista'}
          </h2>
        </div>

        <form onSubmit={adicionarOuAtualizar} className="p-4">
          <div className="mb-4">
            <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do Produto
            </label>
            <input
              type="text"
              id="plan-name"
              name="name"
              value={novoItem.name}
              onChange={manipularMudanca}
              placeholder="Ex: Arroz"
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {erros.name && <p className="mt-1 text-sm text-red-500">{erros.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="plan-quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                id="plan-quantity"
                name="quantity"
                min="1"
                value={novoItem.quantity}
                onChange={manipularMudanca}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {erros.quantity && <p className="mt-1 text-sm text-red-500">{erros.quantity}</p>}
            </div>
            
            <div>
              <label htmlFor="plan-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço (R$)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">R$</span>
                </div>
                <input
                  type="text"
                  id="plan-price"
                  name="price"
                  value={novoItem.price}
                  onChange={manipularMudanca}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.price ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {erros.price && <p className="mt-1 text-sm text-red-500">{erros.price}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {itemEditando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-pulse-light"
            >
              {itemEditando ? 'Atualizar Produto' : 'Adicionar a Lista'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fadeIn">
        <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Lista de Compras</h2>
        </div>

        {itens.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhum item na lista
          </div>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {itens.map((item) => (
                <li 
                  key={item.id} 
                  className={`p-4 flex flex-wrap md:flex-nowrap justify-between items-center transition-colors animate-fadeIn ${
                    item.comprado ? 'bg-gray-50 dark:bg-gray-800/80 opacity-60' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center flex-grow mb-2 md:mb-0">
                    
                    <button
                      type="button"
                      onClick={() => alternarCheckbox(item)}
                      aria-label={item.comprado ? "Desmarcar item" : "Marcar item e enviar para o carrinho"}
                      className={`w-6 h-6 mr-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.comprado
                          ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                          : 'border-gray-300 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-400'
                      }`}
                    >
                      {item.comprado && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <div className={item.comprado ? 'line-through text-gray-500 dark:text-gray-400' : ''}>
                      <h3 className="font-medium text-gray-800 dark:text-white">{item.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="mr-2">{item.quantity} unid.</span>
                        {item.price > 0 && <span>R$ {item.price.toFixed(2)}/unid.</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                    <span className={`font-medium mr-2 ${item.comprado ? 'text-gray-500' : 'text-blue-600 dark:text-blue-400'}`}>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => editarItem(item)} 
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors" 
                      disabled={item.comprado} 
                      aria-label="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onRemoveItem(item.id)} 
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors" 
                      aria-label="Remover"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-gray-600 dark:text-gray-400">Total Planejado:</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ {totalPlanejado.toFixed(2)}</p>
              </div>
              <button 
                onClick={onLimparLista} 
                className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors animate-pulse-soft"
              >
                Limpar Lista
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaPlanejada;