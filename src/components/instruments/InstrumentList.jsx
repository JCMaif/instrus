import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import ReactPaginate from "react-paginate";
import {FaEdit, FaPlus, FaTrash, FaSortAlphaDown} from "react-icons/fa";
import {useData} from "../../context/dataContext.jsx";
import {deleteInstrument, readAllInstruments} from "../../services/instrumentService.js";
import InstrumentForm from "../form/InstrumentForm.jsx";
import {readAllPlayers} from '../../services/playerService';
import PlayerForm from '../form/PlayerForm';

const initialInstrument = {
    code: '', hasLight: false, isFree: true, isSticked: true, observation: '', playerId: '', pupitre: ''
};

const InstrumentList = ({searchTerm}) => {
    const [players, setPlayers] = useState([]);
    const {instruments, setInstruments} = useData();
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const fetchInstruments = async () => {
        try {
            const instrumentList = await readAllInstruments();
            setInstruments(instrumentList)
        } catch (error) {
            console.error("Erreur lors du chargement des instruments: ", error);
        }
    };

    const fetchPlayers = async () => {
        try {
            const playersList = await readAllPlayers();
            setPlayers(playersList);
        } catch (error) {
            console.error("Erreur lors du chargement des joueurs :", error);
        }
    };

    useEffect(() => {
        fetchInstruments();
        fetchPlayers();
    }, []);

    const openModalForEdit = (instrument) => {
        setSelectedInstrument(instrument);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openModalForCreate = () => {
        setSelectedInstrument(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInstrument(null);
    };

    const handleFormSubmit = async () => {
        closeModal();
        await fetchInstruments()
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet instrument?")) {
            try {
                await deleteInstrument(id);
                setInstruments(prev => prev.filter(instru => instru.id !== id));
            } catch (e) {
                console.error("Erreur à la suppression", e);
            }
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const sortedInstruments = () => {
        const sorted = [...instruments].sort((a, b) => {
            let aValue, bValue;
            if (sortConfig.key === 'firstname') {
                aValue = players.find(p => p.id === a.playerId)?.firstname || '';
                bValue = players.find(p => p.id === b.playerId)?.firstname || '';
            } else {
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
            }

            if (typeof aValue === 'boolean') {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    const filteredInstruments = sortedInstruments().filter(instru => {
        const player = players.find(p => p.id === instru.playerId);
        const playerName = player?.firstname?.toLowerCase() || '';
        return (
            instru.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            playerName.includes(searchTerm.toLowerCase())
        );
    });

    const currentItems = filteredInstruments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="table-list">
            <table>
                <thead>
                <tr>
                    <th onClick={() => requestSort('code')}>Instrument <FaSortAlphaDown /></th>
                    <th onClick={() => requestSort('hasLight')}>Lumière <FaSortAlphaDown /></th>
                    <th onClick={() => requestSort('isFree')}>Disponible <FaSortAlphaDown /></th>
                    <th onClick={() => requestSort('pupitre')}>Pupitre <FaSortAlphaDown /></th>
                    <th onClick={() => requestSort('isSticked')}>Stické <FaSortAlphaDown /></th>
                    <th onClick={() => requestSort('observation')}>Observation</th>
                    <th onClick={() => requestSort('firstname')}>Prénom <FaSortAlphaDown /></th>
                    <th>Actions <button className="create-icon" onClick={openModalForCreate}><FaPlus /></button></th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(instru => {
                    const player = players.find(p => p.id === instru.playerId);
                    return (
                        <tr key={instru.id}>
                            <td>{instru.code}</td>
                            <td>{instru.hasLight ? 'Oui' : 'Non'}</td>
                            <td>{instru.isFree ? 'Oui' : 'Non'}</td>
                            <td>{instru.pupitre}</td>
                            <td>{instru.isSticked ? 'Oui' : 'Non'}</td>
                            <td>{instru.observation}</td>
                            <td>{player ? player.firstname : 'Aucun'}</td>
                            <td>
                                <button className="edit-icon" onClick={() => openModalForEdit(instru)}><FaEdit /></button>
                                <button className="trash-icon" onClick={() => handleDelete(instru.id)}><FaTrash /></button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredInstruments.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(e) => setCurrentPage(e.selected)}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Formulaire Instrument"
            >
                <h2>{selectedInstrument ? 'Modifier un instrument' : 'Créer un instrument'}</h2>
                <InstrumentForm
                    instrument={selectedInstrument || initialInstrument}
                    onChange={setSelectedInstrument}
                    onSubmit={handleFormSubmit}
                    onCancel={closeModal}
                    submitLabel={isEditing ? 'Mettre à jour' : 'Créer'}
                    isEditing={isEditing}
                />
            </Modal>
        </div>
    );
};

export default InstrumentList;
