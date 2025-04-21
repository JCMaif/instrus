import FirestoreService from "./firestoreService";

const instrumentService = new FirestoreService("instruments");

// Vérifier l'unicité du code
export const isCodeUnique = async (code) => {
    try {
        const instruments = await instrumentService.readAll();
        return !instruments.some(instrument => instrument.code === code);
    } catch (error) {
        console.error("Error checking code uniqueness:", error);
        throw error;
    }
};

// Créer un instrument
export const createInstrument = async (instrumentData) => {
        if (!await isCodeUnique(instrumentData.code)) {
            console.error("Code instrument already exists");
            return;
        }
        try {
            const instrumentId = await instrumentService.create(instrumentData);
            console.log("Instrument created with ID:", instrumentId);
            return instrumentId;
        } catch (error) {
            console.error("Error creating instrument:", error);
            throw error;
        }

    }
;

// Lire un instrument
export const readInstrument = async (instrumentId) => {
    try {
        const instrumentData = await instrumentService.read(instrumentId);
        console.log("Instrument data:", instrumentData);
        return instrumentData;
    } catch (error) {
        console.error("Error reading instrument:", error);
        throw error;
    }
};

// Lire tous les instruments
export const readAllInstruments = async () => {
    try {
        const instruments = await instrumentService.readAll();
        return instruments;
    } catch (error) {
        console.error("Error reading instruments:", error);
        throw error;
    }
};

// Mettre à jour un instrument
export const updateInstrument = async (instrumentId, instrumentData) => {
    try {
        await instrumentService.update(instrumentId, instrumentData);
        console.log("Instrument updated");
    } catch (error) {
        console.error("Error updating instrument:", error);
        throw error;
    }
};

// Supprimer un instrument
export const deleteInstrument = async (instrumentId) => {
    try {
        await instrumentService.delete(instrumentId);
        console.log("Instrument deleted");
    } catch (error) {
        console.error("Error deleting instrument:", error);
        throw error;
    }
};

// Obtenir tous les instruments libres
export const getAvailableInstruments = async () => {
    try {
        const instruments = await readAllInstruments();
        return instruments.filter(instrument => instrument.isFree);
    } catch (error) {
        console.error("Error getting available instruments:", error);
        throw error;
    }
};

// Obtenir le code d'un instrument à partir de son ID
export const getInstrumentCode = (instruments, instrumentId) => {
    const instrument = instruments.find(instr => instr.id === instrumentId);
    return instrument ? instrument.code : '';
};

// Liberer un instrument
export const setFreeInstrument = async (instrumentId) => {
    try {
        const instrumentToFree = await readInstrument(instrumentId);
        await updateInstrument(instrumentId, {...instrumentToFree, isFree: true, playerId: null});
        console.log("Instrument libéré");
    } catch (error) {
        console.error("Error setting free instrument:", error);
        throw error;
    }
};

// Affecter un instrument
export const setTiedInstrument = async (instrumentId, playerId) => {
    try {
        const instrumentToTye = await readInstrument(instrumentId);
        await updateInstrument(instrumentId, {
            ...instrumentToTye,
            isFree: false,
            playerId: playerId
        });
        console.log("Instrument affecté au joueur", playerId);
    } catch (error) {
        console.error("Error affecting instrument : ", error);
        throw error;
    }
}
