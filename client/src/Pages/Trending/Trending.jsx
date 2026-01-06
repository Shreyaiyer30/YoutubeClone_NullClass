import React, { useState } from 'react';
import { AiFillFire } from 'react-icons/ai';
import './Trending.css';

function Trending() {
    const [activeTab, setActiveTab] = useState('Now');
    const tabs = ['Now', 'Music', 'Gaming', 'Movies'];

    return (
        <div className="container_Pages_App">
            <div className="trending_container">
                <div className="trending_header">
                    <div className="trending_icon_large">
                        <AiFillFire />
                    </div>
                    <div className="trending_title">
                        <h1>Trending</h1>
                    </div>
                </div>

                <div className="trending_tabs">
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="trending_videos_grid">
                    {/* Mock Video Placeholders */}
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="placeholder_card">
                            Trending Video #{i}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Trending;
