import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../http";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Rating from "./Rating";
import Pagination from "./pagination";

const ShopSection = () => {
  const { keyword, pagenumber, sortBy } = useParams();

  const location = useLocation();
  const history = useNavigate();
  const currentPathname = location.pathname;
  const currentSearch = location.search;
  const newParams = new URLSearchParams(currentSearch);

  const [priceRange, setPriceRange] = useState({
    min: newParams.get("minPrice") || 0,
    max: newParams.get("maxPrice") || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState(sortBy || "newlyAdded");
  const [productList, setProductList] = useState({
    products: [],
    page: 0,
    pages: 0,
  });

  const listProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/products?keyword=${keyword || ""}&pageNumber=${
          pagenumber || ""
        }&sortBy=${sortOption}&minPrice=${priceRange.min}&maxPrice=${
          priceRange.max
        }`
      );

      setProductList(data);
      setLoading(false);
    } catch (error) {
      if (error.message === "Network Error") {
        setError(null);
      }
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    const newParams = new URLSearchParams(currentSearch);

    newParams.set("sortBy", newSortOption); // Changed pOrder to sortBy

    const newUrl = `${currentPathname}?${newParams.toString()}`;

    history(newUrl);
  };
  const handlePriceRangeChange = () => {
    // Validate and handle the price range change

    const newParams = new URLSearchParams(currentSearch);

    if (
      !isNaN(priceRange.min) &&
      priceRange.min !== "" &&
      priceRange.min !== 0
    ) {
      newParams.set("minPrice", priceRange.min);
    } else {
      newParams.delete("minPrice");
    }

    if (
      !isNaN(priceRange.max) &&
      priceRange.max !== "" &&
      priceRange.max !== 0
    ) {
      newParams.set("maxPrice", priceRange.max);
    } else {
      newParams.delete("maxPrice");
    }

    const newUrl = `${currentPathname}?${newParams.toString()}`;

    history(newUrl);
  };
const maxPrice =newParams.get("minPrice")

const minPrice=newParams.get("maxPrice")
  useEffect(() => {
    listProducts();
    // eslint-disable-next-line
  }, [
    keyword,
    pagenumber,
    sortBy,
    sortOption,maxPrice,minPrice
    
  ]); // Updated dependencies

  return (
    <div className="container">
      <div className="section">
        <div className="row text-right mb-5">
          <div className="col-7"></div>
          <div className="col-2">
            <div className="form-group">
              <label htmlfor="sortSelect">Sort By:</label>

              <select
                id="sortSelect"
                className="form-control"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="newlyAdded">Newly Added</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="col-1">
            <div className="form-group">
              <label htmlFor="minPrice">Min Price:</label>
              <input
                type="number"
                id="minPrice"
                className="form-control"
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange({
                    ...priceRange,
                    min: parseInt(e.target.value) || 0,
                  });
                }}
                style={{ width: "5rem" }}
                min={0}

                inputMode="numeric" // Set inputMode to numeric
                pattern="[0-9]*" // Allow only numeric input
              />
            </div>
          </div>

          <div className="col-1">
            <div className="form-group">
              <label htmlFor="maxPrice">Max Price:</label>
              <input
                type="number"
                id="maxPrice"
                className="form-control"
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange({
                    ...priceRange,
                    max: parseInt(e.target.value) || 0,
                  });
                }}
                min={0}
                style={{ width: "5rem" }}
              />
            </div>
          </div>
          <div className="col-1">
            <div className="form-group">
              <button
                className="btn btn-primary mt-4"
                onClick={handlePriceRangeChange}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 article">
            <div className="shopcontainer row">
              {loading ? (
                <div className="mb-5">
                  <Loading />
                </div>
              ) : error ? (
                <Message variant="alert-danger">{error}</Message>
              ) : (
                <>
                  {productList.products?.map((product) => (
                    <div
                      className="shop col-lg-4 col-md-6 col-sm-6"
                      key={product._id}
                    >
                      <div className="border-product">
                        <Link to={`/products/${product._id}`}>
                          <div className="shopBack">
                            <img src={product.image} alt={product.name} />
                          </div>
                        </Link>

                        <div className="shoptext">
                          <p>
                            <Link to={`/products/${product._id}`}>
                              {product.name}
                            </Link>
                          </p>

                          <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                          />
                          <h3>${product.price}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {productList.products.length > 0 && (
                <Pagination
                  pages={productList.pages}
                  page={productList.page}
                  keyword={keyword || ""}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSection;
