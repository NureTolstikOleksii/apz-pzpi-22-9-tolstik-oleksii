import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from './DatePickerWithIcon.module.css';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import enUS from 'date-fns/locale/en-US';
import { useTranslation } from 'react-i18next';

registerLocale('uk', uk);
registerLocale('en', enUS);

const DatePickerWithIcon = ({ selectedDate, onChange }) => {
    const { i18n } = useTranslation();

    return (
        <div className={styles.container}>
            <FaCalendarAlt className={styles.icon} />
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                locale={i18n.language === 'uk' ? 'uk' : 'en'}
                dateFormat="dd.MM.yyyy"
                placeholderText="11.11.2004"
                className={styles.input}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
            />
        </div>
    );
};

export default DatePickerWithIcon;
