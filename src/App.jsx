import {BrowserRouter, Routes, Route} from "react-router-dom";
import Modal from 'react-modal';
import {Auth} from './components/auth/Auth'

import PlayerList from "./components/players/PlayerList.jsx";
import InstrumentList from "./components/instruments/InstrumentList.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import {DataProvider} from "./context/dataContext.jsx";


const App = () => {
    Modal.setAppElement('#root');

    return (
        <DataProvider>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/login" element={<Auth/>}/>
                    <Route path="/players" element={<PlayerList/>}/>
                    <Route path="/instruments" element={<InstrumentList/>}/>
                    {/*<Route path="/tripods" element={<TripodList />} />*/}
                    {/*<Route path="/loans" element={<LoanList />} />*/}
                </Routes>
            </BrowserRouter>
        </DataProvider>
    );
};

export default App;

