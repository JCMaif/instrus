import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import {FaEdit, FaPlus, FaTrash, FaSortAlphaDown  } from "react-icons/fa";
import {deletePlayer, readAllPlayers} from '../../services/playerService';
import PlayerForm from '../form/PlayerForm';

const initialPlayer = {
    firstname: '',
    lastname: '',
    nickname: '',
    pupitre: '',
    instrumentId: ''
};

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterPupitre, setFilterPupitre] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });


    const fetchPlayers = async () => {
        try {
            const playersList = await readAllPlayers();
            setPlayers(playersList);
        } catch (error) {
            console.error("Erreur lors du chargement des joueurs :", error);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const openModalForEdit = (player) => {
        setSelectedPlayer(player);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openModalForCreate = () => {
        setSelectedPlayer(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlayer(null);
    };

    const handleFormSubmit = async () => {
        closeModal();
        await fetchPlayers();
    };

    const handlePlayerChange = (newPlayerData) => {
        setSelectedPlayer(newPlayerData);
    };

    const handleDeletePlayer = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce joueur?")) {
            try {
                await deletePlayer(id);
                setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
            } catch (error) {
                console.error("Erreur suppression joueur:", error);
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

    const sortedPlayers = () => {
        if (!sortConfig.key) return players;

        return [...players].sort((a, b) => {
            if (sortConfig.key === 'instrument') {
                a = a.instrument ? a.instrument.code : '';
                b = b.instrument ? b.instrument.code : '';
            } else {
                a = a[sortConfig.key];
                b = b[sortConfig.key];
            }

            if (a < b) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a > b) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    };


    return (
        <div className="table-list">
            <table>
                <thead>
                <tr>
                    <th className="th-order" onClick={() => requestSort('firstname')}>Prénom <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('lastname')}>Nom <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('nickname')}>Surnom <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('pupitre')}>Pupitre <FaSortAlphaDown /></th>
                    <th className="th-order" onClick={() => requestSort('instrument')}>Instrument <FaSortAlphaDown /></th>
                    <th>Actions <button className="create-icon" onClick={openModalForCreate}><FaPlus/></button></th>
                </tr>
                </thead>
                <tbody>
                {sortedPlayers().map(player => (
                    <tr key={player.id}>
                        <td>{player.firstname}</td>
                        <td>{player.lastname}</td>
                        <td>{player.nickname}</td>
                        <td>{player.pupitre}</td>
                        <td>{player.instrument ? player.instrument.code : 'Aucun'}</td>
                        <td>
                            <button className="edit-icon" onClick={() => openModalForEdit(player)}><FaEdit/></button>
                            <button className="trash-icon" onClick={() => handleDeletePlayer(player.id)}><FaTrash/></button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Formulaire Joueur"
            >
                <h2>{selectedPlayer ? 'Modifier un joueur' : 'Créer un joueur'}</h2>
                <PlayerForm
                    player={selectedPlayer || initialPlayer}
                    onChange={handlePlayerChange}
                    onSubmit={handleFormSubmit}
                    onCancel={closeModal}
                    submitLabel={isEditing ? 'Mettre à jour' : 'Créer'}
                    isEditing={isEditing}
                    filterPupitre={filterPupitre}
                />
            </Modal>
        </div>
    );
};

export default PlayerList;
