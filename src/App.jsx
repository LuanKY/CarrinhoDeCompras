import React, { useState, useEffect, useRef } from 'react';
import Cabecalho from './components/Cabecalho';
import CarrinhoCompras from './components/CarrinhoCompras';
import FormularioProduto from './components/FormularioProduto';
import { ProvedorTema } from './contexts/Tema';
import useLocalStorage from './hooks/useLocalStorage';
import './styles/animations.css';

function App() {
  const [produtos, setProdutos] = useLocalStorage('shopping-cart', []);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [indexEditando, setIndexEditando] = useState(null);
  const [total, setTotal] = useState(0);
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);
  const [confirmarLimpeza, setConfirmarLimpeza] = useState(false);

  const formularioRef = useRef(null);

  useEffect(() => {
    const novoTotal = produtos.reduce(
      (soma, produto) => soma + (produto.price * produto.quantity),
      0
    );
    setTotal(novoTotal);
  }, [produtos]);

  const manipularAdicionarProduto = (produto) => {
    if (indexEditando !== null) {
      setProdutos(
        produtos.map((p, index) => (index === indexEditando ? produto : p))
      );
      setIndexEditando(null);
    } else {
      setProdutos([...produtos, produto]);
    }
    setProdutoEditando(null);
  };

  const manipularEditarProduto = (index) => {
    setProdutoEditando(produtos[index]);
    setIndexEditando(index);

    // Scroll suave até o formulário
    setTimeout(() => {
      formularioRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const confirmarRemoverProduto = () => {
    if (confirmarRemocao !== null) {
      setProdutos(produtos.filter((_, i) => i !== confirmarRemocao));
      setConfirmarRemocao(null);
    }
  };

  const confirmarLimparCarrinho = () => {
    setProdutos([]);
    setProdutoEditando(null);
    setIndexEditando(null);
    setConfirmarLimpeza(false);
  };

  return (
    <ProvedorTema>
      <div className="min-h-screen transition-all duration-300 dark:bg-gray-900 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Cabecalho />
          <main className="animate-fadeIn">
            <div ref={formularioRef}>
              <FormularioProduto 
                onAddProduct={manipularAdicionarProduto} 
                editingProduct={produtoEditando} 
                onCancelEdit={() => {
                  setProdutoEditando(null);
                  setIndexEditando(null);
                }}
              />
            </div>
            <CarrinhoCompras 
              products={produtos} 
              total={total}
              onEditProduct={manipularEditarProduto}
              onRemoveProduct={(index) => setConfirmarRemocao(index)} 
              onClearCart={() => setConfirmarLimpeza(true)}
            />
          </main>

          {/* Modal de Confirmação de Remoção */}
          {confirmarRemocao !== null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
                <p className="text-gray-800 dark:text-white mb-4">Deseja remover este item do carrinho?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarRemocao(null)} className="px-4 py-2 border rounded-md dark:text-gray-300">Cancelar</button>
                  <button onClick={confirmarRemoverProduto} className="px-4 py-2 bg-red-600 text-white rounded-md">Remover</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Limpeza */}
          {confirmarLimpeza && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
                <p className="text-gray-800 dark:text-white mb-4">Deseja limpar todo o carrinho?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarLimpeza(false)} className="px-4 py-2 border rounded-md dark:text-gray-300">Cancelar</button>
                  <button onClick={confirmarLimparCarrinho} className="px-4 py-2 bg-red-600 text-white rounded-md">Limpar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProvedorTema>
  );
}

export default App;
