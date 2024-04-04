import { Link } from "react-router-dom";

const SideBar = () => {
    return (
        <aside className="SideBar">
            <ul className="list-menu">
                <li className="list-item active">
                    <Link to={'/'}>
                        <i className="fa-solid fa-house"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'dashboard'}>
                        <i className="fa-solid fa-table-columns"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/account'}>
                        <i className="fa-solid fa-user"></i>
                        <span>Account</span>
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/faculty'}>
                        <i className="fa-solid fa-graduation-cap"></i>
                        <span>Faculity</span>
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/event'}>
                        <i className="fa-regular fa-calendar"></i>
                        <span>Event</span>
                    </Link>
                </li>
                <li className="list-item ">
                    <Link to={'admin/role'}>
                        <i className="fa-solid fa-user-secret"></i>
                        <span>Role</span>
                    </Link>
                </li>
            </ul>

        </aside>
    );
}

export default SideBar;