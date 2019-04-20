import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import socket from 'socket.io-client';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

export default class Box extends Component {
  state = { box: {} };
  async componentDidMount() {
    const id = await AsyncStorage.getItem('@RocketBox:box');
    this.subscribeToNewFiles(id);

    const response = await api.get(`boxes/${id}`);

    console.log(response.data);
    this.setState({ box: response.data });
  }

  subscribeToNewFiles = id => {
    const io = socket('https://omnistackdropbox.herokuapp.com');

    io.emit('connectRoom', id);

    io.on('file', data => {
      console.log(data);
      this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files] } });
    });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.openFile(item)} style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#a5cfff" />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>

      <Text style={styles.fileDate}>há {distanceInWords(item.createdAt, new Date(), { locale: pt })}</Text>
    </TouchableOpacity>
  );

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('error handleUpload');
      } else if (upload.didCancel) {
        console.log('didCancel handleUpload');
      } else {
        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLowerCase() == 'heic' ? 'jpg' : suffix;

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        });

        api.post(`boxes/${this.state.box._id}/files`, data);
      }
    });
  };

  openFile = async file => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;

      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      });

      await FileViewer.open(filePath);
    } catch (err) {
      console.log('error openFile');
    }
  };
  render() {
    const { box } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{box.title}</Text>

        <FlatList styles={styles.list} data={box.files} keyExtractor={file => file._id} ItemSeparatorComponent={() => <View style={styles.separator} />} renderItem={this.renderItem} />

        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="cloud-upload" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}
