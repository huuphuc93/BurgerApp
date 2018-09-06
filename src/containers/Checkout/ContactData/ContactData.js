import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-order';

class ContactData extends Component {
  state= {
    name: '',
    email: '',
    address: {
        stress: '',
        postalCode: ''
    },
    loading: false
  }
  
  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true})
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Phuc',
        address: {
          street: 'HAN',
          zipcode: '1000',
          country: 'VN'
        },
        email: 'test@gmail.com'
      },
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      }).catch(error => {
        this.setState({ loading: false });
      });
  }
  
  render() {
    return(
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        <form>
          <input className={classes.Input} type="text" name="name" placeholder="Your name"></input>
          <input className={classes.Input} type="email" name="email" placeholder="Your email"></input>
          <input className={classes.Input} type="text" name="stress" placeholder="Your stress"></input>
          <input className={classes.Input} type="text" name="postal" placeholder="Your postal"></input>
          <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>
      </div>
    );
  }
}

export default ContactData;