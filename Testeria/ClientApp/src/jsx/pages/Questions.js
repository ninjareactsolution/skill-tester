import React, { Fragment, useState, useEffect } from "react";
import {  Pagination, Badge, Dropdown, Button, Modal, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../constance/index.js";
import axios from 'axios'
import Select from "react-select";
import { useSelector } from 'react-redux'
import authHeader from "./AuthHeader.js";

const Questions = () => {

    const [ Questions, setQuestions ] = useState([])
    const [ filteredQuestions, setFilteredQuestions ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ byFilter, setByFilter ] = useState(100);
    const [paggination, setPaggination] = useState([]);
    const params = useParams();
    const skills = useSelector(state => state.skills);
    const [ question, setQuestion ] = useState('');
    const [ answers, setAnswers ] = useState([]);
    const [ selectedSkill, setSelectedSkill ] = useState(null);
    const [ questionDetailModal, setQuestionDetailModal ] = useState(false);
    const [ selectedQuestion, setSelectedQuestion ] = useState({});
    const [ questionIsEdit, setQuestionIsEdit ] = useState(false);
    const [ modalCentered, setModalCentered ] = useState(false);
    const sort = 8;

    useEffect(() => {
        axios.get(`${BASE_URL}/api/questions`, { headers: authHeader() })
            .then(res => {
                if (res.data.length > 0) {
                    setQuestions(res.data.map(q => {
                        let answers = q.answers.map(a => ({ ...a, isComplete: true }))
                        return { ...q, answers }
                    }));
                }
                
            });
    }, [])

    useEffect(() => {

        let cnt = Questions.length > sort ? sort : (Questions.length - currentPage * sort);
        setFilteredQuestions(Questions.filter(o => byFilter === 100 ? true : byFilter === 2 ? o.target === byFilter : o.target === byFilter && o.agentId === params.agentId).slice(currentPage * sort, currentPage * sort + cnt));

    }, [Questions, currentPage, byFilter])

    useEffect(() => {
        let paggination = Array(Math.ceil(Questions.filter(o => byFilter === 100 ? true : byFilter === 2 ? o.target === byFilter : o.target === byFilter && o.agentId === params.agentId).length / sort))
            .fill()
            .map((_, i) => i + 1);
        setPaggination(paggination);

    }, [filteredQuestions])

    const onAddAnswer = () => {
        setAnswers([...answers, { id: answers.length, value: '', state: false, isComplete: false }]);
    }

    const onRemoveQuestion = id => {
        axios.delete(`${BASE_URL}/api/questions/${id}`, { headers: authHeader() })
             .then(res => {
                 let changedProcess = Questions.filter(p => p.id != id)
                 setQuestions(changedProcess);
             });
    }

    const onRemove = id => {
        setAnswers(answers.filter(a => a.id !== id));
    }

    const onAnswerToggle = id => {
        setAnswers(answers.map(a => {
            if(a.id === id) return {
                ...a,
                isComplete: !a.isComplete
            }
            return a;
        }))
    }

    const onAnswerState = (id, state) => {
        setAnswers(answers.map(a => {
            if(a.id === id) return {
                ...a,
                state
            }
            return a;
        }));

    }

    const onEditAnswer = (id, value) => {
        setAnswers(answers.map(a => {
            if(a.id === id) return {
                ...a,
                value
            }
            return a;
        }))
    }

    const onSaveQuestion = () => {

        const newQuestion = {
            skillId: selectedSkill.id,
            name: question,
            answers
        }
        axios.post(`${BASE_URL}/api/questions`, newQuestion, { headers: authHeader() })
            .then(res => {
                let answers = res.data.answers.map(a => ({...a, isComplete: true}))
                setQuestions([...Questions, { ...res.data, answers }])
                setAnswers([]);
            })
    }

    const selectedQuestionSave = () => {
      
        axios.put(`${BASE_URL}/api/questions`, selectedQuestion, { headers: authHeader() })
            .then(res => {
                let answers = res.data.answers.map(a => ({...a, isComplete: true}))
                let index = Questions.findIndex(q => q.id === res.data.id);
                Questions.splice(index, 1, { ...res.data, answers })
                setQuestions(Questions);
            })
    }

    const onSelectedQuestionAnswerChange = (id, value, type) => {
        setSelectedQuestion({...selectedQuestion, answers: selectedQuestion.answers.map(s => {
            if(s.id === id) {
                switch(type) {
                    case 'state':
                        return { ...s, state: value };
                    case 'isComplete':
                        return { ...s, isComplete: value };
                    case 'answer':
                        return { ...s, value };
                    default:
                        return s;
                }
            }
            return s;
        })})
        
    }

    const byFilterLabel = id => {
        switch (id) {
            case 0:
                return 'Current';
            case 1:
                return 'Always';
            case 2:
                return 'Global';
            default:
                return 'All';
        }
    }

   return (
      <Fragment>
            <div className="row mb-3">
               <div className="col-md-12 text-right">
                     <Button variant="info btn-rounded" onClick={() => setModalCentered(true)}>
                        <span className="btn-icon-left text-info">
                           <i className="fa fa-plus color-info" />
                        </span>
                        Add
                     </Button>

                     <Modal className="fade" show={modalCentered}>
                        <Modal.Header>
                           <Modal.Title>Create Question</Modal.Title>
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
                                onChange={setSelectedSkill}
                                options={skills}
                                defaultValue={selectedSkill}
                                style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                                }}
                            />
                           </div>
                           <div className="form-group">
                              <textarea
                                 className="form-control"
                                 rows="4"
                                 id="comment"
                                 onChange={e => setQuestion(e.target.value)}
                              ></textarea>
                           </div>
                            <div className="col-md-12 text-right">
                                <Button variant="success" onClick={onAddAnswer}>
                                    ADD{" "}
                                    <span className="btn-icon-right">
                                        <i className="fa fa-plus" />
                                    </span>
                                </Button>
                            </div>
                           <Table responsive>
                              <thead>
                                 <tr>
                                    <th>#</th>
                                    <th>Answer</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                               <tbody>
                                   {
                                       answers.map((p, i) => (
                                           <tr key={i}>
                                                <th>
                                                    <div className="custom-control custom-checkbox checkbox-success check-lg mr-3">
                                                        <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        onChange={e => onAnswerState(p.id, e.target.checked)}
                                                        id={`checkbox-${i}`}
                                                        />
                                                        <label
                                                        className="custom-control-label"
                                                        htmlFor={`checkbox-${i}`}
                                                        ></label>
                                                    </div>
                                                </th>
                                                <td>
                                                    <input
                                                        value={p.value}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        disabled={p.isComplete}
                                                        onChange={e => onEditAnswer(p.id, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <div >
                                                        {
                                                            p.isComplete ? 
                                                            <Link
                                                                to="#"
                                                                className="btn btn-primary shadow btn-xs sharp mr-1"
                                                                onClick={e => onAnswerToggle(p.id)}
                                                                >
                                                                <i className="fa fa-pencil"></i>
                                                            </Link> : 
                                                            <Link
                                                            to="#"
                                                            className="btn btn-success shadow btn-xs sharp mr-1"
                                                            onClick={e => onAnswerToggle(p.id)}
                                                            >
                                                            <i className="fa fa-check"></i>
                                                            </Link>
                                                        }
                                                        <Link
                                                        to="#"
                                                        className="btn btn-danger shadow btn-xs sharp"
                                                        onClick={e => onRemove(p.id)}
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
                        </Modal.Body>
                        <Modal.Footer>
                           <Button
                              onClick={() => setModalCentered(false)}
                              variant="danger light"
                           >
                              Close
                           </Button>
                           <Button variant="primary" onClick={onSaveQuestion}>Save changes</Button>
                        </Modal.Footer>
                     </Modal>

                     <Modal className="fade" show={questionDetailModal}>
                        <Modal.Header>
                           <Modal.Title>Create Question</Modal.Title>
                           <Button
                              onClick={() => setQuestionDetailModal(false)}
                              variant=""
                              className="close"
                           >
                              <span>&times;</span>
                           </Button>
                        </Modal.Header>
                        <Modal.Body>
                           <div className="form-group">
                           <Select
                                onChange={e => setSelectedQuestion({...selectedQuestion, skill: e})}
                                options={skills}
                                defaultValue={skills.find(s => s.id === selectedQuestion.skillId)}
                                style={{
                                lineHeight: "40px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                                }}
                            />
                           </div>
                           <div className="form-group">
                              <textarea
                                 className="form-control"
                                   rows="4"
                                   value={selectedQuestion.name}
                                 disabled={!questionIsEdit}
                                 onChange={e => setSelectedQuestion({...selectedQuestion, question: e.target.value})}
                              ></textarea>
                              <div className="col-md-12 text-right">
                                  {
                                      questionIsEdit ? 
                                      <Link
                                            to="#"
                                            className="btn btn-success shadow btn-xs sharp mr-1"
                                            onClick={e => setQuestionIsEdit(false)}
                                            >
                                            <i className="fa fa-check"></i>
                                        </Link>:
                                        <Link
                                            to="#"
                                            className="btn btn-primary shadow btn-xs sharp mr-1"
                                            onClick={e => setQuestionIsEdit(true)}
                                            >
                                            <i className="fa fa-pencil"></i>
                                        </Link>
                                  }
                                
                               
                            </div>
                           </div>
                           
                           <Table responsive>
                              <thead>
                                 <tr>
                                    <th>#</th>
                                    <th>Answer</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                               <tbody>
                                   {
                                       selectedQuestion.answers?.map((p, i) => (
                                           <tr key={i}>
                                                <th>
                                                    <div className="custom-control custom-checkbox checkbox-success check-lg mr-3">
                                                        <input
                                                        checked={p.state || ''}
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id={`checkbox-${i}`}
                                                        onChange={e => onSelectedQuestionAnswerChange(p.id, e.target.checked, 'state')}
                                                        />
                                                        <label
                                                        className="custom-control-label"
                                                        htmlFor={`checkbox-${i}`}
                                                        ></label>
                                                    </div>
                                                </th>
                                                <td>
                                                    <input
                                                        value={p.value}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        disabled={p.isComplete}
                                                        onChange={e => onSelectedQuestionAnswerChange(p.id, e.target.value, 'answer')}
                                                    />
                                                </td>
                                                <td>
                                                    <div >
                                                        {
                                                            p.isComplete ? 
                                                            <Link
                                                                to="#"
                                                                className="btn btn-primary shadow btn-xs sharp mr-1"
                                                                onClick={e => onSelectedQuestionAnswerChange(p.id, false, 'isComplete')}
                                                            >
                                                            <i className="fa fa-pencil"></i>
                                                            </Link> :
                                                            <Link
                                                                to="#"
                                                                className="btn btn-success shadow btn-xs sharp mr-1"
                                                                onClick={e => onSelectedQuestionAnswerChange(p.id, true, 'isComplete')}
                                                                >
                                                                <i className="fa fa-check"></i>
                                                            </Link>
                                                        }
                                                        
                                                        <Link
                                                        to="#"
                                                        className="btn btn-danger shadow btn-xs sharp"
                                                        onClick={e => setSelectedQuestion({...selectedQuestion, answers: selectedQuestion.answers.filter(s => s.id !== p.id)})}
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
                        </Modal.Body>
                        <Modal.Footer>
                           <Button
                              onClick={() => setQuestionDetailModal(false)}
                              variant="danger light"
                           >
                              Close
                           </Button>
                           <Button variant="primary" onClick={selectedQuestionSave}>Save changes</Button>
                        </Modal.Footer>
                     </Modal>

               </div>
            </div>
         <div className="row">
         <div className="col-12">
         <div className="card">
            <div className="card-header">
                <h4 className="card-title">Questions</h4>
                {
                    params.agentId !== '-1' &&
                    <Dropdown className="dropdown mt-sm-0 mt-3">
                        <Dropdown.Toggle
                            as="button"
                            variant=""
                            className="btn rounded border border-light dropdown-toggle"
                        >
                            {byFilterLabel(byFilter)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                            <Dropdown.Item onClick={() => setByFilter(100)}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => setByFilter(0)}>Current</Dropdown.Item>
                            <Dropdown.Item onClick={() => setByFilter(1)}>Always</Dropdown.Item>
                            <Dropdown.Item onClick={() => setByFilter(2)}>Global</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </div>
            <div className="card-body">
                  <div id="example_wrapper" className="dataTables_wrapper">
                            <Table id="example" className="display w-100 dataTable">
                                <thead>
                                    <tr role="row">
                                        <th >
                                            Skill
                                        </th>
                                        <th>
                                            Question
                                        </th>
                                        <th className="text-center">
                                            Answer Count
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                           filteredQuestions
                                            .map((a, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {a.skill.name}
                                                </td>
                                                <td>
                                                    {a.name}
                                                </td>
                                                <td className="text-center">
                                                    {a.answers.length}
                                                </td>
                                                <td className="d-flex">
                                                <div >
                                                    <Link
                                                        to="#"
                                                        className="btn btn-primary shadow btn-xl sharp mr-1"
                                                        onClick={() => {setSelectedQuestion(a); setQuestionDetailModal(true)}}
                                                        >
                                                        <i className="fa fa-eye"></i>
                                                    </Link>
                                                    <Link
                                                    to="#"
                                                    className="btn btn-danger shadow btn-xl sharp"
                                                    onClick={() => onRemoveQuestion(a.id)}
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
                                           {filteredQuestions.length >
                                               (currentPage + 1) * sort
                                               ? filteredQuestions.length
                                               : (currentPage + 1) * sort}
                                           of {Questions.length} entries
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
                                                       filteredQuestions &&
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

export default Questions;
