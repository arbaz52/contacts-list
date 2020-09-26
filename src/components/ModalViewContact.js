import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import * as yup from 'yup'
import { ContactContext } from '../App'

const ModalViewContact = (props) => {
    const { updateContact, deleteContact, getContacts } = useContext(ContactContext)


    const { isOpen, setIsOpen } = props
    const [_id, set_id] = useState(props._id)


    const initialValues = {
        name: props.name,
        mobile: props.mobile
    }
    const validationSchema = yup.object({
        name: yup.string().required(),
        mobile: yup.string().required()
    })
    const onSubmit = ({ name, mobile }) => {
        setDoing(true)
        updateContact(_id, name, mobile)
            .then(res => {
                setDoing(false)
                toast.success("Contact sucessfully updated!", {position: "bottom-right"})
                setTimeout(()=>{closeModal()}, 5000)
                getContacts()
            })
            .catch(err => {
            })
            .finally(() => {
            })
    }



    const closeModal = () => {
        setIsOpen(false)
    }

    const [doing, setDoing] = useState(false)
    const _delete = () => {
        setDoing(true)
        deleteContact(_id)
            .then(res => {
                setDoing(false)
                toast.success("Contact sucessfully deleted!", {position: "bottom-right"})
                setTimeout(()=>{closeModal()}, 2000)
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
                Contact Details of {props.name}
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
                            <Button className="ml-2" disabled={doing} color="primary" type="submit">Update Contact</Button>
                            <Button className="ml-2" disabled={doing} color="danger" type="button" onClick={_delete}>Delete</Button>
                        </div>
                    </Form>
                </Formik>
            </ModalBody>
        </Modal>
    )
}


export default ModalViewContact