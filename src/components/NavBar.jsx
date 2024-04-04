import { Link } from 'react-router-dom';
import Logo from '/logo.webp'
import { useState } from 'react';
import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell,

} from "@novu/notification-center";

const NavBar = () => {
    const [isActive, setIsActive] = useState(false);
    const handleMenu = () => {
        setIsActive(!isActive);
    };

    const userID = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).ID : 0;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    return (
        <nav className="NavBar">

            <div className="logo-2">
                <div className="logo-img">
                    <img src={Logo} width='40px' height='40px' alt="Logo" />
                </div>
                <div className="logo-text">
                    UNIVERSITY of GREENWICH
                </div>
            </div>
            <div className="action">
                <div className="notifactions">
                    <div className="noti">
                        <NovuProvider
                            subscriberId={`${userID}`}
                            applicationIdentifier={"cCNSa5SHFWxD"}>
                            <PopoverNotificationCenter colorScheme="light">
                                {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
                            </PopoverNotificationCenter>
                        </NovuProvider>
                    </div>
                </div>
                <div className="profile" onClick={handleMenu}>
                    <Link href="#">
                        <i className="fa-regular fa-user"></i>
                    </Link>
                    <div className={`menu ${isActive ? 'active' : ''}`}>
                        <a href="#">Profile</a>
                        <Link href="#" onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
            </div>

        </nav>
    );
}

export default NavBar;