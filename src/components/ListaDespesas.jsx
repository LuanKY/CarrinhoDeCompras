const ListaDespesas = ({ expenses, onRemoveExpense, totalExpenses }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fadeIn">
      <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Despesas Adicionadas</h2>
      </div>

      {expenses.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Nenhuma despesa adicionada ainda.
        </div>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fadeIn"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white text-lg">{expense.name}</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      R$ {expense.totalValue.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      aria-label="Remover despesa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {expense.individualItems && expense.individualItems.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Itens Individuais:</p>
                    <ul className="text-sm space-y-1">
                      {expense.individualItems.map((item) => (
                        <li key={item.id} className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span><span className="font-medium">{item.personName}</span>: {item.description}</span>
                          <span>R$ {item.value.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="p-4 bg-gray-100 dark:bg-gray-700/50 flex justify-between items-center border-t border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Total Geral:</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ {totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaDespesas;
