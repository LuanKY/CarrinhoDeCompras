import { useState, useEffect, useMemo } from 'react';
import Cabecalho from './components/Cabecalho';
import ConfiguracaoDivida from './components/ConfiguracaoDivida';
import FormularioDespesa from './components/FormularioDespesa';
import ListaDespesas from './components/ListaDespesas';
import PainelParticipantes from './components/PainelParticipantes';
import { ProvedorTema } from './contexts/Tema';
import useLocalStorage from './hooks/useLocalStorage';
import './styles/animations.css';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [debtConfig, setDebtConfig] = useLocalStorage('debt-config', {
    name: 'Minha Dívida Compartilhada',
    creatorPix: '',
    creatorName: 'Criador (Eu)'
  });
  const [expenses, setExpenses] = useLocalStorage('debt-expenses', []);
  const [participants, setParticipants] = useLocalStorage('debt-participants', []);

  // Sync state from URL on initial load if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataBase64 = params.get('data');
    
    if (dataBase64) {
      try {
        const decodedString = decodeURIComponent(escape(atob(dataBase64)));
        const data = JSON.parse(decodedString);

        if (data.config) setDebtConfig(data.config);
        if (data.expenses) setExpenses(data.expenses);
        if (data.participants) setParticipants(data.participants);
      } catch (error) {
        console.error("Erro ao carregar dados da URL", error);
      }
    }

    // Automatically add the creator if participants are empty and no URL data
    if (!dataBase64 && participants.length === 0) {
        setParticipants([{ id: 'creator', name: debtConfig.creatorName, isCreator: true, paid: true }]);
    }

    setIsDataLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL function
  const updateUrlWithState = () => {
    const data = {
      config: debtConfig,
      expenses,
      participants
    };
    try {
      const jsonStr = JSON.stringify(data);
      const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
      return `${window.location.origin}${window.location.pathname}?data=${b64}`;
    } catch(e) {
      console.error(e);
      return window.location.href;
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    let totalExpenses = 0;
    let totalIndividualItems = 0;

    // Map of individual amounts per person name
    const individualTotals = {};

    expenses.forEach(exp => {
      totalExpenses += exp.totalValue;
      
      if (exp.individualItems && exp.individualItems.length > 0) {
        exp.individualItems.forEach(item => {
          totalIndividualItems += item.value;

          if (!individualTotals[item.personName]) {
            individualTotals[item.personName] = 0;
          }
          individualTotals[item.personName] += item.value;
        });
      }
    });

    const sharedBase = Math.max(0, totalExpenses - totalIndividualItems);

    // Valid participants who share the base cost
    const numParticipants = participants.length > 0 ? participants.length : 1;
    const sharePerPerson = sharedBase / numParticipants;

    // Calculate how much each participant owes
    const participantOwes = participants.map(p => {
      const individualAmount = individualTotals[p.name] || 0;
      const totalOwed = sharePerPerson + individualAmount;
      return {
        ...p,
        totalOwed
      };
    });

    return {
      totalExpenses,
      sharedBase,
      sharePerPerson,
      participantOwes
    };
  }, [expenses, participants]);

  // Handlers for expenses
  const handleAddExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const handleRemoveExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Handlers for participants
  const handleAddParticipant = (name) => {
    if (name.trim() && !participants.find(p => p.name === name)) {
      setParticipants([...participants, { id: Date.now().toString(), name, isCreator: false, paid: false }]);
    }
  };

  const handleRemoveParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleTogglePaid = (id) => {
    setParticipants(participants.map(p => {
      if (p.id === id && !p.isCreator) {
        return { ...p, paid: !p.paid };
      }
      return p;
    }));
  };

  if (!isDataLoaded) return null;

  return (
    <ProvedorTema>
      <div className="min-h-screen transition-all duration-300 dark:bg-gray-900 bg-gray-50 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Cabecalho />
          
          <div className="mt-6 mb-8">
            <ConfiguracaoDivida
              config={debtConfig}
              setConfig={setDebtConfig}
              generateShareLink={updateUrlWithState}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            <div className="space-y-8 animate-fadeIn">
              <FormularioDespesa
                onAddExpense={handleAddExpense}
                participants={participants}
              />
              <ListaDespesas
                expenses={expenses}
                onRemoveExpense={handleRemoveExpense}
                totalExpenses={calculations.totalExpenses}
              />
            </div>

            <div className="animate-fadeIn">
              <PainelParticipantes
                participantsOwes={calculations.participantOwes}
                onAddParticipant={handleAddParticipant}
                onRemoveParticipant={handleRemoveParticipant}
                onTogglePaid={handleTogglePaid}
                sharePerPerson={calculations.sharePerPerson}
                creatorPix={debtConfig.creatorPix}
              />
            </div>

          </div>
        </div>
      </div>
    </ProvedorTema>
  );
}

export default App;
