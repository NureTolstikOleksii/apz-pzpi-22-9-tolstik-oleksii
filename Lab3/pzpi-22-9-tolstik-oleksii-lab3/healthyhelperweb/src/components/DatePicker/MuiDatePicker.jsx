import React from 'react';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import uk from 'date-fns/locale/uk';
import enUS from 'date-fns/locale/en-US';
import { useTranslation } from 'react-i18next';

const MuiDatePicker = ({ value, onChange }) => {
    const { i18n } = useTranslation();
    const locale = i18n.language === 'uk' ? uk : enUS;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
            <DatePicker
                value={value}
                onChange={onChange}
                format="dd.MM.yyyy"
                slotProps={{
                    textField: {
                        placeholder: i18n.language === 'uk' ? 'дд.мм.рррр' : 'dd.mm.yyyy',
                        size: 'small',
                        variant: 'outlined',
                        sx: {
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            minWidth: '160px'
                        }
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default MuiDatePicker;
