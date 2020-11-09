import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

const PlainLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <Col sm={{ size: 8, order: 2, offset: 2 }}>
        {children}
      </Col>
    </Row>

  </Container>
);

PlainLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

PlainLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default PlainLayout;
