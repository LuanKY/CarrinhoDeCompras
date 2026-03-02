import { useState, useEffect } from 'react';

const useLocalStorage = (key, valorInicial) => {
  const [valorArmazenado, setValorArmazenado] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : valorInicial;
    } catch (erro) {
      console.error(`Erro ao ler chave localStorage "${key}":`, erro);
      return valorInicial;
    }
  });

  const setValor = (valor) => {
    try {
      const valorParaArmazenar =
        valor instanceof Function ? valor(valorArmazenado) : valor;
      
      setValorArmazenado(valorParaArmazenar);
      
      window.localStorage.setItem(key, JSON.stringify(valorParaArmazenar));
    } catch (erro) {
      console.error(`Erro ao salvar no localStorage chave "${key}":`, erro);
    }
  };

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

    window.addEventListener('storage', manipularMudancaArmazenamento);
    
    return () => {
      window.removeEventListener('storage', manipularMudancaArmazenamento);
    };
  }, [key, valorInicial]);

  return [valorArmazenado, setValor];
};

export default useLocalStorage;