import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage'
import api from './services/api'

export default function App() {
  state = {
    loggedInUser: null,
    errorMessage = null
  }

  signIn = async () => {
    try {
      const response = await api.post('/auth/authenticate', {
        email: 'brunoguimaraes.cs@gmail.com',
        password: '123456'
      })

      const { user, token } = response.data;

      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:user', JSON.stringify(user)]
      ])

      this.setState({ loggedInUser: user })

      Alert.alert('Login efetuado com sucesso!')
    } catch (response) {
      this.setState({ errorMessage: response.data.error })
    }
  }

  getProjectList = async () => {
    try {
      const response = await api.get('./projects')

      const { projects } = response.data

      this.setState({ projects })
    } catch (response) {
      this.setState({ errorMessage: response.data.error })
    }
  }

  async function componentDidMount() {
    const token = await AsyncStorage.getItem('@CodeApi:token')
    const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:user'))

    if (token && user)
      this.setState({ loggedInUser: user })
  }


  return (
    <View style={styles.container}>
      {!!this.state.loggedInUser && <Text>{this.state.user}</Text>}
      {!!this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}

      {this.state.loggedInUser ?
        <Button onPress={this.getProjectList} title="Carregar" /> : <Button onPress={this.signIn} title="Entrar" />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
