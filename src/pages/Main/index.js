import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './styles';
import logo from '../../assets/logo.png';

export default class Main extends Component {
  state = { newBox: '' };

  async componentDidMount() {
    const id = await AsyncStorage.getItem('@RocketBox:box');

    if (id) {
      this.props.navigation.navigate('Box');
    }
  }

  handleSignIn = async () => {
    const response = await api.post('boxes', {
      title: this.state.newBox
    });

    await AsyncStorage.setItem('@RocketBox:box', response.data._id);
    this.props.navigation.navigate('Box');
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput style={styles.input} value={this.state.newBox} onChangeText={text => this.setState({ newBox: text })} placeholder="Crei um box" underlineColorAndroid="transparent" autoCorrect={false} autoCapitalize="none" placeholderTextColor="#999" />
        <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
