import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Button, TextField, Avatar, Typography, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { urlGetEmail, urlUpdateMemberData, urlGetAvatarByEmail, urlUpdatePassword } from '../../endpoint';
import styles from './backgroundPic.module.css';
import { useProfile } from './useProfile';
import { useAuth } from '../../components/AuthContext';
import { Link } from 'react-router-dom'; // Removed `useParams` as it is not used

interface Profile {
  userName: string;
  email: string;
  profileImage: string | null;
  profileImageFile?: File | null;
}

const EditProfileCard: React.FC = () => {
  const { profile, setProfile } = useProfile(); // Get profile and setProfile from context
  const { logout, email } = useAuth(); //get email using useAuth 

  const [localProfile, setLocalProfile] = useState<Profile>({
    userName: '',
    email: '',
    profileImage: null,
    profileImageFile: null,
  });

  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [prevPassword, setPrevPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Fixed useEffect dependencies and the logic for initial load
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  const loadData = async () => {
    try {
      const response = await axios.get(`${urlGetEmail}/${email}`);
      console.log("Response: ", response.data.password);
      setPrevPassword(response.data.password);

      if (response.data) {
        const avatarUrl = getImageUrl(email); // Fetch avatar URL
        const updatedProfile = {
          userName: response.data.userName,
          email: response.data.email,
          profileImage: avatarUrl || null,
        };
        setProfile(updatedProfile); // Update profile context
        setLocalProfile(updatedProfile); // Update local state
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('UserName', localProfile.userName);
      formData.append('Email', localProfile.email);

      if (localProfile.profileImageFile) {
        formData.append('Avatar', localProfile.profileImageFile);
      }

      const response = await axios.post(urlUpdateMemberData, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("Response: ", response);

      if (localProfile.profileImageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedProfile = {
            ...localProfile,
            profileImage: reader.result as string,
          };
          setProfile(updatedProfile); // Update profile context
          setLocalProfile(updatedProfile); // Update local state
        };
        reader.readAsDataURL(localProfile.profileImageFile);
      } else {
        setProfile(localProfile); // Update profile context
      }
    } catch (err) {
      console.error("Error updating data", err);
    }
  };

  const isClicked = () => {
    setChangePassword(true);
  };

  const handleChangePassword = async () => {
    console.log("Previous Password: ", prevPassword);
    if (currentPassword !== prevPassword) {
      alert('Invalid Current Password!');
      return;
    }
    else if(currentPassword == null) {
      alert("Please type Current Password!")
    }
    else if(newPassword == null) {
      alert("Please type New Password!")
    }
    else if(confirmPassword == null) {
      alert("Please type Confirm Password!")
    }
    else if (currentPassword === newPassword) {
      alert('You cannot use your old password in the New Password field!');
      return;
    } else if (newPassword !== confirmPassword) {
      alert('New Password and Confirm Password do not match!');
      return;
    }

    try {
      const response = await axios.post(urlUpdatePassword, {
        email: localProfile.email,
        password: confirmPassword,
      });
      console.log("Update Password: ", response.data);
      alert("Password changed successfully");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Error changing password", err);
      alert("An error occurred while changing the password.");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({
          ...localProfile,
          profileImage: reader.result as string,
          profileImageFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = (email: string) => { // Changed 'any' to 'string' for better type safety
    return `${urlGetAvatarByEmail}/${email}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile({ ...localProfile, [name]: value });
  };

  return (
    <div className={styles.backgroundPic}>
      <Box sx={{ width: 400, height: 'auto', margin: 'auto', padding: 2, border: '1px inset black', backgroundColor: 'transparent', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ cursor: 'pointer', mb: 2 }}>
            <input
              accept=".jpg,.jpeg,.png"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="profile-image-input"
            />
            <label htmlFor="profile-image-input">
              {localProfile.profileImage ? (
                <Avatar src={localProfile.profileImage} sx={{ width: 200, height: 200 }} />
              ) : (
                <Box sx={{ width: 200, height: 200, border: '2px dashed black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5em' }}>Select Avatar</Typography>
                </Box>
              )}
            </label>
          </Box>
          <TextField
            label="Name"
            name="userName"
            variant="outlined"
            value={localProfile.userName}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            value={localProfile.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <Link to={'#'} style={{ textDecoration: 'none', color: 'yellow', fontSize: '25px', marginBottom: '20px' }} onClick={isClicked}>Change Password</Link>
          {changePassword &&
            <>
              <TextField
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              <FormControlLabel
                control={<Checkbox checked={showCurrentPassword} onChange={(e) => setShowCurrentPassword(e.target.checked)} />}
                label="Show Current Password"
              />
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={<Checkbox checked={showNewPassword} onChange={(e) => setShowNewPassword(e.target.checked)} />}
                label="Show New Password"
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              <FormControlLabel
                control={<Checkbox checked={showConfirmPassword} onChange={(e) => setShowConfirmPassword(e.target.checked)} />}
                label="Show Confirm Password"
              />
              <Button variant="contained" style={{ marginBottom: '10px' }} color="secondary" onClick={handleChangePassword}>Change</Button>
            </>
          }
          <Button variant="contained" onClick={handleSubmit}>Save Changes</Button>

        </Box>
      </Box>
    </div>
  );
};

export default EditProfileCard;
