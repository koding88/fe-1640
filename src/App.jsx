import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import { jwtDecode } from 'jwt-decode';


// Admin - Account
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';
import DetailAccount from './Page/@admin/Account/DetailAccount';

// Admin - Faculty
import ListFaculty from './Page/@admin/Faculty/ListFaculty';
import CreateFaculty from './Page/@admin/Faculty/CreateFaculty';
import UpdateFaculty from './Page/@admin/Faculty/UpdateFaculty';
import DetailFaculty from './Page/@admin/Faculty/DetailFaculty';

// Admin - Event
import ListEvent from './Page/@admin/Event/ListEvent';
import CreateEvent from './Page/@admin/Event/CreateEvent';
import UpdateEvent from './Page/@admin/Event/UpdateEvent';
import DetailEvent from './Page/@admin/Event/DetailEvent';


// Admin - Role
import ListRole from './Page/@admin/Role/ListRole';
import CreateRole from './Page/@admin/Role/CreateRole';
import UpdateRole from './Page/@admin/Role/UpdateRole';
import DetailRole from './Page/@admin/Role/DetailRole';

// Student - Event
import ListEventS from './Page/@user/student/Event/ListEventS';
import DetailEventS from './Page/@user/student/Event/ADetailEventS'

// Student - Contribution
import ListContributionS from './Page/@user/student/Contribution/ListContributionS';
import CreateContributionS from './Page/@user/student/Contribution/CreateContributionS';
import UpdateContributionS from './Page/@user/student/Contribution/UpdateContributionS';
import DetailContributionS from './Page/@user/student/Contribution/DetailContributionS';

// Coordinators - Event
import ListEventC from './Page/@coordinator/Event/ListEventC';
import DetailEventC from './Page/@coordinator/Event/DetailEventC';

// Coordinators - Contribution
import ListContributionC from './Page/@coordinator/Contribution/ListContributionC';
import UpdateContributionC from './Page/@coordinator/Contribution/UpdateContributionC';
import DetailContributionC from './Page/@coordinator/Contribution/DetailContributionC';

// Coordinators - Public
import PublicContributionPC from './Page/@coordinator/Public/PublicContributionPC';
import DetailContributionPC from './Page/@coordinator/Public/DetailContributionPC';

// Manager - Event
import ListEventM from './Page/@manager/Event/ListEventM';
import DetailEventM from './Page/@manager/Event/DetailEventM';

// Manager - Public
import PublicContributionPM from './Page/@manager/Public/PublicContributionPM';
import DetailContributionPM from './Page/@manager/Public/DetailContributionPM';

// Guest - Public
import PublicContributionG from './Page/@user/guest/PublicContributionG';
import DetailContributionG from './Page/@user/guest/DetailContributionG';

// Auth
import LoginAM from './Page/Auth/LoginAM';
import Login from './Page/Auth/Login';
import ChangePassword from './Page/General/ChangePassword';
import Profile from './Page/General/Profile';
import Loading from './components/Loading';
import ForgotPassword from './Page/General/ForgotPassword';
import ResetPassword from './Page/General/ResetPassword';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // if (!token && window.location.pathname !== '/login/') {
    //   window.location.href = '/login/';
    // }

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.clear()
        window.location.href = '/login/';
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth */}
          <Route path='/login/' element={<Login />} />
          <Route path='/login/admin' element={<LoginAM />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />

          <Route
            path="*"
            element={
              isLoggedIn ? (
                <>
                  <NavBar />
                  <div className="Container">
                    <SideBar />
                    <Routes>
                      {/* Admin */}
                      {/* Account */}
                      <Route path='/admin/account' element={<ListAccount />} />
                      <Route path='/admin/account/create' element={<CreateAccount />} />
                      <Route path='/admin/account/update/:id' element={<UpdateAccount />} />
                      <Route path='/admin/account/detail/:id' element={<DetailAccount />} />

                      {/* Faculty */}
                      <Route path='/admin/faculty' element={<ListFaculty />} />
                      <Route path='/admin/faculty/create' element={<CreateFaculty />} />
                      <Route path='/admin/faculty/update/:id' element={<UpdateFaculty />} />
                      <Route path='/admin/faculty/detail/:id' element={<DetailFaculty />} />

                      {/* Event */}
                      <Route path='/admin/event' element={<ListEvent />} />
                      <Route path='/admin/event/create' element={<CreateEvent />} />
                      <Route path='/admin/event/update/:id' element={<UpdateEvent />} />
                      <Route path='/admin/event/detail/:id' element={<DetailEvent />} />

                      {/* Role */}
                      <Route path='/admin/role' element={<ListRole />} />
                      <Route path='/admin/role/create' element={<CreateRole />} />
                      <Route path='/admin/role/update/:id' element={<UpdateRole />} />
                      <Route path='/admin/role/detail/:id' element={<DetailRole />} />

                      {/* Student */}
                      <Route path='/student/event' element={<ListEventS />} />
                      <Route path='/student/event/detail/:id' element={<DetailEventS />} />
                      <Route path='/student/event/contribution/:id' element={<ListContributionS />} />
                      <Route path='/student/event/contribution/:id/create' element={<CreateContributionS />} />
                      <Route path='/student/event/contribution/:id/update/:id' element={<UpdateContributionS />} />
                      <Route path='/student/event/contribution/:id/detail/:id' element={<DetailContributionS />} />

                      {/* Coordinator */}
                      <Route path='/coordinator/event' element={<ListEventC />} />
                      <Route path='/coordinator/event/detail/:id' element={<DetailEventC />} />
                      <Route path='/coordinator/event/contribution/:id' element={<ListContributionC />} />
                      <Route path='/coordinator/event/contribution/:id/update/:id' element={<UpdateContributionC />} />
                      <Route path='/coordinator/event/contribution/:id/detail/:id' element={<DetailContributionC />} />
                      <Route path='/coordinator/public/:id' element={<PublicContributionPC />} />
                      <Route path='/coordinator/public/:id/detail/:id' element={<DetailContributionPC />} />

                      {/* Manager */}
                      <Route path='/manager/event' element={<ListEventM />} />
                      <Route path='/manager/event/detail/:id' element={<DetailEventM />} />
                      <Route path='/manager/public/:id' element={<PublicContributionPM />} />
                      <Route path='/manager/public/detail/:id' element={<DetailContributionPM />} />

                      {/* Guest */}
                      <Route path='/guest/public/' element={<PublicContributionG />} />
                      <Route path='/guest/public/detail/:id' element={<DetailContributionG />} />

                      {/* General */}
                      <Route path='/changepassword' element={<ChangePassword />} />
                      <Route path='/profile' element={<Profile />} />
                    </Routes>
                  </div>
                </>
              ) : (
                isLoggedIn === false ? '' : <Loading />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
