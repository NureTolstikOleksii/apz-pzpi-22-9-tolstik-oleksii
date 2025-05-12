import React, { useState } from 'react';
import styles from './AddPatientModal.module.css';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import enUS from 'date-fns/locale/en-US';
import 'react-datepicker/dist/react-datepicker.css';
import './DatepickerCustom.css';
import CustomDateInput from "../Input/CustomDateInput.jsx";
import { createPatient } from '../../services/patientService';

registerLocale('uk', uk);
registerLocale('en', enUS);

const AddPatientModal = ({ onClose }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    const [formData, setFormData] = useState({
        last_name: '',
        first_name: '',
        patronymic: '',
        email: '',
        phone: '',
        address: '',
        birth_date: null,
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

        if (!formData.last_name || !formData.first_name || !formData.email) {
            setFormError(t('patient_form.errors.required'));
            setLoading(false);
            return;
        }

        try {
            await createPatient({
                ...formData,
                birth_date: formData.birth_date?.toISOString(),
            });
            onClose(); // закрити модалку після успішного створення
        } catch (err) {
            setFormError(t('patient_form.errors.creation_failed'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const phonePlaceholder = currentLang === 'uk' ? '+38 (0...)...' : '+1 (___) ___-____';

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>{t('patient_form.title')}</h3>
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
                        <DatePicker
                            selected={formData.birth_date}
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy"
                            placeholderText={t('patient_form.birth_date')}
                            locale={currentLang}
                            customInput={<CustomDateInput />}
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
                            name="email"
                            placeholder={t('patient_form.email')}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="text"
                            name="address"
                            placeholder={t('patient_form.address')}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Виведення загальної помилки */}
                    {formError && <div className={styles.errorMessage}>{formError}</div>}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.confirm} disabled={loading}>
                            {loading ? t('loading') : t('patient_form.confirm')}
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

export default AddPatientModal;
