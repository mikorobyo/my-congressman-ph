import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import { Button } from '@material-ui/core';
import './index.css';
import data from './data/data.json';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : data.filter(lang =>
    lang.district.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion.district;

const renderSuggestion = suggestion => (
      <div class="suggestion-content">
        <img class="photo" src={suggestion.photo} alt={suggestion.name}/>
        <div>
            <div class="name">{suggestion.district}</div>
            <div class="constituents">{suggestion.constituents}</div>
        </div>
      </div>
);

const getBillValue = bill => bill;

const renderBill = bill => (
      <div class="suggestion-content">
        <div class="name">{bill}</div>
      </div>
);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      billValue: 'HB 6875 - "Anti-Terror Bill"',
      cityValue: '',
      suggestions: [],
      bills: ['HB Anti-Terror Bill'],
      selected: {},
    };
  }

  onChangeCity = (event, { newValue }) => {
    this.setState({
      cityValue: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      selected: suggestion
    });
  };

  onChangeBill = (event, { newValue }) => {
    this.setState({
//      billValue: newValue
    });
  };

  onBillsFetchRequested = ({ value }) => {
      this.setState({
        bills: getSuggestions(value)
      });
    };

  onBillsClearRequested = () => {
    this.setState({
        bills: []
    });
  };

  render() {
    const { billValue, cityValue, suggestions, bills, selected } = this.state;

    const inputProps = {
      placeholder: 'Type your city or province',
      value: cityValue,
      onChange: this.onChangeCity
    };

    const inputPropsBills = {
      placeholder: 'Type the House Bill number e.g. HB 1234',
      value: billValue,
      onChange: this.onChangeBill
    };

    let details;
    let billLink = 'http://www.congress.gov.ph/legisdocs/first_18/CR00340.pdf';


    if (selected.name) {
        let parsedName = selected.name.substring(selected.name.indexOf('.') + 2);
        let surname = parsedName.substring(0, parsedName.indexOf(',')).toLowerCase();
        let nameInitial = parsedName.substring(parsedName.indexOf(',') + 2, parsedName.indexOf(',') + 3).toLowerCase();
        if (!selected.photo) {
            selected.photo = 'http://www.congress.gov.ph/members/images/18th/' + surname + '-' + nameInitial + '.jpg';
        }

      let voteColor =  selected.vote == 'No' ? 'blue' :  (selected.vote == 'Yes' ? 'red' : 'grey'); //grey for Abstain and Absent
      let fbId = selected.facebook.substring(selected.facebook.indexOf('facebook.com/') + 'facebook.com/'.length, selected.facebook.length - 1);;
      let messengerLink = 'https://m.me/' + fbId;
      let twitterId = selected.twitter.substring(selected.twitter.indexOf('twitter.com/') + 'twitter.com/'.length, selected.twitter.length);;
      let parsedPhone = 'tel:02' + selected.phone.substring(selected.phone.indexOf('Direct:') + 'Direct:'.length);
      let congressmanId = selected.photo.substring(selected.photo.indexOf('images/18th/') + 'images/18th/'.length, selected.photo.length - 4);;
      let otherBills = 'http://www.congress.gov.ph/members/search.php?id=' + congressmanId;
      let twitter;
      if (selected.twitter != ''){
        twitter = <Button color='primary' onClick={() => window.open(selected.twitter)}  fullWidth> Twitter: @{twitterId} </Button>
      }
      let verb = selected.vote == 'Absent' ? 'was' : 'voted';
      let sampleMsg = 'Dear Rep. (representative),\nAs my elected representative in the legislature, I demand that you protect the rights of the Filipinos to freedom of speech and withdraw your \"yes\" vote on the \"Anti-Terror Bill\" (HB 6875). Your stance on this issue today will dictate our stance on you come next election.\n(Your name)';
      details = <div><div class="suggestion-content" >
                        <img class="photo" src={selected.photo} alt={selected.name}/>
                        <div>
                            <div class="name">{parsedName} {verb} <font color={voteColor}>{selected.vote}</font></div>
                        </div>
                      </div>
                      <div>
                      <br/>
                        <i>Let your voices be heard!</i><br/>Click to contact your congressman: <br/><br/>
                        <Button color='primary' onClick={() => window.open('mailto:' + selected.email)}  fullWidth> Email: {selected.email} </Button>
                        <Button color='primary' onClick={() => window.open(selected.facebook)}  fullWidth> Facebook: {fbId} </Button>
                        <Button color='primary' onClick={() => window.open(messengerLink)}  fullWidth> Messenger: {fbId} </Button>
                        {twitter}
                        <Button color='primary' onClick={() => window.open(parsedPhone)}  fullWidth> Phone: {selected.phone} </Button>
                        <Button color='primary' onClick={() => window.open(otherBills)}  fullWidth> Browse Other Bills Authored</Button>
                        <Button color='green' onClick={() => {navigator.clipboard.writeText(sampleMsg)}}  fullWidth> Copy template message to clipboard</Button>
                      </div>
                 </div>;



    }

    return (
    <div>
      <div id="header">
      <Typography variant="h4" gutterBottom>My Congressman PH</Typography>
      </div>
      <Typography variant="body2" gutterBottom>
      <p>Alamin ang mga akda at <b>boto</b> ng iyong kongresista sa mga panukalang batas, tulad ng <i>Anti-Terror Bill</i>. Layon nitong mas maging aktibo ang mga mamamayan sa proseso ng paggawa at pag-apruba ng mga batas sa pamamagitan ng mga kumakatawan sa atin sa Kongreso.</p>
      </Typography>
      <Autosuggest
          suggestions={bills}
          onSuggestionsFetchRequested={this.onBillsFetchRequested}
          onSuggestionsClearRequested={this.onBillsClearRequested}
          getSuggestionValue={getBillValue}
          renderSuggestion={renderBill}
          inputProps={inputPropsBills}
      />
      <Button color='primary' onClick={() => window.open(billLink)}  fullWidth> Read House Bill 6875</Button>
      <br />
      <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
      />
      <br />
      {details}
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));