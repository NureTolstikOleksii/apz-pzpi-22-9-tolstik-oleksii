import React, { useState } from 'react';
import styles from './AddPatientModal.module.css';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import enUS from 'date-fns/locale/en-US';
import 'react-datepicker/dist/react-datepicker.css';
import './DatepickerCustom.css';
import { updatePatient } from '../../services/patientService';
import MuiDatePicker from '../DatePicker/MuiDatePicker.jsx'; // шлях змінити відповідно до структури


registerLocale('uk', uk);
registerLocale('en', enUS);

const EditPatientModal = ({ onClose, patient, setPatient }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    const [formData, setFormData] = useState({
        last_name: patient.last_name || patient.name?.split(' ')[0] || '',
        first_name: patient.first_name || patient.name?.split(' ')[1] || '',
        patronymic: patient.patronymic || patient.name?.split(' ')[2] || '',
        login: patient.login || patient.email || '',
        phone: patient.phone || '',
        contact_info: patient.address || '',
        birth_date: patient.date_of_birth
            ? new Date(patient.birth_date)
            : patient.dob
                ? new Date(patient.dob)
                : null,
    });

    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, birth_date: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setLoading(true);

        if (!formData.last_name || !formData.first_name || !formData.login) {
            setFormError(t('patient_form.errors.required'));
            setLoading(false);
            return;
        }

        try {
            const result = await updatePatient(Number(patient.id || patient.user_id), {
                ...formData,
                birth_date: formData.birth_date
                    ? formData.birth_date.toISOString().split('T')[0]
                    : null
            });

            setPatient(result.user);
            alert(t('patient_form.updated_successfully'));
            onClose();
        } catch (err) {
            setFormError(t('patient_form.errors.update_failed'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const phonePlaceholder = currentLang === 'uk' ? '+38 (0...)...' : '+1 (___) ___-____';

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>{t('patient_form.edit_title')}</h3>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.row}>
                        <input
                            type="text"
                            name="last_name"
                            placeholder={t('patient_form.last_name')}
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="first_name"
                            placeholder={t('patient_form.first_name')}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="patronymic"
                            placeholder={t('patient_form.patronymic')}
                            value={formData.patronymic}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.row}>
                        <MuiDatePicker
                            value={formData.birth_date}
                            onChange={handleDateChange}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder={phonePlaceholder}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="login"
                            placeholder={t('patient_form.email')}
                            value={formData.login}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="text"
                            name="contact_info"
                            placeholder={t('patient_form.address')}
                            value={formData.contact_info}
                            onChange={handleChange}
                        />
                    </div>

                    {formError && <div className={styles.errorMessage}>{formError}</div>}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.confirm} disabled={loading}>
                            {loading ? t('loading') : t('patient_form.save_changes')}
                        </button>
                        <button type="button" className={styles.cancel} onClick={onClose}>
                            {t('patient_form.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPatientModal;
