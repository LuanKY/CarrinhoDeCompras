import { useState } from 'react';

const ConfiguracaoDivida = ({ config, setConfig, generateShareLink }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState({ ...config });
  const [linkCopied, setLinkCopied] = useState(false);

  const handleSave = () => {
    setConfig(tempConfig);
    setIsEditing(false);
  };

  const handleCopyLink = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  if (!isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            {config.name}
            <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Editar Configurações"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Criado por: <span className="font-medium text-gray-700 dark:text-gray-300">{config.creatorName}</span>
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className={`px-4 py-2 flex items-center gap-2 rounded-md font-medium transition-colors ${
              linkCopied
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {linkCopied ? 'Link Copiado!' : 'Compartilhar Dívida'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Configurações da Dívida</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome da Dívida
          </label>
          <input
            type="text"
            value={tempConfig.name}
            onChange={(e) => setTempConfig({ ...tempConfig, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Seu Nome (Criador)
          </label>
          <input
            type="text"
            value={tempConfig.creatorName}
            onChange={(e) => setTempConfig({ ...tempConfig, creatorName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sua Chave PIX
          </label>
          <input
            type="text"
            value={tempConfig.creatorPix}
            onChange={(e) => setTempConfig({ ...tempConfig, creatorPix: e.target.value })}
            placeholder="CPF, Email, Telefone..."
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => {
            setTempConfig({ ...config });
            setIsEditing(false);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default ConfiguracaoDivida;
