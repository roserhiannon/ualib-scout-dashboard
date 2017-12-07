import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
  const itemsRef = firebase.database().ref('items');
  itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        title: items[item].title,
        user: items[item].user
      });
    }
    this.setState({
      items: newState
    });
  });
}

removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
}

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    itemsRef.on('value', (snapshot) => {
      console.log(snapshot.val());
    });
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
  });
}
  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Scout Issues</h1>

            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's your email?" onChange={this.handleChange} value={this.state.username} />
                <input type="text" name="currentItem" placeholder="Describe your Scout issue." onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Issue</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
              {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>Noticed by: {item.user}
                          <button onClick={() => this.removeItem(item.id)}>Remove Issue</button>
                        </p>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
