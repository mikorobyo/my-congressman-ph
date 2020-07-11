import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import { Button } from '@material-ui/core';
import './index.css';
import data from './data/data.json';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : data.filter(lang =>
    lang.district.toLowerCase().includes(inputValue) //|| lang.constituents.toLowerCase().includes(inputValue)
  );
};

let bills = ['HB 6724 - "ABS-CBN Franchise Renewal"', 'HB 6875 - "Anti-Terror Bill"'];
let billLinks = ['http://www.congress.gov.ph/legisdocs/basic_18/HB06724.pdf', 'http://www.congress.gov.ph/legisdocs/first_18/CR00340.pdf'];
var selectedBillIndex = 0;

const getBills = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : bills.filter(lang =>
    lang.toLowerCase().includes(inputValue) //|| lang.constituents.toLowerCase().includes(inputValue)
  );
};

const getSuggestionValue = suggestion => suggestion.district;

function renderSuggestion(suggestion, { query }) {
  const matches = AutosuggestHighlightMatch(suggestion.district, query);
  const parts = AutosuggestHighlightParse(suggestion.district, matches);

  return (
    <div class="suggestion-content">
    <img class="photo" src={suggestion.photo} alt={suggestion.name}/>
    <div>
    <div class="name">
      {parts.map((part, index) => {
        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </div>
    <div class="constituents">{suggestion.constituents}</div>
    </div>
    </div>
  );
}

//const renderSuggestion = suggestion => (
//      <div class="suggestion-content">
//        <img class="photo" src={suggestion.photo} alt={suggestion.name}/>
//        <div>
//            <div class="name">{suggestion.district}</div>
//            <div class="constituents">{suggestion.constituents}</div>
//        </div>
//      </div>
//);

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
      billValue: bills[0],
      cityValue: '',
      suggestions: [],
      bills: [],
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
      billValue: newValue
    });
  };

  onBillsFetchRequested = ({ value }) => {
      this.setState({
        bills: getBills(value)
      });
    };

  onBillsClearRequested = () => {
    this.setState({
        bills: []
    });
  };

  onBillSelected = (event, { suggestion }) => {
     selectedBillIndex = bills.indexOf(suggestion);
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

    if (selected.name) {
        let parsedName = selected.name.substring(selected.name.indexOf('.') + 2);
        let surname = parsedName.substring(0, parsedName.indexOf(','));
        let nameInitial = parsedName.substring(parsedName.indexOf(',') + 2, parsedName.indexOf(',') + 3).toLowerCase();
        if (!selected.photo) {
            selected.photo = 'http://www.congress.gov.ph/members/images/18th/' + surname.toLowerCase() + '-' + nameInitial + '.jpg';
        }

      let vote = selectedBillIndex === 0 ? selected.absvote : selected.terrorvote;
      if (vote === '') {
        vote = '(No Data Available)';
      }
      let voteColor = selectedBillIndex === 0  ? (vote.indexOf('No') !== -1 ? 'red' :  (vote.indexOf('Yes') !== -1 ? 'blue' : 'grey')) :
      (vote.indexOf('No') !== -1 ? 'blue' :  (vote.indexOf('Yes') !== -1 ? 'red' : 'grey')); //grey for Abstain and Absent
      let fbId = selected.facebook.substring(selected.facebook.indexOf('facebook.com/') + 'facebook.com/'.length, selected.facebook.length - 1);;
      let messengerLink = 'https://m.me/' + fbId;
      let twitterId = selected.twitter.substring(selected.twitter.indexOf('twitter.com/') + 'twitter.com/'.length, selected.twitter.length);;
      let parsedPhone = 'tel:02' + selected.phone.substring(selected.phone.indexOf('Direct:') + 'Direct:'.length);
      let congressmanId = selected.photo.substring(selected.photo.indexOf('images/18th/') + 'images/18th/'.length, selected.photo.length - 4);;
      let otherBills = 'http://www.congress.gov.ph/members/search.php?id=' + congressmanId;
      let twitter;
      if (selected.twitter !== ''){
        twitter = <Button color='primary' onClick={() => window.open(selected.twitter)}  fullWidth> Twitter: @{twitterId} </Button>
      }
      let verb = vote === 'Absent' ? 'was' : 'voted';
      //let sampleMsg = 'Dear Congressman ' + surname + ',\n\nAs my elected representative in the legislature, I demand that you protect the rights of the Filipinos to freedom of speech and withdraw your "yes" vote on the "Anti-Terror Bill" (HB 6875). Your stance on this issue today will dictate our stance on you come next election.\n\n(Your name)';
      details = <div><div class="suggestion-content" >
                        <img class="photo" src={selected.photo} alt={selected.name}/>
                        <div>
                            <div class="name">{parsedName} {verb} <font color={voteColor}>{vote}</font></div>
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
                      </div>
                 </div>;



    }

    return (
    <div>
      <div id="header">
      <Typography variant="h4" gutterBottom>My Congressman PH</Typography>
      </div>
      <Typography variant="body2" gutterBottom>
      <p>Alamin ang mga akda at <b>boto</b> ng iyong kongresista sa mga panukalang batas. Layon nitong mas maging aktibo ang mga mamamayan sa proseso ng paggawa at pag-apruba ng mga batas sa pamamagitan ng mga kumakatawan sa atin sa Kongreso.</p>
      </Typography>
      <Autosuggest
          suggestions={bills}
          onSuggestionsFetchRequested={this.onBillsFetchRequested}
          onSuggestionsClearRequested={this.onBillsClearRequested}
          onSuggestionSelected={this.onBillSelected}
          getSuggestionValue={getBillValue}
          renderSuggestion={renderBill}
          inputProps={inputPropsBills}
      />
      <Button color='primary' onClick={() => window.open(billLinks[selectedBillIndex])}  fullWidth> Read House Bill</Button>
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