import React from 'react';
import { BiHelpCircle, BiSupport, BiMessageError } from 'react-icons/bi';
import './Help.css';

function Help() {
    return (
        <div className="container_Pages_App">
            <div className="help_container">
                <h1>Hello. How can we help you?</h1>

                <div className="help_search">
                    <input type="text" placeholder="Describe your issue" />
                </div>

                <div className="help_categories">
                    <div className="help_category_card">
                        <BiHelpCircle className="help_icon" />
                        <h3>Get Started</h3>
                        <p>Account creation, sign in issues</p>
                    </div>
                    <div className="help_category_card">
                        <BiSupport className="help_icon" />
                        <h3>Troubleshooting</h3>
                        <p>Video playback, audio issues</p>
                    </div>
                    <div className="help_category_card">
                        <BiMessageError className="help_icon" />
                        <h3>Safety Center</h3>
                        <p>Copyright, reporting, privacy</p>
                    </div>
                </div>

                <div className="popular_articles">
                    <h3>Popular Help Articles</h3>
                    <a href="#" className="article_link">Change your password</a>
                    <a href="#" className="article_link">Upload videos</a>
                    <a href="#" className="article_link">Manage subscriptions</a>
                </div>
            </div>
        </div>
    );
}

export default Help;
