import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  // Ajout de l'état pour stocker la dernière prestation
  const [last, setLast] = useState(null);

  const getData = useCallback(async () => {
    try {
      const eventData = await api.loadData();
      setData(eventData); // Mettre a jour l'état 'data'
      // Déterminez la dernière prestation à partir des données des événements
      setLast(eventData.events[eventData.events.length - 1])
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last, // Ajout de last dans les valeurs fournies par le contexte de données
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
