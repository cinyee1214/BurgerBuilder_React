import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {...}
  // }
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false,
    puchasing: false,
    loading: false
  }

  updatePurchaseState (ingredients) {
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
    const updatedCount = this.state.ingredients[type] + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;

    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

    this.setState({totalPrice: newPrice,
                  ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }

    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;

    const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

    this.setState({totalPrice: newPrice,
                  ingredients: updatedIngredients}); 
    
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({puchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({puchasing: false});
  }

  purchaseContinueHandler = () => {
    // alert('You continue!');
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      prices: this.state.totalPrice,
      customer: {
        name: 'Max S',
        address: {
          street: 'Teststreet 1',
          zipCode: '07306',
          country: 'US'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/orders.json', order)
          .then(response => {
            this.setState({loading: false, puchasing: false});
          })
          .catch(error => {
            this.setState({loading: false, puchasing: false});
          });
  }
  

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = <OrderSummary 
    ingredients={this.state.ingredients}
    price={this.state.totalPrice}
    purchaseCancelled={this.purchaseCancelHandler}
    purchaseContinued={this.purchaseContinueHandler} />;

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.puchasing}
                modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
          price={this.state.totalPrice} />
      </Aux>
    );
  }
}

export default BurgerBuilder;