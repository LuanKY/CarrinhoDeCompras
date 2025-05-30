import React, { createContext, useContext, useState, useEffect } from 'react';

const ContextoTema = createContext();

export const useTema = () => {
  const contexto = useContext(ContextoTema);
  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de um ProvedorTema');
  }
  return contexto;
};

export const ProvedorTema = ({ children }) => {
  // Inicializa tema do localStorage ou preferência do sistema
  const [tema, setTema] = useState(() => {
    // Primeiro verifica se existe tema no localStorage
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo) {
      return temaSalvo;
    }
    
    // Se não, verifica a preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Padrão para tema claro
    return 'light';
  });

  // Aplica mudanças de tema ao DOM
  useEffect(() => {
    if (tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Salva escolha do tema no localStorage
    localStorage.setItem('tema', tema);
  }, [tema]);

  // Escuta mudanças do tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const lidarComMudanca = () => {
      if (localStorage.getItem('tema') === null) {
        setTema(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Navegadores modernos
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', lidarComMudanca);
      return () => mediaQuery.removeEventListener('change', lidarComMudanca);
    }
  }, []);

  // Alterna entre temas claro e escuro
  const alternarTema = () => {
    setTema(temaAnterior => (temaAnterior === 'light' ? 'dark' : 'light'));
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  );
};