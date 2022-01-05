import React, { useState, useEffect } from 'react'
import { ProgressBar } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux'
import axios from 'axios';
import { BASE_URL } from '../../constance';
import authHeader from './AuthHeader';
import { useInterval } from '../UseInterval';
import swal from "sweetalert";

export default function Test() {

    const user = useSelector(state => state.auth.auth)
    const [tests, settests] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedProblem, setSelectedProblem] = useState({});
    const [problemNumbers, setProblemNumbers] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [difference, setDifference] = useState(0);
    const [ testIsEnded, setTestIsEnded ] = useState(false);
    const selectedTest = useSelector(state => state.selectedTest);
    const history = useHistory();

    useEffect(() => {
        setStartTime(Date.now())

        window.onbeforeunload = confirmExit;

        function confirmExit()
        {
            return "show warning";
        }
    }, [])

    useEffect(() => {
        if (testIsEnded) {
            axios.post(`${BASE_URL}/api/tests/result/${user.id}`, testResults, { headers: authHeader() })
                .then(res => {
                    console.log(res.data)
                    swal(res.data.toString(), "Congratulate your test!", "success");
                    history.push('/');
                })
        }
    }, [testIsEnded])

    useEffect(() => {

        setSelectedProblem(tests[currentPage]);
        
        if(tests.length > 0) {
            if (currentPage + 1 <= tests.length && currentPage - 1 > 0) {
                setProblemNumbers([currentPage - 1, currentPage, currentPage + 1]);
            } else if (currentPage - 1 <= 0 && tests.length >= 3) {
                setProblemNumbers([1, 2, 3]);
            } else if (currentPage + 1 > tests.length) {
                setProblemNumbers([tests.length - 2, tests.length - 1, tests.length]);
            } else if (tests.length < 3) {
                setProblemNumbers(Array(Math.ceil(tests.length))
                    .fill()
                    .map((_, i) => i + 1))
            }
        }
        
    }, [tests, currentPage]);

    useInterval(() => {
        if (difference <= selectedTest.time * 60) {
            setDifference(Number.parseInt((Date.now() - startTime)/1000));
            setTestIsEnded(true)
        }
    }, 1000)

    useEffect(() => {
        let selProblem = testResults.filter(t => t.id === selectedProblem.id);
        if (selProblem !== null) {
            setTestResults(testResults.map(t => {
                if (t.id === selectedProblem.id) return selectedProblem;
                else return t;
            }))
        } else {
            setTestResults([...testResults, selectedProblem]);
        }
    }, [currentPage]);

    const onSetAnswer = (id, value) => {
        selectedProblem.answers.map(a => {
            if (a.id === id) {
                a.state = value;
            }
            return a;
        })
    }
    
    useEffect(() => {

        axios.get(`${BASE_URL}/api/questions/byUserId/${user.id}`, { headers: authHeader() })
            .then(res => {
                settests(res.data);
            });
    }, []);

    return (

        <div className="container mt-5">

            <div className="row">

                <div className='col-12'>
                    <div className='card'>
                        <div className='card-body text-center ai-icon  text-primary'>
                        <h1 className='my-2'>
                            {
                                `${selectedTest.time - Number.parseInt(difference/60) -1} : ${60 - difference%60}`
                            }
                        </h1>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                         <h4 className="card-title">
                             Question 
                         </h4>
                        {
                                `Total time: ${selectedTest.time}`
                        }
                         <div style={{width: '300px'}}>
                            <ProgressBar
                                now={difference}
                                max={5*60}
                                variant={'danger'}
                                className="mt-3"
                                />
                         </div>
                     
                      </div>
                      <div className="card-body">
                         <div className="read-content-body">
                            <p>
                                {selectedProblem?.name}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                         <h4 className="card-title">
                             Answers
                         </h4>
                      </div>
                      <div className="card-body">
                            <div className="basic-form">
                                {
                                    selectedProblem?.answers?.map((a, id) => (
                                        <div className="custom-control custom-checkbox mb-3" key={ id }>
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={`answer-item-${a.id}`}
                                                onChange={e => onSetAnswer(a.id, e.target.value)}
                                                required
                                            />
                                            <label
                                                className="custom-control-label"
                                                htmlFor={`answer-item-${a.id}`}
                                            >
                                                {
                                                    a.value
                                                }
                                            </label>
                                        </div>
                                    ))
                                }
                        </div>
                     </div>
                   </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="dataTables_info">
                        Showing
                        {currentPage+1}
                        of {tests.length} entries
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
                                currentPage > 2 &&
                                <Pagination.Item>
                                    ...
                                </Pagination.Item>
                            }
                            {
                                problemNumbers.map((number, i) => (
                                    <Pagination.Item 
                                        className={
                                            currentPage === number ? "active" : ""
                                        }
                                        onClick={() => setCurrentPage(number)}
                                        key={i}
                                    >
                                        {number}
                                    </Pagination.Item>
                                ))
                            }
                            {
                                currentPage < tests.length-1 &&
                                <Pagination.Item>
                                    ...
                                </Pagination.Item>
                            }
                            <li
                                className="page-item page-indicator"
                                onClick={() =>
                                    currentPage + 1 <=
                                    tests.length &&
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

    )
}
