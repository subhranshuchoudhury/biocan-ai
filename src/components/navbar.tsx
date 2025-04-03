import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import BiocanLogoBlue from 'public/assets/biocan-logo-blue.png';

const Navbar: React.FC = () => {
    return (
        <nav className="p-4 flex justify-between items-center border-b">
            <div className="w-32">
                <Image src={BiocanLogoBlue} width={120} height={40} alt='biocan-logo' />
            </div>
            <div className="text-gray-700"> {/* Darker gray for better visibility */}
                <FaUserCircle size={32} />
            </div>
        </nav>
    );
};

export default Navbar;