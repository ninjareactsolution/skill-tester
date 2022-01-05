import React, { Fragment, useState, useRef, useEffect } from "react";
import {  Pagination, Badge, Dropdown, Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../../constance/index.js";
import authHeader from "./AuthHeader.js";

const Users = (props) => {

    const [Users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [paggination, setPaggination] = useState([]);
    const sort = 8;

    const onSetUserRole = role => {

    }

    const onUserDelete = id => {
        
    }

    useEffect(() => {
        axios.get(`${BASE_URL}/api/account`, { headers: authHeader() })
            .then(res => {
                setUsers(res.data);
            })
    }, [])
   
    useEffect(() => {

        let cnt = Users.length > sort ? sort : (Users.length - currentPage * sort);
        setFilteredUsers(Users.slice(currentPage * sort, currentPage * sort + cnt));

    }, [Users, currentPage])

    useEffect(() => {
        let paggination = Array(Math.ceil(Users.length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);
        if (paggination.length - 1 < currentPage) {
            setCurrentPage(0);
        }

    }, [filteredUsers])


   return (
      <Fragment>
            <div className="row mb-3">
               <div className="col-md-12 text-right">

               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Users</h4>
                <div className="input-group search-area d-lg-inline-flex d-none mr-5">
                    <input
                        type="text"
                        value={searchKey}
                        className="form-control"
                        placeholder="Search here"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">
                            <svg
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                                    fill="#A4A4A4"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
               
            </div>
            <div className="card-body">
                  <div id="example_wrapper" className="dataTables_wrapper">
                     <Table >
                        <thead>
                           <tr role="row">
                                 <th >
                                    #
                                 </th>
                                 <th >
                                    Name
                                 </th>
                                <th className="text-center">
                                    Email
                                 </th>
                                 <th className="d-flex">
                                    Action
                                 </th>
                                 
                           </tr>
                        </thead>
                        <tbody>
                            {
                                filteredUsers
                                .map((a, id) => (
                                <tr key={id}>
                                    <td>
                                        {id}
                                     </td>
                                    <td>
                                        {a.userName}
                                    </td>
                                   
                                    <td className="text-center">
                                            {a.email}
                                    </td>
                                    
                                    <td className="d-flex">
                                        <Dropdown>
                                            <Dropdown.Toggle
                                            variant="success"
                                            className="light sharp icon-false"
                                            >
                                                <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"></rect>
                                                        <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                                        <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                                        <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                                                    </g>
                                                </svg>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                            <Dropdown.Item>Set Admin</Dropdown.Item>
                                            <Dropdown.Item>Set Student</Dropdown.Item>
                                            <Dropdown.Item>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    </tr>

                                    ))
                            }
                            </tbody>
                     </Table>
                     <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="dataTables_info">
                            Showing {currentPage * sort + 1} to 
                            {filteredUsers.length >
                                (currentPage + 1) * sort
                                ? filteredUsers.length
                                : (currentPage + 1) * sort}
                            of {Users.length} entries
                        </div>
                        <div className="dataTables_paginate paging_simple_numbers">
                           <Pagination
                              className="pagination-primary pagination-circle"
                              size="lg"
                           >
                              <li
                                 className="page-item page-indicator "
                                    onClick={() =>
                                        currentPage > 0 &&
                                        setCurrentPage(currentPage - 1)
                                 }
                              >
                                 <Link className="page-link" to="#">
                                    <i className="la la-angle-left" />
                                 </Link>
                              </li>
                            {
                                paggination.map((number, i) => (
                                    <Pagination.Item 
                                        className={
                                            currentPage === i ? "active" : ""
                                        }
                                       onClick={() => setCurrentPage(i)}
                                       key={i}
                                    >
                                       {number}
                                    </Pagination.Item>
                                 ))
                              }
                              <li
                                 className="page-item page-indicator"
                                    onClick={() =>
                                        currentPage + 1 <
                                        filteredUsers &&
                                        setCurrentPage(currentPage + 1)
                                 }
                              >
                                 <Link className="page-link" to="#">
                                    <i className="la la-angle-right" />
                                 </Link>
                              </li>
                           </Pagination>
                        </div>
                     </div>
                  </div>
            </div>
         </div>
      </div>
         </div>
      </Fragment>
   );
};

export default Users;
