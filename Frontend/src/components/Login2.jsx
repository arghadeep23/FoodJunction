import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Login2.scss";
export default function Login2({ element }) {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }
    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }

    return element;
}

Login2.propTypes = {
    element: PropTypes.node,
};