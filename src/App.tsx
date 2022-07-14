import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import {TransactionForm} from "./components/transactionForm/TransactionForm";
import {TransactionsList} from "./components/TransactionsList/TransactionsList";
import {Header} from "./components/layout/Header";
import { IdContext } from './contexts/id.context';

export const App = () => {
    const [id, setId] = useState('');

    return (
      <IdContext.Provider value={{id, setId}}>
          <Header/>
          <Routes>
              <Route path="/" element={<TransactionsList/>}/>
              <Route path="/transaction" element={<TransactionForm/>} />
          </Routes>
      </IdContext.Provider>
  );
};
