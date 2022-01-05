import React, { Component, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import MetisMenu from "metismenujs";
import drump from "../../../images/card/drump.png";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from "../../../store/actions/AuthActions";

class MM extends Component {
   componentDidMount() {
      this.$el = this.el;
      this.mm = new MetisMenu(this.$el);
   }

   render() {
      return (
         <div className="mm-wrapper">
            <ul className="metismenu" ref={(el) => (this.el = el)}>
               {this.props.children}
            </ul>
         </div>
      );
   }
}

const SideBar = (props) => {

   useEffect(() => {
      var btn = document.querySelector(".nav-control");
      var aaa = document.querySelector("#main-wrapper");

      function toggleFunc() {
         return aaa.classList.toggle("menu-toggle");
      }

      btn.addEventListener("click", toggleFunc);   

   }, []);

    const user = useSelector(state => state.auth.auth)
    let path = window.location.pathname;
    path = path.split("/");
    path = path[path.length - 1];
    const dispatch = useDispatch();
    const history = useHistory();

   return (
      <div className="deznav">
         <PerfectScrollbar className="deznav-scroll">
               <MM className="metismenu" id="menu">
                   <li
                       className={`${path === '' ? "mm-active" : ""
                           }`}
                   >
                       <Link to="/">
                           <i className="flaticon-381-networking"></i>
                           <span className="nav-text">Home</span>
                       </Link>
                   </li>

                   {
                       user.id && user.roles[0] !== "User" &&
                       (
                           <>
                               <li
                                   className={`${path === 'skills' ? "mm-active" : ""
                                       }`}
                               >
                                   <Link to="/skills">
                                       <i className="flaticon-381-television"></i>
                                       <span className="nav-text">Skills</span>
                                   </Link>
                               </li>
                               <li
                                   className={`${window.location.pathname.includes('questions') ? "mm-active" : ""
                                       }`}
                               >
                                   <Link to="/questions/-1">
                                       <i className="flaticon-381-layer-1"></i>
                                       <span className="nav-text">Questions</span>
                                   </Link>
                               </li>
                               <li
                                   className={`${path === 'users' ? "mm-active" : ""
                                       }`}
                               >
                                   <Link to="/users">
                                       <i className="la la-users"></i>
                                       <span className="nav-text">Users</span>
                                   </Link>
                               </li>
                       </>
                        )
                   }
                   {
                       user.id && user.roles[0] === "User" &&
                       <li
                           className={`${path === 'mytests' ? "mm-active" : ""
                               }`}
                       >
                           <Link to="/mytests">
                               <i className="la la-clock"></i>
                               <span className="nav-text">My test</span>
                           </Link>
                       </li>
                   }
               
                   {
                       user.id && user.roles[0] !== "User" &&
                       <li
                           className={`${path === 'admin-tests' ? "mm-active" : ""
                               }`}
                       >
                           <Link to="/admin-tests">
                               <i className="flaticon-381-notepad"></i>
                               <span className="nav-text">Tests</span>
                           </Link>
                       </li>
                   }
               
               <li>
                <Link to="#" onClick={e => dispatch(logout(history))}>
                  <svg
                     id="icon-logout" xmlns="http://www.w3.org/2000/svg"
                     className="text-danger" width={18} height={18} viewBox="0 0 24 24" 
                     fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  >
                     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                     <polyline points="16 17 21 12 16 7" />
                     <line x1={21} y1={12} x2={9} y2={12} />
                  </svg>
                  <span className="nav-text">Log out</span>
               </Link>
               </li>

            </MM>
            <div className="drum-box mt-5">
               <img src={drump} alt="" />
               <p className="fs-18 font-w500 mb-4">
                  Start Plan Your Workout
               </p>
               
            </div>

           
         </PerfectScrollbar>
      </div>
   );
}

export default SideBar;
