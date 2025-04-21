import React from 'react';
import { createInstrument, updateInstrument } from "../../services/instrumentService.js";

const InstrumentForm = ({ instrument, onChange, onSubmit, onCancel, submitLabel, isEditing }) => {

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const instrumentToSave = {
                code: instrument.code,
                hasLight: instrument.hasLight,
                isFree: instrument.isFree,
                isSticked: instrument.isSticked,
                observation: instrument.observation,
                pupitre: instrument.pupitre
            };

            if (isEditing) {
                await updateInstrument(instrument.id, instrumentToSave);
            } else {
                await createInstrument(instrumentToSave);
            }
            onSubmit();
        } catch (error) {
            console.error("Erreur lors de la soumission du formulaire : ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulaire">
            <input
                type="text"
                placeholder="Code"
                value={instrument.code || ''}
                onChange={(e) => onChange({ ...instrument, code: e.target.value })}
                required
            />
            <label>
                <input
                    type="checkbox"
                    checked={instrument.hasLight}
                    onChange={(e) => onChange({ ...instrument, hasLight: e.target.checked })}
                /> Lumière
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={instrument.isFree}
                    onChange={(e) => onChange({ ...instrument, isFree: e.target.checked })}
                /> Disponible
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={instrument.isSticked}
                    onChange={(e) => onChange({ ...instrument, isSticked: e.target.checked })}
                /> Stické
            </label>
            <input
                type="text"
                placeholder="Observation"
                value={instrument.observation || ''}
                onChange={(e) => onChange({ ...instrument, observation: e.target.value })}
            />
            <select
                value={instrument.pupitre || ''}
                onChange={(e) => onChange({ ...instrument, pupitre: e.target.value })}
            >
                <option value=''>Sélectionnez un pupitre</option>
                <option value="Caixa">Caixa</option>
                <option value="Dobra">Dobra</option>
                <option value="Basse 1">Basse 1</option>
                <option value="Basse 2">Basse 2</option>
                <option value="Repinique">Répinique</option>
            </select>
            <div className="form-actions">
                <button type="submit">{submitLabel}</button>
                <button type="button" onClick={onCancel}>Annuler</button>
            </div>
        </form>
    );
};

export default InstrumentForm;
