import React, {Component} from 'react';
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Keyboard,
	Alert,
} from 'react-native';
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';
import {Icon} from 'react-native-elements';

import Popup from '../../components/Popup/Popup.component.js';
import Input from '../../components/Input/Input.component.js';
import Button from '../../components/Button/Button.component.js';

import {getAccountsMeta} from './Accounts.actions.js';
import {
	addSecondaryAccount,
	validateCredentials,
	switchAccount,
	removeAccount,
} from '../../helpers/bitmex.helpers.js';

import Theme from '../../resources/Theme.js';

class Accounts extends Component {
	constructor(props) {
		super(props);
		this.COLORS = [
			...Theme['dark'].waves,
			Theme['dark'].warning,
			Theme['dark'].positive,
			Theme['dark'].negative,
		];
		this.state = {
			showModal: false,
			accountID: '',
			accountSecret: '',
			metaName: '',
			color: this.COLORS[0],
			deleteMode: false,
			selectedAccount: null,
		};
		this.props.getAccountsMeta();
	}
	shapeName = name => {
		return (name[0] + name[1]).toUpperCase();
	};
	enableDeleteMode = account => {
		this.setState({selectedAccount: account, deleteMode: true});
	};
	openModal = () => {
		this.setState({
			showModal: true,
			deleteMode: false,
			accountSecret: '',
			accountID: '',
			metaName: '',
		});
	};
	hideModal = () => {
		this.setState({
			showModal: false,
			accountSecret: '',
			accountID: '',
			metaName: '',
		});
	};
	selectColor = color => {
		this.setState({color});
	};
	addAccount = async () => {
		const {accountID, accountSecret, metaName, color, deleteMode} = this.state;
		if (deleteMode) {
			this.setState({deleteMode: false});
		} else if (!accountID || !accountSecret || !metaName || metaName.length < 2)
			return;
		else {
			const valid = await validateCredentials({
				appID: accountID,
				appSecret: accountSecret,
			});
			if (valid) {
				await addSecondaryAccount({
					appID: accountID,
					appSecret: accountSecret,
					accountMeta: {
						color,
						name: metaName,
						primary: false,
					},
				});
				this.setState(
					{showModal: false, accountSecret: '', accountID: '', metaName: ''},
					this.props.getAccountsMeta,
				);
			} else {
				const message = 'Account ID or Account Secret is not correct';
				Alert.alert('New Account', message);
			}
		}
	};
	deleteAccount = account => {
		const message = 'Are you sure you want to remove account from this device';
		Alert.alert('Remove Account', message, [
			{
				text: 'Confirm',
				onPress: async () => {
					await removeAccount(account);
					this.props.getAccountsMeta();
					this.setState({deleteMode: false});
				},
			},
			{
				text: 'Cancel',
				onPress: () => {
					this.setState({deleteMode: false});
				},
			},
		]);
	};
	switchAccount = async account => {
		const {deleteMode} = this.state;
		const message = 'You can switch to this account or delete it.';
		if (deleteMode) {
			this.setState({deleteMode: false});
		} else {
			Alert.alert(
				`${account.name} Account`,
				message,
				[
					{
						text: 'Delete',
						onPress: () => this.deleteAccount(account),
						style: 'destructive'
					},
					{
						text: 'Cancel',
						onPress: () => {},
						style: 'cancel',
					},
					{
						text: 'Switch to',
						onPress: async () => {
							await switchAccount(account);
							this.props.getAccountsMeta();
						},
						style: 'default'
					},
				],
				{cancelable: true},
			);
		}
	};
	renderAccountsHeads = () => {
		const {accounts, current} = this.props.accounts;
		const {deleteMode, selectedAccount} = this.state;
		const heads = accounts.map((account, index) => {
			return (
				<TouchableOpacity
					key={index.toString()}
					style={[
						styles.head,
						account.primary ? styles.primary : {backgroundColor: account.color},
						deleteMode && account.ID === selectedAccount.ID
							? {borderColor: Theme['dark'].negative}
							: {},
					]}
					onPress={() => this.switchAccount(account)}
					onLongPress={() => this.enableDeleteMode(account)}>
					<Text style={styles.headTitle}>{this.shapeName(account.name)}</Text>
					{account.ID === current && !deleteMode ? (
						<Icon
							color={account.color}
							reverseColor={Theme['dark'].primaryText}
							name="done"
							type="material-icons"
							containerStyle={styles.iconContainer}
							size={12}
							reverse
							raised
						/>
					) : deleteMode && account.ID === selectedAccount.ID ? (
						<Icon
							color={Theme['dark'].negative}
							reverseColor={Theme['dark'].primaryText}
							name="trash"
							type="feather"
							containerStyle={styles.iconContainer}
							size={12}
							reverse
							raised
							onPress={() => this.deleteAccount(account)}
						/>
					) : (
						<View></View>
					)}
				</TouchableOpacity>
			);
		});
		heads.push(
			<TouchableOpacity
				key={heads.length.toString()}
				style={styles.head}
				onPress={this.openModal}>
				<Icon
					name="plus"
					type="entypo"
					size={18}
					color={Theme['dark'].primaryText}
				/>
			</TouchableOpacity>,
		);
		return heads;
	};
	renderPopup = () => {
		const {showModal, accountID, accountSecret, metaName, color} = this.state;
		return (
			<Popup visible={showModal} onClose={this.hideModal}>
				<View style={styles.dialog}>
					<ScrollView>
						<View style={styles.dialogContent}>
							<Text style={styles.title}>New Account</Text>
							<TouchableWithoutFeedback
								onPress={Keyboard.dismiss}
								accessible={false}>
								<View style={styles.form}>
									<View style={styles.auth}>
										<Input
											onChangeText={value => this.setState({accountID: value})}
											value={accountID}
											placeholderTextColor={Theme['dark'].secondaryText}
											textStyle={styles.textStyle}
											placeholder={'Account ID'}
											underline={false}
										/>
										<Input
											onChangeText={value =>
												this.setState({accountSecret: value})
											}
											value={accountSecret}
											placeholderTextColor={Theme['dark'].secondaryText}
											textStyle={styles.textStyle}
											placeholder={'Account Secret'}
											secureTextEntry={true}
											underline={false}
										/>
										<Input
											onChangeText={value => this.setState({metaName: value})}
											value={metaName}
											placeholderTextColor={Theme['dark'].secondaryText}
											textStyle={styles.textStyle}
											placeholder={'Account name'}
											underline={false}
										/>
									</View>
									<View style={styles.row}>
										{this.COLORS.map((COLOR, index) => {
											const selected = COLOR === color;
											if (selected)
												return (
													<Icon
														color={COLOR}
														reverseColor={Theme['dark'].primaryText}
														name="done"
														type="material-icons"
														size={12}
														reverse
														raised
														key={index.toString()}
													/>
												);
											else
												return (
													<TouchableOpacity
														key={index.toString()}
														onPress={() => this.selectColor(COLOR)}
														style={[styles.circle, {backgroundColor: COLOR}]}
													/>
												);
										})}
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</ScrollView>
					<View style={styles.column}>
						<Button
							text={`Confirm`}
							onPress={this.addAccount}
							buttonStyle={styles.dialogButton}
							textStyle={styles.textButton}
						/>
						<Button
							text={`Cancel`}
							onPress={this.hideModal}
							buttonStyle={styles.dialogCancelButton}
							textStyle={styles.textCancelButton}
						/>
					</View>
				</View>
			</Popup>
		);
	};
	render() {
		return (
			<Animatable.View
				style={styles.container}
				animation={'fadeInRight'}
				useNativeDriver
				duration={Theme.Transition}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					directionalLockEnabled={true}
					horizontal={true}
					style={{width: '100%', height: '100%'}}
					scrollEnabled>
					{this.renderAccountsHeads()}
				</ScrollView>
				{this.renderPopup()}
			</Animatable.View>
		);
	}
}

const styles = {
	container: {
		height: 90,
		paddingVertical: 10,
	},
	head: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: Theme['dark'].primary3,
		borderColor: Theme['dark'].primaryText,
		borderWidth: 5,
		borderType: 'solid',
		marginRight: 10,
		marginLeft: 10,
	},
	headTitle: {
		color: Theme['dark'].primaryText,
		fontSize: 18,
		fontFamily: Theme['dark'].fontNormal,
		textAlign: 'center',
	},
	primary: {
		backgroundColor: Theme['dark'].highlighted,
	},
	iconContainer: {
		position: 'absolute',
		bottom: -12,
		right: -12,
	},
	textButton: {
		fontSize: 14,
		fontFamily: Theme['dark'].fontBold,
	},
	dialogButton: {
		marginTop: 20,
		width: '80%',
		alignSelf: 'center',
	},
	dialogCancelButton: {
		backgroundColor: 'transparent',
		marginTop: 20,
		width: '80%',
		alignSelf: 'center',
		elevation: 0,
	},
	textCancelButton: {
		fontSize: 14,
		fontFamily: Theme['dark'].fontBold,
		color: Theme['dark'].highlighted,
	},
	dialog: {
		width: '100%',
		height: '100%',
		backgroundColor: Theme['dark'].primary3,
		alignSelf: 'center',
		padding: 20,
		borderRadius: 20,
	},
	dialogContent: {
		width: '100%',
		flexDirection: 'column',
		alignSelf: 'center',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingTop: 20,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		width: '100%',
		alignSelf: 'center',
		padding: 10,
	},
	column: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: Theme['dark'].primaryText,
		fontSize: 29,
		fontWeight: 'bold',
		width: '100%',
		textAlign: 'center',
		fontFamily: Theme['dark'].fontBold,
		marginBottom: 20,
	},
	textStyle: {
		color: Theme['dark'].primaryText,
		fontSize: 16,
		backgroundColor: Theme['dark'].primary1,
		borderRadius: 8,
		paddingHorizontal: 20,
	},
	auth: {
		width: '98%',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginVertical: 0,
		paddingVertical: 20,
	},
	form: {
		flexDirection: 'column',
		alignSelf: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	circle: {
		width: 28,
		height: 28,
		borderRadius: 14,
		borderWidth: 1,
		borderType: 'solid',
		borderColor: Theme['dark'].primaryText,
	},
};

const mapStateToProps = state => {
	return {
		accounts: state.accounts,
		settings: state.settings,
	};
};
export default connect(mapStateToProps, {getAccountsMeta})(Accounts);
