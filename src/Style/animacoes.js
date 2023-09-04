import React, { Component } from 'react'; 
import { Animated } from 'react-native';

class Animacoes {

  async onHeader(state, value, time) {
    return await Animated.timing(state.AnimatedHeader,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async onHeaderMapa(state, value, time) {
    return await Animated.timing(state.AnimatedHeader,{
                    toValue: value, 
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async offHeaderMapa(state, value, time) {
    return await Animated.timing(state.AnimatedHeader,{
                    toValue: value, 
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async onContent(state, value, time) {
      return await Animated.timing(state.AnimatedContent,{
                      toValue: value,
                      duration: time,
                      useNativeDriver: true
                    }).start();
  }
  async offContent(state, value, time) {
    return await Animated.timing(state.AnimatedContent,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start(); 
  }
  async onFooter(state, value, time) {
    return await Animated.timing(state.AnimatedFooter,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async offFooter(state, value, time) {
    return await Animated.timing(state.AnimatedFooter,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async onMapa(state, value, time) {
    return await Animated.timing(state.AnimatedMapa,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: false
                  }).start();
  }
  async onScroll(state, value, time) {
    return await Animated.timing(state.AnimatedScroll,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: false
                  }).start();
  }
  async offScroll(state, value, time) {
    return await Animated.timing(state.AnimatedScroll,{
                  toValue: value,
                  duration: time,
                  useNativeDriver: false
                }).start();
  }
  async onButtom(state, value, time) {
    return await Animated.timing(state.AnimatedButtom,{
                  toValue: value,
                  duration: time,
                  useNativeDriver: true
                }).start();
  }
  async offButtom(state, value, time) {
    return await Animated.timing(state.AnimatedButtom,{
                  toValue: value,
                  duration: time,
                  useNativeDriver: true
                }).start();
  }
  async onPhoto(state, value, time) {
    return await Animated.timing(state.AnimatedPhoto,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async onRandomView(state, value, time) {
    return await Animated.timing(state.AnimatedRandomView,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
  async offRandomView(state, value, time) {
    return await Animated.timing(state.AnimatedRandomView,{
                    toValue: value,
                    duration: time,
                    useNativeDriver: true
                  }).start();
  }
}

export default new Animacoes();