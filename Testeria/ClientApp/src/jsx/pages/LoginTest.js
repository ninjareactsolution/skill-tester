import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const LockScreen = ({ history }) => {

    const test = useSelector(state => state.selectedTest)
    const [ testId, setTestId ] = useState('');

    const submitHandler = (e) => {
    e.preventDefault()
    if(test.testId === testId) {
        history.push('/page-test');
    }
    }

  return (
    <div className='authincation h-100 p-meddle'>
      <div className='container h-100'>
        <div className='row justify-content-center h-100 align-items-center'>
          <div className='col-md-6'>
            <div className='authincation-content'>
              <div className='row no-gutters'>
                <div className='col-xl-12'>
                  <div className='auth-form'>
                    <h4 className='text-center mb-4 '>
                      Please input your test ID
                    </h4>
                    <form action='' onSubmit={(e) => submitHandler(e)}>
                      <div className='form-group'>
                        <label className=''>
                          <strong>Test ID</strong>
                        </label>
                        <input
                          type='text'
                          onChange={e => setTestId(e.target.value)}
                          className='form-control'
                          name='testId'
                        />
                      </div>
                      <div className='text-center'>
                        <input
                          type='submit'
                          value='Unlock'
                          className='btn btn-primary btn-block'
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LockScreen
