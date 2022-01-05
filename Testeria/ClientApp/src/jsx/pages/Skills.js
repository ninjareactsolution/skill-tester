import React, { Fragment, useState, useEffect } from "react";
import {  Pagination, Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../../constance/index.js";
import authHeader from "./AuthHeader.js";
import { useDispatch, useSelector } from 'react-redux'
import { createSkillsAction, removeSkillAction } from "../../store/actions/skillActions.js";
import swal from "sweetalert";

const Skills = (props) => {

    const skills = useSelector(state => state.skills);
    const [filteredskills, setFilteredskills] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [paggination, setPaggination] = useState([]);
    const [modalCentered, setModalCentered] = useState(false);
    const [newskills, setNewskills] = useState([]);
    const sort = 8;
    const dispatch = useDispatch();

    const onKeyDown = event => {
        if (event.key === 'Enter') {
            setNewskills([...newskills, event.target.value]);
            event.target.value = ''
        }
    }

    const onRemove = id => {
        setNewskills(newskills?.filter((p, i) => i !== id))
    }

    const onRemoveSkill = id => {
        axios.delete(`${BASE_URL}/api/skills/${id}`, { headers:  authHeader()})
        .then(res => {
            dispatch(removeSkillAction(id))
        })
    }
   
    useEffect(() => {

        let cnt = skills?.length > sort ? sort : (skills?.length - currentPage * sort);
        setFilteredskills(skills?.slice(currentPage * sort, currentPage * sort + cnt));

    }, [skills, currentPage])

    useEffect(() => {
        let paggination = Array(Math.ceil(skills?.length / sort))
            .fill()
            .map((_, i) => i + 1);

        setPaggination(paggination);
        if (paggination.length - 1 < currentPage) {
            setCurrentPage(0);
        }
    }, [filteredskills])

    
    const onSaveNewSkills = (e) => {
        if (newskills.length === 0) {
            swal("Oops", "Please add any skill!", "error");
            return;
        }

        let savedSkills = newskills?.map((s, i) => ({
            name: s,
        }))

        axios.post(`${BASE_URL}/api/skills/many`, savedSkills, { headers:  authHeader()})
            .then(res => {
                dispatch(createSkillsAction(res.data));
                setNewskills([]);
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
                           <Modal.Title>Create Skills</Modal.Title>
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
                              <input
                                   type="text"
                                   className="form-control input-rounded"
                                   placeholder="Please press Enter."
                                   onKeyUp={onKeyDown}
                              />
                           </div>
                           <Table responsive>
                              <thead>
                                 <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                               <tbody>
                                   {
                                       newskills?.map((p, i) => (
                                           <tr key={ i}>
                                               <th>{ i+1}</th>
                                               <td>{p}</td>
                                               <td><Button variant="danger" onClick={() => onRemove(i)}>Delete</Button></td>
                                           </tr>
                                           ))
                                   }
                              </tbody>
                           </Table>
                       </Modal.Body>
                       <Modal.Footer>
                           <Button
                               onClick={() => setModalCentered(false)}
                               variant="danger light"
                           >
                               Close
                           </Button>
                           <Button variant="primary" onClick={onSaveNewSkills}>Add Skills</Button>
                       </Modal.Footer>
                   </Modal>


               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Skills</h4>
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
                                    Question count
                                 </th>
                                 <th className="d-flex">
                                    Action
                                 </th>
                                 
                           </tr>
                        </thead>
                        <tbody>
                            {
                                filteredskills?.map((a, id) => (
                                <tr key={id}>
                                    <td>
                                        {id+1}
                                     </td>
                                    <td>
                                        {a.label}
                                    </td>
                                   
                                    <td className="text-center">
                                            {a.count}
                                    </td>
                                    
                                    <td className="d-flex">
                                        <div >
                                            <Link
                                            to={`/questions/${a.id}`}
                                            className="btn btn-primary shadow btn-xs sharp mr-1"
                                            >
                                            <i className="fa fa-pencil"></i>
                                            </Link>
                                            <Link
                                            to="#"
                                            onClick={() => onRemoveSkill(a.id)}
                                            className="btn btn-danger shadow btn-xs sharp"
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
                            {filteredskills?.length >
                                (currentPage + 1) * sort
                                ? filteredskills?.length
                                : (currentPage + 1) * sort}
                            of {skills?.length} entries
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
                                        filteredskills &&
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

export default Skills;
