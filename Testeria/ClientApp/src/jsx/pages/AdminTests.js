import React, { Fragment, useState, useRef, useEffect } from "react";
import {  Pagination, Badge, Dropdown, Button, Modal, Table, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../../constance/index.js";
import Select from "react-select";
import authHeader from "./AuthHeader.js";
import { useSelector } from 'react-redux'

const AdminTests = (props) => {

    const [Tests, setTests] = useState([])
    const [filteredTests, setFilteredTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [paggination, setPaggination] = useState([]);
    const [modalCentered, setModalCentered] = useState(false);

    const skills = useSelector(state => state.skills);
    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState({});
    const [selectedSkill, setSelectedSkill] = useState({});
    const [time, setTime] = useState(0);
    const [testId, setTestId] = useState('');
    const sort = 8;

    useEffect(() => {
        axios.get(`${BASE_URL}/api/tests`, { headers: authHeader() })
            .then(res => {
                setTests(res.data);
            })

        axios.get(`${BASE_URL}/api/account`, { headers: authHeader() })
            .then(res => {
                if (res.data.length > 0) {
                    setUsers(res.data.map(u => ({ id: u.id, label: u.email, value: u.email })));
                }
            })
    }, [])

    useEffect(() => {

        let cnt = Tests.length > sort ? sort : (Tests.length - currentPage * sort);
        setFilteredTests(Tests.slice(currentPage * sort, currentPage * sort + cnt));

    }, [Tests, currentPage])

    useEffect(() => {
        let paggination = Array(Math.ceil(Tests.length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);

        if (paggination.length - 1 < currentPage) {
            setCurrentPage(0);
        }

    }, [filteredTests])
    
    const onSaveNewTests = (e) => {
        const newTest = {
            userId: selectedUser.id,
            skillId: selectedSkill.id,
            testId,
            time: Number.parseInt(time),
            state: false,
            mark: 0,
        }
        axios.post(`${BASE_URL}/api/tests`, newTest, { headers: authHeader() })
            .then(res => {
                setTests([...Tests, res.data])
            })
    }

    const onDeleteTest = id => {
        axios.delete(`${BASE_URL}/api/tests/${id}`, { headers: authHeader() })
            .then(res => {
                setTests(Tests.filter(t => t.id !== id));
            })
    }
   
   return (
      <Fragment>
            <div className="row mb-3">
               <div className="col-md-12 text-right">
                   <Button variant="info btn-rounded" onClick={() => setModalCentered(true)}>
                        <span className="btn-icon-left text-info">
                           <i className="fa fa-plus color-info" />
                        </span>
                        Create
                   </Button>

                   <Modal className="fade" show={modalCentered}>
                       <Modal.Header>
                           <Modal.Title>Create Tests</Modal.Title>
                           <Button
                               onClick={() => setModalCentered(false)}
                               variant=""
                               className="close"
                           >
                               <span>&times;</span>
                           </Button>
                       </Modal.Header>
                       <Modal.Body>
                           <div className="form-group">
                                <Select
                                    options={users}
                                    placeholder="User"
                                    onChange={setSelectedUser}
                                    defaultValue={selectedUser}
                                    style={{
                                    lineHeight: "40px",
                                    color: "#7e7e7e",
                                    paddingLeft: " 15px",
                                    }}
                                />
                            
                           </div>
                           <div className="form-group">
                                <Select
                                    options={skills}
                                    placeholder="Skill"
                                    defaultValue={selectedSkill}
                                    onChange={setSelectedSkill}
                                    style={{
                                    lineHeight: "40px",
                                    color: "#7e7e7e",
                                    paddingLeft: " 15px",
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                   type="number"
                                   value={time}
                                   onChange={e => setTime(e.target.value)}
                                    className="form-control input-default "
                                    placeholder="minutes"
                                />
                           </div>

                           <div className="form-group">
                               <input
                                   type="text"
                                   value={testId}
                                   onChange={e => setTestId(e.target.value)}
                                   className="form-control input-default "
                                   placeholder="Test Id"
                               />
                           </div>
    
    
                       </Modal.Body>
                       <Modal.Footer>
                           <Button
                               onClick={() => setModalCentered(false)}
                               variant="danger light"
                           >
                               Close
                           </Button>
                           <Button variant="primary" onClick={onSaveNewTests}>Add Tests</Button>
                       </Modal.Footer>
                   </Modal>


               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Tests</h4>
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
                                    User Email
                                 </th>
                                <th>
                                    Skill
                                </th>
                                <th>
                                    Test ID
                                </th>
                                 <th>
                                    Time
                                 </th>
                                 <th>
                                    Action
                                 </th>
                                 
                           </tr>
                        </thead>
                        <tbody>
                            {
                                filteredTests
                                .map((a, id) => (
                                <tr key={id}>
                                    <td>
                                        {id}
                                     </td>
                                        <td>
                                            {a.user.email}
                                    </td>
                                    <td>
                                        {a.skill.name}
                                    </td>
                                    <td>
                                        {a.testId}
                                    </td>
                                    <td className="text-center">
                                            {a.time}
                                    </td>
                                    
                                    <td className="d-flex">
                                        <div >
                                            <Link
                                            to="#"
                                            className="btn btn-primary shadow btn-xs sharp mr-1"
                                            >
                                            <i className="fa fa-pencil"></i>
                                            </Link>
                                            <Link
                                            to={`#`}
                                            className="btn btn-danger shadow btn-xs sharp"
                                            onClick={() => onDeleteTest(a.id)}
                                            >
                                            <i className="fa fa-trash"></i>
                                            </Link>
                                        </div>
                                    </td>
                                    </tr>

                                    ))
                            }
                            </tbody>
                     </Table>
                     <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="dataTables_info">
                            Showing {currentPage * sort + 1} to 
                            {filteredTests.length >
                                (currentPage + 1) * sort
                                ? filteredTests.length
                                : (currentPage + 1) * sort}
                            of {Tests.length} entries
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
                                        filteredTests &&
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

export default AdminTests;
