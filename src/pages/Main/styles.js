import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 30
  },
  logo: {
    alignSelf: 'center'
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 30
  },
  button: {
    height: 48,

    borderRadius: 4,

    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Styles;
