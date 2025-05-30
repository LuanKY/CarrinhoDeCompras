import { useState, useEffect } from 'react';

const useLocalStorage = (key, valorInicial) => {
  // Obtém valor armazenado ou usa valorInicial
  const [valorArmazenado, setValorArmazenado] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Analisa JSON armazenado ou retorna valorInicial
      return item ? JSON.parse(item) : valorInicial;
    } catch (erro) {
      console.error(`Erro ao ler chave localStorage "${key}":`, erro);
      return valorInicial;
    }
  });

  // Retorna uma versão empacotada da função setter do useState que
  // persiste o novo valor no localStorage
  const setValor = (valor) => {
    try {
      // Permite que o valor seja uma função para ter a mesma API do useState
      const valorParaArmazenar =
        valor instanceof Function ? valor(valorArmazenado) : valor;
      
      // Salva no estado
      setValorArmazenado(valorParaArmazenar);
      
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valorParaArmazenar));
    } catch (erro) {
      console.error(`Erro ao salvar no localStorage chave "${key}":`, erro);
    }
  };

  // Atualiza valor armazenado se localStorage mudar em outra aba
  useEffect(() => {
    const manipularMudancaArmazenamento = (evento) => {
      if (evento.key === key) {
        try {
          setValorArmazenado(JSON.parse(evento.newValue || JSON.stringify(valorInicial)));
        } catch (erro) {
          console.error(`Erro ao analisar mudança do localStorage para chave "${key}":`, erro);
        }
      }
    };

    // Escuta mudanças de armazenamento em outras abas
    window.addEventListener('storage', manipularMudancaArmazenamento);
    
    // Limpa o event listener
    return () => {
      window.removeEventListener('storage', manipularMudancaArmazenamento);
    };
  }, [key, valorInicial]);

  return [valorArmazenado, setValor];
};

export default useLocalStorage;