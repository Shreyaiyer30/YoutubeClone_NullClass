import React, { useState } from 'react';
import './Feedback.css';

function Feedback() {
    const [feedback, setFeedback] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your feedback!");
        setFeedback("");
    };

    return (
        <div className="container_Pages_App">
            <div className="feedback_container">
                <h1>Send Feedback</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    We value your feedback! Let us know what you think about our app.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="feedback_form_group">
                        <label>Describe your feedback</label>
                        <textarea
                            className="feedback_textarea"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what you like, what we can improve, or about any bugs you found..."
                        />
                    </div>

                    <div className="screenshot_upload">
                        Click to include a screenshot (Optional)
                    </div>

                    <button type="submit" className="submit_btn">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Feedback;
