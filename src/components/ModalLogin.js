import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { ContactContext, KEY_TOKEN, UserContext, KEY_USER } from '../App'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const ModalLogin = ({ isOpen, setIsOpen }) => {
    const {login, user, setUser, openRegisterModal} = useContext(UserContext)
    const {getContacts} = useContext(ContactContext)

    const [loggingIn, setLoggingIn] = useState(false)

    const closeModal = () => {
        setIsOpen(false)
    }
    const initialValues = {
        username: "",
        password: ""
    }
    const validationSchema = yup.object({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required")
    })
    const onSubmit = ({ username, password }) => {
        setLoggingIn(true)
        login(username, password)
            .then(res => {
                setLoggingIn(false)
                toast.success("Login sucessfully", {position: "bottom-right"})
                setTimeout(()=>{closeModal()}, 1000)
                //storing login session in user's browser
                localStorage.setItem(KEY_TOKEN, res.data.token)
                localStorage.setItem(KEY_USER, JSON.stringify(res.data.user))
                setUser(res.data.user)

                getContacts()
            })
            .catch(err => {
                setLoggingIn(false)
                toast.error(err.response.data.message)
            })
            .finally(() => {
            })
    }
    return (
        <Modal isOpen={isOpen} centered toggle={closeModal}>
            <ModalHeader>
                Let's get started! Login!
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    <Form>
                        <FormGroup>
                            <Label>Username</Label>
                            <Field as={Input} name="username" placeholder="Enter username" />
                            <ErrorMessage name="username">
                                {msg => <div className="alert alert-danger mt-1">{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Field as={Input} name="password" type="password" placeholder="Enter password" />
                            <ErrorMessage name="password">
                                {msg => <div className="alert alert-danger mt-1">{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>
                        <div className="d-flex justify-content-end">
                            <Button disabled={loggingIn} color="primary" className="ml-2">Login</Button>
                            <Button color="link" disabled={loggingIn} onClick={()=>{closeModal(); openRegisterModal()}} type="button" className="ml-2">Don't have an account, Register.</Button>
                        </div>
                    </Form>
                </Formik>
            </ModalBody>
        </Modal>
    )
}


export default ModalLogin