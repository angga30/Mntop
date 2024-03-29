/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5d84a46e265bc63c8b2c05ac
*
* You will get 10% discount for each one of your friends
* 
*/
import React, { Component } from "react";
import { ListView } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Icon,
  Right,
  Left,
  Header,
  Button,
  Body,
  Title
} from "native-base";
import SecurityService from "../security/SecurityService";

// Redux
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Custom Actions


// START IMPORT ACTIONS

// END IMPORT ACTIONS

/** APIs

* actionsUser.delete
*	@description CRUD ACTION delete
*	@param ObjectId id - Id
*
* actionsUser.list
*	@description CRUD ACTION list
*

**/

class UserList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      listClone: this.ds.cloneWithRows(props.list || []),
      authorized: false
    };
  }

  // Load data on start
  componentWillMount() {
    this.props.navigation.addListener("willFocus", async () => { 
      // Check security
      if (await SecurityService.isAuth([  ])) {
        this.setState({ authorized: true });
      } else {
        this.props.navigation.navigate("Login", {
          showError: "Not authorized"
        });
        return;
      }


      // Load list
      this.props.actionsUser.loadUserList();
    });
  }

  // Receive props
  componentWillReceiveProps(props) {
    this.setState({
      ...this.state,
      list: props.list,
      listClone: this.ds.cloneWithRows(props.list || [])
    });
  }

  deleteRow(secId, rowId, rowMap, data) {
    let that = this;
    this.props.actionsUser.deleteUser(data._id).then(() => {
      rowMap[`${secId}${rowId}`].props.closeRow();
      const newData = that.state.list;
      newData.splice(rowId, 1);
      that.setState({
        list: newData,
        listClone: that.ds.cloneWithRows(newData)
      });
    });
  }

  render() { 

    // Check security
    if (!this.state.authorized) {
      return null;
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>List User</Title>
          </Body>
          <Right>
            <Button
              transparent
              name="menu"
              onPress={() => this.props.navigation.navigate("UserEdit")}
            >
              <Text>Add</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <List
            rightOpenValue={-75}
            dataSource={this.state.listClone}
            renderRow={item => (
              <ListItem
                noIndent
                onPress={() =>
                  this.props.navigation.navigate("UserEdit", {
                    id: item._id
                  })
                }
              >
                <Left>
                  <Text>{item._id}</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            )}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => (
              <Button
                full
                danger
                onPress={_ => this.deleteRow(secId, rowId, rowMap, data)}
              >
                <Icon active name="trash" />
              </Button>
            )}
          />
          {this.state.list && this.state.list.length == 0 && (
            <List>
              <ListItem>
                <Text>No elements found</Text>
              </ListItem>
            </List>
          )}
        </Content>
      </Container>
    );
  }
}

// Store actions
const mapDispatchToProps = function(dispatch) {
  return { 
  };
};

// Validate types
UserList.propTypes = { 
};

// Get props from state
function mapStateToProps(state, ownProps) {
  return {
    list: state.UserListReducer.listUser
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
