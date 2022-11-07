import {Btn} from "../common/Btn";
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {apiUrl} from "../../config/api";
import {IdContext} from "../../contexts/id.context";
import "./TransactionForm.css";

export const TransactionForm = ()=>{
    const {id:idContext, setId: setIdContext} = useContext(IdContext);
    const [loading, setLoading] = useState(false);
    const [newId, setNewId] = useState('');
    const [updatedRows, setUpdatedRows] = useState(0);
    const [validationError, setValidationError] = useState({
        operation: false,
        date: false,
        amount: false,
        description: false,
    });
    const [form, setForm] = useState({
        id: '',
        operation: 'expense',
        date: '',
        amount: '',
        description: '',
    });

    useEffect(()=> {

        if (idContext) {
            setLoading(true);

            (async ()=>{
                try{
                    const res = await fetch(`${apiUrl}/transaction/${idContext}`);

                    const data = await res.json();

                    setForm({
                        ...data,
                        date: data.date.split('T')[0]
                    });


                } finally {
                    setIdContext("");
                    setLoading(false);
                }
            })();
        }else{
            const today = new Date().toISOString().split('T')[0];
            updateForm('date',today);
        }

    },[]);


    const checkValidation = (key: string, value: string): void =>{

        const validationResult =(key: string, value: string): boolean => {
            if(key === "date") return Boolean(value);
            if(key === "amount") return Boolean(Number(value) > 0 && Number(value) < 1000000)
            if(key === "description") return Boolean(value.length < 101);
            else return true;
        }

        setValidationError(prevState => {
            return {
                ...prevState,
                [key]: !validationResult(key, value)
            }
        });

    }

    const updateForm = (key: string, value: string)=>{
        !( key === "amount" && value.indexOf(".") !== -1 && (value.length - (value.indexOf(".") + 1) > 2) )
        && setForm(prevState => {
            return {
                ...prevState,
                [key]: value,
            }
        });

        checkValidation(key, value);
    };

    const saveTransaction = async (e: SyntheticEvent) =>{
        e.preventDefault();



        if((Object.values(validationError).findIndex(element => element === true)) !== -1){
            return;
        }

        setLoading(true);

        try{

            if(form.id){
                const res = await fetch(`${apiUrl}/transaction`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...form,
                        date: new Date(form.date),
                    }),
                });

                const updatedRows = await res.json();
                setUpdatedRows(updatedRows);

            }else{
                const res = await fetch(`${apiUrl}/transaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...form,
                        date: new Date(form.date),
                    }),
                });
                const data = await res.json();
                setNewId(data.id);
            }



        } finally {
            setForm({
                id: '',
                operation: 'expense',
                date: new Date().toISOString().split('T')[0],
                amount: '',
                description: '',
            })
            setLoading(false);
        }
    };

    const confirm = (e: SyntheticEvent) =>{
        e.preventDefault();
        newId ? setNewId('') : setUpdatedRows(0);
    }

    if (loading) {
        return <h2 className="transactionForm">Proszę czekać...</h2>;
    }

    if (newId) {
        return (
            <div className="transactionForm">
                <h2>
                    Twoja transakcja została pomyślnie dodana.
                </h2>
                <button onClick={confirm}>OK</button>
            </div>
        );
    }

    if (updatedRows){
        return (
            <div className="transactionForm">
                <h2>
                    Zaktualizowano transakcję.
                </h2>
                <Btn text={"OK"} to={"/"}/>
            </div>
        )
    }


    return (
        <div className="transactionForm">
        <form onSubmit={saveTransaction} >

            <p>
                <label>
                    Operacja: <br/>
                    <select name="operation" value={form.operation} onChange={e=>updateForm(e.target.name, e.target.value)}>
                        <option value="income">Przychód</option>
                        <option value="expense">Wydatek</option>
                    </select>
                    {validationError.operation && <p>Niepoprawna operacja</p>}
                </label>
            </p>

            <br/>

            <p>
                <label>Data: <br/>
                    <input type="date" name="date" value={form.date} onChange={e=>updateForm(e.target.name, e.target.value)}/>
                    {validationError.date && <p>Data nie może być pusta</p>}
                </label>
            </p>

            <br/>

            <p>
                <label>Kwota: <br/>
                    <input type="number" step={0.01} name="amount" value={form.amount} placeholder="Wpisz kwotę" onChange={e=>updateForm(e.target.name, e.target.value)}/>
                    {validationError.amount && <p>Kwota musi być większa niż 0 oraz mniejsza niż 1000000</p>}
                </label>
            </p>

            <br/>

            <p>
                <label>Opis: <br/>
                    <textarea name="description" cols={30} rows={10} value={form.description} onChange={e=>updateForm(e.target.name, e.target.value)}></textarea>
                    {validationError.description && <p>Opis nie może przekraczać 100 znaków.</p>}
                </label>
            </p>

            <br/>

            <Btn text={form.id? "Zaktualizuj" : "Zapisz"}/>
        </form>
        </div>
    )
}