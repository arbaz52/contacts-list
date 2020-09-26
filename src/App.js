import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import axios from 'axios'
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, Spinner } from 'reactstrap';
import Contact from './components/Contact';
import { Field, Form, Formik } from 'formik';
import { HiSearch } from 'react-icons/hi'
import { BsPersonPlusFill } from 'react-icons/bs'
import * as yup from 'yup'
import ModalAddContact from './components/ModalAddContact';
import ModalLogin from './components/ModalLogin';
import ModalRegister from './components/ModalRegister';


// global variables that can be accessed by its children
export const ContactContext = createContext(null)
export const UserContext = createContext(null)
export const KEY_USER = "USER"
export const KEY_TOKEN = "TOKEN"

function App() {


  //add new contact
  const [modalAddContactIsOpen, setModalAddContactIsOpen] = useState(false)
  const openAddContactModal = () => {
    setModalAddContactIsOpen(true)
  }

  // search form

  const initialValues = {
    search: ""
  }
  const onSubmit = ({ search }) => {
    console.log("searching")
  }
  const validationSchema = yup.object({
    search: yup.string()
  })

  // search form ends

  const [contacts, setContacts] = useState([])
  const [error, setError] = useState(null)


  const [loadingContacts, setLoadingContacts] = useState(false)

  //when the page loads
  useEffect(() => {

    getContacts()
  }, [])

  const getContacts = () => {
    //getting contacts from rest api
    setLoadingContacts(true)
    axios.get("http://localhost:1337/contacts", {
      headers: {...getLoginHeader()}
    })
      .then(res => {
        setContacts(res.data)
      })
      .catch(err => {
        console.log(err)
        setError(err.message)
      })
      .finally(() => {
        setLoadingContacts(false)
      })
  }


  const addContact = (name, mobile) => {
    return axios.post("http://localhost:1337/contacts", { name, mobile }, {
      headers: {
        ...getLoginHeader()
      }
    })
  }

  const deleteContact = (_id) => {
    return axios.delete("http://localhost:1337/contacts/" + _id, {
      headers: {
        ...getLoginHeader()
      }
    })
  }
  const updateContact = (_id, name, mobile) => {
    return axios.put("http://localhost:1337/contacts/" + _id, { name, mobile }, {
      headers: {
        ...getLoginHeader()
      }
    })
  }

  const searchedFor = (query, contact) => {
    query = query.toLowerCase()
    return contact._id.toLowerCase().includes(query) || contact.name.toLowerCase().includes(query) || contact.mobile.toLowerCase().includes(query)
  }




  const login = (username, password) => {
    return axios.post("http://localhost:1337/users/login", { username, password }, {})
  }
  const register = (username, password) => {
    return axios.post("http://localhost:1337/users/register", { username, password }, {})
  }
  const logout = () => {
    localStorage.removeItem(KEY_USER)
    localStorage.removeItem(KEY_TOKEN)
    setUser(null)
  }
  const getLoginHeader = () => {
    let token = localStorage.getItem(KEY_TOKEN)
    if (token)
      return {
        Authorization: "Bearer " + token
      }
    return {}
  }
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(KEY_USER)))


  const [modalLoginIsOpen, setModalLoginIsOpen] = useState(false)
  const openLoginModal = () => {
    setModalLoginIsOpen(true)
  }
  const [modalRegisterIsOpen, setModalRegisterIsOpen] = useState(false)
  const openRegisterModal = () => {
    setModalRegisterIsOpen(true)
  }



  return (
    <UserContext.Provider value={{ login, logout, register, user, setUser, openRegisterModal }}>
      <ContactContext.Provider value={{ getContacts, addContact, deleteContact, updateContact }}>
        <ToastContainer />
        <ModalLogin
          isOpen={modalLoginIsOpen}
          setIsOpen={setModalLoginIsOpen} />
        <ModalRegister
          isOpen={modalRegisterIsOpen}
          setIsOpen={setModalRegisterIsOpen} />
        <ModalAddContact
          isOpen={modalAddContactIsOpen}
          setIsOpen={setModalAddContactIsOpen}
        />
        <div className="container py-5">
          {
            user ? (
              <>
                <div className="row">
                  <div className="col-sm-12 col-md-6 text-left">

                    <h1 className="text-primary">Contacts App</h1>
                    <p className='lead'>
                      Create and manage your contacts here!
                    </p>
                    <p className="text-muted d-flex  align-items-center">
                      Welcome @{user.username}
                      <Button color="link" onClick={logout}>Not @{user.username}</Button>
                    </p>
                  </div>
                  <div className="col-sm-12 col-md-6 text-right d-flex align-items-center justify-content-end">
                    <Button color="primary" onClick={openAddContactModal}>

                      <BsPersonPlusFill size={18} />
                      <span className="ml-3">
                        Add a new contact
                </span>
                    </Button>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-sm-12 col-md-6">

                    {loadingContacts &&
                      <div className="d-flex justify-content-center align-items-center">
                        <span><Spinner size="lg"></Spinner></span> {' '}
                        <span className="ml-3">Please wait, loading contacts</span>
                      </div>
                    }
                    {!loadingContacts &&
                      <>
                        {contacts.length > 0 ? (

                          <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}>
                            {
                              ({ values, errors }) =>
                                <>
                                  <Form>
                                    <InputGroup>
                                      <Field as={Input} type="search" name="search" placeholder="Search here" />
                                      <InputGroupAddon addonType="append">
                                        <Button color="primary">
                                          <HiSearch />
                                        </Button>
                                      </InputGroupAddon>
                                    </InputGroup>
                                  </Form>

                                  <ul className="list-unstyled mt-3">
                                    {
                                      contacts.filter(contact => values.search ? searchedFor(values.search, contact) : true).map(
                                        contact => {
                                          return (
                                            <li key={contact._id}>
                                              <Contact {...contact} />
                                            </li>
                                          )
                                        }
                                      )
                                    }
                                  </ul>

                                </>
                            }
                          </Formik>
                        ) : (
                            <>
                              <p className='text-muted'>No contacts, Let's add some by pressing the button on the top right</p>
                            </>
                          )}
                      </>
                    }
                  </div>
                  <div className="col">
                    <img src="undraw_people_search_wctu.svg" alt="" className="img-fluid" />
                  </div>
                </div>
              </>
            ) : (
                <div className="row justify-content-center">
                  <div className="col-sm-12 col-md-7">
                    <h1>Contacts List App</h1>
                    <p className="lead">Let's get started! Please login or if you do not have an account, register now, it's quicker than the rest of the apps out there</p>
                    <div className="d-flex justify-content-end">
                      <Button color="primary" className="ml-3" onClick={() => openLoginModal()}>Login</Button>
                      <Button color="link" className="ml-3" onClick={() => openRegisterModal()}>Register</Button>
                    </div>
                  </div>
                </div>
              )
          }
        </div>
      </ContactContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
