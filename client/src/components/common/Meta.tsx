import { FC } from "react";
import { Helmet } from "react-helmet-async";

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
}

const Meta: FC<Props> = ({
  title = "Welcome to ProShop",
  description = "we sell the best products for cheap",
  keywords = "electronics, buy electronics, cheap electronics",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta name="keywords" content={keywords}></meta>
    </Helmet>
  );
};

export default Meta;
