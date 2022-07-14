import { TransactionEntity } from "types";
import React, {SyntheticEvent, useContext} from "react";
import {IdContext} from "../../contexts/id.context";
import {useNavigate} from "react-router-dom";
import "./SingleTransaction.css";

interface Props {
    data: TransactionEntity;
}


export const SingleTransaction = (props: Props)=>{
    const {setId} = useContext(IdContext);
    const navigate = useNavigate();

    const {data} = props;

    const setIdFromLocalState = (e: SyntheticEvent)=>{
        e.preventDefault();
        setId(data.id);
        navigate("/transaction");
    }

    return <div className="transaction">
        <h2>{new Date(data.date).toISOString().split('T')[0]}</h2>
        <p>{data.description}</p>
        {data.operation === "expense" ? <p><b>-{data.amount} zł</b></p> : <p><b>+{data.amount} zł</b></p>}
        <p>{data.operation}</p>
        <button onClick={setIdFromLocalState} >Edytuj</button>
        {/*<hr/>*/}
    </div>
}