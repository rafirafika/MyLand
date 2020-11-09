import React, { Component } from 'react';
import propTypes from 'prop-types';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "shards-react";

class ModalConfirmation extends Component {
    render() {
        const {
            open,
            message,
            onConfirm,
            onClose,
        } = this.props;

        return (
            <Modal open={open} toggle={() => onClose()}>
                <ModalHeader>CONFIRMATION</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => onConfirm()}
                    >YES</Button>
                    <Button
                        theme="danger"
                        onClick={() => onClose()}
                    >NO</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

ModalConfirmation.propTypes = {
    open : propTypes.bool,
    message : propTypes.string,
    onConfirm : propTypes.func,
    onClose : propTypes.func,
}

ModalConfirmation.defaultProps = {
};

export default ModalConfirmation;