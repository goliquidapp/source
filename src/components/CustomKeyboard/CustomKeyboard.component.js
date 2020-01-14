import React, {Component} from 'react';
import {Text, View, Platform, TouchableOpacity, ScrollView} from 'react-native';
import {KeyboardRegistry} from 'react-native-keyboard-input';
import {Icon} from 'react-native-elements';

import Theme from '../../resources/Theme.js';

class CustomKeyboard extends Component{
    state={value:''}
    onButtonPress(char) {
        this.setState({value:this.state.value+char},()=>{
            KeyboardRegistry.onItemSelected('CustomKeyboard', {value:this.state.value});
        })
    }
    backSpace=()=>{
        this.setState({value:(this.state.value).slice(0,-1)},()=>{
            KeyboardRegistry.onItemSelected('CustomKeyboard', {value:this.state.value});
        })
    }
    renderRow=(rowIndex)=>{
        const {colsCount, chars, rowsCount}=this.props;
        var row=[];
        for (let c=0; c<colsCount; c++){
            row.push(
                    <TouchableOpacity   style={styles.button} 
                                        key={c.toString()}
                                        onPress={() => this.onButtonPress(chars[c+rowIndex*colsCount])}>
                        <Text style={styles.text}>{chars[c+rowIndex*colsCount]}</Text>
                    </TouchableOpacity>
                )
        }
        if ((rowIndex===rowsCount-1)){
            if ((this.state.value.length===0)){
                const lastCharIndex=chars.length-1;
                const lastChar=chars[lastCharIndex];
                
                row[colsCount-1]=(
                                    <TouchableOpacity   style={styles.button}
                                                        key={'-1'.toString()} 
                                                        onPress={() => this.onButtonPress(lastChar)}>
                                        <Text style={styles.text}>{lastChar}</Text>
                                    </TouchableOpacity>
                                )
            }else{
                const lastCharIndex=chars.length-1;
                const lastChar=chars[lastCharIndex];
                
                row[colsCount-1]=(
                                    <TouchableOpacity   key={'-1'.toString()} 
                                                        style={styles.button} 
                                                        onPress={this.backSpace}>
                                        <Icon name={"backspace"} color={'black'} containerStyle={styles.icon}/>
                                    </TouchableOpacity>
                                )
            }
        }
        return <View key={rowIndex.toString()} style={styles.row}>{row}</View>
    }
    renderCols=()=>{
        const {rowsCount}=this.props;
        var cols=[]
        for (let r=0; r<rowsCount; r++){
            cols.push(this.renderRow(r))
        }
        
        return <View style={styles.col}>{cols}</View>;
    }
    render(){
        return(
           <View style={styles.container}>
               {this.renderCols()}
            </View>
        )
    }
}

const styles={
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#dedede'
    },
    row:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    col:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
    },
    button:{
        width:'30%',
        paddingVertical:5,
        paddingHorizontal:10,
        margin:5,
        backgroundColor:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        
        elevation: 2,
        borderRadius:5
    },
    text:{
        color: 'black',
        textAlign:'center',
        fontFamily:Theme['dark'].fontNormal,
        fontSize:28,
    },
    icon:{
        paddingVertical: 5
    }
}

CustomKeyboard.defaultProps={
    chars:[1,2,3,4,5,6,7,8,9,'.',0,'-'],
    colsCount:3,
    rowsCount:4
}

KeyboardRegistry.registerKeyboard('CustomKeyboard', () => CustomKeyboard)

export default CustomKeyboard;