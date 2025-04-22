import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import ReactPaginate from "react-paginate";
import { FaEdit, FaPlus, FaTrash, FaSortAlphaDown } from "react-icons/fa";
import { useData } from "../../context/dataContext.jsx";
import {deleteInstrument, readAllInstruments} from "../../services/instrumentService.js";
import InstrumentForm from "../form/InstrumentForm.jsx";

const initialInstrument = {
    code: '',
    hasLight: false,
    isFree: true,
    isSticked: true,
    observation: '',
    playerId: '',
    pupitre: ''
};

const InstrumentList = ({ searchTerm}) => {
    const { instruments, setInstruments } = useData();
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
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

    useEffect(() => {
        fetchInstruments()
    }, []);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

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

    const handleInstrumentChange = (newInstrumentData) => {
        setSelectedInstrument(newInstrumentData);
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
        setSortConfig({ key, direction });
    };

    const sortedItems = () => {
        if (!sortConfig.key) return instruments;

        return [...instruments].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (typeof aValue === 'boolean') {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    };

    const filteredInstruments = sortedItems().filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentItems = filteredInstruments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="table-list">
            <table>
                <thead>
                <tr>
                    <th className="th-order" onClick={() => requestSort('code')}>Instrument <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('hasLight')}>Lumière <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('isFree')}>Disponible <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('pupitre')}>Pupitre <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('isSticked')}>Stické <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('observation')}>Observation</th>
                    <th>Actions <button className="create-icon" onClick={openModalForCreate}><FaPlus /></button></th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(instrument => (
                    <tr key={instrument.id}>
                        <td>{instrument.code}</td>
                        <td>{instrument.hasLight ? 'Oui' : 'Non'}</td>
                        <td>{instrument.isFree ? 'Oui' : 'Non'}</td>
                        <td>{instrument.pupitre}</td>
                        <td>{instrument.isSticked ? 'Oui' : 'Non'}</td>
                        <td>{instrument.observation}</td>
                        <td>
                            <button className="edit-icon" onClick={() => openModalForEdit(instrument)}><FaEdit /></button>
                            <button className="trash-icon" onClick={() => handleDelete(instrument.id)}><FaTrash /></button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredInstruments.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
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
                    onChange={handleInstrumentChange}
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
