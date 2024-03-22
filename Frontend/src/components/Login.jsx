import "../styles/Login.scss";
export default function Login() {
    return <div className="main">
        <div className="inputs">
            <div className="take">
                <input type="text" id="firstName" placeholder="First Name" />
            </div>
            <div className="take">

                <input type="text" id="lastName" placeholder="Last Name" />
            </div>
            <div className="take">

                <input type="text" id="location" placeholder="Location" />
            </div>
            <div className="take">
                <input type="text" id='email' placeholder="Email" />

            </div>
            <div className="take">
                <input type="text" id='password' placeholder="Password" />

            </div>
            <div className="take">

                <input type="text" id="phone" placeholder="Mobile Number" />
            </div>
            <div>
                <p>
                    By tapping “Sign Up” or “Continue with Google, Facebook, or Apple,” you agree to FoodJunction's Terms and Conditions and Privacy Policy.
                </p>
            </div>

            <button>Sign Up</button>
        </div>
    </div>

}