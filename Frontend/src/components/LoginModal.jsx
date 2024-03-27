import "../styles/Login.scss";
import { useNavigate } from "react-router-dom";
import { forwardRef, useState } from "react";
const LoginModal = forwardRef(function LoginModal({ hideModal }, ref) {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    function handleChange(e) {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/restaurantLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });
            const data = await response.json();
            if (data.success) {
                // alert("Logged in successfully");
                const token = data.token;
                const restaurantId = data.restaurantId;
                localStorage.setItem('token', token);
                localStorage.setItem('restaurantId', restaurantId);
                navigate("/ownerDashboard");
                // hideModal();
            }
            if (!data.success) {
                if (data.message === "Incorrect password")
                    alert("The entered password is incorrect. Please try again.");
                else
                    alert("The entered email is not registered. Please try again.")
                return;
            }
        } catch (error) {
            console.log(error);
            alert("Error checking for existing restaurant. Please try again.");
            return;
        }
        console.log(loginData);
    }
    return (
        <dialog className="login-modal" ref={ref} onClose={hideModal}>
            <div className="someHeading">
                <h3>Log in to FoodJuntion for Merchants</h3>
            </div>
            <div className="inputs">
                <form action="" onSubmit={handleSubmit}>
                    <div className="take">
                        <input type="text" id="email" placeholder="Email" onChange={handleChange} value={loginData.email} />
                    </div>
                    <div className="take">
                        <input type="text" id="password" placeholder="Password" onChange={handleChange} value={loginData.password} />
                    </div>
                    <div className="buttons">
                        <button type="submit">Login</button>
                        <button type="button" onClick={hideModal}>Close</button>
                    </div>
                </form>
            </div>
            <div className="closer">

            </div>
        </dialog>
    );
});
export default LoginModal;
