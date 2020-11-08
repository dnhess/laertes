import React from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { signIn, signOut, useSession } from 'next-auth/client'
import NavLinks from './NavLinks'

const Nav = () => {
    const [ session, loading ] = useSession()
    const linkStyles = "px-2 lg:inline-block text-customGray hover:underline"
    const [showMobileLinks, setShowMobileLinks] = React.useState(false)

    return (
        <>
        <nav className="flex items-center bg-darkBrown p-1 w-screen">
            <div className='max-w-screen-lg w-screen mx-auto flex'>
                <div className="items-center text-customGray mr-6 ml-4 lg:ml-0">
                    <Link href="/">
                        <span className="font-semibold text-xl tracking-tight cursor-pointer">Megaminer</span>
                    </Link>
                </div>
                <div className="w-full block flex-grow hidden md:flex lg:items-center md:w-auto">
                    <div className="text-m flex items-center">
                        <NavLinks linkStyles={linkStyles} />
                    </div>
                </div>
                <div className="hidden md:flex items-center">
                    {!loading &&
                        (session ? (
                            <>
                                <Link href="/profile">
                                    <a className={linkStyles}>Profile</a>
                                </Link>
                            <button onClick={signOut} className={`${linkStyles} rounded-lg bg-grayBlue p-1 hover:no-underline hover:bg-dullGrayBlue`}>Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={signIn} className={`${linkStyles} rounded-lg bg-grayBlue p-1 hover:no-underline hover:bg-dullGrayBlue`}>Login</button>
                            </>
                    ))}
                </div>
                <button className="md:hidden ml-auto mr-4" onClick={() => setShowMobileLinks(!showMobileLinks)}>
                    <img src={'/svgs/hamburger.svg'} alt="nav menu"/>
                </button>
                <button onClick={() => setShowMobileLinks(false)} className={classNames("fixed top-0 right-0 bottom-0 left-0 w-full h-full z-10", { hidden: !showMobileLinks })} />
            </div>
        </nav>
        <div className={classNames("origin-top-left absolute left-0 w-screen rounded-b-md top-38 sticky", { hidden: !showMobileLinks })}>
            <div className="rounded-b-md bg-darkBrown shadow-xs flex flex-col" role="menu" aria-orientation="vertical" aria-labelledby="navigation-menu">
            <div className="m-1 ml-4 flex flex-column">
                    {!loading &&
                        (session ? (
                            <>
                                <Link href="/profile">
                                    <a className={`${linkStyles} p-1 flex`}><img className="h-6 rounded-full mr-1" src={session.user.image}/>Profile</a>
                                </Link>
                            </>
                        ) : (
                            <>
                                <button onClick={signIn} className={`${linkStyles} p-1`}>Login</button>
                            </>
                    ))}
                </div>
                <NavLinks linkStyles={linkStyles} isMobile={true} />
            </div>
        </div>
        </>
    )
}

export default Nav