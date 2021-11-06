import { FaBars, FaBell, FaCog } from 'react-icons/fa'

const Header = () => {
    return (
        <div className="h-14 bg-primary-600 flex items-center">
            <div className="w-10 h-10 rounded-full transition-all ml-3 flex cursor-pointer items-center justify-center hover:bg-primary-700">
                <FaBars className="text-white" />
            </div>
            <div className="w-10 h-10 rounded-full transition-all ml-auto mr-3 flex cursor-pointer items-center justify-center hover:bg-primary-700">
                <FaBell className="text-white" />
            </div>
            <div className="w-10 h-10 rounded-full transition-all  mr-3 flex cursor-pointer items-center justify-center hover:bg-primary-700">
                <FaCog className="text-white" />
            </div>
        </div>
    )
}

export default Header