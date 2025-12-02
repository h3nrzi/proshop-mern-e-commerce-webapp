import { Card, Placeholder } from "react-bootstrap";
const ProductCardSkeleton = () => {
  return (
    <Card className="my-3 p-3 rounded">
      <Card.Img as="div" variant="top">
        <Placeholder animation="glow">
          <Placeholder xs={12} style={{ height: "210px", borderRadius: "3px" }} />
        </Placeholder>
      </Card.Img>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow" style={{ borderRadius: "3px" }}>
          <Placeholder xs={6} style={{ borderRadius: "3px" }} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={8} style={{ borderRadius: "3px" }} />{" "}
          <Placeholder xs={4} style={{ borderRadius: "3px" }} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} style={{ borderRadius: "3px" }} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

export default ProductCardSkeleton;
