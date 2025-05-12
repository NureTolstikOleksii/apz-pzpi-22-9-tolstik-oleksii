import React, { useState } from 'react';
import styles from './AddStaffModal.module.css';
import MuiDatePicker from '../../components/DatePicker/MuiDatePicker';
import { useTranslation } from 'react-i18next';

const AddStaffModal = ({ onClose, onSave }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        last_name: '',
        first_name: '',
        patronymic: '',
        login: '',
        phone: '',
        specialization: '',
        shift: '',
        date_of_birth: null,
        role: '',
        contact_info: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const roleMap = {
            doctor: 1,
            nurse: 2,
        };

        const payload = {
            ...formData,
            role_id: roleMap[formData.role],
        };

        delete payload.role;

        onSave(payload);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>{t('staff.add_title')}</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <input name="last_name" placeholder={t('staff.last_name')} value={formData.last_name} onChange={handleChange} required />
                        <input name="first_name" placeholder={t('staff.first_name')} value={formData.first_name} onChange={handleChange} required />
                        <input name="patronymic" placeholder={t('staff.patronymic')} value={formData.patronymic} onChange={handleChange} />
                    </div>
                    <div className={styles.row}>
                        <MuiDatePicker
                            value={formData.date_of_birth}
                            onChange={(date) => setFormData((prev) => ({ ...prev, date_of_birth: date }))}
                            label={t('staff.date_of_birth')}
                        />
                        <input name="phone" placeholder={t('staff.phone')} value={formData.phone} onChange={handleChange} />
                        <input name="login" placeholder={t('staff.email')} type="email" value={formData.login} onChange={handleChange} required />
                    </div>
                    <div className={styles.row}>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="">{t('staff.role')}</option>
                            <option value="doctor">{t('staff.doctor')}</option>
                            <option value="nurse">{t('staff.nurse')}</option>
                        </select>
                        <input name="specialization" placeholder={t('staff.specialization')} value={formData.specialization} onChange={handleChange} />
                        <select name="shift" value={formData.shift} onChange={handleChange}>
                            <option value="">{t('staff.shift')}</option>
                            <option value="Денна">{t('staff.shift_day')}</option>
                            <option value="Нічна">{t('staff.shift_night')}</option>
                        </select>
                    </div>
                    <div className={styles.row}>
                        <input name="contact_info" placeholder={t('staff.address')} value={formData.contact_info} onChange={handleChange} />
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.submitButton}>{t('staff.confirm')}</button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>{t('staff.close')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffModal;
