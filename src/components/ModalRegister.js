import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { ContactContext, KEY_TOKEN, UserContext, KEY_USER } from '../App'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const ModalRegister = ({ isOpen, setIsOpen }) => {
    const {register, user, setUser} = useContext(UserContext)
    const {getContacts} = useContext(ContactContext)

    const [registering, setRegistering] = useState(false)

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
        setRegistering(true)
        register(username, password)
            .then(res => {
                setRegistering(false)
                toast.success("registered sucessfully", {position: "bottom-right"})
                setTimeout(()=>{closeModal()}, 1000)
                //storing login session in user's browser
                localStorage.setItem(KEY_TOKEN, res.data.token)
                localStorage.setItem(KEY_USER, JSON.stringify(res.data.user))
                setUser(res.data.user)

                getContacts()
            })
            .catch(err => {
                setRegistering(false)
                toast.error(err.response.data.message)
            })
            .finally(() => {
            })
    }
    return (
        <Modal isOpen={isOpen} centered toggle={closeModal}>
            <ModalHeader>
                Let's get started! <b>Register today</b>
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
                            <Button disabled={registering} color="primary" className="ml-2">Register!</Button>
                        </div>
                    </Form>
                </Formik>
            </ModalBody>
        </Modal>
    )
}


export default ModalRegister