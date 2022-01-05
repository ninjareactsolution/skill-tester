import React, { useEffect, useState } from "react";

import axios from 'axios';
import { BASE_URL } from "../../constance";
import authHeader from "./AuthHeader";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { setTestAction } from "../../store/actions/TestActions";

export default function MyTests() {

    const [ tests, setTests ] = useState([]);
    const user = useSelector(state => state.auth.auth)
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`${BASE_URL}/api/tests/byUserId/${user.id}`, { headers: authHeader() })
            .then(res => {
                setTests(res.data);
            })
    }, [])
  
   return (
        <div className="row">
           {
                    tests
                   .map((t, id) => (
                       <div className='col-12' key={ id}>
                        <div className='card'>
                            <div className='card-body text-center ai-icon  text-primary'>
                            <h2 className='my-2'>
                                {
                                    t.skill?.name
                                }
                            </h2>
                            <h4 className='my-2'>
                                {
                                    t.time
                                }
                            </h4>
                            <Link
                                onClick={() => dispatch(setTestAction(t))}
                                to='/page-confirm'
                                className='btn my-2 btn-primary btn-lg px-4'
                            >
                                Start the test
                            </Link>
                            </div>
                        </div>
                    </div>
                ))   
            }
        </div>
   );
}
