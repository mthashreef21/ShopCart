import {useState} from 'react'
import { Link } from 'react-router-dom'
import {
    ShoppingCart,
    Heart,
    UserRound,
    Search,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';


function Navbar({ cartCount = 0 }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const wishlistCount = 2;

    const navLinks = [
        {name: "Home", href: '/'},
        {name: "Shop", href: '/products'},
        {name: "Categories", href: '/categories'},
        {name: "Deals", href: '/deals'},
        {name: "Brands", href: '/brands'},
    ];

    const handleSearch = (e) => {
        e.preventDefault();

        if(!searchQuery.trim()) return;
        console.log('Searching for:', searchQuery);
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <nav className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-3 md:px-5 lg:gap-4 lg:px-8">

                {/*Logo + Menu left side */}
                <div className="flex shrink-0 items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button className="rounded-lg p-2 text-gray-800 transition hover:bg-gray-100 xl:hidden" type="button" onClick={ () => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24}/>}
                    </button>

                    {/* ShopCart Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200">
                            <ShoppingCart size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                            <span className="text-gray-950">Shop</span>
                            <span className="text-blue-600">Cart</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden shrink-0 items-center gap-5 xl:ml-6 xl:flex 2xl:ml-8 2xl:gap-7">
                    {navLinks.map((link,index) => (
                        <Link key={link.name} to={link.href} className={`relative whitespace-nowrap py-2 text-sm font-semibold transition-colors ${index === 0 ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex min-w-0 flex-1 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
                    <Search size={20} className="ml-4 shrink-0 text-gray-500"/>
                    <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Products..." aria-label="Search products" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"/>

                    <button type="submit" aria-label="Submit Search" className="flex h-11 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition hover:from-blue-700 hover:to-indigo-700 sm:w-14">
                        <Search size={20} strokeWidth={2.5}/>
                    </button>
                </form>

                {/* Right Side Icons */}
                <div className="flex shrink-0 items-center gap-1 sm:gap-3 lg:gap-5">

                    {/* Wishlist */}
                    <Link to="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`} className="relative flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600">
                        <span className="relative">
                            <Heart size={23} strokeWidth={1.8}/>

                            {wishlistCount > 0 && (
                                <span className='absolute -right-2 -top-2 flex h-4 min-w-4 items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
                                    {wishlistCount}
                                </span>
                            )}
                        </span>

                        <span className='hidden text-xs font-medium lg:block'>Wishlist</span>
                    </Link>

                    {/* Cart */}
                    <Link to='/cart' aria-label={`Shopping cart, ${cartCount} items`} className="group relative flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600">
                            <span className='relative'>
                                <ShoppingCart size={23} strokeWidth={1.8}/>

                                {cartCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                            <span className="hidden text-xs font-medium lg:block">
                                Cart
                            </span>
                    </Link>

                    {/* Account */}
                    <Link to='/profile' aria-label="My account" className='flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600'>
                        <UserRound size={23} strokeWidth={1.8} />
                        <span className="hidden items-center gap-1 text-xs font-medium lg:flex">
                            Account <ChevronDown size={13}/>
                        </span>
                    </Link>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg xl:hidden">
                    <div className='mx-auto flex max-w-7xl flex-col'>
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href} onClick={() => setIsMenuOpen(false)} className='border-b border-gray-100 py-3 text-sm font-medium text-gray-700 transition hover:text-blue-600 last:border-b-0'>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )

}

export default Navbar;