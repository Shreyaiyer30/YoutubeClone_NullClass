import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
    const [autoplay, setAutoplay] = useState(true);
    const CurrentUser = useSelector((state) => state?.currentUserReducer);
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const handleManageAccount = () => {
        if (CurrentUser?.result?._id) {
            navigate(`/chanel/${CurrentUser?.result?._id}`);
        } else {
            navigate('/auth');
        }
    };

    return (
        <div className="container_Pages_App">
            <div className="settings_container">
                <div className="settings_header">
                    <h1>Settings</h1>
                </div>

                <div className="settings_section">
                    <h3>Account</h3>
                    <div className="setting_item">
                        <div className="setting_info">
                            <h4>{CurrentUser?.result?.name || "Guest"}</h4>
                            <p>Channel Status: {CurrentUser?.result?.plan || "Free"} Member</p>
                        </div>
                        <div className="setting_action">
                            <button onClick={handleManageAccount}>
                                {CurrentUser ? "Manage Channel" : "Sign In"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="settings_section">
                    <h3>Playback</h3>
                    <div className="setting_item">
                        <div className="setting_info">
                            <h4>Autoplay next video</h4>
                            <p>When you finish a video, another plays automatically.</p>
                        </div>
                        <div className="setting_action">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={autoplay}
                                    onChange={() => setAutoplay(!autoplay)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
