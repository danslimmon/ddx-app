import React from 'react';
import './App.css';
import Card from './Card.js';

class Column extends React.Component {
  colName() {
    switch (this.props.type) {
      case "sym":
        return "Symptoms";
      case "hyp":
        return "Hypotheses";
      case "act":
        return "Actions";
      default:
        console.log("Unknown column type '" + this.props.type + "' passed to <Column />");
        return "Unknown Column";
    }
  }

  render() {
    let cardComponents = this.props.cards.map((cardData) => {return (
      <Card
        type={this.props.type}
        key={cardData.cardID}
        cardID={cardData.cardID}
        title={cardData.title}
        description={cardData.description}
        selected={this.props.selectedCard === cardData.cardID}
        surfaced={this.props.surfacedCards.includes(cardData.cardID)}
        selectedCardInputValues={this.props.selectedCardInputValues}

        onCardSelect={this.props.onCardSelect}
        onCardChange={this.props.onCardChange}
      />
    )});

    return (
      <div className={"column column-" + this.props.type + " col-sm"}>
        <h1>{this.colName()}</h1>
        {cardComponents}
      </div>
    );
  }
}

function CardOverlay(props) {
  return (
    <div
      className={"cardOverlay cardOverlay-" + (props.shown ? "shown" : "hidden")}
      onClick={props.onOverlayClick}
    />
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCard: null,
      // selectedCardInputValues holds the latest values input by the user that have not been saved
      // yet. If it is {}, no unsaved changes are present in the form. Otherwise it has a key for each
      // field that is unsaved.
      selectedCardInputValues: {},
      overlayShown: false,
      cards: [
        {
          cardID: "abcdef",
          cardType: "act",
          title: "lorem ipsum",
          description: "This is an action that we're taking to rule out some hypothesis.",
        },
        {
          cardID: "ghijkl",
          cardType: "act",
          title: "dolor sit amet",
          description: "This is a research action that doesn't relate to any specific hypothesis but should help us generate more hypotheses.",
        },
        {
          cardID: "mnopqr",
          cardType: "hyp",
          title: "blibbity blobbity",
          description: "This is a hypothesis about our observed symptoms."
        }
      ]
    }

    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleCardSelect = this.handleCardSelect.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
  }

  cardsByType(cardType) {
    return this.state.cards.filter((cardData) => {
      return (cardData.cardType === cardType);
    });
  }

  render() {
    let columns = ["sym", "hyp", "act"].map((colType) => (
      <Column
        type={colType}
        key={colType}
        cards={this.cardsByType(colType)}
        selectedCard={this.state.selectedCard}
        surfacedCards={this.getSurfaced(this.state.selectedCard)}
        selectedCardInputValues={this.state.selectedCardInputValues}

        onCardSelect={this.handleCardSelect}
        onCardChange={this.handleCardChange}
      />
    ));

    return (
      <div className="board">
        <CardOverlay onOverlayClick={this.handleOverlayClick} shown={this.state.overlayShown} />
        <div className="board row">
          {columns}
        </div>
      </div>
    );
  }

  // Returns the list of card IDs that should be surfaced, given the ID of the selected card.
  getSurfaced(selectedCard) {
    return [selectedCard];
  }

  // Handles the event of the CardOverlay being clicked
  handleOverlayClick(e) {
    if (this.state.selectedCard === null) {
      return;
    }

    this.setState((state, props) => {
      // Merge the data entered by the user into the selected card's data
      for (let i=0; i<state.cards.length; i++) {
        if (state.cards[i].cardID === state.selectedCard) {
          state.cards[i] = {
            ...state.cards[i],
            ...state.selectedCardInputValues
          };
          break;
        }
      };

      // Go back to having no selected card
      state.selectedCard = null;
      state.selectedCardInputValues = {};
      state.overlayShown = false;

      return state;
    });
  }

  // Handles the event of a Card being selected.
  // 
  // The target of this event is a <Card /> component.
  handleCardSelect(e) {
    this.setState((state, props) => {
      return {
        selectedCard: e.target.props.cardID,
        overlayShown: true
      }
    });
    // desurface all (unrelated) cards
  }

  // Handles the event of a Card being changed (input onChange, not submit).
  // 
  // The target of this event is a <Card /> component's input element.
  handleCardChange(e) {
    e = e.nativeEvent;
    console.log('a: ' + e.target);
    this.setState((state, props) => {
      console.log('b: ' + e.target);
      return {
        selectedCardInputValues: {
          ...state.selectedCardInputValues,
          [e.target.name]: e.target.value
        }
      };
    });
  }
}

function App() {
  return (
    <div className="container">
      <Board />
    </div>
  );
}

export default App;
