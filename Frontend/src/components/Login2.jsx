import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Login2.scss";
export default function Login2({ path, element }) {
    const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
    // console.log("Current user", user);

    if (isLoading) {
        return <div>Loading ...</div>;
    }
    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }

    return element;
}