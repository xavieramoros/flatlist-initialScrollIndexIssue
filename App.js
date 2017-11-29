import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';
import TextHeightMeasurer from './components/textToMeasure'
import Chance from 'chance'

const { height, width } = Dimensions.get('window')
const colors = ['red','blue','yellow','orange','brown','green','pink'] //7 colors

const TITLE_HEIGHT = 20
export default class App extends Component {
  constructor(props){
    super(props)


    /**********
    * Image with variable height
    ***********/

    var images = []
    var imageSource = [
      { 
        url: "https://lorempixel.com/400/200/",
        width: 400,
        height: 200
      },{
        url: "https://lorempixel.com/400/400/",
        width: 400,
        height: 400
      }]

    var imageHeights = []
    var image;
    for(let i=0; i<100;i++){
      image = imageSource[Math.round(Math.random())]
      images[i] = {
        key:i,
        url: image.url,
        width: image.width,
        height: image.height,
        color: colors[Math.floor(Math.random() * 8)]
      }
      imageHeights.push(image.height + TITLE_HEIGHT)
    }

    const cumulativeImageHeights = [
      0,
      ...imageHeights.reduce( (soFar, current) => {
        const next = (soFar[soFar.length - 1] || 0) + current;
        soFar.push(next);
        return soFar;
      }, [])
    ].slice(0, imageHeights.length);

    /**********
    * Text with variable height
    ***********/

    var text = []
    var textHeights = []

    var chance = new Chance();

    for(let i=0; i<100;i++){
      text[i] = {
        key: i,
        id: i.toString(),//needed in TextMeasurer
        text: chance.paragraph(),
        style:{fontSize: 20}
      }
    }


    this.state = {
      initialScrollIndex : 0,
      showImages : false,
      showText: false,
      imageHeights: imageHeights,
      cumulativeImageHeights: cumulativeImageHeights,
      textHeights: textHeights,
      cumulativeTextHeights: []
    }
    this.images = images
    this.text = text
  }

  scrollToIndex = value => {
    this.listRef.scrollToIndex({viewPosition: 0, index: value})
  }

  scrollToOffset = value => {
    if(this.state.showImages){
      this.listRef.scrollToOffset({offset: this.state.cumulativeImageHeights[value]})    
    }

    if(this.state.showText){
      this.listRef.scrollToOffset({offset: this.state.cumulativeTextHeights[value]})    
    }    
    
  }

  setInitialScrollIndex = value => {
    this.setState({
      initialScrollIndex: value
    })
  }

  toggleText = () => {
    this.setState({
      showText: !this.state.showText,
      showImages: false
    })
  }

  toggleImages = () => {
    this.setState({
      showImages: !this.state.showImages,
      showText: false
    })
  }


  renderTextMeasurer(){
    return (
      <TextHeightMeasurer
          textToMeasure={this.text}
          allHeightsMeasuredCallback={ (textToMeasure, heights) =>{

            var textHeights = []
            for(let i=0; i<heights.size;i++){
              textHeights.push(heights.get(i.toString())+TITLE_HEIGHT)
            }
            var cumulativeTextHeights = [
              0,
              ...textHeights.reduce( (soFar, current) => {
                const next = (soFar[soFar.length - 1] || 0) + current;
                soFar.push(next);
                return soFar;
              }, [])
            ]

            this.setState({
              textHeights:textHeights,
              cumulativeTextHeights : cumulativeTextHeights});
          }}
          minHeight={100}
          style={{}}
        />
    )
  }
  renderItem = ({ item }) => {
    return (
      <View style={{flex:1, backgroundColor:item.color, width: width, flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{height: TITLE_HEIGHT, fontSize: 20,fontWeight: 'bold'}}> Image {item.key} </Text>
        <Image
          style={{flex:1,width: item.width,height: item.height}}
          source={{uri: item.url}}
          resizeMode={'cover'}
        />
      </View>
    )
  }

  renderTextItem = ({ item }) => {
    return (
      <View style={{flex:1, backgroundColor:item.color, width: width, flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{height: TITLE_HEIGHT, fontSize: 20, fontWeight: 'bold'}}> {item.key} </Text>
        <Text style={{fontSize: 20}}> {item.text} </Text>
      </View>
    )
  }


  renderImages(){
    return (
      <View style={styles.container}>
        <FlatList
          ref={ ref => { this.listRef = ref; }}
          style={{width: width}}
          renderItem={this.renderItem}
          keyExtractor={ item => item.key}
          // initialScrollIndex = {this.state.initialScrollIndex}

          // Fixed Height getItemLayout            
          // getItemLayout = {(data, index) => {
          //   return {length: 400, offset: 400 * index, index}
          // }}

          // Variable Height getItemLayout
          getItemLayout = {(data, index) => {
            return {
              length:this.state.imageHeights[index], 
              offset:this.state.cumulativeImageHeights[index],
              index
            };  
          }}
          initialListSize={5} //listview optimization
          pageSize={10} //listview optimization
          data={this.images}>
        </FlatList>
      </View>
    )
  }

  renderTextList(){
    return (
      <View style={styles.container}>
        <FlatList
          ref={ ref => { this.listRef = ref; }}
          style={{width: width}}
          renderItem={this.renderTextItem}
          keyExtractor={ item => item.key}
          // initialScrollIndex = {this.state.initialScrollIndex}

          // Fixed Height getItemLayout            
          // getItemLayout = {(data, index) => {
          //   return {length: 400, offset: 400 * index, index}
          // }}

          // Variable Height getItemLayout
          getItemLayout = {(data, index) => {
            return {
              length:this.state.textHeights[index], 
              offset:this.state.cumulativeTextHeights[index],
              index
            };  
          }}
          initialListSize={5} //listview optimization
          pageSize={10} //listview optimization
          data={this.text}>
        </FlatList>
      </View>
    )
  }


  renderButton(text, onPress){
    return (
      <TouchableOpacity
        // style={ {height: 50 }}
        onPress = {onPress}>
        <Text style={styles.paragraph}>
          {text}
        </Text>
      </TouchableOpacity>
    )

  }

  renderList(){
    
    if(this.state.showImages){
      return this.renderImages()
    }

    if(this.state.showText){
      return this.renderTextList()
    }
  }
  
  render() {

    var toggleImages = this.state.showImages? 'Hide' : 'Show'
    var toggleText = this.state.showText? 'Hide' : 'Show'

    return (
      <View style={styles.container}>
        {this.renderTextMeasurer()}
        {this.renderButton("scrollToIndex (50)", () => this.scrollToIndex(50))}
        {this.renderButton("scrollToOffset (50)", () => this.scrollToOffset(50))}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {this.renderButton(`${toggleImages} image list`, this.toggleImages)}
          {this.renderButton(`${toggleText} text list `, this.toggleText)}
        </View>
        {this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  paragraph: {
    marginHorizontal: 24,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
