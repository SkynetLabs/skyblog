import React, { useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";
import { Link, useHistory } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/outline";
import PlusIcon from "@heroicons/react/outline/PlusSmIcon";
import { Disclosure } from "@headlessui/react";
import { Menu, Transition } from "@headlessui/react";

//Navigation bar component, displayed along top of screen, used to navigate through Skapp
export default function NavigationBar(props) {
  const { userID, initiateLogin, mySkyLogout, isMySkyLoading } =
    useContext(SkynetContext); //states from Skynet context
  const history = useHistory();

  const handleLogout = async () => {
    const success = await mySkyLogout();
    if (success) {
      history.push("/");
    }
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
            ) : !isMySkyLoading ? (
              <>
                <Link to={"/create"}>
                  <PlusIcon className="-ml-1 mr-2 h-6 w-6" aria-hidden="true" />
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
