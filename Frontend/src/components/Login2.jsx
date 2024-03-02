import { useAuth0 } from "@auth0/auth0-react";
import "./Login2.scss";
export default function Login2() {
  const { user, loginWithRedirect } = useAuth0();
  console.log("Current user", user);
  return (
    <>
      <div className="mainButton">
        <button onClick={loginWithRedirect}>Login with redirect</button>
      </div>
    </>
  );
}
