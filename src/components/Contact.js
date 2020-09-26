import React, { useState } from 'react'
import { GoPerson } from 'react-icons/go'
import { Tooltip } from 'reactstrap'
import ModalViewContact from './ModalViewContact'


const Contact = (props) => {
    const { _id, name, mobile } = props
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const toggle = () => setTooltipOpen(!tooltipOpen)

    const [modalViewContactIsOpen, setModalViewContactIsOpen] = useState(false)
    const viewContact = () => {
        setModalViewContactIsOpen(true)
    }

    return (
        <div id={`contact_${_id}`} className="contact row mb-3" onClick={viewContact}>
            <ModalViewContact {...props} isOpen={modalViewContactIsOpen} setIsOpen={setModalViewContactIsOpen}/>
            <div className="d-flex align-items-stretch">
                <div className="icon-holder d-flex align-items-center mx-3">
                    <GoPerson size={32} />
                </div>
                <div className="info-holder">
                    <p className="m-0">
                        <b>
                            {name}
                        </b>
                    </p>
                    <p className="text-muted m-0">
                        {mobile}
                    </p>
                </div>
            </div>
            <Tooltip placement="right" isOpen={tooltipOpen} target={`contact_${_id}`} toggle={toggle}>
                Click to view more actions
            </Tooltip>
        </div>
    )
}

export default Contact