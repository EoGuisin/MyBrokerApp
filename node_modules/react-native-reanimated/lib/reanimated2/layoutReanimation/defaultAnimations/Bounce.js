import { BaseBounceAnimationBuilder } from '../animationBuilder/BaseBounceAnimationBuilder';
import { withSequence, withTiming } from '../../animations';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export class BounceIn extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                scale: delayFunction(delay, withSequence(withTiming(1.2, { duration: duration }), withTiming(0.9, { duration: (duration * 100) / 250 }), withTiming(1.1, { duration: (duration * 100) / 250 }), withTiming(1, { duration: (duration * 100) / 250 }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ scale: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceIn();
    }
}
export class BounceInDown extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateY: delayFunction(delay, withSequence(withTiming(-20, { duration: duration }), withTiming(10, { duration: (duration * 100) / 250 }), withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(0, { duration: (duration * 100) / 250 }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [
                            {
                                translateY: targetValues.originY + height,
                            },
                        ],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceInDown();
    }
}
export class BounceInUp extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateY: delayFunction(delay, withSequence(withTiming(20, { duration: duration }), withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(10, { duration: (duration * 100) / 250 }), withTiming(0, { duration: (duration * 100) / 250 }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ translateY: targetValues.originY - height }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceInUp();
    }
}
export class BounceInLeft extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateX: delayFunction(delay, withSequence(withTiming(20, { duration: duration }), withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(10, { duration: (duration * 100) / 250 }), withTiming(0, { duration: (duration * 100) / 250 }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ translateX: targetValues.originX - width }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceInLeft();
    }
}
export class BounceInRight extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateX: delayFunction(delay, withSequence(withTiming(-20, { duration: duration }), withTiming(10, { duration: (duration * 100) / 250 }), withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(0, { duration: (duration * 100) / 250 }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ translateX: targetValues.originX + width }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceInRight();
    }
}
export class BounceOut extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                scale: delayFunction(delay, withSequence(withTiming(1.1, { duration: (duration * 100) / 250 }), withTiming(0.9, { duration: (duration * 100) / 250 }), withTiming(1.2, { duration: (duration * 100) / 250 }), withTiming(0, { duration: duration }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ scale: 1 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceOut();
    }
}
export class BounceOutDown extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateY: delayFunction(delay, withSequence(withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(10, { duration: (duration * 100) / 250 }), withTiming(-20, { duration: (duration * 100) / 250 }), withTiming(targetValues.originY + height, {
                                    duration: duration,
                                }))),
                            },
                        ],
                    },
                    initialValues: {
                        originY: 0,
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceOutDown();
    }
}
export class BounceOutUp extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateY: delayFunction(delay, withSequence(withTiming(10, { duration: (duration * 100) / 250 }), withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(20, { duration: (duration * 100) / 250 }), withTiming(targetValues.originY - height, {
                                    duration: duration,
                                }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ translateY: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceOutUp();
    }
}
export class BounceOutLeft extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateX: delayFunction(delay, withSequence(withTiming(10, { duration: (duration * 100) / 250 }), withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(20, { duration: (duration * 100) / 250 }), withTiming(targetValues.originX - width, {
                                    duration: duration,
                                }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ translateX: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceOutLeft();
    }
}
export class BounceOutRight extends BaseBounceAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const delay = this.delayV;
            const duration = this.durationV ? this.durationV : 250;
            const callback = this.callbackV;
            return (targetValues) => {
                'worklet';
                return {
                    animations: {
                        transform: [
                            {
                                translateX: delayFunction(delay, withSequence(withTiming(-10, { duration: (duration * 100) / 250 }), withTiming(10, { duration: (duration * 100) / 250 }), withTiming(-20, { duration: (duration * 100) / 250 }), withTiming(targetValues.originX + width, {
                                    duration: duration,
                                }))),
                            },
                        ],
                    },
                    initialValues: {
                        transform: [{ translateX: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new BounceOutRight();
    }
}
