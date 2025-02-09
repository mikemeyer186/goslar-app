import { Routes, Route, useNavigate } from 'react-router-dom';
import Overview from './components/overview';
import Imprint from './components/imprint';
import DataProtection from './components/dataprotection';

export default function App() {
    const navigate = useNavigate();

    function closeModal(modal: string) {
        document.body.classList.remove('overflow-hidden');
        if (modal) {
            navigate('/');
        }
    }

    return (
        <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="imprint" element={<Imprint closeModal={closeModal} />} />
            <Route path="dataprotection" element={<DataProtection closeModal={closeModal} />} />
        </Routes>
    );
}
