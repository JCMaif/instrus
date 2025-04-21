import React, {useEffect, useState} from 'react';
import { useData } from '../../context/DataContext';
import { getAvailableInstruments} from "../../services/instrumentService.js";

const PupitreList = ({ onInstrumentSelect, selectedInstrumentId = "", filterPupitre = null }) => {
    const { instruments } = useData();
    const [availableInstruments, setAvailableInstruments] = useState([]);

    useEffect(() => {
        const fetchAvailableInstruments = async () => {
            const available = await getAvailableInstruments(instruments);
            const filtered = filterPupitre
                ? available.filter(instr => instr.pupitre === filterPupitre)
                : available;
            setAvailableInstruments(filtered);
        };

        fetchAvailableInstruments();
    }, [instruments, filterPupitre]);

    return (
        <div>
            <select
                value={selectedInstrumentId}
                onChange={(e) => onInstrumentSelect(e.target.value)}
            >
                <option value="">Sélectionnez un instrument</option>
                {availableInstruments.map(instrument => (
                    <option key={instrument.id} value={instrument.id}>{instrument.code}</option>
                ))}
            </select>
        </div>
    );
};

export default PupitreList;
