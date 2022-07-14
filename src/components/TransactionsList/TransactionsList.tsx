import React, {useEffect, useState} from "react";
import {apiUrl} from "../../config/api";
import {TransactionEntity} from 'types';
import {SingleTransaction} from "./SingleTransaction";

export const TransactionsList = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionEntity[]>([]);


    useEffect(()=>{
        (async ()=>{
            try{
                const res = await fetch(`${apiUrl}/transaction`);

                const data = await res.json();
                setTransactions(data);

            } finally {
                setLoading(false);
            }
        })()
    },[]);

    if (loading) {
        return <h2>Trwa pobieranie transakcji...</h2>;
    }


    return (
        <>
            <h1>Transakcje</h1>
            {
                transactions.map(transaction=>(
                    <SingleTransaction key={transaction.id} data={transaction}/>
                ))
            }
        </>
    )
}

