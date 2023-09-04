import React, { Component } from 'react';
import { StatusBar, LogBox, Platform, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from 'react-native-push-notification';

import '~/config/ReactotronConfig';

import Routes from '~/routes';

import store from './store';

PushNotification.createChannel({
        channelId: "channel-pushnotification", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export default class App extends Component {
    render() {
        LogBox.ignoreAllLogs()
            // console.ignoredYellowBox = true;
        return ( 
            <>
                <Provider store = { store } >
                    <StatusBar barStyle = "light-content" hidden />
                    <Routes />
                </Provider> 
            </>
        );
    }
}