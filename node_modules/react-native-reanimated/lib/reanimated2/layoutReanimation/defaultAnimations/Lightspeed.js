import { Dimensions } from 'react-native';
import { withSequence, withTiming } from '../../animations';
import { BaseAnimationBuilder } from '../animationBuilder/BaseAnimationBuilder';
const { width } = Dimensions.get('window');
export class LightSpeedInRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX, config)),
                        opacity: delayFunction(delay, withTiming(1, { duration: duration * 1.5 })),
                        transform: [
                            {
                                skewX: delayFunction(delay, withSequence(withTiming('10deg', { duration: duration }), withTiming('-5deg', { duration: duration / 5 }), withTiming('0deg', { duration: duration / 5 }))),
                            },
                        ],
                    },
                    initialValues: {
                        originX: values.originX + width,
                        opacity: 0,
                        transform: [{ skewX: '-45deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new LightSpeedInRight();
    }
}
export class LightSpeedInLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX, config)),
                        opacity: delayFunction(delay, withTiming(1, { duration: duration * 1.5 })),
                        transform: [
                            {
                                skewX: delayFunction(delay, withSequence(withTiming('-10deg', { duration: duration }), withTiming('5deg', { duration: duration / 5 }), withTiming('0deg', { duration: duration / 5 }))),
                            },
                        ],
                    },
                    initialValues: {
                        originX: values.originX - width,
                        opacity: 0,
                        transform: [{ skewX: '45deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new LightSpeedInLeft();
    }
}
export class LightSpeedOutRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX + width, config)),
                        opacity: delayFunction(delay, animation(0, config)),
                        transform: [
                            {
                                skewX: delayFunction(delay, animation('-45deg', config)),
                            },
                        ],
                    },
                    initialValues: {
                        originX: values.originX,
                        opacity: 1,
                        transform: [{ skewX: '0deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new LightSpeedOutRight();
    }
}
export class LightSpeedOutLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX - width, config)),
                        opacity: delayFunction(delay, animation(0, config)),
                        transform: [
                            {
                                skewX: delayFunction(delay, animation('45deg', config)),
                            },
                        ],
                    },
                    initialValues: {
                        originX: values.originX,
                        opacity: 1,
                        transform: [{ skewX: '0deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new LightSpeedOutLeft();
    }
}
