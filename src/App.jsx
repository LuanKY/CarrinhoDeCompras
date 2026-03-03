import { useState, useEffect, useRef } from 'react';
import Cabecalho from './components/Cabecalho';
import CarrinhoCompras from './components/CarrinhoCompras';
import FormularioProduto from './components/FormularioProduto';
import ListaPlanejada from './components/ListaPlanejada';
import { ProvedorTema } from './contexts/Tema';
import useLocalStorage from './hooks/useLocalStorage';
import './styles/animations.css';

function App() {
  const [produtos, setProdutos] = useLocalStorage('shopping-cart', []);
  const [listaPlanejada, setListaPlanejada] = useLocalStorage('planned-list', []);
  
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [indexEditando, setIndexEditando] = useState(null);
  
  const [produtoPreenchido, setProdutoPreenchido] = useState(null);
  const [idPlanejadoAtivo, setIdPlanejadoAtivo] = useState(null);
  
  const [total, setTotal] = useState(0);
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);
  const [confirmarLimpeza, setConfirmarLimpeza] = useState(false);
  const [confirmarLimpezaPlanejada, setConfirmarLimpezaPlanejada] = useState(false);
  const [confirmarRemocaoPlanejada, setConfirmarRemocaoPlanejada] = useState(null); 
  
  const [desmarcarAoLimpar, setDesmarcarAoLimpar] = useState(true);
  
  const [confirmarDesmarcarTodos, setConfirmarDesmarcarTodos] = useState(false);

  const formularioRef = useRef(null);

  useEffect(() => {
    const novoTotal = produtos.reduce(
      (soma, produto) => soma + (produto.price * produto.quantity),
      0
    );
    setTotal(novoTotal);
  }, [produtos]);

  const iniciarCompraPlanejada = (produtoPlanejado) => {
    setProdutoPreenchido(produtoPlanejado);
    setIdPlanejadoAtivo(produtoPlanejado.id);
    setProdutoEditando(null);
    setIndexEditando(null);
    
    setTimeout(() => {
      formularioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const manipularAdicionarProduto = (produto) => {
    if (indexEditando !== null) {
      setProdutos(
        produtos.map((p, index) => (index === indexEditando ? produto : p))
      );
      setIndexEditando(null);
    } else {
      const indexExistente = produtos.findIndex(p => 
        p.name.trim().toLowerCase() === produto.name.trim().toLowerCase() && 
        p.price === produto.price
      );

      if (indexExistente !== -1) {
        const novosProdutos = [...produtos];
        novosProdutos[indexExistente].quantity += produto.quantity;
        setProdutos(novosProdutos);
      } else {
        setProdutos([...produtos, produto]);
      }
      
      if (idPlanejadoAtivo) {
        setListaPlanejada(listaPlanejada.map(p => 
          p.id === idPlanejadoAtivo ? { ...p, comprado: true } : p
        ));
        setIdPlanejadoAtivo(null);
      }
    }
    setProdutoEditando(null);
    setProdutoPreenchido(null);
  };

  const manipularEditarProduto = (index) => {
    setProdutoEditando(produtos[index]);
    setIndexEditando(index);
    setIdPlanejadoAtivo(null);

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

  const confirmarRemoverItemPlanejado = () => {
    if (confirmarRemocaoPlanejada !== null) {
      setListaPlanejada(listaPlanejada.filter(item => item.id !== confirmarRemocaoPlanejada));
      setConfirmarRemocaoPlanejada(null);
    }
  };

  const confirmarLimparCarrinho = () => {
    setProdutos([]);
    setProdutoEditando(null);
    setIndexEditando(null);
    setConfirmarLimpeza(false);
    
    if (desmarcarAoLimpar) {
      setListaPlanejada(listaPlanejada.map(p => ({ ...p, comprado: false })));
    }
  };

  const confirmarLimparPlano = () => {
    setListaPlanejada([]);
    setConfirmarLimpezaPlanejada(false);
  };

  const confirmarDesmarcarPlanejados = () => {
    setListaPlanejada(listaPlanejada.map(p => ({ ...p, comprado: false })));
    setConfirmarDesmarcarTodos(false);
  };

  return (
    <ProvedorTema>
      <div className="min-h-screen transition-all duration-300 dark:bg-gray-900 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Cabecalho />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
            
            <ListaPlanejada 
              itens={listaPlanejada} 
              setItens={setListaPlanejada} 
              onEnviarParaCarrinho={iniciarCompraPlanejada}
              onLimparLista={() => setConfirmarLimpezaPlanejada(true)}
              onRemoveItem={(id) => setConfirmarRemocaoPlanejada(id)}
              onDesmarcarTodos={() => setConfirmarDesmarcarTodos(true)} 
            />

            <main className="animate-fadeIn">
              <div ref={formularioRef}>
                <FormularioProduto 
                  onAddProduct={manipularAdicionarProduto} 
                  editingProduct={produtoEditando} 
                  prefilledProduct={produtoPreenchido}
                  onCancelEdit={() => {
                    setProdutoEditando(null);
                    setIndexEditando(null);
                    setProdutoPreenchido(null);
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
          </div>


          {confirmarRemocao !== null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
                <p className="text-gray-800 dark:text-white mb-4">Deseja remover este item do carrinho?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarRemocao(null)} className="px-4 py-2 border rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                  <button onClick={confirmarRemoverProduto} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remover</button>
                </div>
              </div>
            </div>
          )}

          {confirmarRemocaoPlanejada !== null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full animate-slideUp">
                <p className="text-gray-800 dark:text-white mb-4">Deseja remover este item da sua lista de compras?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarRemocaoPlanejada(null)} className="px-4 py-2 border rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                  <button onClick={confirmarRemoverItemPlanejado} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remover</button>
                </div>
              </div>
            </div>
          )}

          {confirmarLimpeza && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full">
                <p className="text-gray-800 dark:text-white mb-4">Deseja limpar todo o carrinho?</p>
                
                <label className="flex items-center space-x-2 mb-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={desmarcarAoLimpar}
                    onChange={(e) => setDesmarcarAoLimpar(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Desmarcar também os itens planeados</span>
                </label>

                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarLimpeza(false)} className="px-4 py-2 border rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                  <button onClick={confirmarLimparCarrinho} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Limpar</button>
                </div>
              </div>
            </div>
          )}

          {confirmarLimpezaPlanejada && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full animate-slideUp">
                <p className="text-gray-800 dark:text-white mb-4">Deseja apagar toda a sua lista de compras?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarLimpezaPlanejada(false)} className="px-4 py-2 border rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                  <button onClick={confirmarLimparPlano} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Limpar Lista</button>
                </div>
              </div>
            </div>
          )}

          {confirmarDesmarcarTodos && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-sm w-full animate-slideUp">
                <p className="text-gray-800 dark:text-white mb-4">Deseja desmarcar todos os itens da sua lista?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setConfirmarDesmarcarTodos(false)} className="px-4 py-2 border rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                  <button onClick={confirmarDesmarcarPlanejados} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors">Desmarcar</button>
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