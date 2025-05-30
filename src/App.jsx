import React, { useState, useEffect } from 'react';
import Cabecalho from './components/Cabecalho';
import CarrinhoCompras from './components/CarrinhoCompras';
import FormularioProduto from './components/FormularioProduto';
import { ProvedorTema } from './contexts/Tema';
import useLocalStorage from './hooks/useLocalStorage';
import './styles/animations.css';

function App() {
  const [produtos, setProdutos] = useLocalStorage('shopping-cart', []);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [total, setTotal] = useState(0);

  // Calcula total sempre que produtos mudam
  useEffect(() => {
    const novoTotal = produtos.reduce(
      (soma, produto) => soma + (produto.price * produto.quantity),
      0
    );
    setTotal(novoTotal);
  }, [produtos]);

  // Adiciona um novo produto ao carrinho
  const manipularAdicionarProduto = (produto) => {
    if (produtoEditando !== null) {
      // Atualiza produto existente
      setProdutos(
        produtos.map((p, index) => (index === produtoEditando ? produto : p))
      );
      setProdutoEditando(null);
    } else {
      // Adiciona novo produto
      setProdutos([...produtos, produto]);
    }
  };

  // Inicia edição de um produto
  const manipularEditarProduto = (index) => {
    setProdutoEditando(index);
  };

  // Remove um produto do carrinho
  const manipularRemoverProduto = (index) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  // Limpa todo o carrinho
  const manipularLimparCarrinho = () => {
    setProdutos([]);
    setProdutoEditando(null);
  };

  return (
    <ProvedorTema>
      <div className="min-h-screen transition-all duration-300 dark:bg-gray-900 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Cabecalho />
          <main className="animate-fadeIn">
            <FormularioProduto 
              onAddProduct={manipularAdicionarProduto} 
              editingProduct={produtoEditando !== null ? produtos[produtoEditando] : null} 
              onCancelEdit={() => setProdutoEditando(null)}
            />
            <CarrinhoCompras 
              products={produtos} 
              total={total}
              onEditProduct={manipularEditarProduto}
              onRemoveProduct={manipularRemoverProduto} 
              onClearCart={manipularLimparCarrinho}
            />
          </main>
        </div>
      </div>
    </ProvedorTema>
  );
}

export default App;