import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';


const { height, width } = Dimensions.get('window')

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      initialScrollIndex : 0,
      show : false
    }

    var data = []
    var images = [
      { 
        url: "https://lorempixel.com/400/200/",
        width: 400,
        height: 200
      },{
        url: "https://lorempixel.com/400/400/",
        width: 400,
        height: 400
      }]
    
    var colors = ['red','blue','yellow','orange','brown','green','pink'] //7 colors

    var image;
    for(let i=0; i<100;i++){
      image = images[Math.round(Math.random())]
      data[i] = {
        key:i,
        url: image.url,
        width: image.width,
        height: image.height,
        color: colors[Math.floor(Math.random() * 8)]
      }
    }
    this.data = data
  }

  showFlatList = () => {
    this.setState({
      show: true,
      initialScrollIndex: 50
    })
  }

  hideFlatList = () => {
    this.setState({
      show: false,
      initialScrollIndex: 50
    })
  }

  
  renderItem = ({ item }) => {
    return (
      <View style={{flex:1, backgroundColor:item.color, width: width, flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20,fontWeight: 'bold'}}> Image {item.key} </Text>
        <Image
          style={{flex:1,width: item.width,height: item.height}}
          source={{uri: item.url}}
          resizeMode={'cover'}
        />
      </View>
    )
  }

  renderList(){
    if(this.state.show){
      return (
        <View style={styles.container}>
          <FlatList
            style={{width: width}}
            renderItem={this.renderItem}
            keyExtractor={ item => item.key}
            initialScrollIndex = {this.state.initialScrollIndex}
            getItemLayout = {(data, index) => {
              return {length: 400, offset: 400 * index, index}
            }}
            initialListSize={5} //listview optimization
            pageSize={10} //listview optimization
            data={this.data}>
          </FlatList>
        </View>
      )
    }
  }

  renderButton(text, onPress){
    return (
      <TouchableOpacity
        onPress = {onPress}>
        <Text style={styles.paragraph}>
          {text}
        </Text>
      </TouchableOpacity>
    )

  }
  
  render() {
    return (
      <View style={styles.container}>
        {this.renderButton("Scroll to index 50", this.showFlatList)}
        {this.renderButton("Hide flatList", this.hideFlatList)}
        {this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
