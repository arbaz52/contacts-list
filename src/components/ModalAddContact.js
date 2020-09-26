import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { ContactContext } from '../App'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const ModalAddContact = ({ isOpen, setIsOpen }) => {
    const { addContact, getContacts } = useContext(ContactContext)
    const [adding, setAdding] = useState(false)

    const closeModal = () => {
        setIsOpen(false)
    }
    const initialValues = {
        name: "",
        mobile: ""
    }
    const validationSchema = yup.object({
        name: yup.string().required("Name is required"),
        mobile: yup.string().required("Mobile number is required")
    })
    const onSubmit = ({ name, mobile }) => {
        setAdding(true)
        addContact(name, mobile)
            .then(res => {
                setAdding(false)
                toast.success("Contact sucessfully added!", {position: "bottom-right"})
                setTimeout(()=>{closeModal()}, 1000)
                getContacts()
            })
            .catch(err => {
            })
            .finally(() => {
            })
    }
    return (
        <Modal isOpen={isOpen} centered toggle={closeModal}>
            <ModalHeader>
                Let's add a new contact!
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    <Form>
                        <FormGroup>
                            <Label>Name of this contact</Label>
                            <Field as={Input} name="name" placeholder="Enter name" />
                            <ErrorMessage name="name">
                                {msg => <div className="alert alert-danger mt-1">{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                            <Label>Mobile Number</Label>
                            <Field as={Input} name="mobile" placeholder="Enter mobile number" />
                            <ErrorMessage name="mobile">
                                {msg => <div className="alert alert-danger mt-1">{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>
                        <div className="d-flex justify-content-end">
                            <Button disabled={adding} color="primary" className="ml-2">Add Contact</Button>
                            <Button disabled={adding} onClick={closeModal} type="button" className="ml-2">Cancel</Button>
                        </div>
                    </Form>
                </Formik>
            </ModalBody>
        </Modal>
    )
}


export default ModalAddContact