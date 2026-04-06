import { useState } from 'react';

const PainelParticipantes = ({ participantsOwes, onAddParticipant, onRemoveParticipant, onTogglePaid, sharePerPerson, creatorPix }) => {
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newParticipantName.trim()) {
      onAddParticipant(newParticipantName.trim());
      setNewParticipantName('');
    }
  };

  const totalCollected = participantsOwes
    .filter(p => p.paid)
    .reduce((sum, p) => sum + p.totalOwed, 0);

  const totalExpected = participantsOwes.reduce((sum, p) => sum + p.totalOwed, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fadeIn">
      <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Divisão e Participantes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Base compartilhada: <span className="font-semibold text-blue-600 dark:text-blue-400">R$ {sharePerPerson.toFixed(2)} por pessoa</span>
        </p>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            placeholder="Nome do participante"
            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newParticipantName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Adicionar
          </button>
        </form>
      </div>

      {participantsOwes.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Adicione participantes para ver a divisão.
        </div>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {participantsOwes.map((participant) => (
              <li
                key={participant.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  participant.paid ? 'bg-green-50/50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-grow">
                  <div className="flex-shrink-0">
                    {participant.isCreator ? (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold" title="Criador">
                        C
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {participant.name}
                      {participant.isCreator && <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">Criador</span>}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Deve pagar: <span className="font-semibold text-gray-700 dark:text-gray-300">R$ {participant.totalOwed.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => onTogglePaid(participant.id)}
                    disabled={participant.isCreator}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      participant.paid
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 cursor-pointer'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 cursor-pointer'
                    } ${participant.isCreator ? 'opacity-80 cursor-default' : 'hover:opacity-80'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${participant.paid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    {participant.paid ? 'Pago' : 'Pendente'}
                  </button>

                  {!participant.isCreator && (
                    <button
                      onClick={() => onRemoveParticipant(participant.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Remover participante"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {creatorPix && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">Chave PIX para pagamento:</p>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-blue-700">
                        <code className="text-gray-800 dark:text-gray-200 select-all font-mono text-sm">{creatorPix}</code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(creatorPix);
                                alert('Chave PIX copiada!');
                            }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            title="Copiar PIX"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Arrecadado</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        R$ {totalCollected.toFixed(2)} <span className="text-sm font-normal text-gray-500">de R$ {totalExpected.toFixed(2)}</span>
                    </p>
                </div>

                <div className="w-full sm:w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2 sm:mt-0">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0}%` }}></div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainelParticipantes;
