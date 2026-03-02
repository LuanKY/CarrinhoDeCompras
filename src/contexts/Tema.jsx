import { createContext, useContext, useState, useEffect } from 'react';

const ContextoTema = createContext();

export const useTema = () => {
  const contexto = useContext(ContextoTema);
  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de um ProvedorTema');
  }
  return contexto;
};

export const ProvedorTema = ({ children }) => {
  const [tema, setTema] = useState(() => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo) {
      return temaSalvo;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    if (tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('tema', tema);
  }, [tema]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const lidarComMudanca = () => {
      if (localStorage.getItem('tema') === null) {
        setTema(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', lidarComMudanca);
      return () => mediaQuery.removeEventListener('change', lidarComMudanca);
    }
  }, []);

  const alternarTema = () => {
    setTema(temaAnterior => (temaAnterior === 'light' ? 'dark' : 'light'));
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  );
};