import { Link } from "react-router-dom";

import MyButton from "../button/MyButton";
import { useContext } from "react";
import { AuthContext } from "../../../context/context";

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);

  const logout = (e) => {
    setIsAuth(false);
    localStorage.removeItem("auth");
  };

  return (
    <div className="navbar">
      <MyButton onClick={logout}>Выйти</MyButton>
      <div className="navbar__links">
        <Link to={"/about"}>Эбаут</Link>
        <Link to={"/posts"}>Посты</Link>
      </div>
    </div>
  );
};

export default Navbar;
