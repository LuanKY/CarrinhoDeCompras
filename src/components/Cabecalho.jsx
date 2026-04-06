import AlternadorTema from './AlternadorTema';

const Cabecalho = () => {
  return (
    <header className="flex justify-between items-center animate-slideDown">
      <div>
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Dívida Compartilhada
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
          Divida gastos com amigos de forma justa e automática
        </p>
      </div>
      <AlternadorTema />
    </header>
  );
};

export default Cabecalho;
