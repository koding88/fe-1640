import { Link } from "react-router-dom";

const SideBar = () => {
    return (
        <aside className="SideBar">
            <ul className="list-menu">
                <li className="list-item active">
                    <Link to={'/'}>
                        <i className="fa-solid fa-house"></i>
                        Home page
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'dashboard'}>
                        <i className="fa-solid fa-table-columns"></i>
                        Dashboard
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/account'}>
                        <i className="fa-solid fa-user"></i>
                        Account
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/faculty'}>
                        <i className="fa-solid fa-graduation-cap"></i>
                        Faculity
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/event'}>
                        <i className="fa-regular fa-calendar"></i>
                        Event
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/role'}>
                        <i className="fa-solid fa-user-secret"></i>
                        Role
                    </Link>
                </li>
            </ul>

        </aside>
    );
}

export default SideBar;