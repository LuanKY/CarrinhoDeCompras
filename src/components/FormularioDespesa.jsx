import { useState } from 'react';

const FormularioDespesa = ({ onAddExpense, participants }) => {
  const [expense, setExpense] = useState({
    name: '',
    totalValue: ''
  });

  const [individualItems, setIndividualItems] = useState([]);
  const [indItemName, setIndItemName] = useState('');
  const [indItemPerson, setIndItemPerson] = useState('');
  const [indItemValue, setIndItemValue] = useState('');
  const [showIndividualForm, setShowIndividualForm] = useState(false);

  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!expense.name.trim()) {
      novosErros.name = 'O nome da despesa é obrigatório';
    }

    if (!expense.totalValue || isNaN(Number(expense.totalValue)) || Number(expense.totalValue) <= 0) {
      novosErros.totalValue = 'Informe um valor total válido';
    } else {
        // Validate that individual items do not exceed total value
        const totalInd = individualItems.reduce((acc, item) => acc + item.value, 0);
        if (totalInd > Number(expense.totalValue)) {
            novosErros.totalValue = 'O valor total não pode ser menor que a soma dos itens individuais';
        }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const manipularMudanca = (e) => {
    const { name, value } = e.target;

    if (erros[name]) {
      const novosErros = { ...erros };
      delete novosErros[name];
      setErros(novosErros);
    }

    if (name === 'totalValue') {
      const valorNumerico = value.replace(/[^0-9.]/g, '');
      setExpense({ ...expense, [name]: valorNumerico });
    } else {
      setExpense({ ...expense, [name]: value });
    }
  };

  const handleAddIndItem = () => {
      if (!indItemPerson || !indItemValue || isNaN(Number(indItemValue)) || Number(indItemValue) <= 0) {
          return;
      }
      setIndividualItems([
          ...individualItems,
          {
              id: Date.now(),
              description: indItemName || 'Item individual',
              personName: indItemPerson,
              value: parseFloat(indItemValue)
          }
      ]);
      setIndItemName('');
      setIndItemValue('');
  };

  const handleRemoveIndItem = (id) => {
      setIndividualItems(individualItems.filter(item => item.id !== id));
  };

  const manipularEnvio = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const expenseToAdd = {
      name: expense.name,
      totalValue: parseFloat(expense.totalValue),
      individualItems: [...individualItems]
    };

    onAddExpense(expenseToAdd);

    // Reset form
    setExpense({ name: '', totalValue: '' });
    setIndividualItems([]);
    setShowIndividualForm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-slideUp">
      <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Adicionar Despesa
        </h2>
      </div>

      <form onSubmit={manipularEnvio} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome da Despesa
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={expense.name}
              onChange={manipularMudanca}
              placeholder="Ex: Supermercado"
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {erros.name && <p className="mt-1 text-sm text-red-500">{erros.name}</p>}
          </div>

          <div>
            <label htmlFor="totalValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor Total (R$)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">R$</span>
              </div>
              <input
                type="text"
                id="totalValue"
                name="totalValue"
                value={expense.totalValue}
                onChange={manipularMudanca}
                placeholder="0.00"
                className={`w-full pl-9 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${erros.totalValue ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {erros.totalValue && <p className="mt-1 text-sm text-red-500">{erros.totalValue}</p>}
          </div>
        </div>

        <div className="mb-4">
            <button
                type="button"
                onClick={() => setShowIndividualForm(!showIndividualForm)}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center"
            >
                {showIndividualForm ? '- Esconder itens individuais' : '+ Adicionar itens individuais (Opcional)'}
            </button>

            {showIndividualForm && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Específico para uma Pessoa</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Este valor será descontado da divisão geral e cobrado apenas da pessoa selecionada.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Descrição (opcional)"
                            value={indItemName}
                            onChange={(e) => setIndItemName(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <select
                            value={indItemPerson}
                            onChange={(e) => setIndItemPerson(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Selecione a pessoa...</option>
                            {participants.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Valor (R$)"
                                value={indItemValue}
                                onChange={(e) => setIndItemValue(e.target.value.replace(/[^0-9.]/g, ''))}
                                className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddIndItem}
                                disabled={!indItemPerson || !indItemValue}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50"
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>

                    {individualItems.length > 0 && (
                        <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-600 text-sm">
                            {individualItems.map((item) => (
                                <li key={item.id} className="py-2 flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">{item.personName}</span>: {item.description}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-600 dark:text-gray-400">R$ {item.value.toFixed(2)}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveIndItem(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adicionar Despesa
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDespesa;
