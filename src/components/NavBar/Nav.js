import classes from "./nav.module.css";
import React, { useState } from "react";
import Logo from "../../image/logo.svg";
import LogoText from "../../image/logoText.svg";
import { Link } from "react-router-dom";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import useFirestore from "../../hooks/useFirestore";
import { useHistory, useLocation } from "react-router-dom";
import DefaultImage from "../../assets/images/defaultImage.png";

const NavBar = ({ check, setShowSearchExtended }) => {
  let { docs } = useFirestore("Shop Categories");

  const history = useHistory();
  const location = useLocation();

  const [_, setUserValidate] = useState(false);

  const [hoverSubCategory, setHoverSubCategory] = useState({});

  const openSubCategory = (id) => {
    setHoverSubCategory({
      ...!hoverSubCategory,
      [id]: true,
    });
  };

  const closeSubCategory = (id) => {
    setHoverSubCategory({
      ...hoverSubCategory,
      [id]: false,
    });
  };

  return (
    <div
      className={classes.navbar}
      onClick={() => setShowSearchExtended(false)}
    >
      <div className={classes.container}>
        <div className={classes.logo}>
          <Link
            to={
              location.pathname.split("/")[1] === "admin"
                ? "/admin/dashboard"
                : "/"
            }
            className={classes.logo2}
          >
            <img src={Logo} alt="" style={{ width: "40px" }} />
            <img
              src={LogoText}
              alt=""
              style={{ width: "100px", "margin-left": "10px" }}
            />
          </Link>
        </div>
        <div className={classes.menuItems}>
          <div className={classes.menuList}>
            <ul>
              <li>
                <Link
                  to={
                    location.pathname.split("/")[1] === "admin"
                      ? "/admin/malls"
                      : "/malls"
                  }
                >
                  Malls
                </Link>
              </li>
              <li>
                <Link
                  to={
                    location.pathname.split("/")[1] === "admin"
                      ? "/admin/shops"
                      : "/shops"
                  }
                >
                  Shops
                </Link>
                {docs.length !== 0 && (
                  <>
                    <FaAngleDown className={classes.icon} />
                    <ul className={classes.shopsDropdown}>
                      <div className={classes.dropDownWrapper}>
                        {docs.map((doc) => (
                          <div
                            className={classes.col}
                            key={doc.category}
                            onMouseEnter={() => openSubCategory(doc.id)}
                            onMouseLeave={() => closeSubCategory(doc.id)}
                          >
                            <li className={classes.row}>
                              <div className={classes.hTitle}>
                                <p
                                  onClick={() =>
                                    history.push(
                                      `/shops/category/${doc.category}`
                                    )
                                  }
                                >
                                  <span> {doc.category}</span>
                                </p>
                                {doc?.rowContent?.rowData.length !== 0 && (
                                  <FaAngleRight className={classes.iconRight} />
                                )}
                              </div>

                              {hoverSubCategory[doc.id] ? (
                                <div
                                  className={
                                    doc.rowContent.rowData.length !== 0
                                      ? classes.drop
                                      : classes.hide
                                  }
                                  onMouseEnter={() => openSubCategory(doc.id)}
                                  onMouseLeave={() => closeSubCategory(doc.id)}
                                >
                                  {doc.rowContent.rowData.map((row) => {
                                    return (
                                      <p
                                        key={row.id}
                                        onClick={() =>
                                          history.push(
                                            `/shops/category/${doc.category}/${row.subCategory}`
                                          )
                                        }
                                      >
                                        {row.subCategory}
                                      </p>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className={classes.hide}></div>
                              )}
                            </li>
                          </div>
                        ))}
                      </div>
                    </ul>
                  </>
                )}
              </li>
              {check === "true" && location.pathname.split("/")[1] === "admin" && (
                <li>
                  <Link to="/admin/addshopcategories">Shop Category</Link>
                </li>
              )}
              <li className={classes.toHide}>
                <Link to="/about-us">About Us</Link>
              </li>
              <li className={classes.toHide}>
                <Link to="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          {check === "true" ? (
            <>
              <div className={classes.user}>
                <div className={classes.userImage}>
                  <img src={DefaultImage} alt="" />
                </div>
                <FaAngleDown className={classes.icon} />

                <div className={classes.userDropDown}>
                  <ul>
                    <li>
                      {location.pathname.split("/")[1] === "admin" ? (
                        <Link to="/">
                          <div className={classes.list}>
                            <FaRegUserCircle className={classes.icons} />
                            Switch to user
                          </div>
                        </Link>
                      ) : (
                        <Link to="/admin/dashboard">
                          <div className={classes.list}>
                            <FaRegUserCircle className={classes.icons} />
                            Switch to admin
                          </div>
                        </Link>
                      )}
                    </li>
                    <li>
                      <div
                        className={classes.list}
                        onClick={() => {
                          localStorage.setItem("isAuth", "false");
                          history.push("/");
                          setUserValidate((prevState) => !prevState);
                        }}
                      >
                        <AiOutlineLogout className={classes.icons} />
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <Link className={classes.button} to="/login">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
