import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      mainLists: [],
      listname: '',
      newListNameInput: '',
      listId: '',
      showEditModal: false,
      mainListOrderIndex: '',
      showSavePrompt: false,
      showListModal: false,
      showDelModal: false,
      showDelPrompt: false,
      newListEdit: false
    }
  }

  componentDidMount() {
    console.log("COMPONENT HAS MOUNTED");
    var that = this;
    fetch('http://localhost:3000/api/new-list')
      .then(function(response) {
        response.json()
          .then(function(data) {
            let mainLists = that.state.mainLists;
            mainLists.push(data);
            that.setState({
              mainLists: data
            });
            console.log(data);
          });
      });
  }

  

  /////////////////////////
  /* MAIN LIST FUNCTIONS */
  ////////////////////////

  addList(event) {
    var that = this;
    event.preventDefault();
    let adjIndex = this.state.mainLists.length + 1;
    let listData = {
      listname: this.refs.listName.value,
      orderIndex: adjIndex,
      id: Math.floor((Math.random() * 100) + 1)
    };
    var request = new Request('http://localhost:3000/api/new-list', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json'}),
      body: JSON.stringify(listData)
    });

    let mainList = that.state.mainLists;
            mainList.push(listData);
            console.log(mainList)
            that.setState({
              mainLists: mainList,
              mainListOrderIndex: adjIndex,
              newListNameInput: '',
              newListEdit: true 
            });
      

    fetch(request)
      .then(function (response) {  
        response.json()
          .then(function(data) {
            
          });
      })
      .catch(function(err) {
        console.log(err)
      });
  }

  removeList() {
    var that = this;
    let id = this.state.listId;
    let lists = this.state.mainLists;
    let list = lists.find(function(list) {
      return list.id === id 
    });
    
    var request = new Request('http://localhost:3000/api/remove/' + id, {
      method: 'DELETE'
    });

    fetch(request)
      .then(function(response) {
        that.setState({showDelPrompt: true});
          setTimeout(function() { that.setState({showDelPrompt: false}); }.bind(that), 2000);
        lists.splice(lists.indexOf(list), 1);
        that.setState({
          mainLists: lists,
          showDelModal: false,
          showEditModal: false
        });
        
      
        response.json()
          .then(function(data) {
            console.log(data);
          });
      });
  }

  editList(event) {
    //event.preventDefault();
    var id = this.state.listId;
    var that = this;
    let lists = this.state.mainLists;

    let list = lists.find(function(list) {
      return list.id === id 
    });

    let index = lists.findIndex(function(list) {
      return list.id === id
    });

    let listData = {
      id: id,
      listname: this.refs.mainListEditName.value,
      orderIndex: this.refs.orderIndex.value
    };

    console.log('Line 113 Data: ' + listData);

    var request = new Request('http://localhost:3000/api/edit/' + id, {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/json'}),
      body: JSON.stringify(listData)
    });

    let mainList = that.state.mainLists;

    fetch(request)
      .then(function (response) {  
        response.json()
          .then(function(data) {
 
          var start_index = index;
          var number_of_elements_to_remove = 1;
          var removed_elements = mainList.splice(start_index, number_of_elements_to_remove, listData);
          
          console.log(mainList)
          that.setState({
            mainLists: mainList
          });
          that.setState({showSavePrompt: true});
          setTimeout(function() { that.setState({showSavePrompt: false}); }.bind(that), 2000);
              });
      })
      .catch(function(err) {
        console.log(err)
      });
  }

  //////////////////////////////
  /* MAIN LIST EDIT FUNCTIONS */
  /////////////////////////////

  handleEditClose() {
    this.setState({ 
      showEditModal: false,
      newListEdit: false,
      mainListOrderIndex: this.state.mainListOrderIndex 
    });
  }

  handleEditShow(listId, listName, orderIndex) {

    //if(!this.state.newListEdit) {
      this.setState({ mainListOrderIndex: orderIndex })
    //} 
      this.setState({
        listname: listName,
        listId: listId
      });
    
    
		this.setState({ showEditModal: true });
  }

  handleDelClose() {
    this.setState({ showDelModal: false });
  }

  handleDelShow(listId, listTitle) {
    this.setState({
      listname: listTitle,
      listId: listId,
      showDelModal: true
    });
		//this.setState({  });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleIndexChange() {
    let incrementedIndex = this.state.mainListOrderIndex++;
    this.setState({
      mainListOrderIndex: incrementedIndex
    });
  }

  handleIndexIncrement() {
    var incrementedIndex = parseInt(this.state.mainListOrderIndex) + 1;
    this.setState({
      mainListOrderIndex: incrementedIndex
    });
  }

  handleIndexDecrement() {
    if(this.state.mainListOrderIndex > 1) {
      var decrementIndex = parseInt(this.state.mainListOrderIndex) - 1;
      this.setState({
        mainListOrderIndex: decrementIndex
      });
    } else {
      alert("Index cannot be 0!");
    }
  }

  ///////////////////////
  /* SUBLIST FUNCTIONS */
  //////////////////////

  showList(id, listname) {
    this.setState({
      showListModal: true
    });
  }

  render() {
    let mainLists = this.state.mainLists;
    return (
      /*<div className="App">
        <h1>List Portal</h1>
        <form ref="mainListForm">
          <input type="text" ref="listName" placeholder="List name"/>
          <input type="text" ref="orderIndex" placeholder="Order index"/>
          <button onClick={this.addList.bind(this)}>Add List</button>
        </form>
        <ul>
          {mainLists.map(list => <li key={list.id}>{list.listname}<button onClick={this.removeList.bind(this, list.id)}>Remove</button></li>)}
        </ul>
    </div>*/

    <div id='App' className='container-fluid'>
      <header>
        <div className='wrapper'>
          <img src="shoppingCart-image.png" className="App-logo" alt="logo"/>
          <h1>List Portal<hr className="hrFormat"/></h1>
        </div>
      </header>
      <form ref="mainListForm" id="createListDiv" className="jumbotron">
        <h3 className="letterSpacing">Create List</h3>
        <input ref="listName" id="submitText" type="text" name="newListNameInput" placeholder="New List" value={this.state.newListNameInput} onChange={this.handleChange.bind(this)}/>
        <button id="submitBtn" className="btn btn-success btn-lg btn-block" onClick={this.addList.bind(this)}>Create</button>
      </form>
      <hr className="hrFormat" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '30px'}}/>
      <section className="jumbotron" id="mainListSection">
        <div className="wrapper">

        <h2 className="letterSpacing">Current Lists</h2>
        <hr className="hrFormat" style={{borderColor: '#343a40', marginLeft: '10px', marginRight: '10px'}}/>
        <ul id="mainList">
          {this.state.mainLists.map((list) => {
            return (
              <li className="mainItems" key={list.id}>
              <div id="mainListBtnContainer">
              
                <div id="listBtns">
                <a onClick={() => this.handleEditShow(list.id, list.listname, list.orderindex)} id="editMainListBtn" ><i id="editIcon" className="fas fa-edit fa-sm"></i></a>
                <a id="mainListBtn" onClick={() => this.showList(list.id, list.listname)}><div>{list.listname}</div></a>{/*<div> {list.count > 0 && <p style={{  color:'red' }}>{list.count} List(s)</p>} {list.count == 0 && <p style={{  color:'green' }}>{list.count} List(s)</p>}</div>*/}
                {/*<button onClick={() => this.handleEditShow(list.id, list.title, list.orderIndex)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleDelShow(list.id, list.title)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>*/}
              </div>
              </div>
              </li>
            )
          })}
        </ul>
        </div>
      </section>


        {/*EDIT LIST MODAL*/}
        <Modal show={this.state.showEditModal} onHide={this.handleEditClose.bind(this)} data-dismiss="modal" animationtype="fade">
          <Modal.Header>
            <a id="closeEditBtn" onClick={this.handleEditClose.bind(this)}><i className="fas fa-times fa-2x"></i></a>
            <a id="editDelBtn" onClick={this.handleDelShow.bind(this, this.state.listId, this.state.newListNameInput)}><i id="delIcon" className="fas fa-trash-alt fa-2x"></i></a>
						{/*<Modal.Title id="listModalTitle">Edit</Modal.Title>*/}
          </Modal.Header>
					<Modal.Body>
          <Modal.Title id="listModalTitle">Edit</Modal.Title>
        <form ref="editMainListForm" className="jumbotron">
          <div id="addItemDiv">
              <div id="editNameContainer">
                <h3 id="editNameLabel">Name:</h3>
                <input ref="mainListEditName" id="submitText" type="text" name="listname"  value={this.state.listname} onChange={this.handleChange.bind(this)} />
              </div>
              {/*<button id="submitBtn" onClick={() => {this.editList(this.state.listId, this.state.listTitle); this.setState({showEditModal: false});}} className="btn btn-success btn-sm">Submit</button>*/}
          </div>
          <div id="addItemDiv">
          <h4 id="indexOrderHeader">Order</h4>
            <div id="editNameContainer">
              <h3 id="editNameLabel" style={{paddingLeft: 5}}>Index:</h3>
              <input ref="orderIndex" id="submitText" className="indexInputFormat" type="text" name="mainListOrderIndex" placeholder="1" value={this.state.mainListOrderIndex} onChange={this.handleChange.bind(this)} />
              {/*<div id="orderIndexBtnDiv"><button id="submitOrderIndexBtn" onClick={() => {this.addMainListOrderIndex(this.state.listId, this.state.mainListOrderIndex)}} className="">Add Index</button></div>*/}
              <div id="indexAdjustContainer">
                <a onClick={this.handleIndexIncrement.bind(this)}><i className="fas fa-angle-up fa-3x"></i></a>
                <a onClick={this.handleIndexDecrement.bind(this)}><i className="fas fa-angle-down fa-3x"></i></a>
              </div>
            </div>
          </div>
        </form>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleEditClose.bind(this)} data-dismiss="modal">Cancel</Button>
            <Button onClick={this.editList.bind(this)} data-dismiss="modal">Save</Button>
					</Modal.Footer>
          </Modal>

        {/*SAVE PROMPT MODAL*/}
        <Modal show={this.state.showSavePrompt} data-dismiss="modal" id="editSavePrompt">
        <div>
            <p id="editSaveText">Edits Saved!</p>
        </div>
        </Modal>

        {/*DELETE PROMPT MODAL*/}
        <Modal show={this.state.showDelPrompt} data-dismiss="modal" id="editSavePrompt">
        <div>
            <p id="editSaveText">{this.state.listname} Deleted!</p>
        </div>
        </Modal>

        {/*DELETE LIST MODAL*/}
        <Modal show={this.state.showDelModal} onHide={this.handleDelClose.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title id="listModalTitle">{this.state.listname}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Are you sure you would like to delete <strong>{this.state.listname}</strong>?</h4>
					</Modal.Body>
					<Modal.Footer>
          <button onClick={this.removeList.bind(this)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
						<Button onClick={this.handleDelClose.bind(this)}>Close</Button>
					</Modal.Footer>
				</Modal>
          
        {/*//////////////////////////////////*/}
        {/*TODO: GET SHOW LIST MODAL TO WORK */}
        {/*NOTES: MAY NEED TO SELECT SUBLISTS IN INITIAL COMPONENT DID MOUNT QUERY */}

        

    </div>

    
    );
  }
}
    
export default App;
