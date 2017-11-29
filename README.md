# Small project to test FlatList scrolling with variable height items.

From Github issue: https://github.com/facebook/react-native/issues/13727

Here are is the example running on Expo:
https://exp.host/@xavieramoros/snack-SyN4FJikz

There are 2 FlatLists: 
1-Image list with variable height images
2-Text list with variabled height text

In 1, the image height is known in advance, so we can create an array of heights to be used in getItemLayout. As suggested by @pcattori (https://github.com/pcattori) and @eballeste (https://github.com/eballeste)

In 2, we calculate the text height using Ashoat (https://github.com/Ashoat) code snippet: https://github.com/Ashoat/squadcal/blob/master/native/text-height-measurer.react.js 
as suggested in https://github.com/facebook/react-native/issues/13727#issuecomment-300670351

