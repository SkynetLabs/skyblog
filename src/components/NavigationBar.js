import React, { useContext, useState, useEffect } from "react";
import { SkynetContext } from "../state/SkynetContext";
import { Link, useHistory } from "react-router-dom";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import { Disclosure } from "@headlessui/react";
import { Menu, Transition } from "@headlessui/react";
import { getLocalStorageUserProfileList } from "../data/localStorage";
import SearchProfile from "./SearchProfile";

//Navigation bar component, displayed along top of screen, used to navigate through Skapp
export default function NavigationBar(props) {
  /*
      userID, initiateLogin, mySkyLogout, isMySkyLoading -> instances from SkynetContext
      history -> instance of the react router
      searchOpen -> state to handle showing of the search dropdown
      searchList -> list of users to display in the dropdown
      userList -> unfiltered initial list of users
       */
  const { userID, initiateLogin, mySkyLogout, isMySkyLoading } =
    useContext(SkynetContext);
  const history = useHistory();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [userList, setUserList] = useState([]);

  //logout and redirect user
  const handleLogout = async () => {
    const success = await mySkyLogout();
    if (success) {
      setSearchOpen(false);
      history.push("/");
    }
  };

  //load in the local storage user profiles
  useEffect(() => {
    const handleSearchOpen = () => {
      const profileList = getLocalStorageUserProfileList();
      setSearchList(profileList);
      setUserList(profileList);
    };
    handleSearchOpen();
  }, []);

  //filter user list based on search input
  const handleSearchChange = (event) => {
    const newList = userList.filter((item) => {
      return (
        item.firstName
          .toLowerCase()
          .startsWith(event.target.value.toLowerCase()) ||
        item.lastName.toLowerCase().startsWith(event.target.value.toLowerCase())
      );
    });
    setSearchList(newList);
  };

  const className =
    "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-palette-600 bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors";

  //JSX components to render navigation bar
  return (
    <Disclosure as={"nav"} className={"bg-white border-b border-palette-100"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 space-x-4">
          <Link className={"flex"} to={"/"}>
            <div className="flex-shrink-0 flex items-center">
              <img
                className="lg:block h-8 w-auto"
                src="/logo/skynet.svg"
                alt="Workflow"
              />
              <h1
                className={
                  "mt-1 ml-2 text-base font-extrabold text-palette-600 sm:text-lg sm:tracking-tight lg:text-2xl hidden sm:block"
                }
              >
                SkyBlog
              </h1>
            </div>
          </Link>
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {!userID ? (
              <button
                className={className}
                onClick={initiateLogin}
                disabled={isMySkyLoading}
              >
                <UserCircleIcon className="h-6 w-6 mr-1" aria-hidden="true" />{" "}
                <p className={"sm:tracking-tight hidden sm:block"}>
                  Login with MySky
                </p>
              </button>
            ) : !isMySkyLoading && userList.length > 0 ? (
              <>
                <div className={"relative mr-2 hidden md:block"}>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search users..."
                    className={
                      "shadow-md block text-sm rounded-md hover:border-palette-600 focus:bg-white pr-20 p-2"
                    }
                    onChange={handleSearchChange}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        document.getElementById("search").value = "";
                        setSearchOpen(false);
                      }, 100);
                    }}
                  />
                  {searchOpen ? (
                    <div
                      className={
                        "absolute mt-2 p-2 w-full rounded-md overflow-y-auto bg-palette-100"
                      }
                    >
                      <ul className={"max-h-60"}>
                        {searchList.length > 0 ? (
                          searchList.map((item) => (
                            <li>
                              <SearchProfile profileData={item} />
                            </li>
                          ))
                        ) : (
                          <p className={"text-center text-palette-300 text-sm"}>
                            No known users to show.
                          </p>
                        )}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <Link
                  to={"/create"}
                  className={"p-2 rounded-full hover:bg-palette-100"}
                >
                  <PlusIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
                <Menu as="div" className="relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <div className={"flex items-center"}>
                        <Menu.Button>
                          <UserCircleIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-palette-100 focus:outline-none"
                        >
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/profile/ed25519-${userID}`}
                                  className={
                                    active
                                      ? "flex items-center px-4 py-2 w-full text-xs text-left bg-palette-100"
                                      : "flex items-center px-4 py-2 w-full text-xs text-left"
                                  }
                                >
                                  My blogs
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={handleLogout}
                                  className={
                                    active
                                      ? "flex items-center px-4 py-2 w-full text-xs text-left bg-palette-100"
                                      : "flex items-center px-4 py-2 w-full text-xs text-left"
                                  }
                                >
                                  Logout
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
