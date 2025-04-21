import React, { createContext, useContext, useEffect, useState } from 'react';
import { readAllPlayers } from '../services/playerService';
import { readAllInstruments } from '../services/instrumentService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [instruments, setInstruments] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            const playersData = await readAllPlayers();
            setPlayers(playersData);
        };

        const fetchInstruments = async () => {
            const instrumentsData = await readAllInstruments();
            setInstruments(instrumentsData);
        };

        fetchPlayers();
        fetchInstruments();
    }, []);

    return (
        <DataContext.Provider value={{ players, setPlayers, instruments, setInstruments }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
