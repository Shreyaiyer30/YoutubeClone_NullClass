import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, verifyOrder } from '../../api';
import { setCurrentUser } from '../../actions/currentUser';
import { useNavigate } from 'react-router-dom';
import './Plans.css';

function Plans() {
    const User = useSelector((state) => state.currentUserReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const plans = [
        { name: "Bronze", price: 10, duration: "7 mins watch limit", features: ["1 Video Download/Day"] },
        { name: "Silver", price: 50, duration: "10 mins watch limit", features: ["Unlimited Downloads"] },
        { name: "Gold", price: 100, duration: "Unlimited watch", features: ["Unlimited Downloads", "Priority Support"] }
    ];

    const handlePayment = async (plan, price) => {
        if (!User) {
            alert("Please login to upgrade");
            return;
        }

        try {
            const { data: order } = await createOrder(price, plan);

            // Safety check for Razorpay script
            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please check your internet connection.");
                return;
            }

            const options = {
                key: "rzp_test_S0GtaBV0jrZAxD", // Should match server key_id
                amount: order.amount,
                currency: order.currency,
                name: "YouTube Clone",
                description: `Upgrade to ${plan}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: plan,
                            userId: User.result._id
                        };

                        const { data } = await verifyOrder(verificationData);
                        alert("Payment Successful! Plan Upgraded.");
                        // Update Redux state with new plan
                        dispatch(setCurrentUser({ ...User, result: data.result }));

                        // Redirect to main page
                        navigate('/');

                    } catch (error) {
                        alert("Payment Verification Failed");
                        console.log(error);
                    }
                },
                prefill: {
                    name: User.result.name,
                    email: User.result.email,
                    contact: ""
                },
                theme: {
                    color: "#cc0000"
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="plans_container">
            <h1>Upgrade Your Plan</h1>
            <div className="plans_grid">
                {plans.map((p) => (
                    <div key={p.name} className={`plan_card ${User?.result?.plan === p.name ? 'active_plan' : ''}`}>
                        <h2>{p.name}</h2>
                        <p className="price">₹{p.price}</p>
                        <p className="duration">{p.duration}</p>
                        <ul>
                            {p.features.map(f => <li key={f}>{f}</li>)}
                        </ul>
                        {User?.result?.plan === p.name ? (
                            <button disabled>Current Plan</button>
                        ) : (
                            <button onClick={() => handlePayment(p.name, p.price)}>Buy Now</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Plans;
