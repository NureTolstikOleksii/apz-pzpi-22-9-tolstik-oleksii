import React from 'react';
import styles from './StaffPage.module.css';
import { useTranslation } from 'react-i18next';

const StaffSearchBar = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder={t('staff.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
            >
                <option value="last_name">{t('staff.sort_by_last_name')}</option>
                <option value="first_name">{t('staff.sort_by_first_name')}</option>
                <option value="role">{t('staff.sort_by_role')}</option>
            </select>
        </div>
    );
};

export default StaffSearchBar;
