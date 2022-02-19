import {useRouter} from 'next/router';
import {Fragment, useEffect, useState} from 'react';
import {magic} from '../lib/magic-client';
import {Disclosure, Menu, Transition} from '@headlessui/react';
import {MenuIcon, XIcon} from '@heroicons/react/outline';
import Link from 'next/link';
import {classNames} from '../lib/classNames';

const navigation = [
    {name: 'Dashboard', href: '/', current: true},
    {name: 'Finance', href: '/finance', current: false},
    {name: 'Inventory', href: '/inventory', current: false},
    {name: 'Job Scheduling', href: '/calendar', current: false},
    {name: 'Pricing', href: '/pricing', current: false},
];

export default function Layout({children, ...pageProps}) {
    const router = useRouter();
    console.log("LAYOUT", pageProps)

    const [nav, setNav] = useState(navigation)
    const [username, setUsername] = useState('');
    // const [didToken, setDidToken] = useState('');

    // const {latLong, getGeoLocation, locationErrorMsg, findingLocation} = GeoLocation();

    useEffect(async () => {
        try {
            const {email, issuer} = await magic.user.getMetadata();
            // const didToken = await magic.user.getIdToken();
            if (email) {
                setUsername(email);
                // setDidToken(didToken);
            } else {
                await signOut()
            }
        } catch (error) {
            console.error('Error retrieving email', error);
            await signOut()
        }
    }, [router]);

    const signOut = async (e) => {
        e?.preventDefault();

        try {
            const didToken = await magic.user.getIdToken();
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${didToken}`,
                    'Content-Type': 'application/json',
                },
            });
            await response.json();
        } catch (error) {
            console.error('Error logging out', error);
            router.push('/login');
        }
    };

    const userNavigation = [{name: 'Sign out', func: signOut}];

    function navSelected(item) {
        for (let i = 0; i < nav.length; i++) {
            console.log(nav[i])
            if (nav[i].name == item.name)
                nav[i].current = true;
            else
                nav[i].current = false;
        }
        setNav([...nav]);
    }

    return (
        <div className="flex flex-grow flex-col min-h-screen">
            <Disclosure as="nav" className="bg-gray-800">
                {({open}) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <h2 className="text-xl font-medium leading-none text-white">
                                            XDNSX
                                        </h2>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {nav.map((item) => (
                                                <Link
                                                    href={item.href ? item.href : '/'}
                                                    key={item.name}>
                                                    <a onClick={(e) => navSelected(item)}
                                                       className={classNames(
                                                           item.current
                                                               ? 'bg-gray-900 text-white'
                                                               : 'text-gray-300 hover:bg-gray-700 hover:text-white disabled',
                                                           'px-3 py-2 rounded-md text-sm font-medium'
                                                       )}
                                                       aria-current={item.current ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        {/* Profile dropdown */}
                                        <p className="text-base font-medium leading-none text-white">
                                            {username}
                                        </p>
                                        <Menu as="div" className="ml-3 relative">
                                            <div>
                                                <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                    <span className="sr-only">Open user menu</span>
                                                    <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                              <svg
                                  className="h-full w-full text-gray-300"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                              </svg>
                            </span>
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
                                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigation.map((item) => (
                                                        <Menu.Item key={item.name} as={Fragment}>
                                                            {({active}) => (
                                                                <a
                                                                    onClick={item.func}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                        ) : (
                                            <MenuIcon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {nav.map((item) => (
                                    <Link key={item.name}
                                          href={item.href ? item.href : '/'} passHref>
                                        <Disclosure.Button as={Fragment}>
                                            <a
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-900 text-white'
                                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'block px-3 py-2 rounded-md text-base font-medium'
                                                )}>
                                                {item.name}
                                            </a>
                                        </Disclosure.Button>
                                    </Link>
                                ))}
                            </div>
                            <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-white">
                                            {username}
                                        </div>
                                        {/* <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div> */}
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    {userNavigation.map((item) => (
                                        <Disclosure.Button key={item.name} as={Fragment}>
                                            <Link href="/">
                                                <a
                                                    onClick={item.func}
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                                >
                                                    {item.name}
                                                </a>
                                            </Link>
                                        </Disclosure.Button>
                                    ))}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <main id="layout">
                <div className="mt-9 mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}