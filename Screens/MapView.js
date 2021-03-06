import React, { Component } from "react";
import { Permissions, Location, Marker, MapView } from "expo";
import { View, Dimensions, StyleSheet, Image, Text } from "react-native";
import { GradientButton } from "../components/gradientButton";
import { authActions } from "../redux/actions/auth.actions";
import { connect } from "react-redux";

class MapScreen extends Component {
  static navigationOptions = {
    title: "Your Location".toUpperCase()
  };
  constructor(props) {
    super(props);
    this.state = {
      condition: false,
      location: {
        coords: {
          latitude: 24.9048714,
          longitude: 67.0782024
        }
      }
    };
  }

  componentDidMount() {
    this._getLocationAsync();
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location, condition: true });
    console.log("current location===", location);
  };

  ConfirmLocation = () => {
    const location = this.state.location.coords;
    const sellerEmail = this.props.auth.currentprofile.email;
    const userEmail = this.props.auth.user.email;

    this.props.confirmOrder(userEmail, sellerEmail, location);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.orderConfirm) {
      const email = this.props.auth.user.email;
      this.props.viewOrders(email);
    }
    if (nextProps.auth.yourOrders) {
      this.props.navigation.navigate("OrderConfirm");
    }
  }
  render() {
    console.log(this.state.location);
    return (
      <View style={{ flex: 1 }}>
        <GradientButton
          style={styles.save}
          rkType="large"
          onPress={this.ConfirmLocation}
          text="Confirm Location And Order"
        />
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  save: {
    marginVertical: 9
  }
});

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps = dispatch => {
  return {
    confirmOrder: (userEmail, SellerEmail, userLocation) => {
      dispatch(authActions.confirmOrder(userEmail, SellerEmail, userLocation));
    },
    viewOrders: email => {
      dispatch(authActions.viewOrders(email));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);
