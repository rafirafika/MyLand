import React from "react";
import { Container, Button } from "shards-react";
import history from 'src/routes/history';
const Errors404 = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>404</h2>
        <h3>OPPS! PAGE NOT FOUND</h3>
        <p>Sorry, the page you're looking was moved, removed, renamed or might never existed</p>
        <Button pill onClick={() => history.goBack()}>&larr; Go Back</Button>
      </div>
    </div>
  </Container>
);

export default Errors404;
