import React from 'react';
import styles from '../PatientDetailsPage.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const YearSelector = ({ selectedYear, onChange }) => {
    const handlePrev = () => onChange(selectedYear - 1);
    const handleNext = () => onChange(selectedYear + 1);

    return (
        <div className={styles.yearSelector}>
            <button onClick={handlePrev} className={styles.yearButton}>
                <FaChevronLeft />
            </button>
            <span className={styles.yearText}>{selectedYear}</span>
            <button onClick={handleNext} className={styles.yearButton}>
                <FaChevronRight />
            </button>
        </div>
    );
};

export default YearSelector;
