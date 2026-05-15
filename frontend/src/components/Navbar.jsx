import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { TbReceipt2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import {
  clearSearchQuery,
  setSearchQuery,
  setUserData,
} from "../redux/slices/userSlice";
import MyOrdersPanel from "./MyOrdersPanel";
import NavbarSearch from "./NavbarSearch";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData, city, cartItems, searchQuery } = useSelector(
    (state) => state.user,
  );
  const mobileSearchRef = useRef(null);
  const { shopData } = useSelector((state) => state.owner);

  const openOrders = () => {
    setShowInfo(false);
    setShowOrders(true);
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleClearSearch = () => {
    dispatch(clearSearchQuery());
    mobileSearchRef.current?.focus();
  };

  useEffect(() => {
    if (showSearch && userData.role === "user") {
      mobileSearchRef.current?.focus();
    }
  }, [showSearch, userData.role]);

  const handleLogout = async () => {
    try {
      let response = await axiosInstance.post(AUTH_ROUTES.LOGOUT);

      dispatch(setUserData(null));
      dispatch(clearSearchQuery());
      toast.success(response.data.message);
    } catch (error) {
      //   console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      {/* ── Navbar ── */}
      <header className="w-full h-16 fixed top-0 left-0 z-9999 bg-white border-b border-stone-100 shadow-sm">
        <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand */}
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 shrink-0">
            Order<span className="text-orange-500">Karo</span>
          </h1>

          {/* Search bar — desktop only, user only */}
          {userData.role === "user" && (
            <NavbarSearch
              city={city}
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              className="hidden md:flex flex-1 max-w-sm"
            />
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search toggle — user only */}
            {userData.role === "user" && (
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
                onClick={() => setShowSearch((p) => !p)}
              >
                {showSearch ? (
                  <RxCross2 size={16} />
                ) : (
                  <IoIosSearch size={18} />
                )}
              </button>
            )}

            {/* Owner: Add Item */}
            {userData.role === "owner" && shopData && (
              <>
                <button
                  className="hidden md:flex items-center gap-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 text-sm font-medium px-3.5 py-2 rounded-full transition-colors cursor-pointer"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={13} />
                  Add Food Item
                </button>
                <button
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={15} />
                </button>
              </>
            )}

            {/* Owner: My Orders */}
            {userData.role === "owner" && (
              <>
                <button
                  type="button"
                  className="hidden md:flex items-center gap-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 text-sm font-medium px-3.5 py-2 rounded-full transition-colors cursor-pointer"
                  onClick={openOrders}
                >
                  <TbReceipt2 size={16} />
                  My Orders
                </button>
                <button
                  type="button"
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
                  onClick={openOrders}
                  aria-label="My orders"
                >
                  <TbReceipt2 size={17} />
                </button>
              </>
            )}

            {/* User: Cart */}
            {userData.role === "user" && (
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer" onClick={()=> navigate("/cart")}>
                <FiShoppingCart size={17} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}

            {/* User: My Orders — desktop */}
            {userData.role === "user" && (
              <>
                <button
                  type="button"
                  className="hidden md:flex items-center gap-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 text-sm font-medium px-3.5 py-2 rounded-full transition-colors cursor-pointer"
                  onClick={openOrders}
                >
                  <TbReceipt2 size={16} />
                  My Orders
                </button>
                <button
                  type="button"
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
                  onClick={openOrders}
                  aria-label="My orders"
                >
                  <TbReceipt2 size={17} />
                </button>
              </>
            )}

            {/* Avatar */}
            <button
              className="w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-orange-200 hover:bg-orange-600 transition-colors cursor-pointer shrink-0"
              onClick={() => setShowInfo((p) => !p)}
            >
              {userData.fullName.slice(0, 1).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile search bar (drops below nav) ── */}
      {showSearch && userData.role === "user" && (
        <div className="md:hidden fixed top-16 left-0 w-full z-9998 bg-white border-b border-stone-100 shadow-sm px-4 py-3">
          <NavbarSearch
            city={city}
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            inputRef={mobileSearchRef}
            className="py-2.5"
          />
        </div>
      )}

      {/* ── Profile dropdown ── */}
      {showInfo && (
        <div className="fixed top-18 right-4 sm:right-6 w-48 bg-white rounded-2xl shadow-xl shadow-stone-200 border border-stone-100 p-4 flex flex-col gap-1 z-9999">
          {/* Name */}
          <p className="text-sm font-semibold text-stone-800 pb-2 border-b border-stone-100 mb-1">
            {userData.fullName}
          </p>

          {(userData.role === "user" || userData.role === "owner") && (
            <button
              type="button"
              className="md:hidden text-left text-sm text-stone-600 hover:text-orange-500 font-medium py-1.5 transition-colors cursor-pointer"
              onClick={openOrders}
            >
              My Orders
            </button>
          )}

          <button
            className="text-left text-sm text-orange-500 hover:text-orange-600 font-semibold py-1.5 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}

      <MyOrdersPanel
        open={showOrders}
        onClose={() => setShowOrders(false)}
        role={userData.role}
      />

      {/* Spacer so content doesn't hide behind fixed nav (+ mobile search row) */}
      <div
        className={
          showSearch && userData.role === "user"
            ? "h-[7.25rem] md:h-16"
            : "h-16"
        }
      />
    </>
  );
}

export default Navbar;
