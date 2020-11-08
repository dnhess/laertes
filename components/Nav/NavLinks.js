import React from 'react'
import Link from 'next/link'
import classNames from 'classnames'

const NavLinks = props => {
    const { linkStyles, isMobile = false } = props
    return (
        <>
            <Link href="/bleh">
            {/* TODO: Move about to footer */}
                <a className={classNames(linkStyles, { 'p-1': isMobile, 'ml-4': isMobile, 'flex': isMobile, 'items-center': isMobile })}>Placeholder</a> 
            </Link>
            {/* TODO: Search Bar */}
        </>
    )
}

export default NavLinks