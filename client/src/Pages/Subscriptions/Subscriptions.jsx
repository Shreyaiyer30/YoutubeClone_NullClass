import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubscriptions } from "../../actions/subscription";
import { Link } from "react-router-dom";
import "./Subscriptions.css";

function Subscriptions() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const CurrentUser = useSelector((state) => state?.currentUserReducer);
    const subscriptionState = useSelector((state) => state.subscriptionReducer);
    const subscriptions = subscriptionState.subscriptions || [];

    useEffect(() => {
        const loadSubscriptions = async () => {
            if (CurrentUser) {
                setLoading(true);
                await dispatch(fetchSubscriptions());
                setLoading(false);
            }
        };

        loadSubscriptions();
    }, [CurrentUser, dispatch]);

    if (!CurrentUser) {
        return (
            <div className="subscriptions-container">
                <div className="login-prompt">
                    <h2>Sign in to see your subscriptions</h2>
                    <p>Subscribe to your favorite channels to see their latest videos here.</p>
                    <Link to="/auth" className="signin-button">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="subscriptions-container">
                <div className="loading-spinner-container">
                    <div className="spinner"></div>
                    <p>Loading subscriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="subscriptions-container">
            <div className="subscriptions-header">
                <h1>Subscriptions</h1>
                <p className="subscription-count">
                    {subscriptions.length} channel{subscriptions.length !== 1 ? 's' : ''}
                </p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="no-subscriptions">
                    <div className="empty-state-icon">📺</div>
                    <h2>No subscriptions yet</h2>
                    <p>Subscribe to channels to see their latest videos here.</p>
                    <Link to="/" className="explore-button">
                        Explore Videos
                    </Link>
                </div>
            ) : (
                <div className="subscriptions-grid">
                    {subscriptions.map((subscription) => (
                        <Link
                            key={subscription._id}
                            to={`/chanel/${subscription.channel?._id || subscription.channel}`}
                            className="subscription-card"
                        >
                            <div className="channel-avatar">
                                {subscription.channel?.avatar ? (
                                    <img
                                        src={subscription.channel.avatar}
                                        alt={subscription.channel.name}
                                    />
                                ) : (
                                    <span className="avatar-placeholder">
                                        {subscription.channel?.name?.charAt(0).toUpperCase() || 'C'}
                                    </span>
                                )}
                            </div>

                            <div className="channel-info">
                                <h3 className="channel-name">
                                    {subscription.channel?.channelName || subscription.channel?.name || 'Unknown Channel'}
                                </h3>
                                <p className="subscriber-count">
                                    {subscription.channel?.subscriberCount?.toLocaleString() || 0} subscribers
                                </p>
                                <p className="subscription-date">
                                    Subscribed {new Date(subscription.subscribedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="subscription-status">
                                <span className="subscribed-badge">✓ Subscribed</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Subscriptions;