import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';
import io from 'socket.io-client';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${25}%`,
        left: `${50}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

class NewItemModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            name: '',
            amount: 1
        };

        this.socket = io('localhost:5000');
        this.socket.open();
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`/api/lists/${this.props.listId}/items/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.props.userId,
                name: this.state.name,
                amount: this.state.amount,
                listId: this.props.listId
            })
        })
        const body = await response.json();
        this.socket.emit('ADD_ITEM', body.item);
        this.setState({
            name: '',
            amount: 0,
            open: false,
        });
        this.props.alert.show(body.message);
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    handleAmountChange(event) {
        this.setState({ amount: event.target.value });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;

    return (
        <div>
            <Button onClick={this.handleOpen} color="inherit">Create New Item</Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        Create a New Item
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                            <label htmlFor="name">Name</label>
                            <input className="name signupInput"
                                type="text"
                                placeholder="Enter a name"
                                value={this.state.name}
                                onChange={ (e) => this.handleNameChange(e) }>
                            </input>
                            <label htmlFor="amount">Amount</label>
                            <input className="amount signupInput"
                                type="number"
                                step="1"
                                min="1"
                                placeholder="Enter the amount"
                                value={this.state.amount}
                                onChange={ (e) => this.handleAmountChange(e) }>
                            </input>
                            <input className="handleSubmit signupInput" type="submit" value="Submit"></input>
                        </form>
                    </Typography>
                </div>
            </Modal>
        </div>
        );
    }
}

NewItemModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(NewItemModal));