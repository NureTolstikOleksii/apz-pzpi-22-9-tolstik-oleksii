import React, { useEffect, useState } from 'react';
import styles from './StatsPage.module.css';
import { fetchClinicStats, fetchDoctorStats } from '../../services/statsService';
import { useTranslation } from 'react-i18next';

const StatsPage = () => {
    const { t } = useTranslation();
    const [clinicStats, setClinicStats] = useState(null);
    const [doctorStats, setDoctorStats] = useState([]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const clinic = await fetchClinicStats();
                const doctors = await fetchDoctorStats();
                setClinicStats(clinic.data);
                setDoctorStats(doctors.data);
            } catch (err) {
                console.error('Помилка завантаження статистики:', err);
            }
        };
        loadStats();
    }, []);

    return (
        <div className={styles.container}>
            {clinicStats && (
                <div className={styles.panel}>
                    <h2 className={styles.sectionTitle}>{t('stats.clinic_title')}</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.value}>{clinicStats.activePatients}</div>
                            <div className={styles.label}>{t('stats.active_patients')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.value}>{clinicStats.medicalStaff}</div>
                            <div className={styles.label}>{t('stats.medical_staff')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.value}>{clinicStats.treatmentPlans}</div>
                            <div className={styles.label}>{t('stats.treatment_plans')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.value}>{clinicStats.deviceTriggers}</div>
                            <div className={styles.label}>{t('stats.device_triggers')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.value}>{clinicStats.missedAppointments}</div>
                            <div className={styles.label}>{t('stats.missed_appointments')}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.panel}>
                <h3 className={styles.sectionTitle}>{t('stats.doctor_stats')}</h3>
                <div className={styles.doctorStats}>
                    {doctorStats.map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
