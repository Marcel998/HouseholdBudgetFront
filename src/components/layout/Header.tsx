import React, {SyntheticEvent, useContext, useEffect, useState} from 'react';
import { Btn } from '../common/Btn';
import "./Header.css";
import {Link, useLocation} from "react-router-dom";

export const Header = () => {
    const [inputVal, setInputVal] = useState('');
    const location = useLocation();

    return (
        <header>
            <div className="headerWrapper">
                <h1>
                    <Link className="logo" to="/">
                        <strong>Budżet </strong>Domowy
                    </Link>
                </h1>
                {location.pathname === "/transaction" ? null : <Btn to="/transaction" text="Dodaj transakcję"/>}
            </div>
        </header>
    );
};