import React, {useState} from 'react';
import styles from './PatientsPage.module.css';
import PatientsHeader from './PatientsHeader';
import PatientsContent from './PatientsContent.jsx';
import AddPatientModal from '../../components/Patients/AddPatientModal';
import {useAuth} from "../../context/AuthContext.jsx";

const PatientsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const role = user?.role;

    return (
        <div className={styles.wrapper}>
            <PatientsHeader
                onAdd={() => setShowModal(true)}
                role={role}
            />
            {showModal &&
                <AddPatientModal
                    onClose={() => setShowModal(false)}
                />
            }
            <PatientsContent />
        </div>
    );
};

export default PatientsPage;
