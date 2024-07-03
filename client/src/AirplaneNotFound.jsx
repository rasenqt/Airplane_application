import { Alert } from "react-bootstrap";

function AirplaneNotFound() {
    return <>
        <br/>
        <Alert variant='danger'>
            <Alert.Heading>Error</Alert.Heading>
            No Airplane
        </Alert>
    </>
}

export { AirplaneNotFound };