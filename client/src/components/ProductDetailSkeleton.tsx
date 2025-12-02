import { FC } from "react";
import { Card, Col, ListGroup, Placeholder, Row } from "react-bootstrap";

const ProductDetailPlaceholder: FC = () => {
  return (
    <Row className="gap-5 gap-md-0">
      <Col md={5}>
        <Placeholder as="div" animation="glow">
          <Placeholder style={{ height: "420px", width: "100%", borderRadius: "3px" }} />
        </Placeholder>
      </Col>

      <Col md={4}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Placeholder as="h3" animation="glow">
              <Placeholder xs={8} style={{ borderRadius: "3px" }} />
            </Placeholder>
          </ListGroup.Item>
          <ListGroup.Item>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={4} style={{ borderRadius: "3px" }} />{" "}
              <Placeholder xs={2} style={{ borderRadius: "3px" }} />
            </Placeholder>
          </ListGroup.Item>
          <ListGroup.Item>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} style={{ borderRadius: "3px" }} />
              <Placeholder xs={12} style={{ borderRadius: "3px" }} />
              <Placeholder xs={12} style={{ borderRadius: "3px" }} />
              <Placeholder xs={12} style={{ borderRadius: "3px" }} />
            </Placeholder>
          </ListGroup.Item>
        </ListGroup>
      </Col>

      <Col md={3}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>
                  <Placeholder as="span" animation="glow">
                    <Placeholder xs={4} style={{ borderRadius: "3px" }} />
                  </Placeholder>
                </Col>
                <Col>
                  <Placeholder as="span" animation="glow">
                    <Placeholder xs={6} style={{ borderRadius: "3px" }} />
                  </Placeholder>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <Placeholder as="span" animation="glow">
                    <Placeholder xs={4} style={{ borderRadius: "3px" }} />
                  </Placeholder>
                </Col>
                <Col>
                  <Placeholder as="span" animation="glow">
                    <Placeholder xs={6} style={{ borderRadius: "3px" }} />
                  </Placeholder>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="text-center">
              <Placeholder.Button variant="primary" className="px-5" disabled />
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDetailPlaceholder;
