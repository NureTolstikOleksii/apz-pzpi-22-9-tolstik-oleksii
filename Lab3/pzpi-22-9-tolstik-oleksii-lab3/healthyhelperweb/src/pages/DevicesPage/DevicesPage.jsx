import React, { useEffect, useState } from 'react';
import styles from './DevicesPage.module.css';
import { fetchContainerStats, fetchLatestFillings, fetchTotalContainers } from '../../services/containerService';
import { FaFileExport } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const DevicesPage = () => {
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [fillings, setFillings] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [statsRes, totalRes] = await Promise.all([
                    fetchContainerStats(),
                    fetchTotalContainers()
                ]);
                setActiveCount(statsRes.data.activeCount);
                setInactiveCount(statsRes.data.inactiveCount);
                setTotalCount(totalRes.data.count);
            } catch (err) {
                console.error('Помилка при завантаженні статистики:', err);
            }
        };

        const loadFillings = async () => {
            try {
                const res = await fetchLatestFillings();
                setFillings(res.data);
            } catch (err) {
                console.error('Помилка при завантаженні заповнень:', err);
            }
        };

        loadStats();
        loadFillings();
    }, []);

    const handleExport = async () => {
        try {
            const response = await axios.get('/containers/export', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'containers-report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Помилка експорту:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.card}>
                    <p className={styles.label}>{t('devices.active')}</p>
                    <h2 className={styles.count}>{activeCount}</h2>
                </div>
                <div className={styles.card}>
                    <p className={styles.label}>{t('devices.inactive')}</p>
                    <h2 className={styles.count}>{inactiveCount}</h2>
                </div>
                <div className={styles.card}>
                    <p className={styles.label}>{t('devices.total')}</p>
                    <h2 className={styles.count}>{totalCount}</h2>
                </div>
                <button className={styles.exportBtn} onClick={handleExport}>
                    <FaFileExport className={styles.icon} />
                    {t('devices.export')}
                </button>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>{t('devices.latest_fillings')}</h3>
                <ul className={styles.logList}>
                    {fillings.map((item, index) => (
                        <li key={index}>
                            {t('devices.device')} №{item.device_code} — {t('devices.filled_at')} {item.time} — {item.filled_by}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DevicesPage;
