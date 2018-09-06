import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};
class BurgerBuilder extends Component {
  // constructor(props) {
    // super(props);
  // }

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    console.log(this.props);
    axios.get('https://react-my-bugger-ba690.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({
          ingredients: response.data
        })
      })
      .catch(error => {
        this.setState({error: true});
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({purchasable: sum > 0});
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1;
    const updateIngredient = {
      ...this.state.ingredients
    };
    updateIngredient[type] = updateCount
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({totalPrice: newPrice, ingredients: updateIngredient});
    this.updatePurchaseState(updateIngredient);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) {
      return;
    }
    const updateCount = oldCount - 1;
    const updateIngredient = {
      ...this.state.ingredients
    };
    updateIngredient[type] = updateCount
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updateIngredient});
    this.updatePurchaseState(updateIngredient);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true})
  }

  purchaseCancelHanler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    // alert('You continue!');
    const queryParams = [];
    for(let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });
  }

  render () {
    const disableInfo = {
      ...this.state.ingredients
    };
    for(let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }

    let orderSummary = null

    if(this.state.loading) {
      orderSummary = <Spinner />;
    }

    let burger = this.state.error ? <p>Ingredients can't be load!</p> : <Spinner />

    if(this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemove={this.removeIngredientHandler}
            disable={disableInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice} />
        </Aux>
      );
      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        purchaseCanceled={this.purchaseCancelHanler}
        purchaseContinued={this.purchaseContinueHandler}
        totalPrice={this.state.totalPrice}
        />
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHanler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler( BurgerBuilder, axios );
