import React, {Component} from 'react';
import { TextInput, View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '../../resources/Colors.js';
import Theme from '../../resources/Theme.js';

import * as Animatable from 'react-native-animatable';

class Input extends Component{
    state={minus:false}
    minusToggle=()=>{
        this.setState({minus:!this.state.minus},()=>{
            if (this.state.minus && this.props.value[0]!=='-') this.onChangeText('-'+this.props.value)
            else if (!this.state.minus && this.props.value[0]==='-') this.onChangeText(this.props.value.substr(1))
        })
    }
    outsideClick=(evt)=>{
        if (this.props.onClickOutside){
            evt.persist();
            if (this.input._nativeTag!==evt.target) this.props.onClickOutside();
        }
        
    }
    onChangeText=(value)=>{
        if (this.props.withMinus){
            var minus;
            if (value[0]==='-') minus=true
            else minus=false
            
            if (this.state.minus!==minus) this.setState({minus})
        }
        this.props.onChangeText(value);
    }
    autofill=()=>{
    	this.props.onChangeText(this.props.autofill());
    }
    increment=()=>{
    	const {value}=this.props;
    	this.props.onChangeText(parseFloat(value)+0.5)
    }
    decrement=()=>{
    	const {value}=this.props;
    	this.props.onChangeText(parseFloat(value)-0.5)
    }
	render(){
        const {minus}=this.state;
		const {counter,autofill,autofillIcon ,onFocus, readOnly,keyboardType,textStyle, containerStyle,placeholder,value,error,onChangeText, nextRef, placeholderTextColor, underline, secureTextEntry, withMinus}=this.props
		return (
            <View style={[styles.container, containerStyle]} onStartShouldSetResponder={this.outsideClick}>
				<Animatable.Text transition="opacity" useNativeDriver style={value?styles.show:styles.hide}>{placeholder}</Animatable.Text>
				<TextInput  readOnly={readOnly} 
							keyboardType={keyboardType} 
							style={[styles.input,textStyle,underline?{borderBottomWidth:1}:{borderBottomWidth:0},error?styles.error:{}]} 
							placeholder={placeholder} 
							placeholderTextColor={placeholderTextColor}
							value={value} 
                            onChangeText={withMinus?this.onChangeText:onChangeText}
							undeline={underline}
							secureTextEntry={secureTextEntry}
							ref={(ref)=>this.input=ref}
							onSubmitEditing={() => {if (nextRef) nextRef.input.focus()}}
							blurOnSubmit={ !nextRef }
							returnKeyType={ nextRef?"next":'done' }
                            onFocus={onFocus}/>
                {withMinus&&<TouchableOpacity style={styles.icon} onPress={this.minusToggle}><Icon name={"minus"} type="entypo" color={minus?Theme['dark'].primaryText:Theme['dark'].secondaryText} size={18} /></TouchableOpacity>}
				{autofill&&<TouchableOpacity style={styles.icon} onPress={this.autofill}><Icon name={autofillIcon.name} type={autofillIcon.type} color={Theme['dark'].primaryText} size={14} /></TouchableOpacity>}
				{(value&&counter)?<TouchableOpacity style={styles.counter.up} onPress={this.increment}><Icon name={"plus"} type={"antdesign"} color={Theme['dark'].secondaryText} size={14}/></TouchableOpacity>:<View></View>}
				{(value&&counter)?<TouchableOpacity style={styles.counter.down} onPress={this.decrement}><Icon name={"minus"} type={"antdesign"} color={Theme['dark'].primaryText} size={14}/></TouchableOpacity>:<View></View>}
			</View>
		)
	}
}

Input.defaultProps={
	underline:true,
	counter:false
}

const styles={
	container:{
		width:'90%',
		marginVertical:8
	},
	input:{
		paddingVertical:15,
		paddingHorizontal:15,
		paddingRight:40,
		borderBottomWidth:1,
		borderBottomColor:Colors['White'],
		fontSize:14,
		width:'100%',
		fontFamily:Theme['dark'].fontNormal
	},
	error:{
		borderBottomColor:Colors['Red']
	},
	show:{
		opacity:1,
		fontSize:12,
		color:Colors['Hit Gray']
	},
	hide:{
		opacity:0,
		fontSize:12,
		color:Colors['Hit Gray']
	},
    icon:{
	    position:'absolute',
	    right:0,
	    bottom:20,
	    borderWidth:1,
	    paddingVertical:2,
	    paddingHorizontal:8,
	    backgroundColor:Theme['dark'].highlighted,
	    
	    borderColor:Theme['dark'].primaryText,
	    shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
		borderRadius:8
    },
    counter:{
    	up:{
    		paddingVertical:2,
	    	paddingHorizontal:8,
	    	backgroundColor:Theme['dark'].positive,
    		position:'absolute',
		    left:50,
		    bottom:-20,
		    shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,

			elevation: 5,
			borderRadius:8
    	},
    	down:{
    		paddingVertical:2,
	    	paddingHorizontal:8,
	    	backgroundColor:Theme['dark'].negative,
    		position:'absolute',
		    left:-2,
		    bottom:-20,
		    shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,

			elevation: 5,
			borderRadius:8
    	}
    }
}

export default Input;
