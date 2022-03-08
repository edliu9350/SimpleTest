/**
 * @author Edwaki
 * @date 3.7.2022
 */
import React, { useState, Fragment } from "react";
import {Link} from 'react-router-dom';
import Login from '../../components/login';
import useStore from '../../store';
import {Menu, Transition} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import {useLocation} from 'react-router-dom';


export default (props: any) => {
  const [login_open, setLoginOpen] = useState(false); //state for dialog-opened
  /*Event handler of login button */
  const onOpenLogin = () => {
    setLoginOpen(true);
  }
  /*Closing handler of login dialog */
  const onCloseLogin = () => {
    setLoginOpen(false);
  }
  /*Handler of logging out */
  const onLogout = () => {
    setToken({});
  }
  const token: any = useStore(state => state.token);  //token for authentication
  const setToken: any = useStore(state => state.setToken);
  const location = useLocation(); //current path
  return (
    <div>
      <nav className="bg-gray-800/70">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-centers h-16">        
            <div className="flex grow items-center justify-between">
              <div className="flex cursor-pointer">
                <div className="md:block">
                  <Link to='/home'>
                    <img
                      className="h-10 w-10"
                      src="/images/bitcoin.png"
                      alt="Workflow"
                    />
                  </Link>
                </div>
                <div className="md:block">
                  <Link className="mx-2 text-white text-3xl" to='/home'>Crypto Trading</Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/home"
                    className={`hover:bg-gray-700 ${location.pathname == '/home' ? 'text-white' : 'text-gray-300'} px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    Home
                  </Link>
                  {token.email &&
                    <Link
                      to="/trade"
                      className={`hover:bg-gray-700 ${location.pathname == '/trade' ? 'text-white' : 'text-gray-300'} px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Trade
                    </Link>
                  }
                  { token.email &&
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="bg-green-800 inline-flex hover:bg-green-700 justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {token.email}
                        <ChevronDownIcon
                          className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                onClick={onLogout}
                              >
                                  Log out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>}
                  {
                    !token.email &&
                    <Link
                      to="#"
                      className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={onOpenLogin}
                    >
                      Login
                    </Link>
                  }
                </div>
              </div>
              <Login open={login_open} onClose={onCloseLogin}/>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}