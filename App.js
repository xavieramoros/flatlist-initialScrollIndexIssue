import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';


const { height, width } = Dimensions.get('window')
const colors = ['red','blue','yellow','orange','brown','green','pink'] //7 colors

const TITLE_HEIGHT = 20
export default class App extends Component {
  constructor(props){
    super(props)


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
    
    var rowHeights = []

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

      rowHeights.push(image.height + TITLE_HEIGHT)
    }

    const cumulativeRowHeights = [
      0,
      ...rowHeights.reduce( (soFar, current) => {
        const next = (soFar[soFar.length - 1] || 0) + current;
        soFar.push(next);
        return soFar;
      }, [])
    ].slice(0, rowHeights.length);

    // console.log("cumulativeRowHeights:",cumulativeRowHeights);
    // console.log("cumulativeRowHeights lenght:", cumulativeRowHeights.length);

    this.state = {
      initialScrollIndex : 0,
      show : true,
      rowHeights: rowHeights,
      cumulativeRowHeights: cumulativeRowHeights
    }


    this.data = data
  }

  scrollToIndex = value => {
    this.listRef.scrollToIndex({viewPosition: 0, index: value})
  }

  scrollToOffset = value => {
    this.listRef.scrollToOffset({offset: this.state.cumulativeRowHeights[value]})  
  }

  setInitialScrollIndex = value => {
    this.setState({
      initialScrollIndex: value
    })
  }

  toggleFlatList = () => {
    this.setState({
      show: !this.state.show
    })
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

  renderList(){
    if(this.state.show){
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
                length:this.state.rowHeights[index], 
                offset:this.state.cumulativeRowHeights[index],
                index
              };  
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
        // style={ {height: 50 }}
        onPress = {onPress}>
        <Text style={styles.paragraph}>
          {text}
        </Text>
      </TouchableOpacity>
    )

  }
  
  render() {

    var toggleText = this.state.show? 'Hide' : 'Show'

    return (
      <View style={styles.container}>
        {this.renderButton("scrollToIndex", () => this.scrollToIndex(50))}
        {this.renderButton("scrollToOffset", () => this.scrollToOffset(50))}
        {this.renderButton(`${toggleText} flatList`, this.toggleFlatList)}
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
