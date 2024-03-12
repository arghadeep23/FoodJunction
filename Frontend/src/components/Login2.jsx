import { useAuth0 } from "@auth0/auth0-react";
import "./Login2.scss";
export default function Login2({ path, element }) {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    console.log("Current user", user);
    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }

    return element;
}