import React, { useRef, useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import { useTranslation } from 'react-i18next';
import { MdEdit } from 'react-icons/md';
import {
    getProfile,
    uploadAvatar,
    changePassword,
    updateProfile
} from '../../services/profileService';
import { useAuth } from '../../context/AuthContext.jsx';
import ChangePasswordModal from '../../components/ChangePassword/ChangePasswordModal.jsx';
import defaultAvatar from '../../assets/default_avatar.svg';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState({});
    const isAdmin = user?.role === 'admin';

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleEditClick = () => fileInputRef.current.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const res = await uploadAvatar(file);
                setProfileData(prev => ({ ...prev, avatar: res.avatar }));
                setUser(prev => {
                    const updated = { ...prev, avatar: res.avatar };
                    localStorage.setItem('user', JSON.stringify(updated));
                    return updated;
                });
            } catch (err) {
                console.error('Помилка при завантаженні аватару:', err);
            }
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;
        const newErrors = {};
        if (!currentPassword) newErrors.currentPassword = t('profile.required');
        if (!newPassword) newErrors.newPassword = t('profile.required');
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = t('profile.passwords_do_not_match');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword });
            alert(t('profile.password_changed_successfully'));
            setIsModalOpen(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});
        } catch (err) {
            console.error('Помилка при зміні паролю:', err);
            setErrors({ currentPassword: t('profile.password_change_error') });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedUser = await updateProfile(profileData);

            const normalizedUser = {
                ...user,
                avatar: updatedUser.avatar,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                patronymic: updatedUser.patronymic,
                phone: updatedUser.phone,
                login: updatedUser.login,
                contact_info: updatedUser.contact_info
            };

            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));

            alert(t('profile.saved_successfully'));
        } catch (err) {
            console.error('Помилка при збереженні профілю:', err);
            alert(t('profile.save_error'));
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfileData(data);
            } catch (err) {
                console.error('Помилка завантаження профілю:', err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <>
            <h2 className={styles.title}>{t('profile.title')}</h2>
            <div className={styles.formRow}>
                <div className={styles.fields}>
                    <div className={styles.inputGroup}>
                        <label>{t('profile.last_name')}</label>
                        <input
                            type="text"
                            name="last_name"
                            value={profileData?.last_name || ''}
                            onChange={handleInputChange}
                            readOnly={!isAdmin}
                            className={`${styles.inputGroupInput} ${!isAdmin ? styles.disabledInput : styles.editableInput}`}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t('profile.first_name')}</label>
                        <input
                            type="text"
                            name="first_name"
                            value={profileData?.first_name || ''}
                            onChange={handleInputChange}
                            readOnly={!isAdmin}
                            className={`${styles.inputGroupInput} ${!isAdmin ? styles.disabledInput : styles.editableInput}`}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t('profile.patronymic')}</label>
                        <input
                            type="text"
                            name="patronymic"
                            value={profileData?.patronymic || ''}
                            onChange={handleInputChange}
                            readOnly={!isAdmin}
                            className={`${styles.inputGroupInput} ${!isAdmin ? styles.disabledInput : styles.editableInput}`}
                        />
                    </div>

                    {!isAdmin && (
                        <div className={styles.inputGroup}>
                            <label>{t('profile.specialization')}</label>
                            <input
                                type="text"
                                value={profileData?.medical_staff?.specialization || ''}
                                readOnly
                                className={styles.disabledInput}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>{t('profile.phone')}</label>
                        <input
                            type="text"
                            name="phone"
                            value={profileData?.phone || ''}
                            onChange={handleInputChange}
                            readOnly={!isAdmin}
                            className={`${styles.inputGroupInput} ${!isAdmin ? styles.disabledInput : styles.editableInput}`}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t('profile.email_field')}</label>
                        <input
                            type="email"
                            name="login"
                            value={profileData?.login || ''}
                            onChange={handleInputChange}
                            readOnly={!isAdmin}
                            className={`${styles.inputGroupInput} ${!isAdmin ? styles.disabledInput : styles.editableInput}`}
                        />
                    </div>
                    {isAdmin && (
                        <div className={styles.inputGroup}>
                            <label>{t('profile.role')} {t('profile.no-edit')}</label>
                            <input
                                type="text"
                                name="role"
                                value={t('profile.admin')}
                                className={styles.disabledInput}
                                readOnly
                            />
                        </div>
                    )}
                    <div className={styles.inputGroupAddress}>
                        <label>{t('profile.address')}</label>
                        <input
                            type="text"
                            name="contact_info"
                            value={profileData?.contact_info || ''}
                            onChange={handleInputChange}
                            readOnly={!isAdmin}
                            className={`${styles.inputGroupInput} ${!isAdmin ? styles.disabledInput : styles.editableInput}`}
                        />
                    </div>
                    {isAdmin && (
                        <button className={styles.saveButton} onClick={handleSave}>
                            {t('profile.save_changes')}
                        </button>
                    )}
                </div>

                <div className={styles.photoBlock}>
                    <img
                        src={profileData?.avatar || defaultAvatar}
                        alt="User avatar"
                        className={styles.avatar}
                    />
                    <button className={styles.editPhoto} onClick={handleEditClick}>
                        <MdEdit className={styles.editIcon} />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    <button className={styles.saveButton} onClick={() => setIsModalOpen(true)}>
                        {t('profile.change_password')}
                    </button>

                </div>
            </div>

            {isModalOpen && (
                <ChangePasswordModal
                    passwordForm={passwordForm}
                    onChange={handlePasswordChange}
                    onSubmit={handlePasswordSubmit}
                    onClose={() => {
                        setIsModalOpen(false);
                        setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        });
                        setErrors({});
                    }}
                    errors={errors}
                />
            )}
        </>
    );
};

export default ProfilePage;
